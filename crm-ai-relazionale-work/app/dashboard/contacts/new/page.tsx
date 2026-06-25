/*
 * FILE GENERATO DA MANUS - PAGINA NUOVO LEAD - inserimento e ricerca guidata
 * DESTINAZIONE ESATTA: app/dashboard/contacts/new/page.tsx
 * FUNZIONE: Sostituisce la pagina Nuovo lead: inserimento dati parziali e checklist ricerca automatica/guidata.
 * NOTA: in Next.js il nome deve restare page.tsx; distingue la pagina il percorso della cartella.
 */

import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bot, CheckCircle2, Search, ShieldCheck, UserPlus } from 'lucide-react'

async function createLead(formData: FormData) {
  'use server'

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const firstName = String(formData.get('first_name') || '').trim()
  const lastName = String(formData.get('last_name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const whatsapp = String(formData.get('whatsapp') || '').trim()
  const linkedin = String(formData.get('linkedin') || '').trim()
  const website = String(formData.get('website') || '').trim()
  const city = String(formData.get('city') || '').trim()
  const role = String(formData.get('role') || '').trim()
  const notes = String(formData.get('notes') || '').trim()

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: user.id,
      first_name: firstName || 'Lead',
      last_name: lastName || 'da qualificare',
      email: email || null,
      phone: phone || null,
      whatsapp: whatsapp || phone || null,
      linkedin: linkedin || null,
      website: website || null,
      city: city || null,
      role: role || null,
      status: 'Lead',
      trust_level: 1,
      interest_level: 1,
      first_contact_at: new Date().toISOString(),
      last_contact_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error || !data) redirect('/dashboard/contacts?error=create')

  if (notes) {
    await supabase.from('conversations').insert({
      user_id: user.id,
      contact_id: data.id,
      channel: 'manual',
      raw_content: `Nota iniziale interna per ricerca guidata: ${notes}`,
      occurred_at: new Date().toISOString(),
    })
  }

  redirect(`/dashboard/contacts/${data.id}`)
}

const researchSteps = [
  'Verifica identità: nome, cognome, ruolo, città, azienda e recapiti.',
  'Ricerca contesto pubblico: sito, LinkedIn, attività, settore e segnali di bisogno.',
  'Completa dati economici minimi: dimensione, servizi attuali, costi, urgenze e obiezioni.',
  'Prepara materiale utile: una sola risorsa mirata al bisogno, non tutto il catalogo.',
]

export default function NewContactPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/contacts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-3">
            <ArrowLeft className="w-4 h-4" /> Torna ai lead
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nuovo lead con ricerca guidata</h1>
          <p className="text-sm text-gray-500 mt-1">Inserisci anche pochi dati: il CRM salva il lead e apre una scheda con cosa cercare, cosa manca e quali materiali valutare.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <form action={createLead} className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Nome</span>
              <input name="first_name" placeholder="Es. Marco" className="w-full" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Cognome</span>
              <input name="last_name" placeholder="Es. Rossi" className="w-full" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input name="email" type="email" placeholder="nome@azienda.it" className="w-full" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Telefono</span>
              <input name="phone" placeholder="+39..." className="w-full" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">WhatsApp</span>
              <input name="whatsapp" placeholder="Se diverso dal telefono" className="w-full" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Ruolo / profilo</span>
              <input name="role" placeholder="Titolare, manager, consulente..." className="w-full" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Città / area</span>
              <input name="city" placeholder="Milano, Brescia, Torino..." className="w-full" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-gray-700">Sito web</span>
              <input name="website" placeholder="https://..." className="w-full" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">LinkedIn o fonte pubblica</span>
              <input name="linkedin" placeholder="Profilo LinkedIn, pagina azienda, fonte utile..." className="w-full" />
            </label>
          </div>

          <label className="space-y-1.5 block">
            <span className="text-sm font-medium text-gray-700">Dati parziali, appunti o indizi da cui partire</span>
            <textarea name="notes" rows={6} placeholder="Incolla qui informazioni anche incomplete: nome azienda, settore, città, problema, link, conversazione, bisogno, obiezioni..." className="w-full" />
          </label>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
            <div className="font-semibold mb-1">Nota privacy e professionalità</div>
            <p>La ricerca guidata resta interna al CRM. Nei messaggi al cliente non verranno citate fonti, score, supposizioni o analisi interne.</p>
          </div>

          <button type="submit" className="btn-primary w-full justify-center">
            <UserPlus className="w-4 h-4" /> Salva lead e apri scheda completa
          </button>
        </form>

        <aside className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-brand-600" />
              <h2 className="font-semibold text-gray-900">Ricerca automatica guidata</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Quando il lead viene creato, la scheda evidenzia subito i dati mancanti e le azioni da fare per completare la comunicazione.</p>
            <div className="space-y-3">
              {researchSteps.map((step, index) => (
                <div key={step} className="flex gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">{index + 1}</div>
                  <p className="text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-cyan-600" />
              <h2 className="font-semibold text-gray-900">Cosa comparirà nella scheda</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Dati presenti e mancanti.</div>
              <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Domande da fare prima della proposta.</div>
              <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Materiali consigliati da condividere.</div>
              <div className="flex gap-2"><ShieldCheck className="w-4 h-4 text-green-500 mt-0.5" />Messaggistica pulita da closer professionista.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
