import { createServerClient } from '@/lib/supabase'
import { CheckSquare, Brain, Calendar } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function TasksPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, contacts(id, first_name, last_name)')
    .eq('user_id', user!.id)
    .eq('status', 'pending')
    .order('due_date', { ascending: true })

  const today = new Date().toISOString().split('T')[0]
  const overdue = tasks?.filter(t => t.due_date && t.due_date < today) ?? []
  const dueToday = tasks?.filter(t => t.due_date === today) ?? []
  const upcoming = tasks?.filter(t => !t.due_date || t.due_date > today) ?? []

  const TaskCard = ({ task }: { task: any }) => (
    <div className="card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
      <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
        task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300')} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900">{task.title}</div>
        <Link href={`/dashboard/contacts/${task.contact_id}`}
          className="text-xs text-brand-600 hover:underline">
          {task.contacts?.first_name} {task.contacts?.last_name}
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="badge bg-gray-100 text-gray-600 text-xs">{task.type}</span>
          {task.ai_generated && <span className="flex items-center gap-1 text-xs text-brand-500"><Brain className="w-3 h-3" /> AI</span>}
          {task.due_date && <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="w-3 h-3" />{task.due_date}</span>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Task</h1>

      {overdue.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Scaduti ({overdue.length})
          </h2>
          <div className="space-y-3">{overdue.map(t => <TaskCard key={t.id} task={t} />)}</div>
        </div>
      )}

      {dueToday.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Oggi ({dueToday.length})
          </h2>
          <div className="space-y-3">{dueToday.map(t => <TaskCard key={t.id} task={t} />)}</div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Prossimi ({upcoming.length})
          </h2>
          <div className="space-y-3">{upcoming.map(t => <TaskCard key={t.id} task={t} />)}</div>
        </div>
      )}

      {(!tasks || tasks.length === 0) && (
        <div className="text-center py-16 text-gray-400">
          <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>Nessun task pendente. Ottimo lavoro!</p>
        </div>
      )}
    </div>
  )
}
