import Stripe from 'npm:stripe@^22'
import { createStripeWebhookTestHandler } from '../stripe-webhook-test/handler.ts'

const signingSecret = 'local-unit-test-signing-secret'
const stripe = new Stripe('unit-test-placeholder-never-used')
const handler = createStripeWebhookTestHandler(stripe, signingSecret)

function assertEquals(actual: unknown, expected: unknown, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}

async function signPayload(payload: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(signingSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signedBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`),
  )
  const digest = Array.from(new Uint8Array(signedBytes), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `t=${timestamp},v1=${digest}`
}

async function signedRequest(payload: string): Promise<Request> {
  return new Request('http://localhost/stripe-webhook-test', {
    method: 'POST',
    headers: { 'Stripe-Signature': await signPayload(payload) },
    body: payload,
  })
}

function eventPayload(
  type: string,
  session: { payment_status: string; amount_total: number | null; currency: string | null },
): string {
  return JSON.stringify({
    id: 'evt_unit_test',
    object: 'event',
    api_version: '2024-06-20',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_unit',
        object: 'checkout.session',
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: null,
    type,
  })
}

async function responseBody(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>
}

Deno.test('rejects requests without a Stripe signature', async () => {
  const response = await handler(new Request('http://localhost/stripe-webhook-test', { method: 'POST' }))
  assertEquals(response.status, 400, 'status')
  assertEquals(await response.text(), 'Missing Stripe-Signature header', 'message')
})

Deno.test('rejects invalid Stripe signatures', async () => {
  const payload = eventPayload('checkout.session.completed', {
    payment_status: 'paid',
    amount_total: 500,
    currency: 'eur',
  })
  const response = await handler(new Request('http://localhost/stripe-webhook-test', {
    method: 'POST',
    headers: { 'Stripe-Signature': 't=1,v1=invalid' },
    body: payload,
  }))
  assertEquals(response.status, 400, 'status')
  assertEquals(await response.text(), 'Invalid webhook signature', 'message')
})

Deno.test('reports a valid paid EUR Checkout Session without persisting it', async () => {
  const payload = eventPayload('checkout.session.completed', {
    payment_status: 'paid',
    amount_total: 500,
    currency: 'eur',
  })
  const response = await handler(await signedRequest(payload))
  const body = await responseBody(response)

  assertEquals(response.status, 200, 'status')
  assertEquals(body.ok, true, 'ok')
  assertEquals(body.sandbox, true, 'sandbox')
  assertEquals(body.validated, true, 'validated')
  assertEquals(body.event_id, 'evt_unit_test', 'event id')
  assertEquals(body.checkout_session_id, 'cs_test_unit', 'checkout session id')
  assertEquals(body.amount_cents, 500, 'amount')
  assertEquals(body.currency, 'eur', 'currency')
})

Deno.test('ignores unpaid Checkout Sessions', async () => {
  const payload = eventPayload('checkout.session.completed', {
    payment_status: 'unpaid',
    amount_total: 500,
    currency: 'eur',
  })
  const response = await handler(await signedRequest(payload))
  const body = await responseBody(response)

  assertEquals(response.status, 200, 'status')
  assertEquals(body.ignored, true, 'ignored')
  assertEquals(body.reason, 'not_paid', 'reason')
})

Deno.test('ignores zero-value and non-EUR sessions', async () => {
  for (const session of [
    { payment_status: 'paid', amount_total: 0, currency: 'eur' },
    { payment_status: 'paid', amount_total: 500, currency: 'usd' },
  ]) {
    const response = await handler(await signedRequest(eventPayload('checkout.session.completed', session)))
    const body = await responseBody(response)

    assertEquals(response.status, 200, 'status')
    assertEquals(body.ignored, true, 'ignored')
    assertEquals(body.reason, 'unsupported_amount_or_currency', 'reason')
  }
})

Deno.test('validates async payment success events', async () => {
  const payload = eventPayload('checkout.session.async_payment_succeeded', {
    payment_status: 'paid',
    amount_total: 500,
    currency: 'eur',
  })
  const response = await handler(await signedRequest(payload))
  const body = await responseBody(response)

  assertEquals(response.status, 200, 'status')
  assertEquals(body.validated, true, 'validated')
  assertEquals(body.checkout_session_id, 'cs_test_unit', 'checkout session id')
})

Deno.test('ignores unsupported Stripe event types', async () => {
  const payload = eventPayload('payment_intent.succeeded', {
    payment_status: 'paid',
    amount_total: 500,
    currency: 'eur',
  })
  const response = await handler(await signedRequest(payload))
  const body = await responseBody(response)

  assertEquals(response.status, 200, 'status')
  assertEquals(body.ignored, true, 'ignored')
  assertEquals(body.reason, 'unsupported_event_type', 'reason')
})
