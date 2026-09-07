-- Mission attempts must be created/completed through the server-side mission flow.
-- Direct client INSERT/UPDATE would allow users to forge attempt state and bypass
-- the start/complete Edge Function + RPC validation path.
revoke insert, update on table public.mission_attempts from anon, authenticated;
grant select on table public.mission_attempts to authenticated;
