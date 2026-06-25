import { NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase'
import { hasUsableAdminSupabaseConfig, hasUsablePublicSupabaseConfig } from '@/lib/supabase-config'

export const runtime = 'nodejs'

export async function GET() {
  if (!hasUsablePublicSupabaseConfig() || !hasUsableAdminSupabaseConfig()) {
    return NextResponse.json({ connected: false, reason: 'Supabase non configurato' }, { status: 503 })
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ connected: false, reason: 'Utente non autenticato' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('channel_accounts')
    .select('id, display_name, external_account_id, status, config, updated_at')
    .eq('user_id', user.id)
    .eq('provider', 'meet')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ connected: false, reason: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ connected: false })

  return NextResponse.json({
    connected: true,
    accountId: data.id,
    email: data.external_account_id,
    displayName: data.display_name,
    calendarId: data.config?.calendar_id || 'primary',
    updatedAt: data.updated_at,
  })
}
