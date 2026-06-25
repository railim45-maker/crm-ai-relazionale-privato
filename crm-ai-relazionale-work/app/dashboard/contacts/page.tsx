/*
 * FILE GENERATO DA MANUS - PAGINA CONTATTI - lista/griglia lead caricati
 * DESTINAZIONE ESATTA: app/dashboard/contacts/page.tsx
 * FUNZIONE: Sostituisce la pagina Contatti: mostra i lead in griglia operativa con completezza dati, stato e prossima azione.
 * NOTA: in Next.js il nome deve restare page.tsx; distingue la pagina il percorso della cartella.
 */

import { createServerClient } from '@/lib/supabase'
import { statusColor, initials, timeAgo } from '@/lib/utils'
import { Plus, Search, Users, ArrowRight, AlertTriangle, CheckCircle2, CalendarDays, Mail, Phone, Building2 } from 'lucide-react'
import Link from 'next/link'

function completeness(contact: any) {
  const fields = [
    contact.first_name,
    contact.last_name,
    contact.email,
    contact.phone || contact.whatsapp,
    contact.role,
    contact.city,
    contact.status,
    contact.interest_level,
    contact.potential_value,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

function missingData(contact: any) {
  const missing: string[] = []
  if (!contact.email) missing.push('email')
  if (!contact.phone && !contact.whatsapp) missing.push('telefono/WhatsApp')
  if (!contact.role) missing.push('ruolo')
  if (!contact.city) missing.push('città')
  if (!contact.potential_value) missing.push('valore potenziale')
  return missing
}

export default async function ContactsPage({ searchParams }: { searchParams: { q?: string; status?: string; filter?: string } }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase.from('contacts')
    .select('*, companies(name)')
    .eq('user_id', user!.id)
    .not('status', 'eq', 'Archiviato')
    .order('last_contact_at', { ascending: false })

  if (searchParams.q) {
    query = query.or(`first_name.ilike.%${searchParams.q}%,last_name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%,phone.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%`)
  }
  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.filter === 'inactive') {
    query = query.lt('last_contact_at', new Date(Date.now() - 30 * 86400000).toISOString())
  }

  const { data: contacts } = await query.limit(100)

  const contactIds = contacts?.map((contact: any) => contact.id) ?? []
  const { data: tasks } = contactIds.length
    ? await supabase.from('tasks').select('*').in('contact_id', contactIds).eq('status', 'pending').order('due_date')
    : { data: [] as any[] }
  const { data: appointments } = contactIds.length
    ? await supabase.from('appointments').select('*').in('contact_id', contactIds).gte('scheduled_at', new Date().toISOString()).order('scheduled_at')
    : { data: [] as any[] }

  const nextTaskByContact = new Map<string, any>()
  ;(tasks as any[] | null)?.forEach((task) => {
    if (!nextTaskByContact.has(task.contact_id)) nextTaskByContact.set(task.contact_id, task)
  })

  const nextAppointmentByContact = new Map<string, any>()
  ;(appointments as any[] | null)?.forEach((appointment) => {
    if (!nextAppointmentByContact.has(appointment.contact_id)) nextAppointmentByContact.set(appointment.contact_id, appointment)
  })

  const statuses = ['Lead','Prospect','Interessato','Cliente','Partner','Collaboratore','Ambassador','Inattivo']

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead e contatti</h1>
          <p className="text-sm text-gray-500 mt-1">
            {contacts?.length ?? 0} contatti trovati. Vista a schede per lavorare su completezza, prossima azione e comunicazione.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/calendar" className="btn-secondary">
            <CalendarDays className="w-4 h-4" /> Agenda
          </Link>
          <Link href="/dashboard/contacts/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Nuovo lead
          </Link>
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <form className="relative max-w-xl">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input name="q" defaultValue={searchParams.q} placeholder="Cerca nome, email, telefono, città o azienda..." className="w-full pl-9 pr-4" />
        </form>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <Link key={s} href={`/dashboard/contacts?status=${s}`} className={`badge text-xs ${searchParams.status === s ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
            </Link>
          ))}
          {(searchParams.status || searchParams.q) && <Link href="/dashboard/contacts" className="badge bg-red-50 text-red-600 text-xs">Reset filtri</Link>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {contacts?.map((contact: any) => {
          const score = completeness(contact)
          const missing = missingData(contact)
          const task = nextTaskByContact.get(contact.id)
          const appointment = nextAppointmentByContact.get(contact.id)
          return (
            <article key={contact.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700 flex-shrink-0">
                  {initials(contact.first_name, contact.last_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-900 truncate">{contact.first_name} {contact.last_name}</h2>
                    <span className={`badge ${statusColor(contact.status)} text-xs`}>{contact.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.role || 'Ruolo da verificare'}{(contact.companies as any)?.name ? ` · ${(contact.companies as any).name}` : ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-gray-400 mb-1">Completezza dati</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                    </div>
                    <strong>{score}%</strong>
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-gray-400 mb-1">Interesse</div>
                  <div className="font-semibold text-gray-900">{contact.interest_level ?? 0}/10</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                {contact.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" />{contact.email}</div>}
                {(contact.phone || contact.whatsapp) && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" />{contact.phone || contact.whatsapp}</div>}
                {(contact.companies as any)?.name && <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-gray-400" />{(contact.companies as any).name}</div>}
              </div>

              <div className="rounded-2xl border border-dashed border-gray-200 p-3 text-xs">
                <div className="flex items-center gap-2 font-medium text-gray-800 mb-1">
                  {missing.length ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  {missing.length ? 'Dati da completare' : 'Dati principali completi'}
                </div>
                <p className="text-gray-500">{missing.length ? missing.slice(0, 4).join(', ') : 'Puoi concentrarti su proposta, materiali e follow-up.'}</p>
              </div>

              <div className="rounded-2xl bg-brand-50 p-3 text-xs text-brand-800">
                <div className="font-medium mb-1">Prossima mossa</div>
                <p>{appointment ? `Appuntamento: ${new Date(appointment.scheduled_at).toLocaleDateString('it-IT')}` : task ? task.title : 'Apri la scheda e definisci follow-up, materiale da inviare e domande mancanti.'}</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-1">
                <span className="text-xs text-gray-400">Ultimo contatto: {contact.last_contact_at ? timeAgo(contact.last_contact_at) : '—'}</span>
                <Link href={`/dashboard/contacts/${contact.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
                  Apri scheda <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {(!contacts || contacts.length === 0) && (
        <div className="text-center py-16 text-gray-400 card">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Nessun contatto trovato</p>
        </div>
      )}
    </div>
  )
}
