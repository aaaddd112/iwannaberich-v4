import Stripe from 'npm:stripe@^22'
import { withSupabase } from 'npm:@supabase/server@^1'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string)
const cryptoProvider = Stripe.createSubtleCryptoProvider()

export default {
  fetch: withSupabase({ auth: 'none' }, async (req, ctx) => {
    const signature = req.headers.get('Stripe-Signature')
    if (!signature) {
      return new Response('Missing Stripe-Signature header', { status: 400 })
    }

    const body = await req.text()

    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
        undefined,
        cryptoProvider,
      )
    } catch (error) {
      console.error('Stripe signature verification failed:', error)
      return new Response('Invalid webhook signature', { status: 400 })
    }

    console.log(`Stripe event received: ${event.id} (${event.type})`)

    const configuredPaymentLink = Deno.env.get('STRIPE_PAYMENT_LINK_ID') || null

    try {
      if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        const session = event.data.object as Stripe.Checkout.Session

        // Only count the payment link used by IWANNABERICH when the ID is configured.
        if (configuredPaymentLink && session.payment_link !== configuredPaymentLink) {
          return Response.json({ ok: true, ignored: true, reason: 'different_payment_link' })
        }

        if (session.payment_status !== 'paid') {
          return Response.json({ ok: true, ignored: true, reason: 'not_paid' })
        }

        const amount = session.amount_total ?? 0
        const currency = (session.currency ?? '').toLowerCase()
        const paymentIntent = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null

        if (amount <= 0 || currency !== 'eur') {
          return Response.json({ ok: true, ignored: true, reason: 'unsupported_amount_or_currency' })
        }

        const { error } = await ctx.supabaseAdmin.rpc('record_stripe_contribution', {
          p_checkout_session_id: session.id,
          p_payment_intent_id: paymentIntent,
          p_payment_link_id: session.payment_link,
          p_event_id: event.id,
          p_amount_cents: amount,
          p_currency: currency,
          p_paid_at: new Date((session.created ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
        })

        if (error) {
          console.error('Could not record Stripe contribution:', error)
          return new Response('Database write failed', { status: 500 })
        }
      }

      if (event.type === 'charge.refunded') {
        const charge = event.data.object as Stripe.Charge
        const paymentIntent = typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id ?? null

        if (paymentIntent) {
          const { error } = await ctx.supabaseAdmin.rpc('apply_stripe_refund', {
            p_payment_intent_id: paymentIntent,
            p_refunded_cents: charge.amount_refunded,
            p_event_id: event.id,
          })

          if (error) {
            console.error('Could not apply Stripe refund:', error)
            return new Response('Database write failed', { status: 500 })
          }
        }
      }

      return Response.json({ ok: true })
    } catch (error) {
      console.error('Stripe webhook processing failed:', error)
      return new Response('Webhook processing failed', { status: 500 })
    }
  }),
}
