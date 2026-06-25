import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { hasUsableAdminSupabaseConfig } from '@/lib/supabase-config'

const transparentGif = Buffer.from('R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64')
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const eventConfig: Record<string, { column: string; label: string }> = {
  open: { column: 'voicedesk_email_open_count', label: 'Email VoiceDesk aperta' },
  demo: { column: 'voicedesk_demo_click_count', label: 'Demo VoiceDesk cliccata' },
  call: { column: 'voicedesk_call_click_count', label: 'Chiamata demo avviata' },
}

function safeTarget(rawTarget: string | null, event: string) {
  if (event === 'open') return ''
  const fallback = 'https://www.voicedesk.it/'
  if (!rawTarget) return fallback
  try {
    if (rawTarget.startsWith('tel:')) return rawTarget
    const url = new URL(rawTarget)
    const host = url.hostname.replace(/^www\./, '')
    if (url.protocol === 'https:' && host === 'voicedesk.it') return url.toString()
  } catch {}
  return fallback
}

function pixelResponse() {
  return new NextResponse(transparentGif, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const contactKey = (searchParams.get('contact') || '').trim()
  const event = (searchParams.get('event') || '').trim()
  const config = eventConfig[event]
  const target = safeTarget(searchParams.get('target'), event)

  if (!config || !contactKey) {
    return event === 'open' ? pixelResponse() : NextResponse.redirect('https://www.voicedesk.it/', { status: 302 })
  }

  if (hasUsableAdminSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      let query: any = admin.from('contacts').select('*').limit(1)
      query = uuidPattern.test(contactKey)
        ? query.eq('id', contactKey)
        : query.filter('metadata->>demo_local_id', 'eq', contactKey)

      const { data } = await query.maybeSingle()
      const row = data as any
      if (row?.id) {
        const current = Number(row[config.column] || 0)
        await admin.from('contacts').update({
          [config.column]: current + 1,
          voicedesk_last_action: config.label,
          voicedesk_last_action_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('id', row.id)
      }
    } catch {
      // Il tracciamento non deve mai bloccare l'esperienza del destinatario.
    }
  }

  if (event === 'open') return pixelResponse()
  return NextResponse.redirect(target, { status: 302 })
}
