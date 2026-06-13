import { createServerClient } from '@/lib/supabase'
import { Calendar as CalIcon, Clock, Video, Phone, Users } from 'lucide-react'
import { formatDate, initials } from '@/lib/utils'
import Link from 'next/link'

export default async function CalendarPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const from = new Date()
  const to = new Date(Date.now() + 14 * 86400000)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, contacts(id, first_name, last_name)')
    .eq('user_id', user!.id)
    .gte('scheduled_at', from.toISOString())
    .lte('scheduled_at', to.toISOString())
    .order('scheduled_at')

  const typeIcon: Record<string, any> = {
    chiamata: Phone,
    zoom: Video,
    meet: Video,
    consulenza: Users,
    webinar: Video,
    incontro_fisico: Users,
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <button className="btn-primary"><CalIcon className="w-4 h-4" /> Nuovo appuntamento</button>
      </div>

      <div className="space-y-4">
        {appointments?.map(apt => {
          const Icon = typeIcon[apt.type] ?? CalIcon
          return (
            <div key={apt.id} className="card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium capitalize text-gray-900">{apt.type}</span>
                  <span className="badge bg-gray-100 text-gray-600 text-xs">{apt.duration_minutes} min</span>
                  <span className={`badge text-xs ${apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{apt.status}</span>
                </div>
                <Link href={`/dashboard/contacts/${apt.contact_id}`} className="text-sm text-brand-600 hover:underline mt-0.5 block">
                  {(apt.contacts as any)?.first_name} {(apt.contacts as any)?.last_name}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(apt.scheduled_at, 'EEEE dd MMM yyyy · HH:mm')}
                </div>
                {apt.notes && <p className="text-xs text-gray-500 mt-1.5 italic">{apt.notes}</p>}
              </div>
            </div>
          )
        })}
        {(!appointments || appointments.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <CalIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>Nessun appuntamento nei prossimi 14 giorni</p>
          </div>
        )}
      </div>
    </div>
  )
}
