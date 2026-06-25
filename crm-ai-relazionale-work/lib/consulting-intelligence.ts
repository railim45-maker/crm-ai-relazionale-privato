export type SourceKey = 'ubroker' | 'pef_power' | 'blotix' | 'closer' | 'ai_free'

export type PublicReference = {
  key: SourceKey
  name: string
  url: string
  verifiedPublicCounts: Record<string, number | string>
  safeUse: string
  caution: string
}


export type ProfessionalCloserStep = 'opener' | 'diagnose' | 'qualify' | 'tailored' | 'position' | 'appointment' | 'close' | 'follow_up' | 'objection'

export type ProfessionalCloserOptions = {
  step?: ProfessionalCloserStep | 'auto'
  tone?: 'Cordiale' | 'Soft' | 'Consulenziale' | 'Diretto gentile' | string
  intent?: string
  objection?: string
  lastReply?: string
}

export type ProfessionalCloserPlaybook = {
  step: ProfessionalCloserStep
  stageLabel: string
  principle: string
  nextMove: string
  followUpDays: number
  suggestedStage: string
  message: string
  whatsapp: string
  appointmentProposal: string
  objectionResponse: string
  internalNote: string
  checklist: string[]
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


const PROFESSIONAL_CLOSER_STAGES: Record<ProfessionalCloserStep, { label: string; principle: string; nextMove: string; followUpDays: number; suggestedStage: string }> = {
  opener: {
    label: 'Primo contatto soft',
    principle: 'Aprire una relazione con un dettaglio specifico e una domanda semplice, senza proporre subito una soluzione.',
    nextMove: 'Inviare un messaggio breve, attendere una risposta reale e non sovraccaricare il lead di informazioni.',
    followUpDays: 3,
    suggestedStage: 'Primo invio',
  },
  diagnose: {
    label: 'Diagnosi del bisogno',
    principle: 'Capire dove il lead perde tempo, margine o continuità prima di parlare di prodotto.',
    nextMove: 'Fare una domanda concreta sul processo più ripetitivo o sul collo di bottiglia attuale.',
    followUpDays: 2,
    suggestedStage: 'Risposta ricevuta',
  },
  qualify: {
    label: 'Qualificazione commerciale',
    principle: 'Verificare frequenza, urgenza, canale, decisore e impatto economico del problema.',
    nextMove: 'Chiedere tre informazioni leggere e trasformare la risposta in un prossimo passo misurabile.',
    followUpDays: 2,
    suggestedStage: 'Risposta ricevuta',
  },
  tailored: {
    label: 'Valore su misura',
    principle: 'Mostrare comprensione del contesto e proporre un esempio pratico, non un preventivo generico.',
    nextMove: 'Preparare un esempio testuale o una mini-demo basata su 2-3 richieste tipiche del lead.',
    followUpDays: 3,
    suggestedStage: 'Video da preparare',
  },
  position: {
    label: 'Posizionamento soluzione',
    principle: 'Collegare il problema emerso a un beneficio operativo concreto, mantenendo controllo umano e zero pressione.',
    nextMove: 'Spiegare il risultato atteso in una frase e chiedere se il lead vuole vedere un caso pratico.',
    followUpDays: 3,
    suggestedStage: 'Follow-up 1',
  },
  appointment: {
    label: 'Appuntamento guidato',
    principle: 'Portare il lead a una micro-decisione reversibile: call breve o esempio scritto.',
    nextMove: 'Proporre due opzioni semplici e lasciare scelta al lead, evitando urgenze artificiali.',
    followUpDays: 1,
    suggestedStage: 'Demo richiesta',
  },
  close: {
    label: 'Closing morbido',
    principle: 'Chiedere il prossimo passo solo dopo aver chiarito valore, rischio percepito e semplicità di partenza.',
    nextMove: 'Confermare il problema, proporre un test piccolo e fissare data o modalità del confronto.',
    followUpDays: 1,
    suggestedStage: 'Demo richiesta',
  },
  follow_up: {
    label: 'Follow-up non invasivo',
    principle: 'Riprendere il filo dando valore o semplificando la risposta, senza sensi di colpa e senza pressione.',
    nextMove: 'Inviare una sola frase utile più una domanda a risposta facile.',
    followUpDays: 4,
    suggestedStage: 'Follow-up 1',
  },
  objection: {
    label: 'Gestione obiezione',
    principle: 'Accogliere il dubbio, togliere pressione e proporre un passo piccolo per ridurre rischio e incertezza.',
    nextMove: 'Rispondere con empatia, chiarire il punto critico e offrire esempio o call breve senza impegno.',
    followUpDays: 2,
    suggestedStage: 'Risposta ricevuta',
  },
}

function firstMeaningfulLine(value?: string) {
  return String(value || '').split(/\n|;/).map((line) => line.trim()).filter(Boolean)[0] || ''
}

function inferObjectionKind(text?: string) {
  const lower = String(text || '').toLowerCase()
  if (/(cost|prezz|budget|caro|troppo|investimento)/.test(lower)) return 'price'
  if (/(non.*tempo|ora|adesso|periodo|rimand|più avanti|non è il momento)/.test(lower)) return 'timing'
  if (/(già|fornitore|internamente|abbiamo già|ci pensa)/.test(lower)) return 'already'
  if (/(dubbi|fid|sicurezza|privacy|robot|automat)/.test(lower)) return 'trust'
  if (/(non interessa|non ci serve|no grazie)/.test(lower)) return 'no_interest'
  return 'generic'
}

export function inferProfessionalCloserStep(contact: ConsultingContact, options: ProfessionalCloserOptions = {}): ProfessionalCloserStep {
  if (options.step && options.step !== 'auto') return options.step as ProfessionalCloserStep
  if (options.objection || options.lastReply) {
    const text = `${options.objection || ''} ${options.lastReply || ''}`.trim()
    if (/(cost|prezz|budget|caro|tempo|rimand|dubbi|non interessa|non ora|già|fornitore)/i.test(text)) return 'objection'
  }
  const stage = String(contact.outreach_stage || '').toLowerCase()
  if (stage.includes('demo')) return 'appointment'
  if (stage.includes('risposta')) return 'diagnose'
  if (stage.includes('follow')) return 'follow_up'
  if (stage.includes('video')) return 'tailored'
  if (stage.includes('primo')) return 'diagnose'
  if (stage.includes('ricerca')) return 'opener'
  return 'opener'
}

export function buildProfessionalCloserPlaybook(contact: ConsultingContact, options: ProfessionalCloserOptions = {}): ProfessionalCloserPlaybook {
  const step = inferProfessionalCloserStep(contact, options)
  const meta = PROFESSIONAL_CLOSER_STAGES[step]
  const person = contactDisplayName(contact)
  const company = businessName(contact)
  const hook = contact.personalization_hook || `il modo in cui ${company} gestisce il primo contatto con clienti e richieste`
  const likelyNeed = firstMeaningfulLine(contact.probable_needs) || 'capire quali richieste ripetitive o passaggi commerciali assorbono più tempo'
  const path = firstMeaningfulLine(contact.recommended_path) || 'partire da una mini-diagnosi e poi mostrare un esempio pratico solo se emerge valore'
  const questions = String(contact.recommended_questions || '').split(/\n|;/).map((x) => x.trim()).filter(Boolean)
  const diagnosticQuestion = questions[0] || `per ${company}, quale richiesta dei clienti vi fa perdere più tempo o rischia di restare senza risposta nel momento giusto?`
  const tone = options.tone || 'Soft'
  const objectionKind = inferObjectionKind(`${options.objection || ''} ${options.lastReply || ''}`)
  const objectionMap: Record<string, string> = {
    price: `Capisco perfettamente il tema del costo. Infatti non partirei da un impegno: prima verificherei se esiste un passaggio che oggi fa perdere tempo o opportunità. Se il beneficio non è chiaro, ci fermiamo lì.`,
    timing: `Ha senso, non voglio aggiungere pressione in un momento pieno. Le proporrei solo un passaggio leggero: mi manda il punto che oggi vi pesa di più e le preparo un esempio scritto, così lo valuta quando ha spazio.`,
    already: `Ottimo, se avete già una gestione interna meglio ancora. Il mio punto non è sostituirla, ma capire se c’è un piccolo collo di bottiglia ripetitivo che si può alleggerire lasciando controllo a voi.`,
    trust: `È un dubbio corretto. Per questo lavorerei prima su un esempio limitato e controllabile, senza dati sensibili e senza automatismi verso il cliente finché non siete voi a validare il tono.`,
    no_interest: `La ringrazio, nessun problema. Le lascio solo questa domanda per il futuro: se un giorno volesse alleggerire una parte ripetitiva del primo contatto, quale sarebbe la prima da guardare?`,
    generic: `La capisco. Prima di insistere preferisco capire il punto: il dubbio riguarda priorità, costo, fiducia nello strumento o mancanza di tempo? In base a quello le rispondo in modo preciso, senza forzare.`
  }

  const opener = `Buongiorno ${person}, le scrivo perché ho notato ${hook}. Le faccio solo una domanda pratica: ${diagnosticQuestion} Se ha senso, posso prepararle un esempio molto breve e concreto, senza impegno.`
  const diagnose = `Buongiorno ${person}, prima di proporle qualsiasi cosa preferisco capire bene il contesto. Oggi per ${company} pesa di più gestire richieste ripetitive, rispondere nei momenti di picco, fare follow-up o qualificare meglio i contatti? Mi basta una risposta breve: poi le dico se vedo un margine reale oppure no.`
  const qualify = `Buongiorno ${person}, per capire se posso esserle utile le chiederei tre cose rapide: da quale canale arrivano più richieste, quali si ripetono spesso e quale passaggio vorrebbe alleggerire senza perdere controllo umano. Da lì preparo un esempio pratico, non un preventivo standard.`
  const tailored = `Buongiorno ${person}, per ${company} non partirei da una proposta preconfezionata. Il punto utile sembra questo: ${likelyNeed}. Il percorso più sensato è ${path}. Se vuole, preparo un esempio su 2-3 richieste tipiche e lo valuta con calma.`
  const position = `Buongiorno ${person}, l’idea non è mettere distanza tra voi e i clienti. È il contrario: ordinare il primo contatto, filtrare ciò che è ripetitivo e lasciare allo staff ciò che richiede attenzione umana. Se le torna, le mostro un esempio concreto su ${company}.`
  const appointment = `Buongiorno ${person}, se per lei ha senso farei un passo molto semplice: 10 minuti di call oppure un esempio scritto su ${company}. Così vede subito se c’è valore; se non lo vede, ci fermiamo lì senza impegno. Quale delle due opzioni preferisce?`
  const close = `Buongiorno ${person}, da quello che abbiamo raccolto il punto da verificare è ${likelyNeed}. Le propongo una prova piccola e controllata: definiamo insieme un caso reale, preparo l’esempio e poi decidiamo se procedere. Ha più senso sentirci domani o ricevere prima una bozza scritta?`
  const followUp = `Buongiorno ${person}, mi ricollego al messaggio precedente senza urgenza. Per semplificarle la risposta: se oggi dovesse scegliere un solo punto da alleggerire nel primo contatto di ${company}, quale sarebbe? Da lì capisco se vale la pena prepararle un esempio o se lasciamo perdere.`
  const objectionResponse = objectionMap[objectionKind]
  const messageByStep: Record<ProfessionalCloserStep, string> = { opener, diagnose, qualify, tailored, position, appointment, close, follow_up: followUp, objection: objectionResponse }
  const message = messageByStep[step]
  const whatsapp = message.replace(/\s+/g, ' ').trim()
  const appointmentProposal = `Opzione A: call di 10 minuti per capire il caso reale. Opzione B: esempio scritto su ${company} da valutare senza impegno.`
  const checklist = [
    'Usare un solo gancio specifico e verificabile.',
    'Fare una domanda concreta prima della proposta.',
    'Non citare fonti interne, conteggi o simulazioni economiche nel messaggio al lead.',
    'Registrare risposta, stadio, prossimo follow-up e obiezione nel CRM.',
  ]
  const internalNote = `Step ${meta.label}. Tono richiesto: ${tone}. Intento: ${options.intent || meta.nextMove}. Bisogno da verificare: ${likelyNeed}. Prossimo follow-up consigliato tra ${meta.followUpDays} giorni.`
  return { step, stageLabel: meta.label, principle: meta.principle, nextMove: meta.nextMove, followUpDays: meta.followUpDays, suggestedStage: meta.suggestedStage, message, whatsapp, appointmentProposal, objectionResponse, internalNote, checklist }
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
  return `Studio interno su misura per ${businessName(contact)}. Prima fase: diagnosi dei bisogni reali e raccolta dati verificabili. Valore aziendale indicativo ${euro(snap.estimatedCompanyValue)}, simulazione prudenziale 2,5% annuo ${euro(snap.annualTokenYield)}, risparmio energia stimato ${euro(snap.expectedEnergySaving)}, copertura totale ${euro(snap.totalCoverage)} rispetto a servizi per ${euro(snap.annualServiceCost)}. Percorso energia: ${energyPath}. Nota interna: tokenizzazione, energia e AI vanno presentate come ipotesi da verificare, non come garanzie. Questo testo è per il consulente, non per l’email al lead.`
}

export function buildLeadValueNote(contact: ConsultingContact): string {
  const company = businessName(contact)
  const needs = contact.probable_needs?.trim()
  const path = contact.recommended_path?.trim()
  const questions = contact.recommended_questions?.trim()

  const valueParts = [
    needs ? `ho individuato alcuni punti che potrebbero incidere sull’organizzazione: ${needs}` : `possiamo individuare insieme i passaggi operativi che oggi assorbono più tempo o creano più dispersione`,
    path ? `da lì si può costruire un percorso semplice: ${path}` : `l’obiettivo è capire se una piccola automazione, una revisione del primo contatto o una migliore gestione dei servizi può portare beneficio concreto`,
    questions ? `mi preparerei partendo da queste domande: ${questions}` : `prima di qualsiasi proposta, partirei da poche domande pratiche sui processi reali`,
  ]

  return `Per ${company}, ${valueParts.join('. ')}.`
}

export function buildCloserMessage(contact: ConsultingContact, step: ProfessionalCloserStep = 'opener') {
  return buildProfessionalCloserPlaybook(contact, { step }).message
}

export function ruleBasedAgentAnswer(query: string, contacts: ConsultingContact[] = []) {
  const lower = query.toLowerCase()
  if (contacts.length === 0) return 'Non ho ancora contatti su cui lavorare. Inserisci o importa lead, poi completa fonti pubbliche, bisogni probabili e dati economici prima di generare messaggi.'
  const ranked = contacts.slice().sort((a, b) => (toNumber(b.interest_level) + toNumber(b.trust_level) + toNumber(b.potential_value) / 1000) - (toNumber(a.interest_level) + toNumber(a.trust_level) + toNumber(a.potential_value) / 1000))
  const top = ranked[0]
  if (lower.includes('studio') || lower.includes('energia') || lower.includes('token')) return buildConsultingStudy(top)
  if (lower.includes('obiez')) return buildProfessionalCloserPlaybook(top, { step: 'objection', lastReply: query }).message
  if (lower.includes('appuntament') || lower.includes('call') || lower.includes('demo') || lower.includes('chiud')) return buildProfessionalCloserPlaybook(top, { step: 'appointment' }).message
  if (lower.includes('follow')) return buildProfessionalCloserPlaybook(top, { step: 'follow_up' }).message
  if (lower.includes('messaggio') || lower.includes('closer') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('mail')) return buildCloserMessage(top, lower.includes('email') || lower.includes('mail') ? 'tailored' : 'diagnose')
  if (lower.includes('font') || lower.includes('contegg')) {
    const c = buildGuidedResearch(top)
    return `Per ${businessName(top)} risultano ${c.verified} elementi pubblici/CRM valorizzati, confidenza ${c.label} (${c.score}/100). Mancano: ${c.missing.join(', ') || 'nessun campo essenziale'}. Fonti quadro: ${PUBLIC_REFERENCES.map((r) => r.name).join(', ')}.`
  }
  return `Priorità consigliata: ${businessName(top)}. La ricerca guidata resta materiale interno CRM; verso il lead usa solo una domanda diagnostica o un messaggio orientato al valore. ${buildLeadValueNote(top)}`
}
