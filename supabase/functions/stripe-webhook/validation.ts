import type Stripe from 'npm:stripe@^22'

export type CheckoutSessionValidationInput = Pick<
  Stripe.Checkout.Session,
  'payment_link' | 'metadata' | 'payment_status' | 'amount_total' | 'currency'
>

export type CheckoutSessionIgnoreReason =
  | 'different_payment_link'
  | 'payment_link_not_configured'
  | 'unknown_checkout_source'
  | 'not_paid'
  | 'unsupported_amount_or_currency'

export function checkoutSessionIgnoreReason(
  session: CheckoutSessionValidationInput,
  configuredPaymentLink: string | null,
): CheckoutSessionIgnoreReason | null {
  const isLegacyPaymentLink = Boolean(
    session.payment_link &&
    configuredPaymentLink &&
    session.payment_link === configuredPaymentLink
  )
  const isNewWebCheckout = session.metadata?.source === 'iwannaberich-web'

  if (session.payment_link && !isLegacyPaymentLink) {
    return configuredPaymentLink ? 'different_payment_link' : 'payment_link_not_configured'
  }
  if (!isLegacyPaymentLink && !isNewWebCheckout) return 'unknown_checkout_source'
  if (session.payment_status !== 'paid') return 'not_paid'

  const amount = session.amount_total ?? 0
  const currency = (session.currency ?? '').toLowerCase()
  if (amount <= 0 || currency !== 'eur') return 'unsupported_amount_or_currency'

  return null
}
