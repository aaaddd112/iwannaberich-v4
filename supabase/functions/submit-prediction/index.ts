import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ipSalt = Deno.env.get('PREDICTION_RATE_LIMIT_SALT') || serviceRoleKey

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const MAX_LENGTH = 280
const MAX_PER_10_MINUTES = 3
const MAX_PER_DAY = 10
const MAX_DUPLICATES_WINDOW_HOURS = 24

const ALLOWED_ORIGINS = new Set([
  'https://iwannaberich.xyz',
  'https://www.iwannaberich.xyz',
])

const PROFANITY = [
  'asshole', 'bastard', 'bitch', 'bullshit', 'cock', 'cunt', 'dick',
  'fuck', 'fucking', 'motherfucker', 'piss', 'pussy', 'shit', 'slut', 'whore',
  'cacat', 'căcat', 'coaie', 'curva', 'curvă', 'fut', 'futut', 'muie',
  'pula', 'pulă', 'pizda', 'pizdă',
]

const LEET_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's',
}

function normalize(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(/[013457@$]/g, (char) => LEET_MAP[char] ?? char)
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function compact(text: string) {
  return normalize(text).replace(/\s/g, '')
}

function containsProfanity(text: string) {
  const normalized = normalize(text)
  const compacted = compact(text)
  const words = new Set(normalized.split(' ').filter(Boolean))

  return PROFANITY.some((word) => {
    const cleanWord = normalize(word)
    return words.has(cleanWord) || new RegExp(`(^|[^a-z])${escapeRegExp(cleanWord)}([^a-z]|$)`).test(normalized) ||
      (cleanWord.length >= 4 && compacted.includes(cleanWord))
  })
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function getClientIp(req: Request) {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

function json(data: Record<string, unknown>, status = 200, origin = 'https://iwannaberich.xyz') {
  const responseOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'https://iwannaberich.xyz'
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      'access-control-allow-origin': responseOrigin,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'vary': 'Origin',
    },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return json({}, 204, req.headers.get('origin') || 'https://iwannaberich.xyz')
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, req.headers.get('origin') || 'https://iwannaberich.xyz')

  const origin = req.headers.get('origin') || 'https://iwannaberich.xyz'
  if (!ALLOWED_ORIGINS.has(origin)) {
    return json({ error: 'Origin not allowed.' }, 403, origin)
  }

  const reply = (data: Record<string, unknown>, status = 200) => json(data, status, origin)

  let payload: { comment?: unknown; website?: unknown }
  try {
    payload = await req.json()
  } catch {
    return reply({ error: 'Invalid request.' }, 400)
  }

  // Honeypot: real users never see or fill this field.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return reply({ error: 'Nope.' }, 400)
  }

  if (typeof payload.comment !== 'string') {
    return reply({ error: 'Write something first.' }, 400)
  }

  const comment = payload.comment.trim()
  if (!comment) return reply({ error: 'Write something first.' }, 400)
  if (comment.length > MAX_LENGTH) return reply({ error: `Keep it under ${MAX_LENGTH} characters.` }, 400)

  if (containsProfanity(comment)) {
    return reply({ error: 'Keep it civil. The internet is already chaotic enough.' }, 400)
  }

  const ip = getClientIp(req)
  const ipHash = await sha256(`${ipSalt}:${ip}`)
  const normalizedHash = await sha256(normalize(comment))

  const { data: allowed, error: rateError } = await supabase.rpc('consume_prediction_rate_limit', {
    p_ip_hash: ipHash,
    p_max_10m: MAX_PER_10_MINUTES,
    p_max_day: MAX_PER_DAY,
  })

  if (rateError) {
    console.error('Rate limit check failed:', rateError)
    return reply({ error: 'Could not verify posting limits. Try again shortly.' }, 503)
  }

  if (!allowed) {
    return reply({ error: 'Slow down. Even billionaires need rate limits.' }, 429)
  }

  const cutoff = new Date(Date.now() - MAX_DUPLICATES_WINDOW_HOURS * 60 * 60 * 1000).toISOString()
  const { data: duplicate, error: duplicateError } = await supabase
    .from('predictions_comments')
    .select('id')
    .eq('normalized_hash', normalizedHash)
    .gte('created_at', cutoff)
    .limit(1)
    .maybeSingle()

  if (duplicateError) {
    console.error('Duplicate check failed:', duplicateError)
    return reply({ error: 'Could not validate the prediction. Try again shortly.' }, 503)
  }

  if (duplicate) {
    return reply({ error: 'That prediction was already posted recently.' }, 409)
  }

  const { error: insertError } = await supabase
    .from('predictions_comments')
    .insert({ comment, normalized_hash: normalizedHash })

  if (insertError) {
    console.error('Prediction insert failed:', insertError)
    return reply({ error: 'Couldn’t post your prediction. Try again.' }, 500)
  }

  return reply({ ok: true })
})
