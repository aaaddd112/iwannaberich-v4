create or replace function public.get_public_member_profile(p_username text)
returns table(contributor_number bigint, username text, display_name text, bio text, xp bigint, rank text, achievements bigint, qualified_visitors bigint, joined_at timestamptz)
language sql stable security definer set search_path=public
as $$
with target as (select p.id,p.username,p.display_name,p.bio,p.created_at from public.profiles p where lower(p.username)=lower(trim(p_username)) limit 1),
score as (select t.id,coalesce(sum(x.amount),0)::bigint xp from target t left join public.xp_transactions x on x.user_id=t.id group by t.id),
ach as (select ua.user_id,count(*)::bigint achievements from public.user_achievements ua join target t on t.id=ua.user_id group by ua.user_id),
growth as (select r.referrer_id user_id,count(*)::bigint qualified_visitors from public.referrals r join target t on t.id=r.referrer_id where r.status='qualified' group by r.referrer_id)
select ci.contributor_number,t.username,t.display_name,t.bio,s.xp,
case when s.xp>=500000 then 'Billionaire Material' when s.xp>=150000 then 'Mogul' when s.xp>=50000 then 'Investor' when s.xp>=15000 then 'Associate' when s.xp>=5000 then 'Agent' when s.xp>=1000 then 'Experimenter' when s.xp>=250 then 'Observer' else 'Curious' end,
coalesce(a.achievements,0),coalesce(g.qualified_visitors,0),t.created_at
from target t join score s on s.id=t.id left join ach a on a.user_id=t.id left join growth g on g.user_id=t.id left join public.contributor_identities ci on ci.user_id=t.id;
$$;
revoke all on function public.get_public_member_profile(text) from public;
grant execute on function public.get_public_member_profile(text) to anon,authenticated;
