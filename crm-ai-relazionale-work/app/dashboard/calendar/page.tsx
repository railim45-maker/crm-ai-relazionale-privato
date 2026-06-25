/*
 * FILE GENERATO DA MANUS - PAGINA AGENDA OPERATIVA - appuntamenti follow-up task
 * DESTINAZIONE ESATTA: app/dashboard/calendar/page.tsx
 * FUNZIONE: Sostituisce la pagina Agenda/Calendario: vista 14 giorni, follow-up in ritardo, task e appuntamenti.
 * NOTA: in Next.js il nome deve restare page.tsx; distingue la pagina il percorso della cartella.
 */

import { createServerClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { CalendarDays, Clock, AlertTriangle, CheckSquare, Video, Phone, Users, ArrowRight, Plus, Send } from 'lucide-react'
import Link from 'next/link'

function sameDay(value: string | undefined, date: Date) {
  if (!value) return false
  const current = new Date(value)
  return current.getFullYear() === date.getFullYear() && current.getMonth() === date.getMonth() && current.getDate() === date.getDate()
}

function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

function agendaTypeIcon(type: string) {
  if (['zoom', 'meet', 'webinar'].includes(type)) return <Video className="w-4 h-4 text-blue-500" />
  if (['chiamata', 'call'].includes(type)) return <Phone className="w-4 h-4 text-green-500" />
  return <CalendarDays className="w-4 h-4 text-brand-500" />
}

export default async function CalendarPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const today = startOfToday()
  const horizon = new Date(Date.now() + 45 * 86400000)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, contacts(first_name,last_name,email,phone,whatsapp,status)')
    .eq('user_id', user!.id)
    .gte('scheduled_at', new Date(Date.now() - 14 * 86400000).toISOString())
    .lte('scheduled_at', horizon.toISOString())
    .order('scheduled_at')

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, contacts(first_name,last_name,email,phone,whatsapp,status)')
    .eq('user_id', user!.id)
    .neq('status', 'completed')
    .order('due_date')
    .limit(80)

  const allTasks = (tasks as any[] | null) ?? []
  const allAppointments = (appointments as any[] | null) ?? []
  const todayAppointments = allAppointments.filter((item) => sameDay(item.scheduled_at, today) && item.status === 'scheduled')
  const todayTasks = allTasks.filter((item) => sameDay(item.due_date, today))
  const overdueTasks = allTasks.filter((item) => item.due_date && new Date(item.due_date) < today)
  const upcomingAppointments = allAppointments.filter((item) => new Date(item.scheduled_at) >= today && item.status === 'scheduled').slice(0, 12)
  const upcomingTasks = allTasks.filter((item) => !item.due_date || new Date(item.due_date) >= today).slice(0, 12)

  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return {
      date,
      appointments: allAppointments.filter((item) => sameDay(item.scheduled_at, date)),
      tasks: allTasks.filter((item) => sameDay(item.due_date, date)),
    }
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><CalendarDays className="w-6 h-6 text-brand-600" /> Agenda operativa</h1>
          <p className="text-sm text-gray-500 mt-1">Appuntamenti, follow-up, task e prossime azioni visibili in un’unica schermata.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/dashboard/contacts/new" className="btn-primary"><Plus className="w-4 h-4" /> Nuovo lead</Link>
          <Link href="/dashboard/tasks" className="btn-secondary"><CheckSquare className="w-4 h-4" /> Task</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5"><div className="text-sm text-gray-500">Oggi</div><div className="text-3xl font-bold text-gray-900 mt-1">{todayAppointments.length + todayTasks.length}</div><div className="text-xs text-gray-400 mt-1">appuntamenti + task</div></div>
        <div className="card p-5"><div className="text-sm text-gray-500">In ritardo</div><div className="text-3xl font-bold text-red-600 mt-1">{overdueTasks.length}</div><div className="text-xs text-gray-400 mt-1">follow-up da recuperare</div></div>
        <div className="card p-5"><div className="text-sm text-gray-500">Prossimi appuntamenti</div><div className="text-3xl font-bold text-brand-700 mt-1">{upcomingAppointments.length}</div><div className="text-xs text-gray-400 mt-1">nei prossimi 45 giorni</div></div>
        <div className="card p-5"><div className="text-sm text-gray-500">Task aperti</div><div className="text-3xl font-bold text-amber-600 mt-1">{allTasks.length}</div><div className="text-xs text-gray-400 mt-1">da gestire</div></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-brand-500" />
              <h2 className="font-semibold text-gray-900">Vista 14 giorni</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {days.map((day) => (
                <div key={day.date.toISOString()} className={`rounded-2xl border p-4 ${sameDay(day.date.toISOString(), today) ? 'bg-brand-50 border-brand-100' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900 capitalize">{formatDate(day.date.toISOString(), 'EEEE')}</div>
                      <div className="text-xs text-gray-500">{formatDate(day.date.toISOString(), 'dd MMM yyyy')}</div>
                    </div>
                    <span className="badge bg-gray-100 text-gray-600 text-xs">{day.appointments.length + day.tasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {day.appointments.map((item: any) => (
                      <Link key={item.id} href={`/dashboard/contacts/${item.contact_id}`} className="block rounded-xl bg-blue-50 border border-blue-100 p-3 hover:bg-blue-100">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900">{agendaTypeIcon(item.type)}{item.type}</div>
                        <div className="text-xs text-blue-700 mt-1">{formatDate(item.scheduled_at, 'HH:mm')} · {item.contacts?.first_name} {item.contacts?.last_name}</div>
                        {item.notes && <div className="text-xs text-blue-700/80 mt-1 line-clamp-2">{item.notes}</div>}
                      </Link>
                    ))}
                    {day.tasks.map((item: any) => (
                      <Link key={item.id} href={`/dashboard/contacts/${item.contact_id}`} className="block rounded-xl bg-amber-50 border border-amber-100 p-3 hover:bg-amber-100">
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-900"><CheckSquare className="w-4 h-4" />{item.title}</div>
                        <div className="text-xs text-amber-700 mt-1">{item.contacts?.first_name} {item.contacts?.last_name} · priorità {item.priority}</div>
                      </Link>
                    ))}
                    {day.appointments.length === 0 && day.tasks.length === 0 && <p className="text-xs text-gray-400">Nessun evento previsto</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card p-5 bg-red-50 border-red-100">
            <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-red-600" /><h2 className="font-semibold text-gray-900">Follow-up in ritardo</h2></div>
            <div className="space-y-2">
              {overdueTasks.slice(0, 8).map((task: any) => (
                <Link href={`/dashboard/contacts/${task.contact_id}`} key={task.id} className="block rounded-xl bg-white/80 p-3 hover:bg-white">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.contacts?.first_name} {task.contacts?.last_name} · {task.due_date}</div>
                </Link>
              ))}
              {overdueTasks.length === 0 && <p className="text-sm text-red-700/70">Nessun follow-up in ritardo.</p>}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-brand-600" /><h2 className="font-semibold text-gray-900">Prossimi appuntamenti</h2></div>
            <div className="space-y-2">
              {upcomingAppointments.map((item: any) => (
                <Link key={item.id} href={`/dashboard/contacts/${item.contact_id}`} className="block rounded-xl bg-gray-50 p-3 hover:bg-gray-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">{agendaTypeIcon(item.type)}{item.contacts?.first_name} {item.contacts?.last_name}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatDate(item.scheduled_at, 'dd MMM yyyy HH:mm')} · {item.type}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">Apri scheda lead <ArrowRight className="w-3 h-3" /></div>
                </Link>
              ))}
              {upcomingAppointments.length === 0 && <p className="text-sm text-gray-400">Nessun appuntamento pianificato.</p>}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3"><Send className="w-4 h-4 text-green-600" /><h2 className="font-semibold text-gray-900">Task da completare</h2></div>
            <div className="space-y-2">
              {upcomingTasks.map((task: any) => (
                <Link key={task.id} href={`/dashboard/contacts/${task.contact_id}`} className="block rounded-xl bg-gray-50 p-3 hover:bg-gray-100">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.contacts?.first_name} {task.contacts?.last_name} · {task.due_date || 'senza data'}</div>
                </Link>
              ))}
              {upcomingTasks.length === 0 && <p className="text-sm text-gray-400">Nessun task aperto.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
