-- Fix the generic API limiter to use the actual production schema.
-- The stored attempts_10m counter is the authoritative 10-minute window count.
create or replace function public.consume_api_rate_limit(
  p_bucket text,
  p_ip_hash text,
  p_max_10m integer,
  p_max_day integer
) returns boolean
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  current_row public.api_rate_limits%rowtype;
  now_ts timestamptz := now();
  next_10m integer;
  next_day integer;
begin
  if coalesce(trim(p_bucket), '') = ''
     or coalesce(trim(p_ip_hash), '') = ''
     or p_max_10m < 1
     or p_max_day < 1 then
    raise exception 'invalid_rate_limit_parameters' using errcode = '22023';
  end if;

  insert into public.api_rate_limits(
    bucket, ip_hash, window_started_at, attempts_10m,
    day_started_at, attempts_day, updated_at
  )
  values (p_bucket, p_ip_hash, now_ts, 1, now_ts, 1, now_ts)
  on conflict (bucket, ip_hash) do nothing;

  select * into current_row
    from public.api_rate_limits
   where bucket = p_bucket
     and ip_hash = p_ip_hash
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
     where bucket = p_bucket
       and ip_hash = p_ip_hash;
    return false;
  end if;

  update public.api_rate_limits
     set window_started_at = case
           when current_row.window_started_at <= now_ts - interval '10 minutes'
           then now_ts
           else current_row.window_started_at
         end,
         attempts_10m = next_10m,
         day_started_at = case
           when current_row.day_started_at <= now_ts - interval '1 day'
           then now_ts
           else current_row.day_started_at
         end,
         attempts_day = next_day,
         updated_at = now_ts
   where bucket = p_bucket
     and ip_hash = p_ip_hash;

  return true;
end;
$$;
