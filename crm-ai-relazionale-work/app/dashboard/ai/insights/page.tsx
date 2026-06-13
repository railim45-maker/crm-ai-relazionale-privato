import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'
import { Lightbulb, TrendingUp, Flame, Clock, ArrowUpRight, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function InsightsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: priorities }, { data: contacts }, { data: opportunities }, { data: tasks }] = await Promise.all([
    supabase.rpc('get_today_priorities', { p_user_id: user!.id }),
    supabase.from('contacts').select('id, first_name, last_name, status, interest_level, trust_level, potential_value, last_contact_at').eq('user_id', user!.id).order('interest_level', { ascending: false }).limit(12),
    supabase.from('opportunities').select('id, contact_id, stage, estimated_value, close_probability, next_action, contacts(id, first_name, last_name)').in('stage', ['Interesse','Qualificazione','Presentazione','Webinar','Consulenza','Proposta','Trattativa']).order('close_probability', { ascending: false }).limit(12),
    supabase.from('tasks').select('id, contact_id, title, priority, due_date, contacts(id, first_name, last_name)').eq('user_id', user!.id).eq('status', 'pending').order('due_date', { ascending: true }).limit(10),
  ])

  const hotContacts = (contacts ?? []).filter((contact: any) => (contact.interest_level ?? 0) >= 7)
  const pipelineValue = (opportunities ?? []).reduce((sum: number, opportunity: any) => sum + Number(opportunity.estimated_value ?? 0), 0)
  const weightedValue = (opportunities ?? []).reduce((sum: number, opportunity: any) => sum + Number(opportunity.estimated_value ?? 0) * Number(opportunity.close_probability ?? 0), 0)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insight AI</h1>
          <p className="text-sm text-gray-500 mt-1">Priorità operative generate da dati CRM, conversazioni e pipeline.</p>
        </div>
        <Link href="/dashboard/ai/chat" className="btn-primary">
          <Bot className="w-4 h-4" /> Chiedi all'agente
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm"><Lightbulb className="w-4 h-4" /> Priorità</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{priorities?.length ?? 0}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm"><Flame className="w-4 h-4" /> Lead caldi</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">{hotContacts.length}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm"><TrendingUp className="w-4 h-4" /> Pipeline</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">€{pipelineValue.toLocaleString('it-IT')}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm"><Clock className="w-4 h-4" /> Valore pesato</div>
          <div className="text-3xl font-bold text-brand-600 mt-2">€{Math.round(weightedValue).toLocaleString('it-IT')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Suggerimenti del giorno</h2>
          <div className="space-y-3">
            {(priorities ?? []).slice(0, 8).map((priority: any) => (
              <Link key={`${priority.priority_type}-${priority.contact_id}-${priority.reason}`} href={`/dashboard/contacts/${priority.contact_id}`} className="block rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{priority.contact_name}</div>
                    <div className="text-sm text-gray-600 mt-1">{priority.reason}</div>
                    <div className="text-xs text-brand-600 mt-1">{priority.suggested_action}</div>
                  </div>
                  <span className={cn('badge', priority.score >= 80 ? 'bg-red-50 text-red-700' : priority.score >= 60 ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600')}>{priority.score}</span>
                </div>
              </Link>
            ))}
            {(!priorities || priorities.length === 0) && <p className="text-sm text-gray-400">Nessuna priorità urgente rilevata.</p>}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Opportunità da seguire</h2>
          <div className="space-y-3">
            {(opportunities ?? []).slice(0, 8).map((opportunity: any) => (
              <Link key={opportunity.id} href={`/dashboard/contacts/${opportunity.contact_id}`} className="block rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{opportunity.contacts?.first_name} {opportunity.contacts?.last_name}</div>
                    <div className="text-sm text-gray-600 mt-1">{opportunity.stage} · €{Number(opportunity.estimated_value ?? 0).toLocaleString('it-IT')}</div>
                    {opportunity.next_action && <div className="text-xs text-brand-600 mt-1">{opportunity.next_action}</div>}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
            {(!opportunities || opportunities.length === 0) && <p className="text-sm text-gray-400">Nessuna opportunità aperta.</p>}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Flame className="w-5 h-5" /> Lead caldi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hotContacts.slice(0, 9).map((contact: any) => (
            <Link key={contact.id} href={`/dashboard/contacts/${contact.id}`} className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">{contact.first_name} {contact.last_name}</div>
              <div className="text-sm text-gray-500 mt-1">{contact.status}</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="badge bg-orange-50 text-orange-700">Interesse {contact.interest_level}/10</span>
                <span className="badge bg-brand-50 text-brand-700">Fiducia {contact.trust_level}/10</span>
              </div>
            </Link>
          ))}
          {hotContacts.length === 0 && <p className="text-sm text-gray-400">Nessun lead caldo rilevato.</p>}
        </div>
      </div>
    </div>
  )
}
