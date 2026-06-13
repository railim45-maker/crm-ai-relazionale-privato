import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'

export async function GET() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin.rpc('get_today_priorities', { p_user_id: user.id })
  return NextResponse.json({ priorities: data ?? [] })
}
