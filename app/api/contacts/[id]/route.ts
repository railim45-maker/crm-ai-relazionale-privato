import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'

type RouteContext = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('contacts')
    .select('*, companies(*), opportunities(*, services(*)), tasks(*), conversations(*, ai_summaries(*)), notes(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ contact: data })
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = [
    'first_name', 'last_name', 'role', 'email', 'phone', 'whatsapp', 'telegram', 'linkedin',
    'status', 'trust_level', 'interest_level', 'potential_value', 'last_contact_at', 'notes', 'tags'
  ]
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key]
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('contacts')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select('*, companies(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ contact: data })
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('contacts')
    .update({ status: 'Archiviato', archived_at: new Date().toISOString() })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select('id, status, archived_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ contact: data })
}
