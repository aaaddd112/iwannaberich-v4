# Owner notifications — IWANNABERICH

The site can email the owner when:

- a new public prediction is submitted;
- a new EUR Stripe contribution is successfully recorded.

Notifications are sent server-side from Supabase Edge Functions using Resend.
The email failure is intentionally best-effort: a prediction/payment is never rejected because an email could not be delivered.

## 1. Create a Resend account and verify a sending domain

Create an API key in Resend and verify a domain you control. Use a sender address on that verified domain, for example:

`IWANNABERICH <notifications@iwannaberich.xyz>`

Do not put the Resend API key in the website or Git repository.

## 2. Add these Supabase Edge Function secrets

In Supabase → Edge Functions → Secrets add:

- `RESEND_API_KEY` = your Resend API key
- `OWNER_NOTIFICATION_EMAIL` = the email address where you want to receive alerts
- `RESEND_FROM_EMAIL` = the verified sender, e.g. `IWANNABERICH <notifications@iwannaberich.xyz>`

The existing Stripe secrets remain unchanged.

## 3. Deploy both functions

Deploy/redeploy:

- `supabase/functions/submit-prediction`
- `supabase/functions/stripe-webhook`

No new database migration is required for notifications.

## 4. What you receive

Prediction email:

- prediction text
- timestamp
- author type
- prediction ID

Contribution email:

- EUR amount
- payment time
- Stripe checkout session ID
- payment intent ID

The Stripe function checks whether the checkout session was already recorded before sending the email, so Stripe webhook retries do not normally create duplicate alerts.
