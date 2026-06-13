import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { query, history = [] } = await req.json()
  const admin = createAdminClient()

  // Retrieve context: overdue tasks + recent summaries
  const { data: todayTasks } = await admin.from('tasks')
    .select('title, contacts(first_name, last_name)')
    .eq('user_id', user.id).eq('status', 'pending')
    .lte('due_date', new Date().toISOString().split('T')[0])
    .limit(10)

  const { data: hotContacts } = await admin.from('contacts')
    .select('first_name, last_name, interest_level, last_contact_at, status')
    .eq('user_id', user.id).gte('interest_level', 7)
    .order('last_contact_at', { ascending: false }).limit(10)

  const { data: openOpps } = await admin.from('opportunities')
    .select('stage, close_probability, services(name), contacts(first_name, last_name, user_id)')
    .eq('contacts.user_id', user.id)
    .in('stage', ['Proposta','Trattativa','Interesse']).limit(10)

  const context = `
TASK SCADUTI: ${todayTasks?.map((t: any) => `${(t.contacts as any)?.first_name} - ${t.title}`).join('; ') || 'Nessuno'}
LEAD CALDI (interesse ≥7): ${hotContacts?.map((c: any) => `${c.first_name} ${c.last_name} (${c.interest_level}/10, ${c.status})`).join('; ') || 'Nessuno'}
OPPORTUNITÀ APERTE: ${openOpps?.map((o: any) => `${(o.contacts as any)?.first_name} - ${(o.services as any)?.name} (${o.stage}, ${Math.round(o.close_probability*100)}%)`).join('; ') || 'Nessuna'}
`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `Sei l'Agente AI del CRM. Rispondi in italiano, in modo diretto e operativo. Usa i dati reali forniti nel contesto. Se non hai dati, dillo chiaramente.\n\nCONTESSTO CRM:\n${context}`,
      messages: [...history.map((m: any) => ({ role: m.role, content: m.content })), { role: 'user', content: query }],
    }),
  })
  const data = await res.json()
  return NextResponse.json({ answer: data.content[0].text })
}
