import Stripe from 'npm:stripe@^22'
import { withSupabase } from 'npm:@supabase/server@^1'
import { htmlText, sendOwnerNotification } from '../_shared/notify.ts'
import { checkoutSessionIgnoreReason } from './validation.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string)
const cryptoProvider = Stripe.createSubtleCryptoProvider()

export default {
  fetch: withSupabase({ auth: 'none' }, async (req, ctx) => {
    const signature = req.headers.get('Stripe-Signature')
    if (!signature) return new Response('Missing Stripe-Signature header', { status: 400 })
    const body = await req.text()
    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!, undefined, cryptoProvider)
    } catch (error) {
      console.error('Stripe signature verification failed:', error)
      return new Response('Invalid webhook signature', { status: 400 })
    }
    const configuredPaymentLink = Deno.env.get('STRIPE_PAYMENT_LINK_ID')?.trim() || null
    try {
      if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        const session = event.data.object as Stripe.Checkout.Session

        const ignoreReason = checkoutSessionIgnoreReason(session, configuredPaymentLink)
        if (ignoreReason) return Response.json({ ok: true, ignored: true, reason: ignoreReason })
        const amount = session.amount_total ?? 0
        const currency = (session.currency ?? '').toLowerCase()
        const nickname = (session.metadata?.nickname ?? session.client_reference_id ?? '').trim() || null
        const paymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null
        if (amount <= 0 || currency !== 'eur') return Response.json({ ok: true, ignored: true, reason: 'unsupported_amount_or_currency' })
        const { data: existingContribution, error: existingError } = await ctx.supabaseAdmin.from('stripe_contributions').select('id').eq('stripe_checkout_session_id', session.id).maybeSingle()
        if (existingError) return new Response('Database read failed', { status: 500 })
        if (!existingContribution) {
          const paidAt = new Date((session.created ?? Math.floor(Date.now() / 1000)) * 1000).toISOString()
          const { error } = await ctx.supabaseAdmin.rpc('record_stripe_contribution', { p_checkout_session_id: session.id, p_payment_intent_id: paymentIntent, p_payment_link_id: session.payment_link ?? null, p_event_id: event.id, p_amount_cents: amount, p_currency: currency, p_paid_at: paidAt, p_nickname: nickname })
          if (error) return new Response('Database write failed', { status: 500 })
        }

        // Claim notifications atomically so concurrent/retried Stripe deliveries
        // cannot send duplicate emails for the same Checkout Session.
        const { data: notificationClaimed, error: notificationClaimError } = await ctx.supabaseAdmin.rpc(
          'claim_stripe_contribution_notification',
          { p_checkout_session_id: session.id },
        )
        if (notificationClaimError) return new Response('Notification claim failed', { status: 500 })
        if (notificationClaimed === true) {
          const amountEur = (amount / 100).toFixed(2)
          const subject = `IWANNABERICH — new contribution €${amountEur}`
          const paidAt = new Date((session.created ?? Math.floor(Date.now() / 1000)) * 1000).toISOString()
          const text = [
            'A new Stripe contribution was received.',
            '',
            `Amount: €${amountEur}`,
            `Nickname: ${nickname ?? 'Anonymous'}`,
            `Paid at: ${paidAt}`,
            `Checkout session: ${session.id}`,
            `Payment intent: ${paymentIntent ?? 'n/a'}`,
          ].join('\n')
          const html = `<h2>New contribution received</h2><p><strong>Amount:</strong> €${htmlText(amountEur)}</p><p><strong>Nickname:</strong> ${htmlText(nickname ?? 'Anonymous')}</p><p><strong>Paid at:</strong> ${htmlText(paidAt)}</p><p><strong>Checkout session:</strong> ${htmlText(session.id)}</p><p><strong>Payment intent:</strong> ${htmlText(paymentIntent ?? 'n/a')}</p>`
          const notificationSent = await sendOwnerNotification(subject, text, html, `stripe-contribution/${session.id}`)
          const { error: notificationFinishError } = await ctx.supabaseAdmin.rpc(
            'finish_stripe_contribution_notification',
            { p_checkout_session_id: session.id, p_sent: notificationSent },
          )
          if (notificationFinishError) return new Response('Notification status update failed', { status: 500 })
          if (!notificationSent) return new Response('Owner notification failed', { status: 500 })
        }

        // The database's partial unique index is the concurrency-safe guard.
        // The read below is only a fast path; correctness does not depend on it.
        const { data: existingConversion, error: conversionReadError } = await ctx.supabaseAdmin
          .from('analytics_events')
          .select('id')
          .eq('event_name', 'contribution_completed')
          .contains('metadata', { checkout_session_id: session.id })
          .limit(1)
          .maybeSingle()
        if (conversionReadError) return new Response('Analytics read failed', { status: 500 })
        if (!existingConversion) {
          const metadata = session.metadata ?? {}
          const conversionMetadata: Record<string, string | number> = {
            checkout_session_id: session.id,
            amount_eur: amount / 100,
            currency,
            visitor_id: metadata.analytics_visitor_id ?? '',
            session_id: metadata.analytics_session_id ?? '',
            first_touch_source: metadata.analytics_first_touch_source ?? '',
            first_touch_medium: metadata.analytics_first_touch_medium ?? '',
            first_touch_campaign: metadata.analytics_first_touch_campaign ?? '',
            first_touch_content: metadata.analytics_first_touch_content ?? '',
            last_touch_source: metadata.analytics_last_touch_source ?? '',
            last_touch_medium: metadata.analytics_last_touch_medium ?? '',
            last_touch_campaign: metadata.analytics_last_touch_campaign ?? '',
            last_touch_content: metadata.analytics_last_touch_content ?? '',
            referrer_host: metadata.analytics_referrer_host ?? '',
            landing_page: metadata.analytics_landing_page ?? '/',
          }
          const { error: conversionInsertError } = await ctx.supabaseAdmin.from('analytics_events').insert({
            event_name: 'contribution_completed',
            page: metadata.analytics_landing_page || '/',
            metadata: conversionMetadata,
          })
          if (conversionInsertError) {
            // Concurrent/retried delivery can hit the unique index. Treat it as
            // success only after confirming that this exact session is recorded.
            if (conversionInsertError.code !== '23505') return new Response('Analytics write failed', { status: 500 })
            const { data: duplicateConversion, error: duplicateReadError } = await ctx.supabaseAdmin
              .from('analytics_events')
              .select('id')
              .eq('event_name', 'contribution_completed')
              .contains('metadata', { checkout_session_id: session.id })
              .limit(1)
              .maybeSingle()
            if (duplicateReadError || !duplicateConversion) return new Response('Analytics write failed', { status: 500 })
          }
        }
      }
      if (event.type === 'charge.refunded') {
        const charge = event.data.object as Stripe.Charge
        const paymentIntent = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id ?? null
        if (paymentIntent) {
          const { error } = await ctx.supabaseAdmin.rpc('apply_stripe_refund', { p_payment_intent_id: paymentIntent, p_refunded_cents: charge.amount_refunded, p_event_id: event.id })
          if (error) return new Response('Database write failed', { status: 500 })
        }
      }
      return Response.json({ ok: true })
    } catch (error) {
      console.error('Stripe webhook processing failed:', error)
      return new Response('Webhook processing failed', { status: 500 })
    }
  }),
}
