-- IWANNABERICH — live community experiment + public ledger
-- Run this migration in Supabase before enabling the live voting/ledger features.

create table if not exists public.next_experiment_votes (
  id bigint generated always as identity primary key,
  option_code text not null check (option_code in ('sell', 'digital', 'hustle')),
  created_at timestamptz not null default now()
);

alter table public.next_experiment_votes enable row level security;
revoke all on public.next_experiment_votes from anon, authenticated;

create or replace function public.get_next_experiment_votes()
returns table(option_code text, vote_count bigint)
language sql
security definer
set search_path = public
as $$
  select option_code, count(*)::bigint
  from public.next_experiment_votes
  group by option_code
  order by option_code;
$$;

grant execute on function public.get_next_experiment_votes() to anon, authenticated;

create or replace function public.vote_next_experiment(option_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if option_code not in ('sell', 'digital', 'hustle') then
    raise exception 'invalid experiment option: %', option_code;
  end if;
  insert into public.next_experiment_votes(option_code) values (option_code);
end;
$$;

grant execute on function public.vote_next_experiment(text) to anon;

-- Safe public ledger: exposes only amount/date for paid net contributions.
create or replace function public.get_public_ledger()
returns table(amount_eur numeric, paid_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    round(((amount_cents - refunded_cents)::numeric) / 100, 2) as amount_eur,
    paid_at
  from public.stripe_contributions
  where currency = 'eur'
    and (amount_cents - refunded_cents) > 0
  order by paid_at desc
  limit 50;
$$;

grant execute on function public.get_public_ledger() to anon, authenticated;
