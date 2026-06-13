import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase'

export const maxDuration = 60

async function transcribeAudio(buffer: Buffer, mimeType: string): Promise<string> {
  const formData = new FormData()
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  formData.append('file', new Blob([arrayBuffer], { type: mimeType }), 'audio.webm')
  formData.append('model', 'whisper-1')
  formData.append('language', 'it')
  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: formData,
  })
  const data = await res.json()
  return data.text
}

async function analyzeWithClaude(text: string, contactHint?: string) {
  const systemPrompt = `Analizza conversazioni CRM ed estrai dati strutturati. Restituisci SOLO JSON valido con questa struttura:
{
  "contact": {"first_name":"","last_name":"","company":"","role":"","email":"","phone":"","city":""},
  "professional_profile": {"sector":"","type":"","skills":[],"company_size":""},
  "needs": [{"type":"explicit|implicit","description":"","urgency":"low|medium|high"}],
  "interests": {"autodeterminazione":0,"tokenizzazione":0,"ai_automazioni":0,"web":0,"energia":0,"net_free":0,"educazione_finanziaria":0,"partnership":0},
  "opportunities": [{"service":"","probability":0.0,"reasoning":"","materials_to_send":[],"webinar_to_propose":""}],
  "commitments": {"mine":[],"theirs":[]},
  "objections": [{"text":"","type":""}],
  "sentiment": {"overall":"","temperature":"freddo|tiepido|caldo|bollente","suggested_status":"Lead|Prospect|Interessato|Cliente|Partner"},
  "suggested_tasks": [{"title":"","type":"call|email|send_material|propose_webinar|follow_up","due_days":0,"priority":"low|medium|high"}],
  "summary":""
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Contatto: ${contactHint ?? 'sconosciuto'}\n\nConversazione:\n${text}` }],
    }),
  })
  const data = await res.json()
  const raw = data.content[0].text.replace(/```json\n?|```/g, '').trim()
  return JSON.parse(raw)
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const formData = await req.formData()
  const contactId = formData.get('contact_id') as string
  const channel = (formData.get('channel') as string) ?? 'manual'
  const file = formData.get('file') as File | null
  const text = formData.get('text') as string | null

  if (!contactId) return NextResponse.json({ error: 'contact_id required' }, { status: 400 })

  let rawContent = text ?? ''
  let transcription: string | undefined

  if (file?.type.startsWith('audio/')) {
    const buf = Buffer.from(await file.arrayBuffer())
    transcription = await transcribeAudio(buf, file.type)
    rawContent = transcription
  } else if (file) {
    rawContent = await file.text()
  }

  if (!rawContent) return NextResponse.json({ error: 'No content' }, { status: 400 })

  const { data: contact } = await admin.from('contacts').select('first_name, last_name, company_id').eq('id', contactId).single()
  const hint = contact ? `${contact.first_name} ${contact.last_name}` : undefined

  const knowledge = await analyzeWithClaude(rawContent, hint)

  // Save conversation
  const { data: conv } = await admin.from('conversations').insert({
    contact_id: contactId, user_id: user.id, channel,
    raw_content: rawContent, transcription, occurred_at: new Date().toISOString(),
  }).select('id').single()

  if (conv) {
    // Save AI summary
    await admin.from('ai_summaries').insert({
      conversation_id: conv.id, contact_id: contactId,
      summary: knowledge.summary, extracted_data: knowledge,
      opportunities: knowledge.opportunities, suggested_actions: knowledge.suggested_tasks,
      confidence: 0.85,
    })

    // Update contact
    await admin.from('contacts').update({
      last_contact_at: new Date().toISOString(),
      ...(knowledge.sentiment.suggested_status && { status: knowledge.sentiment.suggested_status }),
    }).eq('id', contactId)

    // Create tasks
    for (const task of knowledge.suggested_tasks ?? []) {
      const due = new Date()
      due.setDate(due.getDate() + task.due_days)
      await admin.from('tasks').insert({
        contact_id: contactId, user_id: user.id,
        title: task.title, type: task.type, status: 'pending',
        priority: task.priority, ai_generated: true,
        due_date: due.toISOString().split('T')[0],
      })
    }
  }

  return NextResponse.json({
    success: true,
    conversation_id: conv?.id,
    tasks_created: knowledge.suggested_tasks?.length ?? 0,
    summary: knowledge.summary,
    opportunities_found: knowledge.opportunities?.length ?? 0,
    suggested_tasks: knowledge.suggested_tasks,
    interests_updated: Object.entries(knowledge.interests ?? {})
      .filter(([, v]) => (v as number) > 0)
      .map(([k, v]) => ({ area: k, level: v })),
    sentiment: knowledge.sentiment,
  })
}
