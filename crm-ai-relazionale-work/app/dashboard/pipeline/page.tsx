import { createServerClient } from '@/lib/supabase'
import { statusColor, currencyFormat, initials } from '@/lib/utils'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

const STAGES = ['Nuovo Lead','Primo Contatto','Interesse','Qualificazione','Presentazione','Webinar','Consulenza','Proposta','Trattativa','Chiusura']

export default async function PipelinePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, contacts(first_name, last_name, status), services(name, area)')
    .in('stage', STAGES)
    .eq('contacts.user_id', user!.id)
    .order('close_probability', { ascending: false })

  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = (opportunities ?? []).filter(o => o.stage === stage)
    return acc
  }, {} as Record<string, typeof opportunities>)

  const totalValue = (opportunities ?? []).reduce((s, o) => s + (o.estimated_value ?? 0), 0)
  const weightedValue = (opportunities ?? []).reduce((s, o) => s + (o.estimated_value ?? 0) * o.close_probability, 0)

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline commerciale</h1>
          <p className="text-sm text-gray-500">
            {opportunities?.length ?? 0} opportunità · {currencyFormat(totalValue)} totale · {currencyFormat(weightedValue)} pesato
          </p>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const cards = grouped[stage] ?? []
          return (
            <div key={stage} className="flex-shrink-0 w-60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stage}</h3>
                <span className="text-xs text-gray-400">{cards.length}</span>
              </div>
              <div className="space-y-3">
                {cards.map((opp: any) => (
                  <Link key={opp.id} href={`/dashboard/contacts/${opp.contact_id}`}
                    className="block card p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                        {initials(opp.contacts?.first_name ?? '', opp.contacts?.last_name ?? '')}
                      </div>
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {opp.contacts?.first_name} {opp.contacts?.last_name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-2">{opp.services?.name}</p>
                    <div className="flex items-center justify-between">
                      {opp.estimated_value ? (
                        <span className="text-xs font-medium text-gray-700">{currencyFormat(opp.estimated_value)}</span>
                      ) : <span />}
                      <span className="text-xs text-brand-600">{Math.round(opp.close_probability * 100)}%</span>
                    </div>
                  </Link>
                ))}
                {cards.length === 0 && (
                  <div className="h-16 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-300">Vuoto</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
