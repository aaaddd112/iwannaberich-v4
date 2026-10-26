-- Keep cumulative Stripe refund amounts monotonic when webhook events arrive out of order.
-- PR-only migration: do not apply to production without explicit approval.
CREATE OR REPLACE FUNCTION public.apply_stripe_refund(
  p_payment_intent_id text,
  p_refunded_cents bigint,
  p_event_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_refunded_cents bigint;
BEGIN
  IF NULLIF(btrim(p_payment_intent_id), '') IS NULL THEN
    RAISE EXCEPTION 'invalid_payment_intent_id' USING ERRCODE = '22023';
  END IF;

  -- Stripe's amount_refunded is cumulative. Never let an older event reduce it.
  UPDATE public.stripe_contributions
     SET refunded_cents = GREATEST(
           refunded_cents,
           LEAST(GREATEST(COALESCE(p_refunded_cents, 0), 0), amount_cents)
         ),
         status = CASE
           WHEN GREATEST(
             refunded_cents,
             LEAST(GREATEST(COALESCE(p_refunded_cents, 0), 0), amount_cents)
           ) >= amount_cents THEN 'refunded'
           WHEN GREATEST(
             refunded_cents,
             LEAST(GREATEST(COALESCE(p_refunded_cents, 0), 0), amount_cents)
           ) > 0 THEN 'partially_refunded'
           ELSE 'paid'
         END,
         updated_at = now()
   WHERE stripe_payment_intent_id = p_payment_intent_id;

  -- p_event_id is retained for API compatibility with the existing webhook.
  -- Idempotency is provided by the monotonic cumulative refund value.
END;
$function$;
