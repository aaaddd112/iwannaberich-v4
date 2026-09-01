-- IWANNABERICH — public API security hardening
-- Keep public clients away from write RPCs and enforce server-side rate limits.

create table if not exists public.api_rate_limits (
  bucket text not null,
  ip_hash text not null,
  window_started_at timestamptz not null default now(),
  attempts_10m integer not null default 0,
  day_started_at timestamptz not null default now(),
  attempts_day integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (bucket, ip_hash)
);

alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from anon, authenticated;

create or replace function public.consume_api_rate_limit(
  p_bucket text,
  p_ip_hash text,
  p_max_10m integer,
  p_max_day integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.api_rate_limits%rowtype;
  now_ts timestamptz := now();
  next_10m integer;
  next_day integer;
begin
  if p_bucket is null or length(p_bucket) = 0 or length(p_bucket) > 64 then
    raise exception 'Invalid rate-limit bucket';
  end if;

  if p_max_10m < 1 or p_max_day < 1 then
    raise exception 'Invalid rate-limit thresholds';
  end if;

  insert into public.api_rate_limits (
    bucket, ip_hash, window_started_at, attempts_10m,
    day_started_at, attempts_day, updated_at
  ) values (
    p_bucket, p_ip_hash, now_ts, 1, now_ts, 1, now_ts
  )
  on conflict (bucket, ip_hash) do nothing;

  select * into current_row
  from public.api_rate_limits
  where bucket = p_bucket and ip_hash = p_ip_hash
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
    update public.api_rate_limits
    set updated_at = now_ts
    where bucket = p_bucket and ip_hash = p_ip_hash;
    return false;
  end if;

  update public.api_rate_limits
  set window_started_at = case
        when current_row.window_started_at <= now_ts - interval '10 minutes' then now_ts
        else current_row.window_started_at
      end,
      attempts_10m = next_10m,
      day_started_at = case
        when current_row.day_started_at <= now_ts - interval '1 day' then now_ts
        else current_row.day_started_at
      end,
      attempts_day = next_day,
      updated_at = now_ts
  where bucket = p_bucket and ip_hash = p_ip_hash;

  return true;
end;
$$;

revoke execute on function public.consume_api_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;

-- The old public write RPC is no longer part of the public API.
revoke execute on function public.vote_next_experiment(text)
  from public, anon, authenticated;

-- The existing prediction rate limiter remains in place for prediction submissions.
-- This migration adds the same server-side primitive for the other public APIs.
