import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'
import { dbContactToDemo, demoContactToDb } from '@/lib/demo-crm-mapping'

function hasUuidShape(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const contacts = Array.isArray(body?.contacts) ? body.contacts : []
  const admin = createAdminClient()
  const saved: any[] = []
  const errors: string[] = []

  for (const contact of contacts.slice(0, 250)) {
    const payload = demoContactToDb(contact)
    let existing: any = null

    if (hasUuidShape(contact?.dbId)) {
      const { data } = await admin
        .from('contacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('id', contact.dbId)
        .maybeSingle()
      existing = data
    }

    if (!existing && contact?.id) {
      const { data } = await admin
        .from('contacts')
        .select('id')
        .eq('user_id', user.id)
        .filter('metadata->>demo_local_id', 'eq', String(contact.id))
        .maybeSingle()
      existing = data
    }

    if (existing?.id) {
      const { data, error } = await admin
        .from('contacts')
        .update(payload)
        .eq('user_id', user.id)
        .eq('id', existing.id)
        .select('*, companies(name)')
        .single()
      if (error) errors.push(`${contact?.name || contact?.company || contact?.id}: ${error.message}`)
      else saved.push(dbContactToDemo(data))
    } else {
      const { data, error } = await admin
        .from('contacts')
        .insert({ ...payload, user_id: user.id })
        .select('*, companies(name)')
        .single()
      if (error) errors.push(`${contact?.name || contact?.company || contact?.id}: ${error.message}`)
      else saved.push(dbContactToDemo(data))
    }
  }

  if (errors.length) return NextResponse.json({ saved, errors }, { status: 207 })
  return NextResponse.json({ saved, count: saved.length, persistence: 'cloud' })
}
