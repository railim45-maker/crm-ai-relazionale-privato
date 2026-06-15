from pathlib import Path

path = Path('/home/ubuntu/crm-ai-relazionale-work/app/demo/page.tsx')
text = path.read_text()

insert_after = "function pct(value?: number) { return `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(num(value))}%` }\n"
quick_helpers = r'''
function firstMatch(text: string, regex: RegExp) {
  const match = text.match(regex)
  return match?.[1]?.trim() || ''
}
function titleCaseName(value: string) {
  return value.split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}
function uniqueLines(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => (value || '').trim()).filter(Boolean))).join('\n')
}
function inferLeadCategory(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes('camping') || lower.includes('campeggio')) return { category: 'Camping / Turismo', services: 'AI primo contatto; gestione richieste; automazione prenotazioni; comunicazione stagionale', need: 'gestione richieste, disponibilità, prenotazioni e informazioni ripetitive' }
  if (lower.includes('hotel') || lower.includes('albergo') || lower.includes('b&b') || lower.includes('bed and breakfast')) return { category: 'Hotel / Ospitalità', services: 'AI primo contatto; reception digitale; automazione richieste; follow-up prenotazioni', need: 'gestione richieste ospiti, disponibilità, preventivi e follow-up' }
  if (lower.includes('ristorante') || lower.includes('trattoria') || lower.includes('pizzeria')) return { category: 'Ristorazione', services: 'AI primo contatto; prenotazioni; gestione richieste; comunicazione locale', need: 'prenotazioni, richieste ripetitive, orari, tavoli e comunicazione con i clienti' }
  if (lower.includes('immobiliare') || lower.includes('agenzia')) return { category: 'Immobiliare / Servizi', services: 'CRM lead; AI primo contatto; follow-up; qualificazione richieste', need: 'qualificazione contatti, richieste immobiliari e follow-up tempestivo' }
  if (lower.includes('studio') || lower.includes('professionista') || lower.includes('consulente')) return { category: 'Studio professionale', services: 'CRM lead; AI primo contatto; agenda; gestione richieste', need: 'gestione appuntamenti, richieste informative e follow-up' }
  return { category: 'Attività da qualificare', services: 'CRM lead; AI primo contatto; comunicazione; consulenza', need: 'capire quali richieste ripetitive o processi commerciali fanno perdere tempo' }
}
function parseLeadPasteText(rawText: string): Partial<Contact> {
  const text = rawText.replace(/\r/g, '').trim()
  const email = firstMatch(text, /(?:e-?mail|mail|email)\s*:?\s*([^\s,;]+@[^\s,;]+)/i) || firstMatch(text, /([^\s,;]+@[^\s,;]+)/i)
  const website = firstMatch(text, /(https?:\/\/[^\s,;]+)/i) || firstMatch(text, /(?:sito|website)\s*:?\s*((?:www\.)?[^\s,;]+\.[a-z]{2,})/i)
  const address = firstMatch(text, /(?:indirizzo(?:\s+fisico)?|sede)\s*:?\s*(.+)/i)
  const phoneMatches = Array.from(text.matchAll(/(?:\+?39[\s.-]?)?(?:0\d{1,4}[\s.-]?\d{4,8}|3\d{2}[\s.-]?\d{6,7})/g)).map((match) => match[0].replace(/\s+/g, ' ').trim())
  const phone = phoneMatches[0] || ''
  const mobile = phoneMatches.find((value) => /(?:\+?39\s*)?3\d{2}/.test(value.replace(/[.-]/g, ' '))) || ''
  const ownerName = firstMatch(text, /(?:titolare|referente|gestione|responsabile)[^\n.]*?\s(?:è|:|-)\s*([A-ZÀ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-Ý][A-Za-zÀ-ÿ'’.-]+){1,4})/i) || firstMatch(text, /(?:nome|referente)\s*:?\s*([A-ZÀ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-Ý][A-Za-zÀ-ÿ'’.-]+){1,4})/i)
  const companyFromOwnerPhrase = firstMatch(text, /(?:titolare|referente|gestione|responsabile)\s+(?:del|della|dello|dell'|dell’|di)\s+([^\n(.]+?)(?:\s*\(|\s+è|\.|,|$)/i)
  const company = firstMatch(text, /(?:azienda|attività|struttura|società|nome attività)\s*:?\s*(.+)/i) || companyFromOwnerPhrase || firstMatch(text, /^([^\n]+)$/m)
  const cityFromParentheses = firstMatch(text, /(?:situat[oa]\s+a|sede\s+a)\s+([^,)\n]+(?:,\s*[A-Z]{2})?)/i)
  const cityFromAddress = firstMatch(address, /\b\d{5}\s+([^,(\n]+(?:\s*\([A-Z]{2}\))?)/i)
  const city = cityFromAddress || cityFromParentheses
  const firstName = ownerName ? titleCaseName(ownerName).split(/\s+/)[0] : ''
  const lastName = ownerName ? titleCaseName(ownerName).split(/\s+/).slice(1).join(' ') : ''
  const inferred = inferLeadCategory(text)
  const cleanCompany = company.replace(/^Il\s+titolare\s+del\s+/i, '').trim()
  const publicSources = uniqueLines([
    'Dati copiati da ricerca manuale: verificare fonte, pertinenza e aggiornamento prima del primo contatto.',
    website ? `Sito/profilo indicato: ${website}` : '',
    email ? `Email pubblica indicata: ${email}` : '',
    phone ? `Telefono indicato: ${phone}` : '',
  ])
  return {
    name: titleCaseName(ownerName || cleanCompany || 'Lead da completare'),
    company: cleanCompany || titleCaseName(ownerName || 'Lead da completare'),
    role: ownerName ? 'Titolare / gestione' : 'Da verificare',
    email,
    generalEmail: email,
    phone,
    decisionMakerName: titleCaseName(ownerName),
    decisionMakerRole: ownerName ? 'Titolare / gestione' : '',
    decisionMakerEmail: email,
    personFirstName: firstName,
    personLastName: lastName,
    personCity: city,
    city: city || '',
    address,
    website,
    category: inferred.category,
    services: inferred.services,
    topics: [inferred.category, 'Inserimento rapido'].filter(Boolean),
    priorityLevel: 'B',
    outreachStage: 'Da qualificare',
    status: 'Lead',
    interest: 6,
    trust: 5,
    value: 0,
    commercialName: cleanCompany,
    publicSources,
    probableNeeds: inferred.need,
    recommendedQuestions: uniqueLines([
      'Da quale canale arrivano più richieste: telefono, email, WhatsApp o sito?',
      'Quali richieste vi fanno perdere più tempo perché richiedono sempre risposte simili?',
      'Oggi vi sarebbe più utile aumentare richieste, gestire meglio quelle esistenti o alleggerire lo staff?',
    ]),
    recommendedPath: 'Mini-diagnosi iniziale e messaggio leggero; proporre solo dopo aver verificato il bisogno reale.',
    researchSummary: `${cleanCompany || ownerName || 'Lead'}: dati assorbiti da testo incollato. Settore stimato: ${inferred.category}. Bisogno iniziale da verificare: ${inferred.need}.`,
    notes: uniqueLines([
      `Testo originale incollato:\n${text}`,
      mobile && mobile !== phone ? `Cellulare rilevato: ${mobile}` : '',
    ]),
    nextAction: 'Controllare i dati essenziali e inviare una domanda diagnostica breve.',
    confidenceScore: 55,
  }
}
function mergeDefinedContactFields(base: Contact, updates: Partial<Contact>): Contact {
  const merged: Contact = { ...base }
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    ;(merged as Record<string, unknown>)[key] = value
  })
  return merged
}
'''
if insert_after not in text:
    raise SystemExit('Punto di inserimento helper non trovato')
text = text.replace(insert_after, insert_after + quick_helpers + "\n", 1)

state_marker = "  const [researchSavedFeedback, setResearchSavedFeedback] = useState('')\n"
state_insert = "  const [quickPasteText, setQuickPasteText] = useState('')\n  const [quickPasteFeedback, setQuickPasteFeedback] = useState('')\n"
if state_marker not in text:
    raise SystemExit('Punto di inserimento stato non trovato')
text = text.replace(state_marker, state_marker + state_insert, 1)

function_marker = "\n\n\n  function importMilanoBatch1() {"
quick_functions = r'''

  function setTemporaryQuickPasteFeedback(message: string) {
    setQuickPasteFeedback(message)
    setTimeout(() => setQuickPasteFeedback(''), 2600)
  }

  function createLeadFromQuickPaste(targetStatus: ContactStatus = 'Lead') {
    if (!quickPasteText.trim()) { window.alert('Incolla prima i dati trovati sul lead o cliente.'); return }
    const timestamp = nowIso()
    const parsed = parseLeadPasteText(quickPasteText)
    const newContact: Contact = normalizeContact({
      id: id('contact'),
      name: parsed.name || parsed.company || 'Lead da completare',
      company: parsed.company || parsed.name || 'Lead da completare',
      role: parsed.role || 'Da verificare',
      email: parsed.email || parsed.generalEmail || '',
      phone: parsed.phone || '',
      status: targetStatus,
      interest: targetStatus === 'Cliente' ? 8 : parsed.interest || 6,
      trust: targetStatus === 'Cliente' ? 7 : parsed.trust || 5,
      value: parsed.value || 0,
      lastContact: today(),
      topics: parsed.topics || ['Inserimento rapido'],
      nextAction: parsed.nextAction || 'Verificare dati e decidere primo contatto.',
      notes: parsed.notes || quickPasteText.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
      ...parsed,
      status: targetStatus,
      outreachStage: targetStatus === 'Cliente' ? 'Risposta ricevuta' : parsed.outreachStage || 'Da qualificare',
      sourceBatch: parsed.sourceBatch || 'Incolla rapido',
    } as Contact)
    setContacts((current) => [newContact, ...current])
    setSelectedContactId(newContact.id)
    setTasks((current) => [{ id: id('task'), title: `${targetStatus === 'Cliente' ? 'Gestire cliente' : 'Qualificare lead'} ${newContact.name}: controllare dati e prossima azione`, contactId: newContact.id, priority: newContact.priorityLevel === 'A' ? 'Alta' : 'Media', due: today(), completed: false, createdAt: timestamp }, ...current])
    setQuickPasteText('')
    setSection('contacts')
    setTemporaryQuickPasteFeedback(`${targetStatus === 'Cliente' ? 'Cliente' : 'Lead'} salvato: ${newContact.name}`)
  }

  function updateSelectedContactFromQuickPaste() {
    if (!selectedContact) { window.alert('Seleziona prima un lead da aggiornare.'); return }
    if (!quickPasteText.trim()) { window.alert('Incolla prima i dati da aggiungere alla scheda selezionata.'); return }
    const timestamp = nowIso()
    const parsed = parseLeadPasteText(quickPasteText)
    const updated = mergeDefinedContactFields(selectedContact, {
      ...parsed,
      notes: uniqueLines([selectedContact.notes, parsed.notes]),
      publicSources: uniqueLines([selectedContact.publicSources, parsed.publicSources]),
      probableNeeds: uniqueLines([selectedContact.probableNeeds, parsed.probableNeeds]),
      recommendedQuestions: uniqueLines([selectedContact.recommendedQuestions, parsed.recommendedQuestions]),
      topics: Array.from(new Set([...(selectedContact.topics || []), ...((parsed.topics as string[]) || [])])),
      updatedAt: timestamp,
    })
    setContacts((current) => current.map((contact) => contact.id === selectedContact.id ? normalizeContact(updated) : contact))
    setTasks((current) => [{ id: id('task'), title: `Verificare aggiornamento dati ${selectedContact.name} e decidere prossimo contatto`, contactId: selectedContact.id, priority: selectedContact.priorityLevel === 'A' ? 'Alta' : 'Media', due: today(), completed: false, createdAt: timestamp }, ...current])
    setQuickPasteText('')
    setTemporaryQuickPasteFeedback(`Scheda aggiornata: ${selectedContact.name}`)
  }
'''
if function_marker not in text:
    raise SystemExit('Punto di inserimento funzioni rapide non trovato')
text = text.replace(function_marker, quick_functions + function_marker, 1)

ui_marker = "</section>\n\n  {section === 'dashboard'"
quick_ui = r'''</section>

<section className="mb-8 rounded-3xl border bg-white p-5">
  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
    <div className="lg:w-72">
      <div className="flex items-center gap-2 text-sm font-semibold text-blue-800"><ClipboardList className="w-4 h-4" /> Inserimento rapido</div>
      <h2 className="text-xl font-bold mt-1">Incolla dati lead o cliente</h2>
      <p className="text-sm text-gray-600 mt-2">Copia informazioni trovate online, email, telefono, referente, indirizzo e note. Il CRM le assorbe nei campi utili e crea subito la scheda lavorabile.</p>
      {quickPasteFeedback && <div className="mt-3 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{quickPasteFeedback}</div>}
    </div>
    <div className="flex-1 space-y-3">
      <textarea value={quickPasteText} onChange={(e) => setQuickPasteText(e.target.value)} className="w-full min-h-36 rounded-2xl border p-4" placeholder="Esempio: Il titolare del Camping Pfirsich è Giulia Alizeri. Email: ... Telefono: ... Indirizzo: ... Note utili..." />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => createLeadFromQuickPaste('Lead')} disabled={!quickPasteText.trim()} className="rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800 disabled:opacity-40"><Plus className="w-4 h-4 inline mr-2" />Crea lead</button>
        <button onClick={() => createLeadFromQuickPaste('Cliente')} disabled={!quickPasteText.trim()} className="rounded-2xl bg-green-700 text-white px-4 py-3 font-semibold hover:bg-green-800 disabled:opacity-40"><Save className="w-4 h-4 inline mr-2" />Crea cliente</button>
        <button onClick={updateSelectedContactFromQuickPaste} disabled={!quickPasteText.trim() || !selectedContact} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50 disabled:opacity-40"><Pencil className="w-4 h-4 inline mr-2" />Aggiorna selezionato</button>
        <button onClick={() => setQuickPasteText('')} disabled={!quickPasteText.trim()} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-red-50 text-red-700 disabled:opacity-40">Pulisci</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="rounded-2xl bg-stone-50 border p-3"><strong>Dati salvati</strong><br />Nome, azienda, email, telefono, città, indirizzo, note e prossima azione.</div>
        <div className="rounded-2xl bg-stone-50 border p-3"><strong>Tempo minimo</strong><br />Non devi compilare tutto: correggi solo ciò che manca dopo l’assorbimento.</div>
        <div className="rounded-2xl bg-stone-50 border p-3"><strong>Uso corretto</strong><br />Le note interne restano nel CRM; al lead si invia solo un messaggio utile e leggero.</div>
      </div>
    </div>
  </div>
</section>

  {section === 'dashboard'"'''
if ui_marker not in text:
    raise SystemExit('Punto di inserimento UI rapido non trovato')
text = text.replace(ui_marker, quick_ui, 1)

path.write_text(text)
print('OK: inserimento rapido lead/clienti aggiunto')
