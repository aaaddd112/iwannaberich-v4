-- V1.8 Contribution Score action ledger.
-- All writes are server-side only. xp_transactions remains the score source of truth.
create table if not exists public.participation_actions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null, action_key text not null, points integer not null,
  created_at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb,
  constraint participation_actions_points_nonzero check (points <> 0)
);
create unique index if not exists participation_actions_unique on public.participation_actions(user_id,action_type,action_key);
create index if not exists participation_actions_user_created on public.participation_actions(user_id,created_at desc);
alter table public.participation_actions enable row level security;
revoke all on table public.participation_actions from anon,authenticated;

create or replace function public.award_experiment_vote(p_user_id uuid,p_option_code text)
returns integer language plpgsql security definer set search_path=public as $$
declare v_action_id uuid; v_points integer := 25;
begin
 if p_user_id is null then raise exception using errcode='42501',message='unauthorized'; end if;
 if p_option_code is null or length(trim(p_option_code))=0 or length(trim(p_option_code))>64 then raise exception using errcode='22023',message='invalid_option'; end if;
 insert into public.participation_actions(user_id,action_type,action_key,points,metadata)
 values(p_user_id,'experiment_vote',trim(p_option_code),v_points,jsonb_build_object('option_code',trim(p_option_code)))
 on conflict(user_id,action_type,action_key) do nothing returning id into v_action_id;
 if v_action_id is null then return 0; end if;
 insert into public.xp_transactions(user_id,amount,reason,source_type,source_id,metadata)
 values(p_user_id,v_points,'Voted on the next experiment','participation_action',v_action_id,jsonb_build_object('action_type','experiment_vote','option_code',trim(p_option_code)));
 return v_points;
end; $$;
revoke all on function public.award_experiment_vote(uuid,text) from public,anon,authenticated;
grant execute on function public.award_experiment_vote(uuid,text) to service_role;

-- The participation projection includes an action count for the profile UI.
drop function if exists public.get_my_participation();
create function public.get_my_participation()
returns table(username text,display_name text,xp bigint,rank text,referral_code text,referral_count bigint,achievement_count bigint,action_count bigint)
language sql stable security definer set search_path=public as $$
with mine as (select coalesce(sum(amount),0)::bigint xp from public.xp_transactions where user_id=auth.uid())
select p.username,p.display_name,mine.xp,
 case when mine.xp>=500000 then 'Billionaire Material' when mine.xp>=150000 then 'Mogul' when mine.xp>=50000 then 'Investor' when mine.xp>=15000 then 'Associate' when mine.xp>=5000 then 'Agent' when mine.xp>=1000 then 'Experimenter' when mine.xp>=250 then 'Observer' else 'Curious' end,
 rc.code,
 (select count(*) from public.referrals r where r.referrer_id=p.id and r.status in('active','qualified')),
 (select count(*) from public.user_achievements ua where ua.user_id=p.id),
 (select count(*) from public.participation_actions pa where pa.user_id=p.id)
from public.profiles p cross join mine left join public.referral_codes rc on rc.user_id=p.id and rc.active where p.id=auth.uid(); $$;
revoke all on function public.get_my_participation() from public,anon;
grant execute on function public.get_my_participation() to authenticated,service_role;
