# IWANNABERICH — Supabase + Stripe

The public site already reads `public.get_current_wealth()` from Supabase. This integration makes that number update automatically when the live Stripe Payment Link receives a successful EUR payment.

## 1. Run the SQL

Open **Supabase → SQL Editor** and run:

`migrations/202608140001_stripe_contributions.sql`

This creates the contribution table and the public read-only RPC. The payment rows themselves are not readable/writable by the public client.

## 2. Deploy the Edge Function

Deploy:

`functions/stripe-webhook`

The function is configured with `verify_jwt = false` because Stripe is an external webhook provider. It verifies the Stripe signature itself before processing the event.

## 3. Add Supabase Edge Function secrets

Add these secrets in **Supabase → Edge Functions → Secrets**:

- `STRIPE_API_KEY` = your **LIVE** Stripe secret key (`sk_live_...`)
- `STRIPE_WEBHOOK_SIGNING_SECRET` = the webhook endpoint signing secret (`whsec_...`)
- `STRIPE_PAYMENT_LINK_ID` = the `plink_...` ID of the IWANNABERICH live Payment Link (recommended)

Do not put any of these secrets in the website or Git repository. Supabase documents secret keys as server-side only; never expose them in the browser.

## 4. Create the Stripe webhook

In the **LIVE** Stripe account, create a webhook endpoint pointing to:

`https://ofcdtwrgyxjrpoxuikxg.supabase.co/functions/v1/stripe-webhook`

Subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `charge.refunded`

Copy the endpoint's `whsec_...` secret into `STRIPE_WEBHOOK_SIGNING_SECRET`.

## 5. Test

Make a small real payment through the live Payment Link.

Then verify:

1. Stripe shows the successful payment.
2. The webhook delivery is successful (HTTP 200).
3. `stripe_contributions` contains the payment.
4. `select public.get_current_wealth();` returns the new total.
5. Refresh `https://iwannaberich.xyz` and the public counter shows the same amount.

The counter is based on gross EUR contributions, minus recorded refunds. Stripe processing fees are not subtracted from the public experiment total.
