alter table public.predictions_comments add column if not exists moderation_status text not null default 'visible';
alter table public.predictions_comments drop constraint if exists predictions_comments_moderation_status_check;
alter table public.predictions_comments add constraint predictions_comments_moderation_status_check check (moderation_status in ('visible','hidden','removed'));
create index if not exists predictions_comments_moderation_status_created_idx on public.predictions_comments(moderation_status, created_at desc);

create table if not exists public.community_reports (
 id uuid primary key default gen_random_uuid(),
 comment_id uuid not null references public.predictions_comments(id) on delete cascade,
 reporter_user_id uuid references auth.users(id) on delete set null,
 reporter_hash text not null,
 reason text not null check (reason in ('spam','harassment','hate','scam','sexual','other')),
 details text,
 status text not null default 'open' check (status in ('open','reviewed','dismissed','actioned')),
 created_at timestamptz not null default now(),
 reviewed_at timestamptz,
 reviewer_id uuid references auth.users(id) on delete set null,
 review_note text
);
create unique index if not exists community_reports_comment_reporter_idx on public.community_reports(comment_id, reporter_hash);
create index if not exists community_reports_status_created_idx on public.community_reports(status, created_at desc);
create index if not exists community_reports_comment_idx on public.community_reports(comment_id);
create index if not exists community_reports_reporter_user_idx on public.community_reports(reporter_user_id);
alter table public.community_reports enable row level security;
revoke all on public.community_reports from anon, authenticated;

create or replace function public.submit_community_report(p_comment_id uuid,p_reporter_user_id uuid,p_reporter_hash text,p_reason text,p_details text default null) returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
 if p_reporter_user_id is not null and p_reporter_user_id <> auth.uid() then raise exception 'invalid_reporter'; end if;
 if p_reason not in ('spam','harassment','hate','scam','sexual','other') then raise exception 'invalid_reason'; end if;
 if length(coalesce(p_details,'')) > 500 then raise exception 'details_too_long'; end if;
 if not exists(select 1 from public.predictions_comments where id=p_comment_id and moderation_status <> 'removed') then raise exception 'comment_not_found'; end if;
 insert into public.community_reports(comment_id,reporter_user_id,reporter_hash,reason,details) values(p_comment_id,p_reporter_user_id,p_reporter_hash,p_reason,nullif(trim(p_details),'')) returning id into v_id;
 return v_id;
exception when unique_violation then raise exception 'duplicate_report';
end; $$;
revoke all on function public.submit_community_report(uuid,uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_community_report(uuid,uuid,text,text,text) to service_role;

create or replace function public.get_community_reports(p_admin_id uuid,p_status text default 'open',p_limit integer default 50) returns table(id uuid,comment_id uuid,comment text,nickname text,author_type text,reporter_user_id uuid,reason text,details text,status text,created_at timestamptz,reviewed_at timestamptz,reviewer_id uuid,review_note text) language sql security definer set search_path=public as $$
 select r.id,r.comment_id,c.comment,c.nickname,c.author_type,r.reporter_user_id,r.reason,r.details,r.status,r.created_at,r.reviewed_at,r.reviewer_id,r.review_note from public.community_reports r join public.predictions_comments c on c.id=r.comment_id where exists(select 1 from public.admin_users a where a.user_id=p_admin_id and a.role is not null) and (p_status is null or p_status='all' or r.status=p_status) order by r.created_at desc limit least(greatest(coalesce(p_limit,50),1),100);
$$;
revoke all on function public.get_community_reports(uuid,text,integer) from public, anon, authenticated;
grant execute on function public.get_community_reports(uuid,text,integer) to service_role;

create or replace function public.review_community_report(p_admin_id uuid,p_report_id uuid,p_decision text,p_note text default null) returns boolean language plpgsql security definer set search_path=public as $$
declare v_comment uuid;
begin
 if not exists(select 1 from public.admin_users a where a.user_id=p_admin_id and a.role is not null) then raise exception 'not_authorized'; end if;
 if p_decision not in ('reviewed','dismissed','actioned') then raise exception 'invalid_decision'; end if;
 if length(coalesce(p_note,''))>1000 then raise exception 'note_too_long'; end if;
 select comment_id into v_comment from public.community_reports where id=p_report_id for update;
 if v_comment is null then raise exception 'report_not_found'; end if;
 update public.community_reports set status=p_decision,reviewed_at=now(),reviewer_id=p_admin_id,review_note=nullif(trim(p_note),'') where id=p_report_id;
 if p_decision='actioned' then update public.predictions_comments set moderation_status='hidden' where id=v_comment; end if;
 return true;
end; $$;
revoke all on function public.review_community_report(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.review_community_report(uuid,uuid,text,text) to service_role;
