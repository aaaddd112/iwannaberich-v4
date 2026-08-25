const RESEND_API_URL = 'https://api.resend.com/emails'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getNotificationConfig() {
  const apiKey = (Deno.env.get('RESEND_API_KEY') ?? '').trim()
  const to = (Deno.env.get('OWNER_NOTIFICATION_EMAIL') ?? '').trim()
  const from = (Deno.env.get('RESEND_FROM_EMAIL') ?? '').trim()

  return { apiKey, to, from }
}

export async function sendOwnerNotification(subject: string, text: string, html: string): Promise<boolean> {
  const { apiKey, to, from } = getNotificationConfig()

  // Notifications are intentionally best-effort: a failed email must never
  // make a valid prediction or Stripe payment fail.
  if (!apiKey || !to || !from) {
    console.warn('Owner notifications are not configured. Set RESEND_API_KEY, OWNER_NOTIFICATION_EMAIL and RESEND_FROM_EMAIL.')
    return false
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('Owner notification failed:', response.status, body)
      return false
    }

    return true
  } catch (error) {
    console.error('Owner notification request failed:', error)
    return false
  }
}

export function htmlText(value: string): string {
  return escapeHtml(value).replaceAll('\n', '<br>')
}
