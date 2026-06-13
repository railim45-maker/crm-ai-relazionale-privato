import { createServerClient } from '@/lib/supabase'
import { statusColor, initials, timeAgo } from '@/lib/utils'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default async function ContactsPage({ searchParams }: { searchParams: { q?: string; status?: string; filter?: string } }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase.from('contacts')
    .select('*, companies(name)')
    .eq('user_id', user!.id)
    .not('status', 'eq', 'Archiviato')
    .order('last_contact_at', { ascending: false })

  if (searchParams.q) {
    query = query.or(`first_name.ilike.%${searchParams.q}%,last_name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%`)
  }
  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.filter === 'inactive') {
    query = query.lt('last_contact_at', new Date(Date.now() - 30 * 86400000).toISOString())
  }

  const { data: contacts } = await query.limit(100)

  const statuses = ['Lead','Prospect','Interessato','Cliente','Partner','Collaboratore','Ambassador','Inattivo']

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contatti</h1>
          <p className="text-sm text-gray-500">{contacts?.length ?? 0} contatti trovati</p>
        </div>
        <Link href="/dashboard/contacts/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Nuovo contatto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <form className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input name="q" defaultValue={searchParams.q} placeholder="Cerca nome, email..."
            className="w-full pl-9 pr-4" />
        </form>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <Link key={s} href={`/dashboard/contacts?status=${s}`}
              className={`badge text-xs ${searchParams.status === s ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
            </Link>
          ))}
          {searchParams.status && <Link href="/dashboard/contacts" className="badge bg-red-50 text-red-600 text-xs">✕ Reset</Link>}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Contatto</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Azienda</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Stato</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Interesse</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Ultimo contatto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts?.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/contacts/${c.id}`} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700 flex-shrink-0">
                      {initials(c.first_name, c.last_name)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-brand-600">{c.first_name} {c.last_name}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{(c.companies as any)?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${statusColor(c.status)}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-400 rounded-full" style={{ width: `${(c.interest_level ?? 0) * 10}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{c.interest_level ?? 0}/10</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {c.last_contact_at ? timeAgo(c.last_contact_at) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!contacts || contacts.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Nessun contatto trovato</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { Users } from 'lucide-react'
