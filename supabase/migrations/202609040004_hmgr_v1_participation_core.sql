-- IWANNABERICH V1 participation core: referral identity + private participation projection.
-- Production-compatible with the service-role identity boundary.

create or replace function public.create_my_profile(p_user_id uuid, p_username text, p_display_name text default null)
returns public.profiles
language plpgsql security definer set search_path=public as $$
declare v_profile public.profiles; v_username text:=lower(trim(p_username));
begin
 if p_user_id is null then raise exception 'user_required' using errcode='22023'; end if;
 if not exists(select 1 from auth.users where id=p_user_id) then raise exception 'user_not_found' using errcode='23503'; end if;
 if v_username !~ '^[a-z0-9_-]{3,24}$' then raise exception 'invalid_username' using errcode='23514'; end if;
 if exists(select 1 from public.reserved_usernames where username=v_username and active) then raise exception 'username_reserved' using errcode='23514'; end if;
 if p_display_name is not null and length(trim(p_display_name))>60 then raise exception 'display_name_too_long' using errcode='22001'; end if;
 insert into public.profiles(id,username,display_name) values(p_user_id,v_username,nullif(trim(p_display_name),'')) returning * into v_profile;
 insert into public.user_private(user_id) values(p_user_id);
 insert into public.referral_codes(user_id,code,active) values(p_user_id,v_username,true);
 return v_profile;
exception when unique_violation then raise exception 'username_taken_or_profile_exists' using errcode='23505'; end; $$;
revoke all on function public.create_my_profile(uuid,text,text) from public,anon,authenticated;
grant execute on function public.create_my_profile(uuid,text,text) to service_role;

create or replace function public.get_my_participation()
returns table(username text,display_name text,xp bigint,rank text,referral_code text,referral_count bigint,achievement_count bigint)
language sql security definer stable set search_path=public as $$
with mine as (select coalesce(sum(amount),0)::bigint xp from public.xp_transactions where user_id=auth.uid())
select p.username,p.display_name,mine.xp,
 case when mine.xp>=500000 then 'Billionaire Material' when mine.xp>=150000 then 'Mogul' when mine.xp>=50000 then 'Investor' when mine.xp>=15000 then 'Associate' when mine.xp>=5000 then 'Agent' when mine.xp>=1000 then 'Experimenter' when mine.xp>=250 then 'Observer' else 'Curious' end,
 rc.code,
 (select count(*) from public.referrals r where r.referrer_id=p.id and r.status in('active','qualified')),
 (select count(*) from public.user_achievements ua where ua.user_id=p.id)
from public.profiles p cross join mine left join public.referral_codes rc on rc.user_id=p.id and rc.active where p.id=auth.uid(); $$;
revoke all on function public.get_my_participation() from public,anon;
grant execute on function public.get_my_participation() to authenticated,service_role;

create or replace function public.register_referral(p_code text,p_referred_user_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_code public.referral_codes; v_id uuid;
begin
 if p_referred_user_id is null or p_referred_user_id<>auth.uid() then raise exception 'invalid_user' using errcode='42501'; end if;
 select * into v_code from public.referral_codes where lower(code)=lower(trim(p_code)) and active for update;
 if not found or v_code.user_id=p_referred_user_id then return null; end if;
 insert into public.referrals(referral_code_id,referrer_id,referred_user_id,status,first_seen_at) values(v_code.id,v_code.user_id,p_referred_user_id,'active',now()) on conflict(referred_user_id) where referred_user_id is not null do nothing returning id into v_id;
 return v_id;
end; $$;
revoke all on function public.register_referral(text,uuid) from public,anon;
grant execute on function public.register_referral(text,uuid) to authenticated,service_role;
