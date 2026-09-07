-- Fix the 10-minute API limiter to evaluate the stored counter, not the
-- number of rows. There is normally one row per bucket/IP, so counting rows
-- made the 10-minute limit effectively non-functional.
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
  now_ts timestamptz := now();
  ten_min_start timestamptz := now_ts - interval '10 minutes';
  day_start timestamptz := date_trunc('day', now_ts);
  window_count integer;
  day_count integer;
begin
  if coalesce(trim(p_bucket), '') = ''
     or coalesce(trim(p_ip_hash), '') = ''
     or p_max_10m < 1
     or p_max_day < 1 then
    raise exception 'invalid_rate_limit_parameters' using errcode = '22023';
  end if;

  insert into public.api_rate_limits(bucket, ip_hash, window_start, count)
  values (p_bucket, p_ip_hash, ten_min_start, 1)
  on conflict (bucket, ip_hash) do update
    set count = case
      when public.api_rate_limits.window_start < ten_min_start then 1
      else public.api_rate_limits.count + 1
    end,
    window_start = case
      when public.api_rate_limits.window_start < ten_min_start then ten_min_start
      else public.api_rate_limits.window_start
    end;

  select coalesce(sum(count), 0)
    into window_count
    from public.api_rate_limits
   where bucket = p_bucket
     and ip_hash = p_ip_hash
     and window_start >= ten_min_start;

  select coalesce(sum(count), 0)
    into day_count
    from public.api_rate_limits
   where bucket = p_bucket
     and ip_hash = p_ip_hash
     and window_start >= day_start;

  return window_count <= p_max_10m and day_count <= p_max_day;
end;
$$;
