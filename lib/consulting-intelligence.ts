export type SourceKey = 'ubroker' | 'pef_power' | 'blotix' | 'closer' | 'ai_free'

export type PublicReference = {
  key: SourceKey
  name: string
  url: string
  verifiedPublicCounts: Record<string, number | string>
  safeUse: string
  caution: string
}

export type ConsultingContact = {
  first_name?: string
  last_name?: string
  name?: string
  company?: string
  role?: string
  email?: string
  phone?: string
  website?: string
  city?: string
  notes?: string
  tags?: string[]
  trust_level?: number
  interest_level?: number
  potential_value?: number
  annual_energy_cost?: number
  expected_energy_saving_pct?: number
  annual_service_cost?: number
  paid_share_capital?: number
  real_estate_value?: number
  inventory_value?: number
  equipment_value?: number
  receivables_value?: number
  cash_value?: number
  brand_value?: number
  annual_ebitda?: number
  preferred_energy_path?: string
  research_summary?: string
  public_sources?: string
  probable_needs?: string
  recommended_questions?: string
  recommended_path?: string
  personalization_hook?: string
  outreach_stage?: string
  confidence_score?: number
}

export const PUBLIC_REFERENCES: PublicReference[] = [
  {
    key: 'ubroker',
    name: 'uBroker',
    url: 'https://ubroker.it/',
    verifiedPublicCounts: {
      main_public_site: 1,
      pricing_plans_publicly_visible: 'da verificare sul sito ufficiale al momento della proposta',
      use_in_crm: 'percorso energia alternativo o comparativo, non promessa di risparmio garantito',
    },
    safeUse: 'Usare uBroker come fonte pubblica da consultare quando il lead ha costi energia rilevanti e chiede alternative commerciali.',
    caution: 'Non inserire numeri commerciali non verificati in tempo reale; registrare sempre data, URL e screenshot o nota fonte.',
  },
  {
    key: 'pef_power',
    name: 'PEF Power',
    url: 'https://www.pefpower.it/',
    verifiedPublicCounts: {
      main_public_site: 1,
      faq_or_support_public_pages: 1,
      use_in_crm: 'percorso energia da confrontare con costi storici e bollette del cliente',
    },
    safeUse: 'Usare PEF Power nel CRM come riferimento energia da analizzare con dati del cliente, non come preventivo automatico.',
    caution: 'Le condizioni operative cambiano: la UI deve chiedere costo annuo energia e percentuale stimata, non fissare risparmi predefiniti.',
  },
  {
    key: 'blotix',
    name: 'Blotix',
    url: 'https://blotix.com/',
    verifiedPublicCounts: {
      main_public_site: 1,
      tokenization_reference: 'presente come area da qualificare, numeri economici da confermare contrattualmente',
      default_model_rate_pct: 2.5,
    },
    safeUse: 'Usare Blotix come ipotesi di valorizzazione/tokenizzazione con modello prudenziale modificabile.',
    caution: 'Il 2,5% annuo è solo parametro di simulazione modificabile: non va presentato come rendimento certo o promessa finanziaria.',
  },
  {
    key: 'closer',
    name: 'Strategie Closer',
    url: 'manuale interno / script consulenziale',
    verifiedPublicCounts: {
      communication_steps: 6,
      required_principles: 'diagnosi, domande, qualificazione, proposta morbida, call/demo, follow-up',
    },
    safeUse: 'Convertire i dati pubblici in domande e messaggi prudenti, evitando spam e promesse premature.',
    caution: 'Non inviare automaticamente messaggi: preparare bozze e richiedere conferma umana prima dell’invio.',
  },
  {
    key: 'ai_free',
    name: 'AI gratuita/configurabile',
    url: 'http://localhost:11434 oppure provider OpenAI-compatible configurato',
    verifiedPublicCounts: {
      free_local_options: 'Ollama / LM Studio se installati dall’utente',
      paid_optional_options: 'Anthropic/OpenAI se sono presenti chiavi API',
    },
    safeUse: 'Il CRM deve funzionare sempre con fallback rule-based gratuito; l’AI esterna è opzionale.',
    caution: 'Non inviare dati sensibili a servizi esterni senza consenso e configurazione esplicita.',
  },
]

export function toNumber(value: unknown): number {
  const parsed = typeof value === 'string' ? Number(value.replace(',', '.')) : Number(value || 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function euro(value: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0)
}

export function contactDisplayName(contact: ConsultingContact): string {
  const full = [contact.first_name, contact.last_name].filter(Boolean).join(' ').trim()
  return full || contact.name || contact.company || 'contatto selezionato'
}

export function businessName(contact: ConsultingContact): string {
  return contact.company || contact.name || contactDisplayName(contact)
}

export function valuationSnapshot(contact: ConsultingContact) {
  const assetBase = toNumber(contact.paid_share_capital) + toNumber(contact.real_estate_value) + toNumber(contact.inventory_value) + toNumber(contact.equipment_value) + toNumber(contact.receivables_value) + toNumber(contact.cash_value) + toNumber(contact.brand_value)
  const ebitdaComponent = Math.max(0, toNumber(contact.annual_ebitda) * 3)
  const estimatedCompanyValue = Math.max(0, assetBase + ebitdaComponent)
  const annualTokenYield = estimatedCompanyValue * 0.025
  const annualEnergyCost = toNumber(contact.annual_energy_cost)
  const expectedEnergySaving = annualEnergyCost * (toNumber(contact.expected_energy_saving_pct) / 100)
  const annualServiceCost = toNumber(contact.annual_service_cost)
  const totalCoverage = annualTokenYield + expectedEnergySaving
  return { assetBase, ebitdaComponent, estimatedCompanyValue, annualTokenYield, annualEnergyCost, expectedEnergySaving, annualServiceCost, totalCoverage, surplusOrGap: totalCoverage - annualServiceCost }
}

export function countPublicReferences(contact: ConsultingContact) {
  const sourceLines = String(contact.public_sources || '').split(/\n|;/).map((x) => x.trim()).filter(Boolean)
  const verified = [contact.website, contact.email, contact.phone, contact.city, contact.research_summary, contact.probable_needs, contact.recommended_path, ...sourceLines].filter(Boolean).length
  const missing = [
    !contact.website ? 'sito ufficiale/dominio' : '',
    !contact.phone ? 'telefono pubblico' : '',
    !contact.city ? 'città o sede' : '',
    !contact.public_sources ? 'URL delle fonti consultate' : '',
    !contact.research_summary ? 'sintesi prudente della ricerca' : '',
    !contact.probable_needs ? 'bisogni probabili da validare' : '',
  ].filter(Boolean)
  const score = Math.min(95, Math.max(toNumber(contact.confidence_score), Math.round(verified * 11)))
  return { verified, sourceLines, missing, score, label: score >= 75 ? 'Alta' : score >= 45 ? 'Media' : 'Bassa' }
}

export function buildGuidedResearch(contact: ConsultingContact) {
  const counts = countPublicReferences(contact)
  const name = businessName(contact)
  const city = contact.city || 'città da verificare'
  const queries = Array.from(new Set([
    `${name} ${city} sito ufficiale`,
    `${name} telefono email`,
    `${name} recensioni social`,
    `${name} ragione sociale partita iva`,
  ]))
  const summary = contact.research_summary || `Ricerca guidata per ${name}: usare solo fonti pubbliche coerenti, distinguendo dati certi, indizi e ipotesi commerciali da verificare in call.`
  return { ...counts, queries, summary }
}

export function buildConsultingStudy(contact: ConsultingContact): string {
  const snap = valuationSnapshot(contact)
  const energyPath = contact.preferred_energy_path || 'Da valutare tra uBroker, PEF Power o altra opzione verificata'
  return `Studio su misura per ${businessName(contact)}. Prima fase: diagnosi dei bisogni reali e raccolta dati verificabili. Valore aziendale indicativo ${euro(snap.estimatedCompanyValue)}, simulazione prudenziale 2,5% annuo ${euro(snap.annualTokenYield)}, risparmio energia stimato ${euro(snap.expectedEnergySaving)}, copertura totale ${euro(snap.totalCoverage)} rispetto a servizi per ${euro(snap.annualServiceCost)}. Percorso energia: ${energyPath}. Nota prudenziale: tokenizzazione, energia e AI vanno presentate come ipotesi da verificare, non come garanzie.`
}

export function buildCloserMessage(contact: ConsultingContact, step: 'opener' | 'diagnose' | 'tailored' | 'close' = 'opener') {
  const person = contactDisplayName(contact)
  const company = businessName(contact)
  const hook = contact.personalization_hook || `il modo in cui ${company} si presenta pubblicamente ai clienti`
  const research = buildGuidedResearch(contact)
  const study = buildConsultingStudy(contact)
  if (step === 'diagnose') return `Buongiorno ${person}, prima di proporle qualcosa preferisco farle una domanda concreta. Ho visto ${hook}. Oggi per ${company} pesa di più gestire richieste ripetitive, ridurre costi, alleggerire lo staff, migliorare il primo contatto o valutare energia/servizi?`
  if (step === 'tailored') return `Buongiorno ${person}, sulla base delle sole informazioni pubbliche ho preparato una traccia prudente, da correggere con lei. ${research.summary} ${study} Se vuole, partiamo da 10 minuti di diagnosi e non da un preventivo standard.`
  if (step === 'close') return `Buongiorno ${person}, se ha senso facciamo un passo semplice: mini-demo o esempio scritto su ${company}, basato su 2-3 richieste reali. Se non vede valore, ci fermiamo lì. Preferisce call breve o esempio via email?`
  return `Buongiorno ${person}, le scrivo perché ho notato ${hook}. Per ${company}, qual è oggi la richiesta dei clienti che fa perdere più tempo o rischia di restare senza risposta nel momento giusto? Se ha senso, preparo un esempio molto breve e concreto.`
}

export function ruleBasedAgentAnswer(query: string, contacts: ConsultingContact[] = []) {
  const lower = query.toLowerCase()
  if (contacts.length === 0) return 'Non ho ancora contatti su cui lavorare. Inserisci o importa lead, poi completa fonti pubbliche, bisogni probabili e dati economici prima di generare messaggi.'
  const ranked = contacts.slice().sort((a, b) => (toNumber(b.interest_level) + toNumber(b.trust_level) + toNumber(b.potential_value) / 1000) - (toNumber(a.interest_level) + toNumber(a.trust_level) + toNumber(a.potential_value) / 1000))
  const top = ranked[0]
  if (lower.includes('studio') || lower.includes('energia') || lower.includes('token')) return buildConsultingStudy(top)
  if (lower.includes('messaggio') || lower.includes('closer') || lower.includes('whatsapp')) return buildCloserMessage(top, 'diagnose')
  if (lower.includes('font') || lower.includes('contegg')) {
    const c = buildGuidedResearch(top)
    return `Per ${businessName(top)} risultano ${c.verified} elementi pubblici/CRM valorizzati, confidenza ${c.label} (${c.score}/100). Mancano: ${c.missing.join(', ') || 'nessun campo essenziale'}. Fonti quadro: ${PUBLIC_REFERENCES.map((r) => r.name).join(', ')}.`
  }
  return `Priorità consigliata: ${businessName(top)}. Completa ricerca guidata, poi usa una domanda diagnostica. ${buildGuidedResearch(top).summary}`
}
