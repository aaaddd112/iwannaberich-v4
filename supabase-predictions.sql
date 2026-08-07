-- ============================================
-- PREDICTIONS FEATURE — run once in Supabase
-- SQL Editor (Project → SQL Editor → New query)
-- ============================================

-- 1) Vote counters (single row, id is always 1)
create table if not exists public.predictions (
  id smallint primary key default 1,
  yes_count bigint not null default 0,
  no_count bigint not null default 0,
  constraint single_row check (id = 1)
);

insert into public.predictions (id, yes_count, no_count)
values (1, 0, 0)
on conflict (id) do nothing;

alter table public.predictions enable row level security;

create policy "Public can read predictions"
on public.predictions for select
to anon
using (true);

-- Atomic increment via RPC, so the public anon key never needs
-- direct UPDATE access to the table (avoids double-vote race conditions
-- and stops people from setting counts to arbitrary numbers).
create or replace function public.increment_prediction_vote(vote_type text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if vote_type = 'yes' then
    update public.predictions set yes_count = yes_count + 1 where id = 1;
  elsif vote_type = 'no' then
    update public.predictions set no_count = no_count + 1 where id = 1;
  else
    raise exception 'invalid vote_type: %', vote_type;
  end if;
end;
$$;

grant execute on function public.increment_prediction_vote(text) to anon;

-- 2) Visitor comments
create table if not exists public.predictions_comments (
  id uuid primary key default gen_random_uuid(),
  comment text not null check (char_length(comment) between 1 and 280),
  created_at timestamptz not null default now()
);

alter table public.predictions_comments enable row level security;

create policy "Public can read comments"
on public.predictions_comments for select
to anon
using (true);

create policy "Public can add comments"
on public.predictions_comments for insert
to anon
with check (char_length(comment) between 1 and 280);
