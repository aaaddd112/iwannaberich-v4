create or replace function public.create_my_profile(p_user_id uuid, p_username text, p_display_name text default null)
returns public.profiles
language plpgsql
security definer
set search_path=public
as $$
declare
  v_profile public.profiles;
  v_username text := lower(trim(p_username));
  v_wealth numeric;
begin
  if p_user_id is null then raise exception 'user_required' using errcode='22023'; end if;
  if not exists(select 1 from auth.users where id=p_user_id) then raise exception 'user_not_found' using errcode='23503'; end if;
  if v_username !~ '^[a-z0-9_-]{3,24}$' then raise exception 'invalid_username' using errcode='23514'; end if;
  if exists(select 1 from public.reserved_usernames where username=v_username) then raise exception 'username_reserved' using errcode='23514'; end if;
  if p_display_name is not null and length(trim(p_display_name))>60 then raise exception 'display_name_too_long' using errcode='22001'; end if;
  insert into public.profiles(id,username,display_name)
  values(p_user_id,v_username,nullif(trim(p_display_name),''))
  returning * into v_profile;
  insert into public.user_private(user_id) values(p_user_id);
  insert into public.referral_codes(user_id,code,active) values(p_user_id,v_username,true);
  insert into public.contributor_identities(user_id) values(p_user_id) on conflict do nothing;
  v_wealth:=public.get_current_wealth();
  if v_wealth<25 then
    perform public.award_achievement_to_user(p_user_id,'early_contributor',jsonb_build_object('joined_wealth_eur',v_wealth));
  end if;
  return v_profile;
exception
  when unique_violation then
    raise exception 'username_taken_or_profile_exists' using errcode='23505';
end;
$$;
revoke all on function public.create_my_profile(uuid,text,text) from public,anon,authenticated;
grant execute on function public.create_my_profile(uuid,text,text) to service_role;
