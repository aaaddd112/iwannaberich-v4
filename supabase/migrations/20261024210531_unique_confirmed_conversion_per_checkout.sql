-- Enforce one confirmed conversion event per Stripe Checkout Session.
-- This index is intentionally scoped to server-confirmed conversion events only.
CREATE UNIQUE INDEX IF NOT EXISTS analytics_events_contribution_completed_session_uidx
ON public.analytics_events ((metadata ->> 'checkout_session_id'))
WHERE event_name = 'contribution_completed'
  AND metadata ? 'checkout_session_id'
  AND NULLIF(metadata ->> 'checkout_session_id', '') IS NOT NULL;
