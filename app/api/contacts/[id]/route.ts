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
    'website', 'address', 'city', 'province', 'country',
    'status', 'trust_level', 'interest_level', 'potential_value', 'last_contact_at', 'notes', 'tags',
    'research_entry_mode', 'commercial_name', 'company_legal_name', 'commercial_aliases',
    'public_sources', 'facebook_page_candidates', 'confirmed_facebook_page', 'person_company_links',
    'public_complaints', 'research_summary', 'probable_needs', 'recommended_questions',
    'recommended_path', 'confidence_score', 'personalization_hook', 'message_angle',
    'outreach_stage', 'source_batch', 'paid_share_capital', 'real_estate_value',
    'inventory_value', 'equipment_value', 'receivables_value', 'cash_value', 'brand_value',
    'annual_revenue', 'annual_ebitda', 'annual_energy_cost', 'expected_energy_saving_pct',
    'annual_service_cost', 'preferred_energy_path', 'study_notes', 'service_plafond_notes', 'metadata'
  ]
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
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
