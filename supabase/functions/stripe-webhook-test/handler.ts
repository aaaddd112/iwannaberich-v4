import Stripe from 'npm:stripe@^22'

const cryptoProvider = Stripe.createSubtleCryptoProvider()

// Keep the request handler separate from the Deno.serve entry point so its
// signature validation and response rules can be exercised without a server.
export function createStripeWebhookTestHandler(
  stripe: Stripe,
  signingSecret: string,
): (req: Request) => Promise<Response> {
  return async (req) => {
    const signature = req.headers.get('Stripe-Signature')
    if (!signature) return new Response('Missing Stripe-Signature header', { status: 400 })

    const body = await req.text()
    let event: Stripe.Event

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        signingSecret,
        undefined,
        cryptoProvider,
      )
    } catch (error) {
      console.error('Stripe sandbox signature verification failed:', error)
      return new Response('Invalid webhook signature', { status: 400 })
    }

    console.log(`Stripe sandbox event received: ${event.id} (${event.type})`)

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status !== 'paid') {
        return Response.json({ ok: true, sandbox: true, ignored: true, reason: 'not_paid' })
      }

      const amount = session.amount_total ?? 0
      const currency = (session.currency ?? '').toLowerCase()

      if (amount <= 0 || currency !== 'eur') {
        return Response.json({ ok: true, sandbox: true, ignored: true, reason: 'unsupported_amount_or_currency' })
      }

      // Intentionally report validation only. Persisting a test payment requires
      // a dedicated sandbox table/schema, never the production wealth ledger.
      return Response.json({
        ok: true,
        sandbox: true,
        validated: true,
        event_id: event.id,
        checkout_session_id: session.id,
        amount_cents: amount,
        currency,
      })
    }

    return Response.json({ ok: true, sandbox: true, ignored: true, reason: 'unsupported_event_type' })
  }
}
