import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'
import { dbContactToDemo, demoContactToDb } from '@/lib/demo-crm-mapping'
import { hasUsableAdminSupabaseConfig } from '@/lib/supabase-config'

const DEFAULT_CONTACT_LIMIT = 250
const DEMO_CONTACT_LIMIT = 5000
const CONTACT_PAGE_SIZE = 1000

function clampLimit(value: string | null, fallback: number, max: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(Math.floor(parsed), max)
}

async function fetchContactsPaginated(admin: ReturnType<typeof createAdminClient>, userId: string, options: { q?: string | null; status?: string | null; limit: number }) {
  const rows: any[] = []
  for (let from = 0; from < options.limit; from += CONTACT_PAGE_SIZE) {
    const to = Math.min(from + CONTACT_PAGE_SIZE - 1, options.limit - 1)
    let query = admin.from('contacts').select('*').eq('user_id', userId)
    if (options.q) query = query.or(`first_name.ilike.%${options.q}%,last_name.ilike.%${options.q}%,email.ilike.%${options.q}%`)
    if (options.status) query = query.eq('status', options.status)
    const { data, error } = await query.order('last_contact_at', { ascending: false }).range(from, to)
    if (error) throw error
    rows.push(...(data ?? []))
    if (!data || data.length < CONTACT_PAGE_SIZE) break
  }
  return rows
}

export async function GET(req: NextRequest) {
  if (!hasUsableAdminSupabaseConfig()) {
    return NextResponse.json({ contacts: [], persistence: 'local', code: 'supabase_config_missing', message: 'Database cloud non configurato: usare backup locale o impostare Supabase.' }, { status: 503 })
  }

  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) return NextResponse.json({ error: authError.message, code: 'auth_error' }, { status: 401 })
    if (!user) return NextResponse.json({ error: 'Unauthorized', code: 'auth_required' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = searchParams.get('status')
    const format = searchParams.get('format')
    const requestedLimit = clampLimit(searchParams.get('limit'), format === 'demo' ? DEMO_CONTACT_LIMIT : DEFAULT_CONTACT_LIMIT, DEMO_CONTACT_LIMIT)
    const admin = createAdminClient()

    const data = await fetchContactsPaginated(admin, user.id, { q, status, limit: requestedLimit })
    if (format === 'demo') return NextResponse.json({ contacts: data.map(dbContactToDemo), persistence: 'cloud', count: data.length, limit: requestedLimit })
    return NextResponse.json({ contacts: data, count: data.length, limit: requestedLimit })
  } catch (error: any) {
    return NextResponse.json({ contacts: [], error: error?.message || 'Errore imprevisto durante la lettura dei contatti.', code: 'contacts_unhandled_error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!hasUsableAdminSupabaseConfig()) {
    return NextResponse.json({ error: 'Database cloud non configurato: salvataggio mantenuto in locale.', code: 'supabase_config_missing' }, { status: 503 })
  }

  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) return NextResponse.json({ error: authError.message, code: 'auth_error' }, { status: 401 })
    if (!user) return NextResponse.json({ error: 'Unauthorized', code: 'auth_required' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Payload JSON non valido.', code: 'invalid_json' }, { status: 400 })

    const admin = createAdminClient()
    const payload = body?.name || body?.company || body?.topics ? demoContactToDb(body) : body
    const { data, error } = await admin.from('contacts').insert({ ...payload, user_id: user.id }).select('*').single()
    if (error) return NextResponse.json({ error: error.message, code: 'contact_insert_failed' }, { status: 400 })
    return NextResponse.json({ contact: body?.name || body?.company || body?.topics ? dbContactToDemo(data) : data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Errore imprevisto durante il salvataggio del contatto.', code: 'contact_unhandled_error' }, { status: 500 })
  }
}
