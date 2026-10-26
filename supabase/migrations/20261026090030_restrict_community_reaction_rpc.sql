-- Restrict reaction mutations to the rate-limited Edge Function.
-- The public client must not bypass the Edge Function's per-IP rate limits.
REVOKE ALL ON FUNCTION public.apply_community_reaction(uuid, text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_community_reaction(uuid, text, text)
  TO service_role;
