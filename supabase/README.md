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
## 6. Prediction anti-spam / moderation

The public prediction form now posts through:

`functions/submit-prediction`

Run the migration:

`migrations/202608140002_prediction_moderation.sql`

Then deploy the Edge Function. It adds:

- server-side profanity filtering (including common obfuscations)
- 3 posts per 10 minutes per network identifier
- 10 posts per day per network identifier
- duplicate prediction blocking for 24 hours
- a hidden honeypot for simple bots
- direct anonymous INSERT access to `predictions_comments` disabled

The function uses Supabase's server-side service role automatically. No service-role key belongs in the website.

If abuse becomes significant, Cloudflare Turnstile can be added as a second anti-bot layer without changing the public comments table.

## Live community experiment + public ledger

Run `migrations/202608200001_live_experiment.sql` after the existing Stripe contribution migration. It adds the public-safe contribution ledger RPC and the anonymous next-experiment voting RPC used by the homepage.
