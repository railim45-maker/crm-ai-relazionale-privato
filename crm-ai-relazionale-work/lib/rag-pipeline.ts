// ============================================================
// CRM AI — RAG PIPELINE COMPLETA
// Trascrizione → Analisi → Embedding → Ricerca Semantica
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─────────────────────────────────────────────
// STEP 1: Trascrizione Audio (Whisper API)
// ─────────────────────────────────────────────

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  const formData = new FormData()
  const arrayBuffer = audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength) as ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: mimeType })
  formData.append('file', blob, 'audio.webm')
  formData.append('model', 'whisper-1')
  formData.append('language', 'it')
  formData.append('response_format', 'verbose_json')
  formData.append('timestamp_granularities[]', 'segment')

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: formData,
  })

  const data = await response.json()
  return data.text
}

// ─────────────────────────────────────────────
// STEP 2: Analisi con Claude (Knowledge Extraction)
// ─────────────────────────────────────────────

export async function analyzeConversation(
  rawText: string,
  contactHint?: string
): Promise<ExtractedKnowledge> {
  const { AGENTS } = await import('./agents-prompts')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: AGENTS.KNOWLEDGE_EXTRACTION.system,
      messages: [{
        role: 'user',
        content: `Analizza questa conversazione${contactHint ? ` (contatto probabile: ${contactHint})` : ''}:\n\n---\n${rawText}\n---\n\nRestituisci SOLO JSON valido.`
      }]
    })
  })

  const data = await response.json()
  const text = data.content[0].text

  try {
    return JSON.parse(text.replace(/```json\n?|```/g, '').trim())
  } catch {
    // Fallback: cerca il JSON nel testo
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('JSON parsing failed: ' + text.substring(0, 200))
  }
}

// ─────────────────────────────────────────────
// STEP 3: Generazione Embedding (pgvector)
// ─────────────────────────────────────────────

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000) // max token limit
    })
  })

  const data = await response.json()
  return data.data[0].embedding
}

// ─────────────────────────────────────────────
// STEP 4: Salvataggio nel Database
// ─────────────────────────────────────────────

export async function saveConversationWithKnowledge(
  contactId: string,
  userId: string,
  params: {
    channel: string
    rawContent: string
    transcription?: string
    occurredAt: Date
    knowledge: ExtractedKnowledge
  }
): Promise<{ conversationId: string; tasksCreated: number }> {

  const { channel, rawContent, transcription, occurredAt, knowledge } = params

  // 1. Genera embedding del testo per ricerca semantica
  const textForEmbedding = [
    knowledge.summary,
    knowledge.needs.map(n => n.description).join('. '),
    knowledge.opportunities.map(o => o.service + ': ' + o.reasoning).join('. ')
  ].join(' ')

  const embedding = await generateEmbedding(textForEmbedding)

  // 2. Salva conversazione
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .insert({
      contact_id: contactId,
      user_id: userId,
      channel,
      raw_content: rawContent,
      transcription: transcription ?? rawContent,
      occurred_at: occurredAt.toISOString(),
    })
    .select('id')
    .single()

  if (convErr || !conv) throw new Error('Conversation insert failed: ' + convErr?.message)

  // 3. Salva AI summary con embedding
  await supabase.from('ai_summaries').insert({
    conversation_id: conv.id,
    contact_id: contactId,
    summary: knowledge.summary,
    extracted_data: knowledge,
    opportunities: knowledge.opportunities,
    suggested_actions: knowledge.suggested_tasks,
    embedding: JSON.stringify(embedding),
    confidence: 0.85
  })

  // 4. Aggiorna profilo contatto
  const updates: Record<string, unknown> = { last_contact_at: occurredAt.toISOString() }
  if (knowledge.sentiment.suggested_status) {
    updates.status = knowledge.sentiment.suggested_status
  }
  if (knowledge.contact.city) updates.city = knowledge.contact.city
  if (knowledge.contact.company) {
    // Crea/aggiorna company e collega
    const { data: company } = await supabase
      .from('companies')
      .upsert({ name: knowledge.contact.company }, { onConflict: 'name' })
      .select('id').single()
    if (company) updates.company_id = company.id
  }

  await supabase.from('contacts').update(updates).eq('id', contactId)

  // 5. Aggiorna interessi topic
  const topicAreaMap: Record<string, string> = {
    autodeterminazione: 'autodeterminazione',
    tokenizzazione: 'tokenizzazione',
    ai_automazioni: 'AI e Automazioni',
    web: 'Web',
    energia: 'Energia',
    net_free: 'Net Free',
    educazione_finanziaria: 'Educazione Finanziaria',
    partnership: 'Partnership'
  }

  for (const [key, areaName] of Object.entries(topicAreaMap)) {
    const interestValue = knowledge.interests[key as keyof typeof knowledge.interests]
    if (interestValue > 0) {
      const { data: topics } = await supabase
        .from('topics')
        .select('id')
        .eq('area', areaName)

      for (const topic of topics ?? []) {
        await supabase.from('contact_topics').upsert({
          contact_id: contactId,
          topic_id: topic.id,
          interest_level: interestValue,
          last_interest_at: occurredAt.toISOString()
        }, { onConflict: 'contact_id,topic_id', ignoreDuplicates: false })
      }
    }
  }

  // 6. Crea opportunità se non esistono
  for (const opp of knowledge.opportunities) {
    if (opp.probability > 0.3) {
      const { data: service } = await supabase
        .from('services')
        .select('id')
        .ilike('name', `%${opp.service}%`)
        .limit(1).single()

      if (service) {
        await supabase.from('opportunities').upsert({
          contact_id: contactId,
          service_id: service.id,
          stage: 'Interesse',
          close_probability: opp.probability,
          notes: opp.reasoning
        }, { onConflict: 'contact_id,service_id' })
      }
    }
  }

  // 7. Crea task automatici
  let tasksCreated = 0
  for (const task of knowledge.suggested_tasks) {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + task.due_days)

    await supabase.from('tasks').insert({
      contact_id: contactId,
      user_id: userId,
      title: task.title,
      type: task.type,
      status: 'pending',
      ai_generated: true,
      priority: task.priority,
      due_date: dueDate.toISOString().split('T')[0]
    })
    tasksCreated++
  }

  // 8. Salva obiezioni e bisogni come notes
  if (knowledge.objections.length > 0) {
    const objectionsText = knowledge.objections
      .map(o => `[${o.type}] ${o.text}`).join('\n')
    await supabase.from('notes').insert({
      contact_id: contactId,
      conversation_id: conv.id,
      type: 'objections',
      content: objectionsText
    })
  }

  return { conversationId: conv.id, tasksCreated }
}

// ─────────────────────────────────────────────
// STEP 5: Ricerca Semantica nelle Conversazioni
// ─────────────────────────────────────────────

export async function semanticSearch(
  query: string,
  userId: string,
  options: { limit?: number; minSimilarity?: number; contactId?: string } = {}
): Promise<SemanticSearchResult[]> {
  const { limit = 10, minSimilarity = 0.7, contactId } = options

  const queryEmbedding = await generateEmbedding(query)

  const { data, error } = await supabase.rpc('search_summaries_by_similarity', {
    query_embedding: JSON.stringify(queryEmbedding),
    user_id_filter: userId,
    contact_id_filter: contactId ?? null,
    similarity_threshold: minSimilarity,
    match_count: limit
  })

  if (error) throw new Error('Semantic search failed: ' + error.message)
  return data ?? []
}

// ─────────────────────────────────────────────
// STEP 6: Risposta RAG (per Agente Centrale)
// ─────────────────────────────────────────────

export async function ragAnswer(
  userQuery: string,
  userId: string,
  conversationHistory: Message[] = []
): Promise<string> {

  // Trova contesto rilevante
  const context = await semanticSearch(userQuery, userId, { limit: 5, minSimilarity: 0.65 })

  // Recupera anche dati strutturati rilevanti
  const { data: todayTasks } = await supabase
    .from('tasks')
    .select('*, contacts(first_name, last_name)')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .lte('due_date', new Date().toISOString().split('T')[0])
    .order('priority')
    .limit(10)

  const contextText = context
    .map(r => `[${r.contact_name} - ${r.occurred_at.substring(0, 10)}]: ${r.summary}`)
    .join('\n')

  const systemPrompt = `Sei l'Agente AI del CRM. Rispondi in italiano, in modo diretto e operativo.

CONTESTO CONVERSAZIONI RILEVANTI:
${contextText || 'Nessuna conversazione rilevante trovata.'}

TASK SCADUTI OGGI: ${todayTasks?.map(t => `${t.contacts?.first_name} ${t.contacts?.last_name}: ${t.title}`).join(', ') || 'Nessuno'}

Basa la risposta sui dati reali. Se non hai dati sufficienti, dillo chiaramente.`

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: userQuery }
  ]

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages
    })
  })

  const data = await response.json()
  return data.content[0].text
}

// ─────────────────────────────────────────────
// TIPI TypeScript
// ─────────────────────────────────────────────

export interface ExtractedKnowledge {
  contact: { first_name: string; last_name: string; company: string; role: string; email: string; phone: string; city: string }
  professional_profile: { sector: string; type: string; skills: string[]; company_size: string }
  needs: Array<{ type: 'explicit' | 'implicit'; description: string; urgency: 'low' | 'medium' | 'high' }>
  interests: Record<string, number>
  opportunities: Array<{ service: string; probability: number; reasoning: string; materials_to_send: string[]; webinar_to_propose: string }>
  commitments: { mine: string[]; theirs: string[] }
  objections: Array<{ text: string; type: string }>
  sentiment: { overall: string; temperature: string; suggested_status: string }
  suggested_tasks: Array<{ title: string; type: string; due_days: number; priority: 'low' | 'medium' | 'high' }>
  summary: string
}

export interface SemanticSearchResult {
  contact_id: string
  contact_name: string
  conversation_id: string
  occurred_at: string
  summary: string
  similarity: number
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
