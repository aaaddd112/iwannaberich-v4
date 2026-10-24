import Stripe from 'npm:stripe@^22'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string)
const rateLimitSalt = Deno.env.get('PUBLIC_API_RATE_LIMIT_SALT') || Deno.env.get('STRIPE_API_KEY') || 'iwbr-checkout-rate-limit'
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = (await import('npm:@supabase/supabase-js@2')).createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const ALLOWED_ORIGINS = new Set([
  'https://iwannaberich.xyz',
  'https://www.iwannaberich.xyz',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
])
const MAX_BODY_BYTES = 4096

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://iwannaberich.xyz'
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

function json(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) })
}

function getClientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip')?.trim() || req.headers.get('x-real-ip')?.trim() || 'unknown'
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function normalizeNickname(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const nickname = value.trim().replace(/\s+/g, ' ')
  if (!nickname) return null
  if (nickname.length > 40) throw new Error('Nickname must be 40 characters or fewer.')
  return nickname
}

function getAnalyticsMetadata(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const input = value as Record<string, unknown>
  const allowed: Record<string, string> = {
    visitor_id: 'analytics_visitor_id',
    session_id: 'analytics_session_id',
    first_touch_source: 'analytics_first_touch_source',
    first_touch_medium: 'analytics_first_touch_medium',
    first_touch_campaign: 'analytics_first_touch_campaign',
    first_touch_content: 'analytics_first_touch_content',
    last_touch_source: 'analytics_last_touch_source',
    last_touch_medium: 'analytics_last_touch_medium',
    last_touch_campaign: 'analytics_last_touch_campaign',
    last_touch_content: 'analytics_last_touch_content',
    referrer_host: 'analytics_referrer_host',
    landing_page: 'analytics_landing_page',
  }
  const result: Record<string, string> = {}
  for (const [inputKey, stripeKey] of Object.entries(allowed)) {
    const item = input[inputKey]
    if (typeof item === 'string' && item.trim()) result[stripeKey] = item.trim().slice(0, 200)
  }
  return result
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')

  if (req.method === 'OPTIONS') {
    if (!origin || !ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403, headers: corsHeaders(origin) })
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin)
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return json({ error: 'Origin not allowed' }, 403, origin)

  try {
    const contentLength = Number(req.headers.get('content-length') || 0)
    if (contentLength > MAX_BODY_BYTES) return json({ error: 'Request is too large.' }, 413, origin)

    const rawBody = await req.text()
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return json({ error: 'Request is too large.' }, 413, origin)
    const body = JSON.parse(rawBody)

    const amount = Number(body?.amount)
    const nickname = normalizeNickname(body?.nickname)
    if (!Number.isFinite(amount)) return json({ error: 'Please enter a valid amount.' }, 400, origin)
    if (amount < 0.5 || amount > 10000) return json({ error: 'Amount must be between €0.50 and €10,000.' }, 400, origin)

    const amountCents = Math.round(amount * 100)
    if (amountCents < 50 || amountCents > 1_000_000) return json({ error: 'Amount is outside the allowed range.' }, 400, origin)

    const ipHash = await sha256(`checkout-v1:${rateLimitSalt}:${getClientIp(req)}`)
    const { data: allowed, error: rateLimitError } = await supabase.rpc('consume_api_rate_limit', {
      p_bucket: 'create-checkout',
      p_ip_hash: ipHash,
      p_max_10m: 5,
      p_max_day: 20,
    })
    if (rateLimitError) {
      console.error('Checkout rate-limit error:', rateLimitError)
      return json({ error: 'Checkout is temporarily unavailable.' }, 500, origin)
    }
    if (!allowed) return json({ error: 'Too many checkout attempts. Please try again later.' }, 429, origin)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Support the IWANNABERICH Experiment',
            description: 'Support a public experiment documenting an attempt to go from €0 to €1,000,000,000.',
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      }],
      payment_method_collection: 'if_required',
      success_url: 'https://iwannaberich.xyz/?payment=success',
      cancel_url: 'https://iwannaberich.xyz/?payment=cancelled',
      client_reference_id: nickname ?? undefined,
      metadata: { nickname: nickname ?? '', source: 'iwannaberich-web', ...getAnalyticsMetadata(body?.analytics) },
    })

    return json({ url: session.url }, 200, origin)
  } catch (error) {
    console.error('Checkout creation failed:', error)
    const message = error instanceof Error ? error.message : 'Could not create checkout.'
    return json({ error: message }, 500, origin)
  }
})
