-- Growth-first public leaderboard.
-- Do not show users with no qualified growth activity.
CREATE OR REPLACE FUNCTION public.get_public_leaderboard(p_limit integer DEFAULT 25)
RETURNS TABLE(
  contributor_number bigint,
  username text,
  display_name text,
  xp bigint,
  rank text,
  achievements bigint,
  qualified_visitors bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public
AS $$
WITH scores AS (
  SELECT p.id AS user_id, COALESCE(SUM(x.amount),0)::bigint AS xp
  FROM public.profiles p
  LEFT JOIN public.xp_transactions x ON x.user_id=p.id
  GROUP BY p.id
), growth AS (
  SELECT contributor_user_id AS user_id, COUNT(*)::bigint AS qualified_visitors
  FROM public.growth_attributions
  GROUP BY contributor_user_id
), ach AS (
  SELECT user_id, COUNT(*)::bigint AS achievements
  FROM public.user_achievements
  GROUP BY user_id
)
SELECT ci.contributor_number,
       p.username,
       p.display_name,
       s.xp,
       CASE
         WHEN s.xp>=500000 THEN 'Billionaire Material'
         WHEN s.xp>=150000 THEN 'Mogul'
         WHEN s.xp>=50000 THEN 'Investor'
         WHEN s.xp>=15000 THEN 'Associate'
         WHEN s.xp>=5000 THEN 'Agent'
         WHEN s.xp>=1000 THEN 'Experimenter'
         WHEN s.xp>=250 THEN 'Observer'
         ELSE 'Curious'
       END,
       COALESCE(a.achievements,0),
       COALESCE(g.qualified_visitors,0)
FROM scores s
JOIN public.profiles p ON p.id=s.user_id
JOIN public.contributor_identities ci ON ci.user_id=s.user_id
LEFT JOIN ach a ON a.user_id=s.user_id
LEFT JOIN growth g ON g.user_id=s.user_id
WHERE COALESCE(g.qualified_visitors,0) > 0
ORDER BY g.qualified_visitors DESC, s.xp DESC, ci.contributor_number ASC
LIMIT GREATEST(1,LEAST(COALESCE(p_limit,25),100));
$$;

REVOKE ALL ON FUNCTION public.get_public_leaderboard(integer) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_leaderboard(integer) TO anon,authenticated,service_role;
