import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'
import { dbContactToDemo, demoContactToDb } from '@/lib/demo-crm-mapping'

export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const status = searchParams.get('status')
  const format = searchParams.get('format')
  const admin = createAdminClient()

  let query = admin.from('contacts').select('*, companies(name)').eq('user_id', user.id)
  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`)
  if (status) query = query.eq('status', status)
  const { data } = await query.order('last_contact_at', { ascending: false }).limit(250)
  if (format === 'demo') return NextResponse.json({ contacts: (data ?? []).map(dbContactToDemo), persistence: 'cloud' })
  return NextResponse.json({ contacts: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const admin = createAdminClient()
  const payload = body?.name || body?.company || body?.topics ? demoContactToDb(body) : body
  const { data, error } = await admin.from('contacts').insert({ ...payload, user_id: user.id }).select('*, companies(name)').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ contact: body?.name || body?.company || body?.topics ? dbContactToDemo(data) : data }, { status: 201 })
}
