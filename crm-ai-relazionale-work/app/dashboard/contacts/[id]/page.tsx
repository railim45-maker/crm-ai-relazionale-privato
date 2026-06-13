import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { statusColor, initials, timeAgo, formatDate, interestBar, currencyFormat } from '@/lib/utils'
import { Phone, Mail, MessageSquare, ExternalLink, Clock, Star, TrendingUp, CheckSquare, Calendar, Brain } from 'lucide-react'
import Link from 'next/link'

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
    .eq('status', 'pending')
    .order('due_date')
    .limit(5)

  const { data: scoreData } = await supabase
    .rpc('calculate_relationship_score', { p_contact_id: params.id })
    .single()
  const score = scoreData as { score: number } | null

  const topicAreas = (contact.contact_topics as any[])
    ?.filter(ct => ct.interest_level > 0)
    .sort((a, b) => b.interest_level - a.interest_level) ?? []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-xl font-bold text-brand-700 flex-shrink-0">
            {initials(contact.first_name, contact.last_name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{contact.first_name} {contact.last_name}</h1>
              <span className={`badge ${statusColor(contact.status)}`}>{contact.status}</span>
              {score && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">{score.score}/100</span>
                  <span className="text-xs text-gray-400">relationship score</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 mt-1">{contact.role} {(contact.companies as any)?.name ? `· ${(contact.companies as any).name}` : ''}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600"><Mail className="w-3.5 h-3.5" />{contact.email}</a>}
              {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600"><Phone className="w-3.5 h-3.5" />{contact.phone}</a>}
              {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" className="flex items-center gap-1.5 text-sm text-green-600 hover:underline"><MessageSquare className="w-3.5 h-3.5" />WhatsApp</a>}
              {contact.linkedin && <a href={contact.linkedin} target="_blank" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" />LinkedIn</a>}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Primo contatto</div>
            <div className="text-sm font-medium">{contact.first_contact_at ? formatDate(contact.first_contact_at) : '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Ultimo contatto</div>
            <div className="text-sm font-medium">{contact.last_contact_at ? timeAgo(contact.last_contact_at) : '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Fiducia</div>
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} className={`w-2 h-2 rounded-full ${n <= (contact.trust_level ?? 0) ? 'bg-brand-500' : 'bg-gray-100'}`} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Valore potenziale</div>
            <div className="text-sm font-medium">{contact.potential_value ? currencyFormat(contact.potential_value) : '—'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: timeline + interessi */}
        <div className="lg:col-span-2 space-y-5">

          {/* Interessi topic */}
          {topicAreas.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Interessi per area</h2>
              <div className="space-y-3">
                {topicAreas.map((ct: any) => (
                  <div key={ct.topic_id} className="flex items-center gap-3">
                    <div className="w-28 text-xs text-gray-600 truncate">{ct.topics?.area}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${interestBar(ct.interest_level)}`}
                        style={{ width: `${ct.interest_level * 10}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{ct.interest_level}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline conversazioni */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Timeline conversazioni</h2>
              <Link href="/dashboard/conversations/upload" className="ml-auto text-xs text-brand-600 hover:underline">+ Aggiungi</Link>
            </div>
            <div className="space-y-4">
              {conversations?.map(conv => {
                const summary = (conv.ai_summaries as any[])?.[0]
                return (
                  <div key={conv.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-brand-300 mt-1.5 flex-shrink-0" />
                      <div className="w-px flex-1 bg-gray-100 mt-1" />
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 capitalize">{conv.channel}</span>
                        <span className="text-xs text-gray-400">{formatDate(conv.occurred_at, 'dd MMM yyyy HH:mm')}</span>
                        {summary && <span className="badge bg-brand-50 text-brand-600 text-xs ml-auto">AI analizzato</span>}
                      </div>
                      {summary ? (
                        <p className="text-sm text-gray-700">{summary.summary}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Nessuna analisi AI disponibile</p>
                      )}
                    </div>
                  </div>
                )
              })}
              {(!conversations || conversations.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">Nessuna conversazione registrata</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: opportunità + task */}
        <div className="space-y-5">
          {/* Opportunità */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-gray-900">Opportunità</h2>
            </div>
            <div className="space-y-3">
              {opportunities?.map(opp => (
                <div key={opp.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">{(opp.services as any)?.name}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs badge bg-indigo-50 text-indigo-700">{opp.stage}</span>
                    <span className="text-xs text-gray-500">{Math.round(opp.close_probability * 100)}%</span>
                  </div>
                  {opp.estimated_value && (
                    <div className="text-xs text-gray-500 mt-1">{currencyFormat(opp.estimated_value)}</div>
                  )}
                </div>
              ))}
              {(!opportunities || opportunities.length === 0) && (
                <p className="text-xs text-gray-400 text-center py-2">Nessuna opportunità</p>
              )}
            </div>
          </div>

          {/* Task */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="w-4 h-4 text-orange-500" />
              <h2 className="font-semibold text-gray-900">Task pendenti</h2>
            </div>
            <div className="space-y-2">
              {tasks?.map(task => (
                <div key={task.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                  <div>
                    <div className="text-sm text-gray-900">{task.title}</div>
                    <div className="text-xs text-gray-400">{task.due_date ?? 'Nessuna scadenza'}</div>
                  </div>
                  {task.ai_generated && <span className="ml-auto mt-0.5" title="Generato da AI"><Brain className="w-3 h-3 text-brand-400 flex-shrink-0" /></span>}
                </div>
              ))}
              {(!tasks || tasks.length === 0) && (
                <p className="text-xs text-gray-400 text-center py-2">Nessun task pendente</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
