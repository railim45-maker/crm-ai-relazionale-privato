import { createServerClient } from '@/lib/supabase'
import { Video, Users, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function WebinarsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: webinars } = await supabase
    .from('webinars')
    .select('*, webinar_attendees(count)')
    .eq('created_by', user!.id)
    .order('scheduled_at', { ascending: false })

  const statusBadge: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    published: 'bg-blue-100 text-blue-700',
    live: 'bg-green-100 text-green-700 animate-pulse',
    completed: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Webinar</h1>
        <button className="btn-primary"><Video className="w-4 h-4" /> Nuovo webinar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {webinars?.map(w => (
          <Link key={w.id} href={`/dashboard/webinars/${w.id}`} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{w.title}</h3>
              <span className={`badge text-xs ${statusBadge[w.status]}`}>{w.status}</span>
            </div>
            <span className="badge bg-indigo-50 text-indigo-700 text-xs mb-3 inline-block">{w.area}</span>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(w.scheduled_at, 'dd MMM yyyy HH:mm')}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {(w.webinar_attendees as any)?.[0]?.count ?? 0} iscritti
              </span>
            </div>
          </Link>
        ))}
        {(!webinars || webinars.length === 0) && (
          <div className="col-span-2 text-center py-16 text-gray-400">
            <Video className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>Nessun webinar programmato</p>
          </div>
        )}
      </div>
    </div>
  )
}
