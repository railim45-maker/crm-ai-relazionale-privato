/*
 * FILE GENERATO DA MANUS - PAGINA SCHEDA LEAD - console completa del singolo lead
 * DESTINAZIONE ESATTA: app/dashboard/contacts/[id]/page.tsx
 * FUNZIONE: Sostituisce la scheda del singolo lead: dati presenti, dati mancanti, agenda, task, comunicazioni e materiali consigliati.
 * NOTA: in Next.js il nome deve restare page.tsx; distingue la pagina il percorso della cartella.
 */

import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { statusColor, initials, timeAgo, formatDate, interestBar, currencyFormat } from '@/lib/utils'
import { Phone, Mail, MessageSquare, ExternalLink, Clock, Star, TrendingUp, CheckSquare, Calendar, Brain, AlertTriangle, CheckCircle2, FileText, HelpCircle, Send, Building2, MapPin } from 'lucide-react'
import Link from 'next/link'

const materialLibrary = [
  {
    area: 'Voice Desk e assistenza clienti',
    when: 'Reception sovraccarica, chiamate perse, bisogno di risposta rapida e tracciata.',
    material: 'Mini scheda: come ridurre chiamate perse, tempi morti e richieste ripetitive.',
    message: 'Ti mando una sintesi molto pratica su come alleggerire la gestione delle richieste senza cambiare tutto il tuo modo di lavorare.',
  },
  {
    area: 'CRM e follow-up commerciale',
    when: 'Lead dispersi, preventivi non richiamati, contatti senza storico o senza prossima azione.',
    material: 'Esempio operativo: scheda lead completa, agenda e pipeline commerciale.',
    message: 'Ti condivido un esempio semplice di organizzazione dei contatti, utile per non perdere follow-up e opportunità già aperte.',
  },
  {
    area: 'Automazioni e processi',
    when: 'Attività manuali ripetitive, documenti ricorrenti, notifiche e passaggi interni non presidiati.',
    material: 'Checklist automazioni: cosa delegare al sistema e cosa mantenere umano.',
    message: 'Ti preparo una checklist per capire quali passaggi si possono automatizzare senza perdere controllo sulla relazione.',
  },
  {
    area: 'Energia e servizi ricorrenti',
    when: 'Bollette alte, sedi operative, costi luce/gas o necessità di ottimizzazione utenze.',
    material: 'Scheda raccolta dati energia: consumi, contratti, margine di risparmio e verifica.',
    message: 'Se ha senso, partiamo dai dati oggettivi delle utenze e verifichiamo se esiste un margine reale di miglioramento.',
  },
  {
    area: 'Plafond, tokenizzazione e studio economico',
    when: 'Azienda con asset, capitale, immobili, magazzino, crediti o bisogno di liquidità progettuale.',
    material: 'Modulo studio su misura: base patrimoniale, costi annui, obiettivo e percorso valutativo.',
    message: 'Per evitare proposte generiche, ti condivido una traccia di raccolta dati: serve a capire se il percorso è adatto al tuo caso.',
  },
  {
    area: 'Marketing e acquisizione clienti',
    when: 'Bisogno di visibilità, funnel, contenuti, webinar, appuntamenti o campagne locali.',
    material: 'Mappa dei canali: contenuti, webinar, contatto diretto e follow-up.',
    message: 'Ti mando una mappa molto concreta per capire quali canali possono produrre contatti utili nel tuo caso.',
  },
]

function dataChecklist(contact: any) {
  return [
    { label: 'Nome e cognome', value: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(), required: true },
    { label: 'Email', value: contact.email, required: true },
    { label: 'Telefono o WhatsApp', value: contact.phone || contact.whatsapp, required: true },
    { label: 'Ruolo decisionale', value: contact.role, required: true },
    { label: 'Azienda', value: (contact.companies as any)?.name, required: false },
    { label: 'Città / area', value: contact.city, required: false },
    { label: 'LinkedIn o fonte pubblica', value: contact.linkedin || contact.website, required: false },
    { label: 'Valore potenziale', value: contact.potential_value ? currencyFormat(contact.potential_value) : '', required: false },
  ]
}

function recommendedMaterials(contact: any, topicAreas: any[], opportunities: any[]) {
  const text = `${contact.role || ''} ${contact.website || ''} ${contact.city || ''} ${(contact.companies as any)?.name || ''} ${topicAreas.map((ct) => ct.topics?.area || ct.topics?.name || '').join(' ')} ${opportunities.map((opp) => `${opp.services?.name || ''} ${opp.notes || ''}`).join(' ')}`.toLowerCase()
  const selected = materialLibrary.filter((item) => {
    const area = item.area.toLowerCase()
    return area.split(' ').some((word) => word.length > 4 && text.includes(word)) || text.includes(item.area.split(' ')[0].toLowerCase())
  })
  return selected.length ? selected.slice(0, 3) : materialLibrary.slice(0, 3)
}

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contact } = await supabase
    .from('contacts')
    .select(`*, companies(*), contact_topics(*, topics(*))`)
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!contact) notFound()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, ai_summaries(*)')
    .eq('contact_id', params.id)
    .order('occurred_at', { ascending: false })
    .limit(20)

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, services(*)')
    .eq('contact_id', params.id)
    .order('close_probability', { ascending: false })

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('contact_id', params.id)
    .order('due_date')
    .limit(12)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('contact_id', params.id)
    .gte('scheduled_at', new Date(Date.now() - 7 * 86400000).toISOString())
    .order('scheduled_at')
    .limit(8)

  const { data: scoreData } = await supabase
    .rpc('calculate_relationship_score', { p_contact_id: params.id })
    .single()
  const score = scoreData as { score: number } | null

  const topicAreas = (contact.contact_topics as any[])
    ?.filter(ct => ct.interest_level > 0)
    .sort((a, b) => b.interest_level - a.interest_level) ?? []
  const checklist = dataChecklist(contact)
  const missing = checklist.filter((item) => !item.value)
  const complete = checklist.length - missing.length
  const completeness = Math.round((complete / checklist.length) * 100)
  const materials = recommendedMaterials(contact, topicAreas, opportunities as any[] ?? [])
  const pendingTasks = (tasks as any[] | null)?.filter((task) => task.status !== 'completed') ?? []
  const nextAppointment = (appointments as any[] | null)?.find((appointment) => appointment.status === 'scheduled')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-xl font-bold text-brand-700 flex-shrink-0">
            {initials(contact.first_name, contact.last_name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{contact.first_name} {contact.last_name}</h1>
              <span className={`badge ${statusColor(contact.status)}`}>{contact.status}</span>
              {score && (
                <div className="flex items-center gap-1.5 lg:ml-auto">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">{score.score}/100</span>
                  <span className="text-xs text-gray-400">score relazione</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 mt-1">{contact.role || 'Ruolo da chiarire'} {(contact.companies as any)?.name ? `· ${(contact.companies as any).name}` : ''}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600"><Mail className="w-3.5 h-3.5" />{contact.email}</a>}
              {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600"><Phone className="w-3.5 h-3.5" />{contact.phone}</a>}
              {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" className="flex items-center gap-1.5 text-sm text-green-600 hover:underline"><MessageSquare className="w-3.5 h-3.5" />WhatsApp</a>}
              {contact.linkedin && <a href={contact.linkedin} target="_blank" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" />LinkedIn</a>}
              {contact.website && <a href={contact.website} target="_blank" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" />Sito</a>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-5 pt-5 border-t border-gray-100">
          <div><div className="text-xs text-gray-400 mb-0.5">Completezza</div><div className="text-sm font-semibold">{completeness}%</div></div>
          <div><div className="text-xs text-gray-400 mb-0.5">Ultimo contatto</div><div className="text-sm font-medium">{contact.last_contact_at ? timeAgo(contact.last_contact_at) : '—'}</div></div>
          <div><div className="text-xs text-gray-400 mb-0.5">Fiducia</div><div className="text-sm font-medium">{contact.trust_level ?? 0}/10</div></div>
          <div><div className="text-xs text-gray-400 mb-0.5">Interesse</div><div className="text-sm font-medium">{contact.interest_level ?? 0}/10</div></div>
          <div><div className="text-xs text-gray-400 mb-0.5">Valore potenziale</div><div className="text-sm font-medium">{contact.potential_value ? currencyFormat(contact.potential_value) : '—'}</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <h2 className="font-semibold text-gray-900">Console lead: cosa c’è e cosa manca</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklist.map((item) => (
                <div key={item.label} className={`rounded-2xl border p-3 ${item.value ? 'bg-green-50 border-green-100' : item.required ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    {item.value ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {item.label}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.value || (item.required ? 'Da chiedere prima della proposta' : 'Utile per personalizzare') }</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-cyan-500" />
              <h2 className="font-semibold text-gray-900">Domande da fare prima di comunicare la soluzione</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="rounded-2xl bg-gray-50 p-4">Qual è il problema più urgente: clienti, costi, tempo, liquidità, personale o organizzazione?</div>
              <div className="rounded-2xl bg-gray-50 p-4">Quali strumenti sta usando oggi e cosa non sta funzionando?</div>
              <div className="rounded-2xl bg-gray-50 p-4">Chi decide e quali dati servono per valutare seriamente?</div>
              <div className="rounded-2xl bg-gray-50 p-4">Quale materiale può chiarire senza sovraccaricare la persona?</div>
            </div>
          </div>

          {topicAreas.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Interessi per area</h2>
              <div className="space-y-3">
                {topicAreas.map((ct: any) => (
                  <div key={ct.topic_id} className="flex items-center gap-3">
                    <div className="w-32 text-xs text-gray-600 truncate">{ct.topics?.area}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${interestBar(ct.interest_level)}`} style={{ width: `${ct.interest_level * 10}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{ct.interest_level}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Timeline conversazioni</h2>
              <Link href="/dashboard/conversations/upload" className="ml-auto text-xs text-brand-600 hover:underline">+ Aggiungi</Link>
            </div>
            <div className="space-y-4">
              {conversations?.map((conv: any) => {
                const summary = (conv.ai_summaries as any[])?.[0]
                return (
                  <div key={conv.id} className="flex gap-3">
                    <div className="flex flex-col items-center"><div className="w-2 h-2 rounded-full bg-brand-300 mt-1.5 flex-shrink-0" /><div className="w-px flex-1 bg-gray-100 mt-1" /></div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium text-gray-500 capitalize">{conv.channel}</span><span className="text-xs text-gray-400">{formatDate(conv.occurred_at, 'dd MMM yyyy HH:mm')}</span>{summary && <span className="badge bg-brand-50 text-brand-600 text-xs ml-auto">AI analizzato</span>}</div>
                      {summary ? <p className="text-sm text-gray-700">{summary.summary}</p> : <p className="text-sm text-gray-400 italic">{conv.raw_content || 'Nessuna analisi AI disponibile'}</p>}
                    </div>
                  </div>
                )
              })}
              {(!conversations || conversations.length === 0) && <p className="text-sm text-gray-400 text-center py-4">Nessuna conversazione registrata</p>}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card p-5 bg-brand-50 border-brand-100">
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-4 h-4 text-brand-600" />
              <h2 className="font-semibold text-gray-900">Prossima comunicazione</h2>
            </div>
            <p className="text-sm text-gray-700">{nextAppointment ? `Appuntamento già in agenda il ${formatDate(nextAppointment.scheduled_at, 'dd MMM yyyy HH:mm')}.` : pendingTasks[0] ? `Prima azione: ${pendingTasks[0].title}.` : 'Definisci una domanda precisa, scegli un materiale utile e programma un follow-up.'}</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-500" />
              <h2 className="font-semibold text-gray-900">Agenda del lead</h2>
              <Link href="/dashboard/calendar" className="ml-auto text-xs text-brand-600 hover:underline">Apri agenda</Link>
            </div>
            <div className="space-y-2">
              {(appointments as any[] | null)?.map((apt) => (
                <div key={apt.id} className="rounded-xl bg-gray-50 p-3 text-sm"><div className="font-medium capitalize">{apt.type}</div><div className="text-xs text-gray-500">{formatDate(apt.scheduled_at, 'dd MMM yyyy HH:mm')} · {apt.status}</div>{apt.notes && <p className="text-xs text-gray-500 mt-1">{apt.notes}</p>}</div>
              ))}
              {(!appointments || appointments.length === 0) && <p className="text-xs text-gray-400 text-center py-3">Nessun appuntamento collegato</p>}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="w-4 h-4 text-orange-500" />
              <h2 className="font-semibold text-gray-900">Task e follow-up</h2>
            </div>
            <div className="space-y-2">
              {pendingTasks.map((task: any) => (
                <div key={task.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                  <div><div className="text-sm text-gray-900">{task.title}</div><div className="text-xs text-gray-400">{task.due_date ?? 'Nessuna scadenza'} · {task.status}</div></div>
                  {task.ai_generated && <span className="ml-auto mt-0.5" title="Generato da AI"><Brain className="w-3 h-3 text-brand-400 flex-shrink-0" /></span>}
                </div>
              ))}
              {pendingTasks.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Nessun task pendente</p>}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-purple-500" />
              <h2 className="font-semibold text-gray-900">Materiali utili da condividere</h2>
            </div>
            <div className="space-y-3">
              {materials.map((item) => (
                <div key={item.area} className="rounded-2xl border border-gray-100 p-3">
                  <div className="font-medium text-sm text-gray-900">{item.area}</div>
                  <p className="text-xs text-gray-500 mt-1"><strong>Quando:</strong> {item.when}</p>
                  <p className="text-xs text-gray-500 mt-1"><strong>Materiale:</strong> {item.material}</p>
                  <div className="mt-2 rounded-xl bg-gray-50 p-2 text-xs text-gray-600">{item.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-gray-900">Opportunità</h2>
            </div>
            <div className="space-y-3">
              {opportunities?.map((opp: any) => (
                <div key={opp.id} className="p-3 bg-gray-50 rounded-lg"><div className="font-medium text-sm">{(opp.services as any)?.name}</div><div className="flex items-center justify-between mt-1.5"><span className="text-xs badge bg-indigo-50 text-indigo-700">{opp.stage}</span><span className="text-xs text-gray-500">{Math.round(opp.close_probability * 100)}%</span></div>{opp.estimated_value && <div className="text-xs text-gray-500 mt-1">{currencyFormat(opp.estimated_value)}</div>}</div>
              ))}
              {(!opportunities || opportunities.length === 0) && <p className="text-xs text-gray-400 text-center py-2">Nessuna opportunità</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
