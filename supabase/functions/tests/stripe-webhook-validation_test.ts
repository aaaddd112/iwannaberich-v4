import {
  checkoutSessionIgnoreReason,
  type CheckoutSessionValidationInput,
} from '../stripe-webhook/validation.ts'

function session(
  overrides: Partial<CheckoutSessionValidationInput> = {},
): CheckoutSessionValidationInput {
  return {
    payment_link: null,
    metadata: { source: 'iwannaberich-web' },
    payment_status: 'paid',
    amount_total: 500,
    currency: 'eur',
    ...overrides,
  }
}

function assertEquals(actual: unknown, expected: unknown, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}

Deno.test('accepts a paid EUR first-party Checkout Session', () => {
  assertEquals(checkoutSessionIgnoreReason(session(), null), null, 'reason')
})

Deno.test('accepts a legacy Payment Link only when its exact ID is configured', () => {
  assertEquals(
    checkoutSessionIgnoreReason(session({ payment_link: 'plink_expected' }), 'plink_expected'),
    null,
    'reason',
  )
})

Deno.test('rejects a different configured Payment Link', () => {
  assertEquals(
    checkoutSessionIgnoreReason(session({ payment_link: 'plink_other' }), 'plink_expected'),
    'different_payment_link',
    'reason',
  )
})

Deno.test('rejects legacy Payment Links when no ID is configured', () => {
  assertEquals(
    checkoutSessionIgnoreReason(session({ payment_link: 'plink_any' }), null),
    'payment_link_not_configured',
    'reason',
  )
})

Deno.test('rejects unknown checkout sources', () => {
  assertEquals(
    checkoutSessionIgnoreReason(session({ metadata: {} }), null),
    'unknown_checkout_source',
    'reason',
  )
})

Deno.test('ignores sessions that have not been paid', () => {
  assertEquals(
    checkoutSessionIgnoreReason(session({ payment_status: 'unpaid' }), null),
    'not_paid',
    'reason',
  )
})

Deno.test('rejects zero-value and non-EUR sessions', () => {
  assertEquals(
    checkoutSessionIgnoreReason(session({ amount_total: 0 }), null),
    'unsupported_amount_or_currency',
    'zero amount reason',
  )
  assertEquals(
    checkoutSessionIgnoreReason(session({ currency: 'usd' }), null),
    'unsupported_amount_or_currency',
    'currency reason',
  )
})

Deno.test('normalizes currency case', () => {
  assertEquals(checkoutSessionIgnoreReason(session({ currency: 'EUR' }), null), null, 'reason')
})
