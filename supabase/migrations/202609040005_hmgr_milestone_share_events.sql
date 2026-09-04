create table if not exists public.milestone_events (
  id uuid primary key default gen_random_uuid(), amount_eur numeric(14,2) not null check(amount_eur>0),
  reached_at timestamptz not null, created_at timestamptz not null default now(), unique(amount_eur)
);
alter table public.milestone_events enable row level security;
revoke all on public.milestone_events from anon,authenticated;
create or replace function public.get_public_milestones()
returns table(amount_eur numeric,reached_at timestamptz) language sql stable security definer set search_path=public
as $$ select amount_eur,reached_at from public.milestone_events order by amount_eur asc $$;
revoke all on function public.get_public_milestones() from public,anon,authenticated;
grant execute on function public.get_public_milestones() to anon,authenticated,service_role;
create or replace function public.record_wealth_milestone(p_amount_eur numeric,p_reached_at timestamptz)
returns integer language plpgsql security definer set search_path=public as $$
declare v_count integer:=0;
begin
 if p_amount_eur is null or p_reached_at is null or p_amount_eur<=0 then raise exception 'invalid_milestone' using errcode='22023'; end if;
 insert into public.milestone_events(amount_eur,reached_at) values(p_amount_eur,p_reached_at) on conflict(amount_eur) do nothing;
 if found then v_count:=public.award_wealth_milestone_badges(p_amount_eur,p_reached_at); end if;
 return v_count;
end; $$;
revoke all on function public.record_wealth_milestone(numeric,timestamptz) from public,anon,authenticated;
grant execute on function public.record_wealth_milestone(numeric,timestamptz) to service_role;