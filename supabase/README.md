# IWANNABERICH — Supabase + Stripe

The public site reads `public.get_current_wealth()` from Supabase. Stripe payments update that total through a server-side webhook.

## Authentication and accounts

The website uses Supabase Auth with email/password. The browser only contains the project's publishable key. User sessions are persisted and refreshed by `@supabase/supabase-js`.

Account creation is split into two server boundaries:

1. `auth.signUp()` creates the Supabase Auth user.
2. The authenticated `create-profile` Edge Function resolves the caller from the session token and calls the service-role-only `public.create_my_profile(...)` RPC.

The profile RPC is intentionally not executable by `anon` or `authenticated`. The Edge Function is the only public application path to it.

Owner replies use the normal Supabase Auth session. The `submit-prediction` Edge Function verifies the Bearer token and compares the authenticated user's email with the server-side `OWNER_EMAIL` secret before allowing a reply.

### Edge Function JWT policy

Public browser endpoints that intentionally accept anonymous requests have `verify_jwt = false` and perform their own validation/rate limiting:

- `submit-prediction`
- `next-experiment-vote`
- `analytics-events`
- `analytics-dashboard`

Authenticated account/admin endpoints keep `verify_jwt = true`:

- `create-profile`
- `admin-contributions`
- `admin-growth-review`

The Stripe webhook also remains public at the gateway and verifies the Stripe signature inside the function.

## 1. Run the SQL

Open **Supabase → SQL Editor** and run the migrations in chronological order, including the current HMGR/account migrations. In particular, account creation requires:

- `migrations/202609040001_hmgr_account_foundation.sql`
- `migrations/202609040002_hmgr_profile_creation_rpc.sql`

The public comments and payment migrations remain required for their respective features.

## 2. Deploy the Edge Functions

Deploy the functions under `supabase/functions/`. The root `supabase/config.toml` contains the intended JWT policy and must be deployed with the functions.

The `create-profile` function is required for `/account.html` username/profile setup.

## 3. Add Supabase Edge Function secrets

Server-only credentials must stay in **Supabase → Edge Functions → Secrets**. Never put service-role/secret keys in frontend files or Git.

Owner setup requires:

- `OWNER_EMAIL` = exact owner account email

Prediction moderation uses:

- `PREDICTION_RATE_LIMIT_SALT` = optional dedicated random salt; if absent, the function falls back to the service-role key

Owner notifications use:

- `RESEND_API_KEY`
- `OWNER_NOTIFICATION_EMAIL`
- `RESEND_FROM_EMAIL`

Stripe uses:

- `STRIPE_API_KEY`
- `STRIPE_WEBHOOK_SIGNING_SECRET`
- `STRIPE_PAYMENT_LINK_ID`

## 4. Stripe webhook

Deploy `functions/stripe-webhook` with `verify_jwt = false` because Stripe cannot provide a Supabase user JWT. The function verifies Stripe's webhook signature before processing events.

Webhook events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `charge.refunded`

## 5. Prediction anti-spam / moderation

The public prediction form posts through `functions/submit-prediction`.

It provides:

- server-side profanity filtering
- hidden honeypot handling
- 3 posts per 10 minutes per network identifier
- 10 posts per day per network identifier
- stricter authenticated owner reply handling
- duplicate prediction blocking for 24 hours
- no direct anonymous INSERT permission on `predictions_comments`

The function uses server-side privileged DB access for the controlled insert. The service-role credential never belongs in the website.

## 6. Live community experiment + public ledger

`migrations/202608200001_live_experiment.sql` provides the public-safe contribution ledger and next-experiment voting RPCs. `functions/next-experiment-vote` adds server-side rate limiting and optional XP awarding for authenticated users.

## 7. Verification checklist after deployment

1. Create a fresh test account on `/account.html`.
2. Verify the email if confirmation is enabled.
3. Claim a valid username and confirm `/profile.html` loads.
4. Confirm a duplicate/reserved username is rejected without creating a second profile.
5. Sign out and confirm `/profile.html` redirects to `/account.html`.
6. Post an anonymous prediction and confirm it appears publicly.
7. Repeat the same prediction within 24 hours and confirm it is rejected.
8. Exercise the prediction rate limit and confirm HTTP 429 behavior.
9. Log in as the configured owner and confirm owner reply controls appear.
10. Confirm a non-owner authenticated account receives HTTP 403 when attempting an owner reply.
11. Vote in the next-experiment flow anonymously and while authenticated, confirming the latter can award XP only once per option/action key.
12. Confirm Stripe webhook requests work without a Supabase JWT and that invalid Stripe signatures are rejected.
13. Confirm public clients cannot directly insert into protected payment, moderation, XP, admin, or participation tables.
14. Confirm no service-role/secret key exists in tracked frontend files.
