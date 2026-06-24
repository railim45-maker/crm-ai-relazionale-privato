import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'
import { dbContactToDemo, demoContactToDb } from '@/lib/demo-crm-mapping'
import { hasUsableAdminSupabaseConfig } from '@/lib/supabase-config'

const MAX_SYNC_BATCH_SIZE = 250

function hasUuidShape(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(value)
}

function contactLabel(contact: any) {
  return String(contact?.name || contact?.company || contact?.email || contact?.id || 'contatto senza nome')
}

export async function POST(req: NextRequest) {
  if (!hasUsableAdminSupabaseConfig()) {
    return NextResponse.json({
      saved: [],
      persistence: 'local',
      code: 'supabase_config_missing',
      message: 'Database cloud non configurato: dati mantenuti localmente. Imposta URL, anon key e service role reali nel deploy.',
    }, { status: 503 })
  }

  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) return NextResponse.json({ error: authError.message, code: 'auth_error' }, { status: 401 })
    if (!user) return NextResponse.json({ error: 'Unauthorized', code: 'auth_required' }, { status: 401 })

    const body = await req.json().catch(() => null)
    const contacts = Array.isArray(body?.contacts) ? body.contacts : []
    if (!contacts.length) return NextResponse.json({ saved: [], count: 0, received: 0, persistence: 'cloud' })

    const batch = contacts.slice(0, MAX_SYNC_BATCH_SIZE)
    const admin = createAdminClient()
    const saved: any[] = []
    const errors: string[] = []

    for (const contact of batch) {
      const payload = demoContactToDb(contact)
      let existing: any = null

      if (hasUuidShape(contact?.dbId)) {
        const { data, error } = await admin
          .from('contacts')
          .select('id')
          .eq('user_id', user.id)
          .eq('id', contact.dbId)
          .maybeSingle()
        if (error) errors.push(`${contactLabel(contact)}: ricerca per dbId fallita: ${error.message}`)
        existing = data
      }

      if (!existing && contact?.id) {
        const { data, error } = await admin
          .from('contacts')
          .select('id')
          .eq('user_id', user.id)
          .filter('metadata->>demo_local_id', 'eq', String(contact.id))
          .maybeSingle()
        if (error) errors.push(`${contactLabel(contact)}: ricerca per ID locale fallita: ${error.message}`)
        existing = data
      }

      if (existing?.id) {
        const { data, error } = await admin
          .from('contacts')
          .update(payload)
          .eq('user_id', user.id)
          .eq('id', existing.id)
          .select('*')
          .single()
        if (error) errors.push(`${contactLabel(contact)}: ${error.message}`)
        else saved.push(dbContactToDemo(data))
      } else {
        const { data, error } = await admin
          .from('contacts')
          .insert({ ...payload, user_id: user.id })
          .select('*')
          .single()
        if (error) errors.push(`${contactLabel(contact)}: ${error.message}`)
        else saved.push(dbContactToDemo(data))
      }
    }

    const result = {
      saved,
      count: saved.length,
      received: contacts.length,
      processed: batch.length,
      truncated: contacts.length > batch.length,
      maxBatchSize: MAX_SYNC_BATCH_SIZE,
      persistence: 'cloud',
    }

    if (errors.length) return NextResponse.json({ ...result, errors, code: 'partial_sync_failed' }, { status: 207 })
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({
      saved: [],
      error: error?.message || 'Errore imprevisto durante la sincronizzazione cloud.',
      code: 'sync_unhandled_error',
    }, { status: 500 })
  }
}
