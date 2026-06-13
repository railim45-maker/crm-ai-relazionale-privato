import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

export async function POST(req: NextRequest) {
  const secret = process.env.WEBHOOK_INGEST_SECRET
  const provided = req.headers.get('x-crm-webhook-secret') ?? ''
  if (secret && !safeEqual(provided, secret)) {
    return NextResponse.json({ error: 'Webhook non autorizzato' }, { status: 401 })
  }

  const body = await req.json()
  if (!body.user_id || !body.event_type) {
    return NextResponse.json({ error: 'user_id ed event_type sono obbligatori' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('automation_events')
    .insert({
      user_id: body.user_id,
      event_type: body.event_type,
      source: body.source ?? 'n8n',
      contact_id: body.contact_id ?? null,
      conversation_id: body.conversation_id ?? null,
      payload: body.payload ?? body,
      processed: false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ event: data }, { status: 201 })
}
