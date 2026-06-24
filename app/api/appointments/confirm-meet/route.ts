import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase'
import { hasUsableAdminSupabaseConfig, hasUsablePublicSupabaseConfig } from '@/lib/supabase-config'

export const runtime = 'nodejs'

type GoogleAccount = {
  id: string
  external_account_id?: string | null
  display_name?: string | null
  config?: Record<string, any> | null
}

function isUuid(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeIso(value: unknown) {
  const raw = clean(value)
  if (!raw) return ''
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
}

async function refreshGoogleAccessToken(account: GoogleAccount) {
  const config = account.config || {}
  const expiresAt = config.expires_at ? new Date(String(config.expires_at)).getTime() : 0
  const stillValid = clean(config.access_token) && expiresAt > Date.now() + 90_000
  if (stillValid) return clean(config.access_token)

  const refreshToken = clean(config.refresh_token)
  const clientId = clean(process.env.GOOGLE_CLIENT_ID)
  const clientSecret = clean(process.env.GOOGLE_CLIENT_SECRET)
  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error('Collegamento Google incompleto: riconnetti Google Calendar dalla demo.')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const payload = await response.json().catch(() => ({} as any))
  if (!response.ok || !payload?.access_token) {
    throw new Error('Token Google non aggiornato: riconnetti Google Calendar.')
  }

  const nextConfig = {
    ...config,
    access_token: payload.access_token,
    expires_at: new Date(Date.now() + Number(payload.expires_in || 3600) * 1000).toISOString(),
    token_type: payload.token_type || config.token_type,
    refreshed_at: new Date().toISOString(),
  }
  const admin = createAdminClient()
  await admin.from('channel_accounts').update({ config: nextConfig, last_sync_at: new Date().toISOString() }).eq('id', account.id)
  return clean(payload.access_token)
}

function appointmentDescription(input: any, contactName: string) {
  const notes = clean(input.notes)
  const source = clean(input.source) || 'CRM AI Relazionale'
  const lines = [
    `Appuntamento generato automaticamente da ${source}.`,
    '',
    `Contatto: ${contactName}`,
  ]
  if (notes) lines.push('', `Note operative: ${notes}`)
  lines.push('', 'Comunicazione: invito Calendar inviato automaticamente da Google al partecipante, se è presente una email valida.')
  return lines.join('\n')
}

export async function POST(request: NextRequest) {
  if (!hasUsablePublicSupabaseConfig() || !hasUsableAdminSupabaseConfig()) {
    return NextResponse.json({ error: 'Supabase non configurato: collega il database cloud prima di automatizzare gli appuntamenti.' }, { status: 503 })
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Accesso richiesto: accedi al CRM prima di confermare appuntamenti automatici.' }, { status: 401 })

  const input = await request.json().catch(() => ({} as any))
  const contact = input.contact && typeof input.contact === 'object' ? input.contact : {}
  const contactName = clean(input.contactName) || clean(contact.name) || clean(contact.company) || 'Contatto CRM'
  const attendeeEmail = clean(input.attendeeEmail) || clean(contact.decisionMakerEmail) || clean(contact.generalEmail) || clean(contact.email)
  const contactLocalId = clean(input.contactId) || clean(contact.id)
  const contactDbId = clean(input.contactDbId) || clean(contact.dbId)
  const scheduledAt = normalizeIso(input.scheduledAt)
  const durationMinutes = Math.max(15, Math.min(240, Number(input.durationMinutes || 30)))
  const timeZone = clean(input.timeZone) || clean(process.env.GOOGLE_CALENDAR_TIME_ZONE) || 'Europe/Rome'
  if (!scheduledAt) return NextResponse.json({ error: 'Data e ora appuntamento non valide.' }, { status: 400 })

  const admin = createAdminClient()
  const { data: googleAccount, error: accountError } = await admin
    .from('channel_accounts')
    .select('id, external_account_id, display_name, config')
    .eq('user_id', user.id)
    .eq('provider', 'meet')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (accountError) return NextResponse.json({ error: accountError.message }, { status: 500 })
  if (!googleAccount) return NextResponse.json({ error: 'Google Calendar/Meet non collegato: usa “Collega Google Meet” una sola volta dalla demo.' }, { status: 428 })

  let dbContactId = isUuid(contactDbId) ? contactDbId : ''
  if (!dbContactId && contactLocalId) {
    const { data: matchedContact } = await admin
      .from('contacts')
      .select('id')
      .eq('user_id', user.id)
      .contains('metadata', { demo_local_id: contactLocalId })
      .limit(1)
      .maybeSingle()
    dbContactId = matchedContact?.id || ''
  }

  const accessToken = await refreshGoogleAccessToken(googleAccount as GoogleAccount)
  const start = new Date(scheduledAt)
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  const title = clean(input.title) || `Appuntamento ${contactName}`
  const calendarId = encodeURIComponent(clean(googleAccount.config?.calendar_id) || clean(process.env.GOOGLE_CALENDAR_ID) || 'primary')
  const conferenceRequestId = `crm-meet-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const eventBody: Record<string, any> = {
    summary: title,
    description: appointmentDescription(input, contactName),
    start: { dateTime: start.toISOString(), timeZone },
    end: { dateTime: end.toISOString(), timeZone },
    reminders: { useDefault: true },
    conferenceData: {
      createRequest: {
        requestId: conferenceRequestId,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  }
  if (attendeeEmail) eventBody.attendees = [{ email: attendeeEmail, displayName: contactName }]

  const googleResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(eventBody),
  })
  const googleEvent = await googleResponse.json().catch(() => ({} as any))
  if (!googleResponse.ok) {
    return NextResponse.json({ error: googleEvent?.error?.message || 'Creazione evento Google Calendar fallita.' }, { status: 502 })
  }

  const meetUrl = clean(googleEvent.hangoutLink) || clean(googleEvent.conferenceData?.entryPoints?.find((entry: any) => entry.entryPointType === 'video')?.uri)
  const insertPayload: Record<string, any> = {
    user_id: user.id,
    type: 'meet',
    title,
    scheduled_at: start.toISOString(),
    duration_minutes: durationMinutes,
    status: 'scheduled',
    meeting_url: meetUrl || clean(googleEvent.htmlLink),
    notes: clean(input.notes) || null,
    briefing: {
      provider: 'google_calendar_meet',
      google_event_id: googleEvent.id,
      google_calendar_id: decodeURIComponent(calendarId),
      google_html_link: googleEvent.htmlLink,
      meet_url: meetUrl,
      attendee_email: attendeeEmail,
      contact_local_id: contactLocalId,
      communication: attendeeEmail ? 'Invito Calendar inviato automaticamente da Google.' : 'Email contatto mancante: evento creato senza invitato.',
      created_from: 'demo_confirm_meet',
      created_at: new Date().toISOString(),
    },
  }
  if (dbContactId) insertPayload.contact_id = dbContactId

  const { data: appointment, error: appointmentError } = await admin
    .from('appointments')
    .insert(insertPayload)
    .select('id, contact_id, scheduled_at, meeting_url, title, briefing')
    .single()

  if (appointmentError) {
    return NextResponse.json({
      warning: 'Evento Google creato, ma salvataggio appuntamento Supabase non riuscito.',
      details: appointmentError.message,
      googleEvent,
      meetingUrl: meetUrl,
    }, { status: 207 })
  }

  if (dbContactId) {
    await admin.from('contacts').update({
      last_contact_at: new Date().toISOString(),
      metadata: {
        ...(contact.metadata || {}),
        demo_local_id: contactLocalId,
        nextAction: `Appuntamento Meet confermato per ${start.toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short', timeZone })}.`,
        last_meet_url: meetUrl,
        last_google_event_id: googleEvent.id,
        last_appointment_at: start.toISOString(),
      },
    }).eq('id', dbContactId).eq('user_id', user.id)
  }

  return NextResponse.json({
    ok: true,
    appointment,
    meetingUrl: meetUrl,
    googleEventId: googleEvent.id,
    googleHtmlLink: googleEvent.htmlLink,
    attendeeEmail,
    message: attendeeEmail
      ? 'Appuntamento creato: Google ha generato il link Meet e inviato l’invito al partecipante.'
      : 'Appuntamento creato con link Meet. Aggiungi una email al contatto per inviare automaticamente l’invito.',
  })
}
