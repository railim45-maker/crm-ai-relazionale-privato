import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase'
import { ruleBasedAgentAnswer, type ConsultingContact } from '@/lib/consulting-intelligence'

function normalizeContacts(rows: any[] | null | undefined): ConsultingContact[] {
  return (rows || []).map((row: any) => ({
    first_name: row.first_name,
    last_name: row.last_name,
    name: [row.first_name, row.last_name].filter(Boolean).join(' ').trim(),
    company: row.company || row.companies?.name,
    role: row.role,
    email: row.email,
    phone: row.phone,
    city: row.city,
    notes: row.notes,
    tags: row.tags,
    trust_level: row.trust_level,
    interest_level: row.interest_level,
    potential_value: row.potential_value,
    annual_energy_cost: row.annual_energy_cost,
    expected_energy_saving_pct: row.expected_energy_saving_pct,
    annual_service_cost: row.annual_service_cost,
    paid_share_capital: row.paid_share_capital,
    real_estate_value: row.real_estate_value,
    inventory_value: row.inventory_value,
    equipment_value: row.equipment_value,
    receivables_value: row.receivables_value,
    cash_value: row.cash_value,
    brand_value: row.brand_value,
    annual_ebitda: row.annual_ebitda,
    preferred_energy_path: row.preferred_energy_path,
    research_summary: row.research_summary,
    public_sources: row.public_sources,
    probable_needs: row.probable_needs,
    recommended_questions: row.recommended_questions,
    recommended_path: row.recommended_path,
    personalization_hook: row.personalization_hook,
    outreach_stage: row.outreach_stage,
    confidence_score: row.confidence_score,
  }))
}

async function askAnthropic(query: string, history: any[], context: string) {
  if (!process.env.ANTHROPIC_API_KEY) return null
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: `Sei l'Agente AI del CRM. Rispondi in italiano, in modo diretto, prudente e operativo. Non promettere rendimenti, risparmi o risultati. Usa i dati reali forniti e, quando parli di uBroker, PEF Power o Blotix, chiedi sempre verifica puntuale delle condizioni aggiornate.\n\nCONTESTO CRM:\n${context}`,
      messages: [...history.map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') })), { role: 'user', content: query }],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.content?.[0]?.text || null
}

async function askLocalOpenAICompatible(query: string, history: any[], context: string) {
  const baseUrl = process.env.LOCAL_AI_BASE_URL || process.env.OPENAI_COMPATIBLE_BASE_URL || ''
  const apiKey = process.env.LOCAL_AI_API_KEY || process.env.OPENAI_COMPATIBLE_API_KEY || 'local'
  const model = process.env.LOCAL_AI_MODEL || process.env.OPENAI_COMPATIBLE_MODEL || 'llama3.1'
  if (!baseUrl) return null
  const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: `Sei l'Agente AI del CRM. Usa un tono consulenziale, prudente e operativo. Contesto CRM:\n${context}` },
        ...history.map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') })),
        { role: 'user', content: query },
      ],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.choices?.[0]?.message?.content || null
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { query = '', history = [] } = await req.json()
  const admin = createAdminClient()

  const { data: todayTasks } = await admin.from('tasks')
    .select('title, contacts(first_name, last_name)')
    .eq('user_id', user.id).eq('status', 'pending')
    .lte('due_date', new Date().toISOString().split('T')[0])
    .limit(10)

  const { data: hotContacts } = await admin.from('contacts')
    .select('*, companies(name)')
    .eq('user_id', user.id)
    .order('interest_level', { ascending: false })
    .limit(25)

  const normalized = normalizeContacts(hotContacts)
  const context = `TASK SCADUTI: ${todayTasks?.map((t: any) => `${(t.contacts as any)?.first_name || ''} ${(t.contacts as any)?.last_name || ''} - ${t.title}`).join('; ') || 'Nessuno'}\nLEAD CALDI: ${normalized.map((c) => `${c.name || c.company} interesse ${c.interest_level || 0}/10, fiducia ${c.trust_level || 0}/10, stadio ${c.outreach_stage || 'n/d'}`).join('; ') || 'Nessuno'}`

  const externalAnswer = await askAnthropic(query, history, context).catch(() => null) || await askLocalOpenAICompatible(query, history, context).catch(() => null)
  if (externalAnswer) return NextResponse.json({ answer: externalAnswer, provider: process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'openai-compatible' })

  return NextResponse.json({ answer: ruleBasedAgentAnswer(String(query || ''), normalized), provider: 'free-rule-based' })
}
