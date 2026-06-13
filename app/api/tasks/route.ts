import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'pending'
  const contactId = searchParams.get('contact_id')
  const admin = createAdminClient()

  let query = admin
    .from('tasks')
    .select('*, contacts(id, first_name, last_name, email, whatsapp)')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })
    .limit(100)

  if (status !== 'all') query = query.eq('status', status)
  if (contactId) query = query.eq('contact_id', contactId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ tasks: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.contact_id || !body.title) {
    return NextResponse.json({ error: 'contact_id e title sono obbligatori' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tasks')
    .insert({
      contact_id: body.contact_id,
      user_id: user.id,
      title: body.title,
      description: body.description ?? null,
      type: body.type ?? 'follow_up',
      status: body.status ?? 'pending',
      priority: body.priority ?? 'medium',
      ai_generated: Boolean(body.ai_generated ?? false),
      due_date: body.due_date ?? null,
      completed_at: body.status === 'completed' ? new Date().toISOString() : null,
    })
    .select('*, contacts(id, first_name, last_name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ task: data }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'id task obbligatorio' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  for (const key of ['title', 'description', 'type', 'status', 'priority', 'due_date']) {
    if (body[key] !== undefined) updates[key] = body[key]
  }
  if (body.status === 'completed') updates.completed_at = new Date().toISOString()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tasks')
    .update(updates)
    .eq('id', body.id)
    .eq('user_id', user.id)
    .select('*, contacts(id, first_name, last_name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ task: data })
}
