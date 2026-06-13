import { createServerClient } from '@/lib/supabase'
import { currencyFormat, timeAgo } from '@/lib/utils'
import { Users, TrendingUp, CheckSquare, Video, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { DashboardMetrics, DailyPriority } from '@/types'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: metrics } = await supabase
    .from('v_dashboard')
    .select('*')
    .eq('user_id', user!.id)
    .single() as { data: DashboardMetrics | null }

  const { data: priorities } = await supabase
    .rpc('get_today_priorities', { p_user_id: user!.id })
    .limit(6) as { data: DailyPriority[] | null }

  const { data: recentTasks } = await supabase
    .from('tasks')
    .select('*, contacts(first_name, last_name)')
    .eq('user_id', user!.id)
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .limit(5)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Panoramica relazionale di oggi</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Contatti attivi</span>
            <Users className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold">{(metrics?.leads_count ?? 0) + (metrics?.prospects_count ?? 0) + (metrics?.interested_count ?? 0) + (metrics?.clients_count ?? 0)}</div>
          <div className="text-xs text-green-600 mt-1">{metrics?.clients_count ?? 0} clienti · {metrics?.partners_count ?? 0} partner</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Pipeline aperta</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold">{currencyFormat(metrics?.pipeline_value ?? 0)}</div>
          <div className="text-xs text-gray-500 mt-1">{metrics?.open_opportunities ?? 0} opportunità · weighted {currencyFormat(metrics?.weighted_pipeline ?? 0)}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Task</span>
            <CheckSquare className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold">{metrics?.due_today ?? 0}</div>
          <div className="text-xs text-red-500 mt-1">{metrics?.overdue_tasks ?? 0} scaduti</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Appuntamenti oggi</span>
            <Video className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold">{metrics?.appointments_today ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">{metrics?.upcoming_webinars ?? 0} webinar questa settimana</div>
        </div>
      </div>

      {/* Alert inattivi */}
      {(metrics?.inactive_30d ?? 0) > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span><strong>{metrics?.inactive_30d}</strong> contatti non sentiti da oltre 30 giorni.</span>
          <Link href="/dashboard/contacts?filter=inactive" className="ml-auto underline font-medium">Vedi →</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priorità AI */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h2 className="font-semibold text-gray-900">Priorità del giorno</h2>
            <span className="badge bg-brand-50 text-brand-700 ml-auto">{priorities?.length ?? 0} azioni</span>
          </div>
          <div className="space-y-3">
            {priorities?.map((p, i) => (
              <Link key={i} href={`/dashboard/contacts/${p.contact_id}`}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${p.score >= 80 ? 'bg-red-400' : p.score >= 60 ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">{p.contact_name}</div>
                  <div className="text-xs text-gray-500 truncate">{p.reason}</div>
                  <div className="text-xs text-brand-600 mt-0.5">{p.suggested_action}</div>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-brand-500">→</span>
              </Link>
            ))}
            {(!priorities || priorities.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">Nessuna priorità urgente oggi 🎉</p>
            )}
          </div>
        </div>

        {/* Task pendenti */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-4 h-4 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Task pendenti</h2>
            <Link href="/dashboard/tasks" className="ml-auto text-xs text-brand-600 hover:underline">Tutti →</Link>
          </div>
          <div className="space-y-2">
            {recentTasks?.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.contacts?.first_name} {task.contacts?.last_name}</div>
                </div>
                <span className="text-xs text-gray-400">{task.due_date}</span>
              </div>
            ))}
            {(!recentTasks || recentTasks.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">Nessun task pendente 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
