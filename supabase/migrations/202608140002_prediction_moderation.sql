-- IWANNABERICH — prediction moderation / anti-spam
-- Run once in Supabase SQL Editor.

-- Keep a normalized hash for duplicate detection without storing extra
-- visitor identity data in the public comments table.
alter table public.predictions_comments
  add column if not exists normalized_hash text;

create index if not exists predictions_comments_normalized_hash_created_idx
  on public.predictions_comments (normalized_hash, created_at desc);

-- Public clients must no longer insert directly. The Edge Function is now
-- responsible for moderation, rate limiting and the actual insert.
drop policy if exists "Public can add comments" on public.predictions_comments;
revoke insert on public.predictions_comments from anon, authenticated;

-- Rate-limit state is intentionally inaccessible to the public client.
create table if not exists public.prediction_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempts_10m integer not null default 0,
  day_started_at timestamptz not null default now(),
  attempts_day integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.prediction_rate_limits enable row level security;
revoke all on public.prediction_rate_limits from anon, authenticated;

create or replace function public.consume_prediction_rate_limit(
  p_ip_hash text,
  p_max_10m integer default 3,
  p_max_day integer default 10
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.prediction_rate_limits%rowtype;
  now_ts timestamptz := now();
  next_10m integer;
  next_day integer;
begin
  insert into public.prediction_rate_limits (ip_hash, window_started_at, attempts_10m, day_started_at, attempts_day, updated_at)
  values (p_ip_hash, now_ts, 1, now_ts, 1, now_ts)
  on conflict (ip_hash) do nothing;

  select * into current_row
  from public.prediction_rate_limits
  where ip_hash = p_ip_hash
  for update;

  if current_row.window_started_at <= now_ts - interval '10 minutes' then
    next_10m := 1;
  else
    next_10m := current_row.attempts_10m + 1;
  end if;

  if current_row.day_started_at <= now_ts - interval '1 day' then
    next_day := 1;
  else
    next_day := current_row.attempts_day + 1;
  end if;

  if next_10m > p_max_10m or next_day > p_max_day then
    update public.prediction_rate_limits
    set updated_at = now_ts
    where ip_hash = p_ip_hash;
    return false;
  end if;

  update public.prediction_rate_limits
  set window_started_at = case when current_row.window_started_at <= now_ts - interval '10 minutes' then now_ts else current_row.window_started_at end,
      attempts_10m = next_10m,
      day_started_at = case when current_row.day_started_at <= now_ts - interval '1 day' then now_ts else current_row.day_started_at end,
      attempts_day = next_day,
      updated_at = now_ts
  where ip_hash = p_ip_hash;

  return true;
end;
$$;

revoke execute on function public.consume_prediction_rate_limit(text, integer, integer) from public, anon, authenticated;
