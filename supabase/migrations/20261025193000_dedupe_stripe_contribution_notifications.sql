-- Deduplicate owner notifications per confirmed Stripe Checkout Session.
-- This migration is for review in the PR only; do not apply to production without approval.

CREATE TABLE IF NOT EXISTS public.stripe_contribution_notifications (
  stripe_checkout_session_id text PRIMARY KEY
    REFERENCES public.stripe_contributions(stripe_checkout_session_id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stripe_contribution_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.stripe_contribution_notifications FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_stripe_contribution_notification(p_checkout_session_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_claimed text;
BEGIN
  IF NULLIF(btrim(p_checkout_session_id), '') IS NULL THEN
    RAISE EXCEPTION 'invalid_checkout_session_id' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.stripe_contribution_notifications (
    stripe_checkout_session_id, status
  )
  VALUES (p_checkout_session_id, 'pending')
  ON CONFLICT (stripe_checkout_session_id) DO NOTHING
  RETURNING stripe_checkout_session_id INTO v_claimed;

  IF v_claimed IS NOT NULL THEN
    RETURN true;
  END IF;

  -- Resend retains idempotency keys for 24 hours. Reclaim failed claims,
  -- or claims stuck for 10+ minutes, only inside a 23-hour safe retry window.
  -- Older pending/failed rows require manual reconciliation instead of a
  -- potentially duplicate email after the provider's idempotency window expires.
  UPDATE public.stripe_contribution_notifications
     SET status = 'pending', updated_at = now()
   WHERE stripe_checkout_session_id = p_checkout_session_id
     AND updated_at > now() - interval '23 hours'
     AND (
       status = 'failed'
       OR (status = 'pending' AND updated_at < now() - interval '10 minutes')
     )
  RETURNING stripe_checkout_session_id INTO v_claimed;

  RETURN v_claimed IS NOT NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.finish_stripe_contribution_notification(
  p_checkout_session_id text,
  p_sent boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.stripe_contribution_notifications
     SET status = CASE WHEN p_sent THEN 'sent' ELSE 'failed' END,
         updated_at = now()
   WHERE stripe_checkout_session_id = p_checkout_session_id
     AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'notification_claim_not_pending' USING ERRCODE = 'P0002';
  END IF;
END;
$function$;

REVOKE ALL ON FUNCTION public.claim_stripe_contribution_notification(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.finish_stripe_contribution_notification(text, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_stripe_contribution_notification(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.finish_stripe_contribution_notification(text, boolean) TO service_role;
