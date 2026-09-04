-- Atomic profile creation for HELP ME GET RICH.
-- The authenticated user's identity comes from auth.uid(); the client cannot supply a user_id.

create or replace function public.create_my_profile(
  p_username text,
  p_display_name text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_username text;
  v_display_name text;
  v_profile public.profiles;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'unauthorized';
  end if;

  v_username := lower(trim(coalesce(p_username, '')));
  v_display_name := nullif(trim(coalesce(p_display_name, '')), '');

  if v_username !~ '^[a-z0-9_-]{3,24}$' then
    raise exception using errcode = '22023', message = 'invalid_username';
  end if;

  if v_display_name is not null and char_length(v_display_name) > 60 then
    raise exception using errcode = '22023', message = 'display_name_too_long';
  end if;

  if exists (
    select 1
    from public.reserved_usernames r
    where r.username = v_username
  ) then
    raise exception using errcode = '23514', message = 'username_reserved';
  end if;

  insert into public.profiles (id, username, display_name)
  values (v_user_id, v_username, v_display_name)
  returning * into v_profile;

  insert into public.user_private (user_id)
  values (v_user_id);

  return v_profile;
exception
  when unique_violation then
    raise exception using errcode = '23505', message = 'username_taken_or_profile_exists';
end;
$$;

revoke all on function public.create_my_profile(text, text) from public, anon;
grant execute on function public.create_my_profile(text, text) to authenticated;
