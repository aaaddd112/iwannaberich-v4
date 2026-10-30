const RESEND_API_URL = 'https://api.resend.com/emails'
const TELEGRAM_API_URL = 'https://api.telegram.org'

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}

function getNotificationConfig() {
  return {
    apiKey: (Deno.env.get('RESEND_API_KEY') ?? '').trim(),
    to: (Deno.env.get('OWNER_NOTIFICATION_EMAIL') ?? '').trim(),
    from: (Deno.env.get('RESEND_FROM_EMAIL') ?? '').trim(),
  }
}

export async function sendOwnerNotification(subject: string, text: string, html: string): Promise<boolean> {
  const { apiKey, to, from } = getNotificationConfig()
  if (!apiKey || !to || !from) {
    console.warn('Owner notifications are not configured. Set RESEND_API_KEY, OWNER_NOTIFICATION_EMAIL and RESEND_FROM_EMAIL.')
    return false
  }
  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
    })
    if (!response.ok) {
      console.error('Owner notification failed:', response.status, await response.text())
      return false
    }
    return true
  } catch (error) {
    console.error('Owner notification request failed:', error)
    return false
  }
}

// Telegram is deliberately best-effort: it must never block a prediction or payment.
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const token = (Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '').trim()
  const chatId = (Deno.env.get('TELEGRAM_CHAT_ID') ?? '').trim()
  if (!token || !chatId) {
    console.warn('Telegram notifications are not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.')
    return false
  }
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message.slice(0, 4096), disable_web_page_preview: true }),
    })
    if (!response.ok) {
      console.error('Telegram notification failed:', response.status, await response.text())
      return false
    }
    const result = await response.json()
    if (!result.ok) {
      console.error('Telegram API rejected notification:', result.description ?? 'unknown error')
      return false
    }
    return true
  } catch (error) {
    console.error('Telegram notification request failed:', error)
    return false
  }
}

export function htmlText(value: string): string {
  return escapeHtml(value).replaceAll('\n', '<br>')
}
