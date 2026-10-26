import Stripe from 'npm:stripe@^22'
import { createStripeWebhookTestHandler } from './handler.ts'

const apiKey = Deno.env.get('STRIPE_TEST_API_KEY')
const signingSecret = Deno.env.get('STRIPE_TEST_WEBHOOK_SIGNING_SECRET')
if (!apiKey) throw new Error('Missing STRIPE_TEST_API_KEY')
if (!signingSecret) throw new Error('Missing STRIPE_TEST_WEBHOOK_SIGNING_SECRET')

const stripe = new Stripe(apiKey)

// This test endpoint validates Stripe test-mode signatures and reports results.
// Its handler has no database or notification dependencies by design.
Deno.serve(createStripeWebhookTestHandler(stripe, signingSecret))
