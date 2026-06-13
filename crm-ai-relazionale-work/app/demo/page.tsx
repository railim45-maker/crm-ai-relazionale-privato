'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Bot, Building2, CheckSquare, ChevronRight, ClipboardList, Copy, Database, Download, Mail, MessageSquareText, Pencil, Phone, Plus, Save, Search, Send, ShieldCheck, Star, Trash2, TrendingUp, Upload, UserPlus, Users } from 'lucide-react'

type ContactStatus = 'Lead' | 'Prospect' | 'Interessato' | 'Cliente' | 'Partner'
type Priority = 'Alta' | 'Media' | 'Bassa'
type PriorityLevel = 'A' | 'B' | 'C'
type OutreachStage = 'Da qualificare' | 'Video da preparare' | 'Primo invio' | 'Follow-up 1' | 'Risposta ricevuta' | 'Demo richiesta' | 'Non interessato' | 'Sospeso'
type Section = 'dashboard' | 'contacts' | 'pipeline' | 'conversations' | 'mailing' | 'agent'
type Channel = 'Email' | 'Telefono' | 'WhatsApp' | 'LinkedIn' | 'Video' | 'Nota interna'
type MailingPriorityFilter = 'Tutte' | PriorityLevel
type MailingStageFilter = 'Tutti' | OutreachStage
type MailingSeparator = 'virgola' | 'punto e virgola'

type Contact = {
  id: string
  name: string
  company: string
  role: string
  email: string
  phone: string
  status: ContactStatus
  interest: number
  trust: number
  value: number
  lastContact: string
  topics: string[]
  nextAction: string
  notes: string
  createdAt: string
  updatedAt: string
  category?: string
  subcategory?: string
  city?: string
  address?: string
  website?: string
  generalEmail?: string
  decisionMakerName?: string
  decisionMakerRole?: string
  decisionMakerEmail?: string
  estimatedSize?: string
  priceRange?: string
  rating?: string
  reviews?: string
  services?: string
  priorityLevel?: PriorityLevel
  messageAngle?: string
  personalizationHook?: string
  outreachStage?: OutreachStage
  sourceBatch?: string
}

type Task = {
  id: string
  title: string
  contactId: string
  priority: Priority
  due: string
  completed: boolean
  createdAt: string
}

type ConversationAnalysis = {
  score: number
  topic: string
  summary: string
  needs: string[]
  action: string
  sentiment: 'Positivo' | 'Neutro' | 'Critico'
}

type ConversationRecord = {
  id: string
  contactId: string
  text: string
  channel?: Channel
  stage?: OutreachStage
  analysis: ConversationAnalysis
  createdAt: string
}

type CrmProfile = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

type StoredCrmData = { contacts?: Contact[]; tasks?: Task[]; conversations?: ConversationRecord[] }

type ContactDraft = Omit<Contact, 'id' | 'topics' | 'createdAt' | 'updatedAt' | 'lastContact'> & { topicsText: string }
type SeedLead = Pick<Contact, 'name' | 'category' | 'subcategory' | 'phone' | 'rating' | 'reviews' | 'priorityLevel' | 'messageAngle' | 'personalizationHook' | 'services'>

const LEGACY_STORAGE_KEY = 'relazione-crm-personale-v1'
const PROFILE_LIST_KEY = 'relazione-crm-profili-v1'
const ACTIVE_PROFILE_KEY = 'relazione-crm-profilo-attivo-v1'

const statuses: ContactStatus[] = ['Lead', 'Prospect', 'Interessato', 'Cliente', 'Partner']
const priorityLevels: PriorityLevel[] = ['A', 'B', 'C']
const outreachStages: OutreachStage[] = ['Da qualificare', 'Video da preparare', 'Primo invio', 'Follow-up 1', 'Risposta ricevuta', 'Demo richiesta', 'Non interessato', 'Sospeso']
const channels: Channel[] = ['Email', 'Telefono', 'WhatsApp', 'LinkedIn', 'Video', 'Nota interna']

const emptyDraft: ContactDraft = {
  name: '',
  company: '',
  role: '',
  email: '',
  phone: '',
  status: 'Lead',
  interest: 6,
  trust: 5,
  value: 0,
  topicsText: '',
  nextAction: '',
  notes: '',
  category: '',
  subcategory: '',
  city: 'Milano',
  address: '',
  website: '',
  generalEmail: '',
  decisionMakerName: '',
  decisionMakerRole: '',
  decisionMakerEmail: '',
  estimatedSize: '',
  priceRange: '',
  rating: '',
  reviews: '',
  services: '',
  priorityLevel: 'B',
  messageAngle: '',
  personalizationHook: '',
  outreachStage: 'Da qualificare',
  sourceBatch: '',
}

const milanoBatch1: SeedLead[] = [
  { name: 'Casa Brera, a Luxury Collection Hotel, Milan', category: 'Hotel luxury', subcategory: 'Design / ospitalità alto livello', phone: '+39 02 305430', rating: '4.4', reviews: '262 recensioni', priorityLevel: 'A', services: 'Ospitalità premium, accoglienza, concierge', messageAngle: 'Proteggere l’attenzione all’ospite dal rumore operativo delle chiamate.', personalizationHook: 'La vostra accoglienza è costruita sull’esperienza dell’ospite, proprio dove ogni interruzione telefonica può avere un impatto.' },
  { name: 'Palazzo Parigi Hotel & Grand Spa Milano', category: 'Luxury hotel', subcategory: '5 stelle / spa / servizi premium', phone: '+39 02 625625', rating: '4.7', reviews: '1.830 recensioni', priorityLevel: 'A', services: 'Spa, servizi premium, ospitalità 5 stelle', messageAngle: 'Rendere impeccabile il primo contatto senza appesantire reception e concierge.', personalizationHook: 'Una struttura con molti servizi e richieste richiede una gestione impeccabile del primo contatto.' },
  { name: 'Four Seasons Hotel Milano', category: 'Hotel luxury', subcategory: 'Clientela internazionale', phone: '+39 02 77088', rating: '4.7', reviews: '2.432 recensioni', priorityLevel: 'A', services: 'Ospitalità internazionale, concierge, alta gamma', messageAngle: 'Trattare ogni chiamata come parte dell’esperienza di marca.', personalizationHook: 'Quando l’ospitalità è il vostro marchio, anche una chiamata è parte dell’esperienza.' },
  { name: 'Château Monfort', category: 'Boutique hotel 5★', subcategory: 'Esperienza / design / eventi', phone: '+39 02 776761', rating: '4.7', reviews: '1.379 recensioni', priorityLevel: 'A', services: 'Eventi, design hotel, ospitalità boutique', messageAngle: 'Evitare che una telefonata interrompa un’esperienza curata nei dettagli.', personalizationHook: 'Un’esperienza così curata non dovrebbe essere interrotta da una telefonata nel momento sbagliato.' },
  { name: 'Seta by Antonio Guida', category: 'Fine dining', subcategory: 'Alta cucina', phone: '+39 02 87318897', rating: '4.6', reviews: '659 recensioni', priorityLevel: 'A', services: 'Fine dining, cucina d’autore, servizio di sala', messageAngle: 'Proteggere l’attenzione del personale e la continuità dell’esperienza gastronomica.', personalizationHook: 'Nel fine dining l’attenzione al dettaglio è tutto: anche una telefonata può interrompere quel momento.' },
  { name: 'Ristorante Berton', category: 'Fine dining', subcategory: 'Alta gastronomia', phone: '+39 02 67075801', rating: '4.6', reviews: '697 recensioni', priorityLevel: 'A', services: 'Alta gastronomia, servizio di sala, prenotazioni', messageAngle: 'Risolvere il paradosso tra accoglienza in sala e telefono che interrompe.', personalizationHook: 'Quando il personale racconta un piatto o segue un ospite, il telefono crea un vero paradosso dell’ospitalità.' },
  { name: 'Sadler Restaurant', category: 'Ristorante gourmet', subcategory: 'Alta cucina', phone: '+39 02 58104451', rating: '4.6', reviews: '706 recensioni', priorityLevel: 'B', services: 'Ristorante gourmet, prenotazioni, servizio al tavolo', messageAngle: 'Mantenere continuità di attenzione verso il cliente anche nei momenti di picco.', personalizationHook: 'Un’esperienza gastronomica di livello vive di attenzione continua verso il cliente.' },
  { name: 'Excelsior Hotel Gallia, a Luxury Collection Hotel, Milan', category: 'Grande hotel luxury', subcategory: 'Alto volume di chiamate', phone: '+39 02 67851', rating: '4.7', reviews: '2.878 recensioni', priorityLevel: 'B', services: 'Grande hotel luxury, reception, concierge, eventi', messageAngle: 'Liberare tempo alla reception quando i flussi di chiamate sono elevati.', personalizationHook: 'Una reception che gestisce molti flussi potrebbe dedicare più tempo agli ospiti presenti.' },
]

function profileStorageKey(profileId: string) { return `${LEGACY_STORAGE_KEY}:${profileId}` }
function nowIso() { return new Date().toISOString() }
function today() { return new Date().toISOString().slice(0, 10) }
function id(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
function euro(value: number) { return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0) }
function fmtDate(value: string) { if (!value) return 'Non impostata'; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat('it-IT').format(d) }
function topics(value: string) { return value.split(',').map((item) => item.trim()).filter(Boolean) }
function statusClass(status: ContactStatus) { return ({ Lead: 'bg-blue-50 text-blue-700 border-blue-200', Prospect: 'bg-amber-50 text-amber-700 border-amber-200', Interessato: 'bg-purple-50 text-purple-700 border-purple-200', Cliente: 'bg-green-50 text-green-700 border-green-200', Partner: 'bg-teal-50 text-teal-700 border-teal-200' })[status] }
function priorityClass(priority: Priority) { return ({ Alta: 'bg-red-50 text-red-700 border-red-200', Media: 'bg-amber-50 text-amber-700 border-amber-200', Bassa: 'bg-stone-50 text-stone-700 border-stone-200' })[priority] }
function priorityLevelClass(priority?: PriorityLevel) { return ({ A: 'bg-red-50 text-red-700 border-red-200', B: 'bg-amber-50 text-amber-700 border-amber-200', C: 'bg-stone-50 text-stone-700 border-stone-200' })[priority || 'B'] }
function stageClass(stage?: OutreachStage) { return ({ 'Da qualificare': 'bg-slate-50 text-slate-700 border-slate-200', 'Video da preparare': 'bg-blue-50 text-blue-700 border-blue-200', 'Primo invio': 'bg-indigo-50 text-indigo-700 border-indigo-200', 'Follow-up 1': 'bg-amber-50 text-amber-700 border-amber-200', 'Risposta ricevuta': 'bg-purple-50 text-purple-700 border-purple-200', 'Demo richiesta': 'bg-green-50 text-green-700 border-green-200', 'Non interessato': 'bg-red-50 text-red-700 border-red-200', Sospeso: 'bg-stone-50 text-stone-700 border-stone-200' })[stage || 'Da qualificare'] }
function normalizeContact(contact: Contact): Contact { return { ...contact, company: contact.company || contact.name, city: contact.city || 'Milano', priorityLevel: contact.priorityLevel || 'B', outreachStage: contact.outreachStage || 'Da qualificare', generalEmail: contact.generalEmail || contact.email || '', sourceBatch: contact.sourceBatch || '' } }

function analyzeConversation(text: string, contact?: Contact): ConversationAnalysis {
  const lower = text.toLowerCase()
  const urgent = ['urgente', 'subito', 'oggi', 'questa settimana', 'priorità', 'richiamare', 'follow'].filter((x) => lower.includes(x)).length
  const interest = ['interess', 'demo', 'proposta', 'preventivo', 'call', 'approfondire', 'mandami', 'video', 'prenotazioni'].filter((x) => lower.includes(x)).length
  const risk = ['non sono convinto', 'costa', 'troppo', 'dubbi', 'problema', 'rimandiamo', 'non ora', 'non interessa'].filter((x) => lower.includes(x)).length
  const score = Math.max(20, Math.min(98, Math.round((contact ? contact.interest * 7 + contact.trust * 3 : 55) + urgent * 8 + interest * 6 - risk * 10 + (contact?.priorityLevel === 'A' ? 6 : 0))))
  const topic = lower.includes('video') ? 'Video personalizzato' : lower.includes('prenot') || lower.includes('telefono') || lower.includes('chiam') ? 'Gestione chiamate e prenotazioni' : lower.includes('hotel') || lower.includes('ospite') || lower.includes('reception') ? 'Esperienza ospite' : lower.includes('ristor') || lower.includes('sala') ? 'Esperienza in sala' : 'Relazione commerciale'
  const sentiment = risk > interest ? 'Critico' : interest > 0 || urgent > 0 ? 'Positivo' : 'Neutro'
  const action = score >= 85 ? `Contattare ${contact?.name || 'il contatto'} oggi con messaggio personalizzato e proposta di call` : score >= 65 ? 'Inviare riepilogo personalizzato e programmare follow-up entro 3 giorni' : 'Completare qualificazione e preparare un messaggio più specifico prima dell’invio'
  return {
    score,
    topic,
    sentiment,
    action,
    needs: [
      contact?.personalizationHook ? `Usare il gancio: ${contact.personalizationHook}` : 'Chiarire gancio di personalizzazione prima del contatto',
      urgent > 0 ? 'Gestire rapidamente il prossimo passo' : 'Mantenere continuità senza automatismi invasivi',
      risk > 0 ? 'Gestire obiezioni e percezione del valore' : 'Trasformare interesse in azione tracciabile',
    ],
    summary: `La comunicazione con ${contact?.name || 'questo contatto'} mostra opportunità ${score >= 85 ? 'alta' : score >= 65 ? 'media' : 'iniziale'} sul tema ${topic.toLowerCase()}. ${contact?.outreachStage ? `Stadio attuale: ${contact.outreachStage}.` : 'Stadio da definire.'}`,
  }
}

function agentAnswer(question: string, contacts: Contact[], tasks: Task[], conversations: ConversationRecord[]) {
  const lower = question.toLowerCase()
  const openTasks = tasks.filter((task) => !task.completed)
  const hot = contacts.slice().sort((a, b) => (b.interest + b.trust + b.value / 1000 + (b.priorityLevel === 'A' ? 4 : 0)) - (a.interest + a.trust + a.value / 1000 + (a.priorityLevel === 'A' ? 4 : 0)))
  const pipeline = contacts.reduce((sum, c) => sum + c.value, 0)
  const aList = contacts.filter((c) => c.priorityLevel === 'A')
  const toQualify = contacts.filter((c) => (c.outreachStage || 'Da qualificare') === 'Da qualificare')
  if (contacts.length === 0) return 'Non hai ancora caricato contatti. Parti dal pulsante “Carica Batch Milano 1”, poi completa email, sito e decision maker dei lead A-list.'
  if (lower.includes('oggi') || lower.includes('contattare') || lower.includes('priorità')) return `Oggi partirei da ${hot[0].name}: priorità ${hot[0].priorityLevel || 'B'}, stadio ${hot[0].outreachStage || 'Da qualificare'}, interesse ${hot[0].interest}/10. Prossima azione: ${hot[0].nextAction || hot[0].messageAngle || 'completare qualificazione e preparare messaggio personalizzato'}.${hot[1] ? ` Seconda priorità: ${hot[1].name}.` : ''}`
  if (lower.includes('100') || lower.includes('database')) return `Database attuale: ${contacts.length}/100 contatti. A-list: ${aList.length}. Da qualificare: ${toQualify.length}. Il lavoro corretto è completare i campi mancanti dei lead A prima di aggiungere troppi nominativi.`
  if (lower.includes('task') || lower.includes('follow')) return openTasks.length === 0 ? 'Non ci sono task aperti. Crea almeno un prossimo passo per ogni contatto A o B.' : `Hai ${openTasks.length} task aperti: ${openTasks.slice(0, 4).map((t) => `${t.title} (${t.priority}, ${fmtDate(t.due)})`).join('; ')}.`
  if (lower.includes('caldi') || lower.includes('lead')) return `I lead più caldi sono: ${hot.slice(0, 5).map((c) => `${c.name} · priorità ${c.priorityLevel || 'B'} · ${c.outreachStage || 'Da qualificare'} · interesse ${c.interest}/10`).join('; ')}.`
  if (lower.includes('pipeline') || lower.includes('valore')) return `La pipeline totale stimata è ${euro(pipeline)}. ${statuses.map((s) => `${s}: ${euro(contacts.filter((c) => c.status === s).reduce((sum, c) => sum + c.value, 0))}`).join('; ')}.`
  if (lower.includes('conversazioni') || lower.includes('analisi')) return `Hai archiviato ${conversations.length} comunicazioni. Ultima analisi: ${conversations[0]?.analysis.summary || 'nessuna analisi ancora presente'}`
  return `Sintesi operativa: ${contacts.length}/100 contatti, ${aList.length} A-list, ${openTasks.length} task aperti. La mossa più utile ora è lavorare su ${hot[0].name}: ${hot[0].nextAction || hot[0].messageAngle || 'definisci il prossimo contatto'}.`
}

export default function DemoAppPage() {
  const [section, setSection] = useState<Section>('dashboard')
  const [hydrated, setHydrated] = useState(false)
  const [profiles, setProfiles] = useState<CrmProfile[]>([])
  const [activeProfileId, setActiveProfileId] = useState('')
  const [newProfileName, setNewProfileName] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [conversations, setConversations] = useState<ConversationRecord[]>([])
  const [selectedContactId, setSelectedContactId] = useState('')
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDue, setTaskDue] = useState(today())
  const [taskPriority, setTaskPriority] = useState<Priority>('Media')
  const [conversation, setConversation] = useState('')
  const [communicationChannel, setCommunicationChannel] = useState<Channel>('Email')
  const [communicationStage, setCommunicationStage] = useState<OutreachStage>('Primo invio')
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null)
  const [question, setQuestion] = useState('Chi devo contattare oggi?')
  const [answer, setAnswer] = useState('Carica il primo batch o inserisci i tuoi contatti qualificati: userò quei dati per suggerire priorità, follow-up e prossime azioni.')
  const [search, setSearch] = useState('')
  const [mailingPriority, setMailingPriority] = useState<MailingPriorityFilter>('A')
  const [mailingStage, setMailingStage] = useState<MailingStageFilter>('Tutti')
  const [mailingSeparator, setMailingSeparator] = useState<MailingSeparator>('punto e virgola')
  const [mailingCopied, setMailingCopied] = useState(false)

  function loadProfileData(profileId: string, useLegacyFallback = false) {
    try {
      const stored = window.localStorage.getItem(profileStorageKey(profileId)) || (useLegacyFallback ? window.localStorage.getItem(LEGACY_STORAGE_KEY) : null)
      if (stored) {
        const parsed = JSON.parse(stored) as StoredCrmData
        const nextContacts = Array.isArray(parsed.contacts) ? parsed.contacts.map(normalizeContact) : []
        setContacts(nextContacts)
        setTasks(Array.isArray(parsed.tasks) ? parsed.tasks : [])
        setConversations(Array.isArray(parsed.conversations) ? parsed.conversations : [])
        setSelectedContactId(nextContacts[0]?.id || '')
        return
      }
    } catch { window.localStorage.removeItem(profileStorageKey(profileId)) }
    setContacts([]); setTasks([]); setConversations([]); setSelectedContactId(''); setAnalysis(null)
  }

  useEffect(() => {
    try {
      const savedProfiles = window.localStorage.getItem(PROFILE_LIST_KEY)
      let parsedProfiles = savedProfiles ? JSON.parse(savedProfiles) as CrmProfile[] : []
      if (!Array.isArray(parsedProfiles) || parsedProfiles.length === 0) {
        const timestamp = nowIso()
        parsedProfiles = [{ id: 'profilo-io', name: 'Io', createdAt: timestamp, updatedAt: timestamp }]
        window.localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(parsedProfiles))
      }
      const savedActive = window.localStorage.getItem(ACTIVE_PROFILE_KEY)
      const nextActive = parsedProfiles.find((profile) => profile.id === savedActive)?.id || parsedProfiles[0].id
      setProfiles(parsedProfiles)
      setActiveProfileId(nextActive)
      window.localStorage.setItem(ACTIVE_PROFILE_KEY, nextActive)
      loadProfileData(nextActive, nextActive === parsedProfiles[0].id)
    } catch {
      const timestamp = nowIso()
      const fallback = [{ id: 'profilo-io', name: 'Io', createdAt: timestamp, updatedAt: timestamp }]
      setProfiles(fallback); setActiveProfileId(fallback[0].id); loadProfileData(fallback[0].id, true)
    }
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated && activeProfileId) window.localStorage.setItem(profileStorageKey(activeProfileId), JSON.stringify({ contacts, tasks, conversations })) }, [contacts, tasks, conversations, hydrated, activeProfileId])
  useEffect(() => { if (hydrated) window.localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(profiles)) }, [profiles, hydrated])

  const activeProfile = useMemo(() => profiles.find((profile) => profile.id === activeProfileId), [profiles, activeProfileId])
  const selectedContact = useMemo(() => contacts.find((c) => c.id === selectedContactId) || contacts[0], [contacts, selectedContactId])
  const filteredContacts = useMemo(() => {
    const q = search.toLowerCase().trim()
    return q ? contacts.filter((c) => [c.name, c.company, c.role, c.email, c.phone, c.notes, c.topics.join(' '), c.category, c.subcategory, c.city, c.website, c.decisionMakerName, c.personalizationHook, c.messageAngle, c.outreachStage, c.priorityLevel].join(' ').toLowerCase().includes(q)) : contacts
  }, [contacts, search])
  const openTasks = tasks.filter((t) => !t.completed)
  const metrics = {
    active: contacts.length,
    pipeline: contacts.reduce((sum, c) => sum + c.value, 0),
    tasks: openTasks.length,
    hot: contacts.filter((c) => c.priorityLevel === 'A' || c.interest >= 8 || c.value >= 5000).length,
    aList: contacts.filter((c) => c.priorityLevel === 'A').length,
    qualified: contacts.filter((c) => c.website || c.email || c.generalEmail || c.decisionMakerName || c.decisionMakerEmail).length,
  }
  const suggestion = useMemo(() => agentAnswer('Chi devo contattare oggi?', contacts, tasks, conversations), [contacts, tasks, conversations])
  const contactEmail = (contact: Contact) => (contact.decisionMakerEmail || contact.generalEmail || contact.email || '').trim()
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const mailingContacts = useMemo(() => contacts.filter((contact) => {
    const email = contactEmail(contact)
    if (!isValidEmail(email)) return false
    if (mailingPriority !== 'Tutte' && (contact.priorityLevel || 'B') !== mailingPriority) return false
    if (mailingStage !== 'Tutti' && (contact.outreachStage || 'Da qualificare') !== mailingStage) return false
    return true
  }), [contacts, mailingPriority, mailingStage])
  const mailingEmails = useMemo(() => Array.from(new Set(mailingContacts.map(contactEmail).filter(isValidEmail))), [mailingContacts])
  const mailingText = mailingEmails.join(mailingSeparator === 'virgola' ? ', ' : '; ')
  const excludedEmailCount = contacts.filter((contact) => !isValidEmail(contactEmail(contact))).length


  function resetDraft() { setDraft(emptyDraft); setEditingId(null) }

  function draftFromContact(contact: Contact): ContactDraft {
    return {
      name: contact.name,
      company: contact.company,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      status: contact.status,
      interest: contact.interest,
      trust: contact.trust,
      value: contact.value,
      topicsText: contact.topics.join(', '),
      nextAction: contact.nextAction,
      notes: contact.notes,
      category: contact.category || '',
      subcategory: contact.subcategory || '',
      city: contact.city || 'Milano',
      address: contact.address || '',
      website: contact.website || '',
      generalEmail: contact.generalEmail || contact.email || '',
      decisionMakerName: contact.decisionMakerName || '',
      decisionMakerRole: contact.decisionMakerRole || '',
      decisionMakerEmail: contact.decisionMakerEmail || '',
      estimatedSize: contact.estimatedSize || '',
      priceRange: contact.priceRange || '',
      rating: contact.rating || '',
      reviews: contact.reviews || '',
      services: contact.services || '',
      priorityLevel: contact.priorityLevel || 'B',
      messageAngle: contact.messageAngle || '',
      personalizationHook: contact.personalizationHook || '',
      outreachStage: contact.outreachStage || 'Da qualificare',
      sourceBatch: contact.sourceBatch || '',
    }
  }

  function startEdit(contact: Contact) { setEditingId(contact.id); setSelectedContactId(contact.id); setDraft(draftFromContact(contact)) }

  function contactFromDraft(timestamp: string): Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastContact'> {
    return {
      name: draft.name.trim(),
      company: draft.company.trim() || draft.name.trim(),
      role: draft.role.trim(),
      email: draft.email.trim() || draft.generalEmail?.trim() || '',
      phone: draft.phone.trim(),
      status: draft.status,
      interest: Number(draft.interest),
      trust: Number(draft.trust),
      value: Number(draft.value),
      topics: topics(draft.topicsText),
      nextAction: draft.nextAction.trim(),
      notes: draft.notes.trim(),
      category: draft.category?.trim(),
      subcategory: draft.subcategory?.trim(),
      city: draft.city?.trim() || 'Milano',
      address: draft.address?.trim(),
      website: draft.website?.trim(),
      generalEmail: draft.generalEmail?.trim(),
      decisionMakerName: draft.decisionMakerName?.trim(),
      decisionMakerRole: draft.decisionMakerRole?.trim(),
      decisionMakerEmail: draft.decisionMakerEmail?.trim(),
      estimatedSize: draft.estimatedSize?.trim(),
      priceRange: draft.priceRange?.trim(),
      rating: draft.rating?.trim(),
      reviews: draft.reviews?.trim(),
      services: draft.services?.trim(),
      priorityLevel: draft.priorityLevel || 'B',
      messageAngle: draft.messageAngle?.trim(),
      personalizationHook: draft.personalizationHook?.trim(),
      outreachStage: draft.outreachStage || 'Da qualificare',
      sourceBatch: draft.sourceBatch?.trim(),
    }
  }

  function saveContact() {
    if (!draft.name.trim()) return
    const timestamp = nowIso()
    const base = contactFromDraft(timestamp)
    if (editingId) {
      setContacts((current) => current.map((c) => c.id === editingId ? { ...c, ...base, updatedAt: timestamp } : c))
      resetDraft(); return
    }
    const newContact: Contact = { id: id('contact'), ...base, lastContact: today(), createdAt: timestamp, updatedAt: timestamp }
    setContacts((current) => [newContact, ...current]); setSelectedContactId(newContact.id); resetDraft()
  }

  function importMilanoBatch1() {
    const timestamp = nowIso()
    const existing = new Set(contacts.map((c) => c.name.toLowerCase().trim()))
    const toAdd = milanoBatch1.filter((lead) => !existing.has(lead.name.toLowerCase().trim())).map((lead) => ({
      ...lead,
      id: id('contact'),
      name: lead.name,
      company: lead.name,
      role: lead.category || '',
      email: '',
      phone: lead.phone || '',
      status: 'Lead' as ContactStatus,
      interest: lead.priorityLevel === 'A' ? 8 : 7,
      trust: 5,
      value: lead.priorityLevel === 'A' ? 6000 : 3500,
      lastContact: '',
      topics: ['Hospitality premium', lead.category || '', lead.subcategory || ''].filter(Boolean),
      nextAction: 'Completare sito, email, decision maker e preparare messaggio/video personalizzato.',
      notes: 'Lead importato dal Batch Milano 1. Verificare e completare i campi mancanti prima dell’invio.',
      createdAt: timestamp,
      updatedAt: timestamp,
      city: 'Milano',
      outreachStage: 'Da qualificare' as OutreachStage,
      sourceBatch: 'Milano Batch 1',
    }))
    if (toAdd.length === 0) { window.alert('Il Batch Milano 1 risulta già caricato in questo profilo.'); return }
    setContacts((current) => [...toAdd, ...current])
    setSelectedContactId(toAdd[0]?.id || selectedContactId)
    setTasks((current) => [...toAdd.map((c) => ({ id: id('task'), title: `Qualificare ${c.name}: sito, email e decision maker`, contactId: c.id, priority: c.priorityLevel === 'A' ? 'Alta' as Priority : 'Media' as Priority, due: today(), completed: false, createdAt: timestamp })), ...current])
    setSection('contacts')
    setAnswer(`Ho caricato ${toAdd.length} lead del Batch Milano 1 nel profilo ${activeProfile?.name || 'attivo'}. Ora completa i campi mancanti e porta gli A-list a “Video da preparare”.`)
  }

  function deleteContact(contactId: string) { setContacts((c) => c.filter((x) => x.id !== contactId)); setTasks((t) => t.filter((x) => x.contactId !== contactId)); setConversations((x) => x.filter((r) => r.contactId !== contactId)); if (selectedContactId === contactId) setSelectedContactId(''); if (editingId === contactId) resetDraft() }
  function saveTask() { if (!taskTitle.trim() || !selectedContact) return; setTasks((current) => [{ id: id('task'), title: taskTitle.trim(), contactId: selectedContact.id, priority: taskPriority, due: taskDue, completed: false, createdAt: nowIso() }, ...current]); setTaskTitle(''); setTaskDue(today()); setTaskPriority('Media') }
  function updateContactStage(contactId: string, stage: OutreachStage) { setContacts((current) => current.map((c) => c.id === contactId ? { ...c, outreachStage: stage, updatedAt: nowIso(), nextAction: stage === 'Video da preparare' ? 'Preparare video personalizzato usando il gancio salvato.' : c.nextAction } : c)) }

  function runAnalysis() {
    if (!conversation.trim() || !selectedContact) return
    const result = analyzeConversation(conversation, selectedContact)
    setAnalysis(result)
    setConversations((current) => [{ id: id('conversation'), contactId: selectedContact.id, text: conversation.trim(), channel: communicationChannel, stage: communicationStage, analysis: result, createdAt: nowIso() }, ...current])
    setTasks((current) => [{ id: id('task'), title: result.action, contactId: selectedContact.id, priority: result.score >= 85 ? 'Alta' : result.score >= 65 ? 'Media' : 'Bassa', due: result.score >= 85 ? today() : '', completed: false, createdAt: nowIso() }, ...current])
    setContacts((current) => current.map((c) => c.id === selectedContact.id ? { ...c, interest: Math.max(c.interest, Math.round(result.score / 10)), lastContact: today(), topics: Array.from(new Set([result.topic, ...c.topics])), nextAction: result.action, outreachStage: communicationStage, updatedAt: nowIso() } : c))
    setConversation('')
  }

  function copyMailingList() {
    if (!mailingText) return
    navigator.clipboard.writeText(mailingText).then(() => {
      setMailingCopied(true)
      setTimeout(() => setMailingCopied(false), 2200)
    }).catch(() => window.alert('Non sono riuscito a copiare automaticamente. Seleziona il testo e copialo manualmente.'))
  }

  function askAgent(prompt?: string) { const q = prompt || question; setQuestion(q); setAnswer(agentAnswer(q, contacts, tasks, conversations)) }
  function switchProfile(profileId: string) { setActiveProfileId(profileId); window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId); loadProfileData(profileId); resetDraft(); setAnalysis(null); setAnswer('Profilo cambiato. Sto usando solo i dati locali di questo profilo.') }
  function createProfile() { const name = newProfileName.trim(); if (!name) return; const timestamp = nowIso(); const newProfile = { id: id('profilo'), name, createdAt: timestamp, updatedAt: timestamp }; setProfiles((current) => [...current, newProfile]); setNewProfileName(''); setActiveProfileId(newProfile.id); window.localStorage.setItem(ACTIVE_PROFILE_KEY, newProfile.id); setContacts([]); setTasks([]); setConversations([]); setSelectedContactId(''); resetDraft(); setAnalysis(null); setAnswer(`Profilo ${name} creato. I dati saranno separati dagli altri profili locali.`) }
  function exportData() { const blob = new Blob([JSON.stringify({ profile: activeProfile, contacts, tasks, conversations }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `relazione-crm-${activeProfile?.name || 'profilo'}-backup-${today()}.json`.replace(/\s+/g, '-').toLowerCase(); a.click(); URL.revokeObjectURL(url) }
  function importData(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const parsed = JSON.parse(String(reader.result)) as StoredCrmData; const nextContacts = Array.isArray(parsed.contacts) ? parsed.contacts.map(normalizeContact) : []; const nextTasks = Array.isArray(parsed.tasks) ? parsed.tasks : []; const nextConversations = Array.isArray(parsed.conversations) ? parsed.conversations : []; setContacts(nextContacts); setTasks(nextTasks); setConversations(nextConversations); setSelectedContactId(nextContacts[0]?.id || ''); setAnswer('Backup importato nel profilo attivo. Gli altri profili non sono stati modificati.'); } catch { window.alert('Il file selezionato non sembra un backup valido del CRM.') } finally { event.target.value = '' } }; reader.readAsText(file) }
  function clearAllData() { if (!window.confirm(`Vuoi cancellare solo i dati locali del profilo ${activeProfile?.name || 'attivo'}? Gli altri profili resteranno separati.`)) return; setContacts([]); setTasks([]); setConversations([]); setSelectedContactId(''); resetDraft(); setAnalysis(null); setAnswer('Dati del profilo attivo cancellati. Puoi ricominciare inserendo contatti reali.') }

  const stageGroups = outreachStages.map((stage) => ({
    stage,
    items: contacts.filter((contact) => (contact.outreachStage || 'Da qualificare') === stage),
  }))

  const nav = [{ id: 'dashboard', label: 'Dashboard', icon: TrendingUp }, { id: 'contacts', label: 'Database 100', icon: Users }, { id: 'pipeline', label: 'Flusso', icon: ChevronRight }, { id: 'conversations', label: 'Comunicazioni', icon: Upload }, { id: 'mailing', label: 'Mailing CCN', icon: Mail }, { id: 'agent', label: 'Agente', icon: Bot }] as const

  return <div className="min-h-screen bg-[#f7f6f1] text-gray-900"><div className="flex min-h-screen"><aside className="hidden md:flex w-72 flex-col border-r border-stone-200 bg-white/90 p-5"><div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">AI</div><div><div className="font-bold text-lg">RelazioneCRM</div><div className="text-xs text-gray-500">Database privato</div></div></div><nav className="space-y-2">{nav.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${section === item.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-stone-100 text-gray-700'}`}><Icon className="w-4 h-4" /> {item.label}</button> })}</nav><div className="mt-auto rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-900"><strong className="block mb-1">Uso privato gratuito</strong>Database locale per i primi 100 contatti qualificati. Ogni profilo resta separato.</div></aside><main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full"><header className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-8"><div><h1 className="text-3xl font-bold tracking-tight">CRM privato · 100 contatti qualificati</h1><p className="text-gray-500 mt-1">Gestisci lead premium, comunicazioni, follow-up e backup in modalità gratuita local-first.</p></div><div className="flex flex-wrap gap-2">{nav.map((item) => <button key={item.id} onClick={() => setSection(item.id)} className="md:hidden px-3 py-2 rounded-xl border bg-white text-sm">{item.label}</button>)}<button onClick={importMilanoBatch1} className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 text-sm inline-flex items-center gap-2"><Database className="w-4 h-4" />Carica Batch Milano 1</button><button onClick={exportData} className="px-4 py-2 rounded-xl border bg-white hover:bg-stone-50 text-sm inline-flex items-center gap-2"><Download className="w-4 h-4" />Backup</button><label className="px-4 py-2 rounded-xl border bg-white hover:bg-stone-50 text-sm inline-flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" />Importa<input type="file" accept="application/json" onChange={importData} className="hidden" /></label><button onClick={clearAllData} className="px-4 py-2 rounded-xl border bg-white hover:bg-red-50 text-sm text-red-700 inline-flex items-center gap-2"><Trash2 className="w-4 h-4" />Reset</button></div></header><section className="mb-8 rounded-3xl border bg-white p-5"><div className="flex flex-col xl:flex-row xl:items-end gap-4 justify-between"><div><div className="flex items-center gap-2 text-sm font-semibold text-blue-800"><ShieldCheck className="w-4 h-4" /> Profili separati per te e soci</div><p className="text-gray-600 mt-1">Profilo attivo: <strong>{activeProfile?.name || 'Profilo locale'}</strong>. I dati restano nel browser di questo profilo e non vengono mostrati agli altri profili locali.</p></div><div className="flex flex-col md:flex-row gap-2 md:items-center"><select value={activeProfileId} onChange={(e) => switchProfile(e.target.value)} className="rounded-2xl border px-4 py-3 bg-white min-w-48">{profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</select><div className="flex gap-2"><input value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} className="rounded-2xl border px-4 py-3 w-48" placeholder="Nome socio/profilo" /><button onClick={createProfile} className="rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800"><UserPlus className="w-4 h-4 inline mr-2" />Crea</button></div></div></div></section>

  {section === 'dashboard' && <div className="space-y-6"><div className="rounded-3xl border bg-white p-5 flex flex-col lg:flex-row gap-4 lg:items-center"><div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center"><Bot className="w-5 h-5" /></div><div className="flex-1"><div className="font-semibold">Agente operativo · Prossima mossa</div><div className="text-gray-600">{suggestion}</div></div><button onClick={() => setSection('agent')} className="px-5 py-3 rounded-2xl border bg-stone-50 hover:bg-stone-100">Interroga agente</button></div><div className="grid grid-cols-2 lg:grid-cols-5 gap-4"><div className="rounded-3xl bg-white border p-5"><Users className="w-5 h-5 text-blue-600 mb-3" /><div className="text-sm text-gray-500">Database</div><div className="text-3xl font-bold">{metrics.active}/100</div></div><div className="rounded-3xl bg-white border p-5"><Star className="w-5 h-5 text-red-600 mb-3" /><div className="text-sm text-gray-500">A-list</div><div className="text-3xl font-bold">{metrics.aList}</div></div><div className="rounded-3xl bg-white border p-5"><ClipboardList className="w-5 h-5 text-green-600 mb-3" /><div className="text-sm text-gray-500">Qualificati</div><div className="text-3xl font-bold">{metrics.qualified}</div></div><div className="rounded-3xl bg-white border p-5"><CheckSquare className="w-5 h-5 text-orange-600 mb-3" /><div className="text-sm text-gray-500">Task aperti</div><div className="text-3xl font-bold">{metrics.tasks}</div></div><div className="rounded-3xl bg-white border p-5"><TrendingUp className="w-5 h-5 text-purple-600 mb-3" /><div className="text-sm text-gray-500">Pipeline stimata</div><div className="text-3xl font-bold">{euro(metrics.pipeline)}</div></div></div><div className="grid lg:grid-cols-2 gap-6"><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg mb-4">Follow-up aperti</h2><div className="space-y-3">{openTasks.slice(0, 6).map((task) => { const c = contacts.find((x) => x.id === task.contactId); return <div key={task.id} className="rounded-2xl border p-4 flex items-center gap-3"><input type="checkbox" checked={task.completed} onChange={() => setTasks((current) => current.map((x) => x.id === task.id ? { ...x, completed: !x.completed } : x))} /><div className="flex-1"><div className="font-semibold">{task.title}</div><div className="text-sm text-gray-500">{c?.name || 'Contatto eliminato'} · {fmtDate(task.due)}</div></div><span className={`text-xs border rounded-lg px-2 py-1 ${priorityClass(task.priority)}`}>{task.priority}</span><button onClick={() => setTasks((current) => current.filter((x) => x.id !== task.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button></div> })}{openTasks.length === 0 && <p className="text-gray-500">Nessun task aperto. Carica il batch o crea un follow-up da un contatto.</p>}</div></div><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg mb-4">Aggiungi task rapido</h2><div className="space-y-3"><select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="w-full rounded-2xl border px-4 py-3 bg-white"><option value="">Seleziona contatto</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full rounded-2xl border px-4 py-3" placeholder="Es. completare email, inviare video, follow-up..." /><div className="grid grid-cols-2 gap-3"><input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} className="rounded-2xl border px-4 py-3" /><select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as Priority)} className="rounded-2xl border px-4 py-3 bg-white"><option>Alta</option><option>Media</option><option>Bassa</option></select></div><button onClick={saveTask} disabled={!selectedContact || !taskTitle.trim()} className="w-full rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800 disabled:opacity-40"><Plus className="w-4 h-4 inline mr-2" />Salva task</button></div></div></div></div>}

  {section === 'contacts' && <div className="grid lg:grid-cols-[1fr_440px] gap-6"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5"><div className="flex items-center gap-3"><Search className="w-5 h-5 text-gray-400" /><h2 className="font-bold text-lg">Database contatti qualificati</h2></div><button onClick={importMilanoBatch1} className="rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800"><Database className="w-4 h-4 inline mr-2" />Carica Batch Milano 1</button></div><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-2xl border px-4 py-3 mb-4" placeholder="Cerca per struttura, categoria, città, gancio, stadio..." /><div className="space-y-3">{filteredContacts.map((contact) => <div key={contact.id} className={`rounded-2xl border p-4 hover:bg-stone-50 ${selectedContact?.id === contact.id ? 'ring-2 ring-blue-200' : ''}`}><button onClick={() => setSelectedContactId(contact.id)} className="w-full text-left"><div className="flex justify-between gap-3"><div><div className="font-semibold">{contact.name}</div><div className="text-sm text-gray-500">{contact.category || 'Categoria non indicata'} · {contact.city || 'Città non indicata'} · {contact.phone || 'Telefono mancante'}</div></div><div className="flex flex-col gap-1 items-end"><span className={`h-fit text-xs px-2 py-1 rounded-lg border ${priorityLevelClass(contact.priorityLevel)}`}>Priorità {contact.priorityLevel || 'B'}</span><span className={`h-fit text-xs px-2 py-1 rounded-lg border ${stageClass(contact.outreachStage)}`}>{contact.outreachStage || 'Da qualificare'}</span></div></div>{contact.personalizationHook && <div className="mt-3 text-sm text-gray-700 bg-stone-50 rounded-xl p-3">{contact.personalizationHook}</div>}<div className="mt-3 flex flex-wrap gap-2">{contact.topics.map((t) => <span key={t} className="text-xs rounded-lg bg-stone-100 px-2 py-1">{t}</span>)}</div></button><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => startEdit(contact)} className="text-sm rounded-xl border px-3 py-2 hover:bg-white"><Pencil className="w-3 h-3 inline mr-1" />Modifica</button><select value={contact.outreachStage || 'Da qualificare'} onChange={(e) => updateContactStage(contact.id, e.target.value as OutreachStage)} className="text-sm rounded-xl border px-3 py-2 bg-white">{outreachStages.map((s) => <option key={s}>{s}</option>)}</select><button onClick={() => deleteContact(contact.id)} className="text-sm rounded-xl border px-3 py-2 text-red-700 hover:bg-red-50"><Trash2 className="w-3 h-3 inline mr-1" />Elimina</button></div></div>)}{filteredContacts.length === 0 && <p className="text-gray-500">Nessun contatto trovato. Carica il Batch Milano 1 o inserisci il primo lead dal modulo a destra.</p>}</div></div><div className="rounded-3xl bg-white border p-5 h-fit"><h2 className="font-bold text-lg">{editingId ? 'Modifica lead qualificato' : 'Nuovo lead qualificato'}</h2><div className="mt-4 space-y-3"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Nome struttura *" /><div className="grid grid-cols-2 gap-3"><input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Categoria" /><input value={draft.subcategory} onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Sottocategoria" /></div><div className="grid grid-cols-2 gap-3"><input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Città" /><input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Telefono" /></div><input value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Sito web" /><div className="grid grid-cols-2 gap-3"><input value={draft.generalEmail} onChange={(e) => setDraft({ ...draft, generalEmail: e.target.value, email: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Email generale" /><input value={draft.decisionMakerName} onChange={(e) => setDraft({ ...draft, decisionMakerName: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Decision maker" /></div><div className="grid grid-cols-2 gap-3"><input value={draft.decisionMakerRole} onChange={(e) => setDraft({ ...draft, decisionMakerRole: e.target.value, role: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Ruolo decision maker" /><input value={draft.decisionMakerEmail} onChange={(e) => setDraft({ ...draft, decisionMakerEmail: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Email decision maker" /></div><div className="grid grid-cols-3 gap-3"><select value={draft.priorityLevel} onChange={(e) => setDraft({ ...draft, priorityLevel: e.target.value as PriorityLevel })} className="rounded-2xl border px-4 py-3 bg-white">{priorityLevels.map((p) => <option key={p}>{p}</option>)}</select><select value={draft.outreachStage} onChange={(e) => setDraft({ ...draft, outreachStage: e.target.value as OutreachStage })} className="rounded-2xl border px-4 py-3 bg-white col-span-2">{outreachStages.map((s) => <option key={s}>{s}</option>)}</select></div><div className="grid grid-cols-3 gap-3"><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ContactStatus })} className="rounded-2xl border px-4 py-3 bg-white">{statuses.map((s) => <option key={s}>{s}</option>)}</select><input type="number" min="1" max="10" value={draft.interest} onChange={(e) => setDraft({ ...draft, interest: Number(e.target.value) })} className="rounded-2xl border px-4 py-3" placeholder="Interesse" /><input type="number" min="1" max="10" value={draft.trust} onChange={(e) => setDraft({ ...draft, trust: Number(e.target.value) })} className="rounded-2xl border px-4 py-3" placeholder="Fiducia" /></div><div className="grid grid-cols-2 gap-3"><input value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Valutazione" /><input value={draft.reviews} onChange={(e) => setDraft({ ...draft, reviews: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Numero recensioni" /></div><input type="number" value={draft.value} onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })} className="w-full rounded-2xl border px-4 py-3" placeholder="Valore stimato €" /><input value={draft.services} onChange={(e) => setDraft({ ...draft, services: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Servizi: spa, eventi, concierge, prenotazioni..." /><textarea value={draft.personalizationHook} onChange={(e) => setDraft({ ...draft, personalizationHook: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Gancio di personalizzazione" /><textarea value={draft.messageAngle} onChange={(e) => setDraft({ ...draft, messageAngle: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Angolo messaggio / video" /><input value={draft.topicsText} onChange={(e) => setDraft({ ...draft, topicsText: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Temi separati da virgola" /><textarea value={draft.nextAction} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Prossima azione" /><textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="w-full rounded-2xl border px-4 py-3 min-h-24" placeholder="Note interne" /><div className="flex gap-2"><button onClick={saveContact} className="flex-1 rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800"><Save className="w-4 h-4 inline mr-2" />Salva</button>{editingId && <button onClick={resetDraft} className="rounded-2xl border px-4 py-3">Annulla</button>}</div></div></div></div>}

  {section === 'pipeline' && <div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg">Flusso comunicazioni</h2><p className="text-gray-600 mt-1">Sposta ogni contatto nello stadio reale. Per ora l’invio resta manuale: il CRM ti aiuta a non perdere prossima azione e storico.</p></div><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{stageGroups.map(({ stage, items }) => <div key={stage} className="rounded-3xl bg-white border p-4"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold">{stage}</h3><span className="text-xs rounded-full bg-stone-100 px-2 py-1">{items.length}</span></div><div className="space-y-3">{items.map((contact) => <button key={contact.id} onClick={() => { setSelectedContactId(contact.id); setSection('contacts') }} className="w-full text-left rounded-2xl border p-3 hover:bg-stone-50"><div className="font-semibold text-sm">{contact.name}</div><div className="text-xs text-gray-500">Priorità {contact.priorityLevel || 'B'} · {contact.category || 'Categoria n/d'}</div><div className="text-xs text-gray-600 mt-2 line-clamp-2">{contact.nextAction || contact.messageAngle || 'Prossima azione da definire'}</div></button>)}{items.length === 0 && <p className="text-sm text-gray-400">Nessun contatto.</p>}</div></div>)}</div></div>}

  {section === 'conversations' && <div className="grid lg:grid-cols-2 gap-6"><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg mb-4">Registra comunicazione</h2><select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="w-full rounded-2xl border px-4 py-3 mb-4 bg-white"><option value="">Seleziona contatto</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><div className="grid grid-cols-2 gap-3 mb-4"><select value={communicationChannel} onChange={(e) => setCommunicationChannel(e.target.value as Channel)} className="rounded-2xl border px-4 py-3 bg-white">{channels.map((c) => <option key={c}>{c}</option>)}</select><select value={communicationStage} onChange={(e) => setCommunicationStage(e.target.value as OutreachStage)} className="rounded-2xl border px-4 py-3 bg-white">{outreachStages.map((s) => <option key={s}>{s}</option>)}</select></div>{selectedContact && <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900 mb-4"><strong>Gancio:</strong> {selectedContact.personalizationHook || 'gancio non compilato'}<br /><strong>Angolo:</strong> {selectedContact.messageAngle || 'angolo messaggio non compilato'}</div>}<textarea value={conversation} onChange={(e) => setConversation(e.target.value)} className="w-full min-h-52 rounded-2xl border p-4" placeholder="Incolla email inviata, nota telefonata, risposta ricevuta, script video o appunto operativo..." /><button onClick={runAnalysis} disabled={!selectedContact || !conversation.trim()} className="mt-4 w-full rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800 disabled:opacity-40"><Upload className="w-4 h-4 inline mr-2" />Salva, aggiorna stadio e genera follow-up</button></div><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg mb-4">Ultima analisi</h2>{analysis ? <div className="space-y-4"><div className="rounded-2xl bg-blue-50 p-4"><div className="text-sm text-blue-700">Score opportunità</div><div className="text-3xl font-bold text-blue-900">{analysis.score}/100</div></div><div><div className="text-sm text-gray-500">Sintesi</div><p className="font-medium">{analysis.summary}</p></div><div><div className="text-sm text-gray-500 mb-2">Bisogni / attenzioni</div>{analysis.needs.map((n) => <div key={n} className="rounded-xl border px-3 py-2 mb-2">{n}</div>)}</div><div className="rounded-2xl bg-green-50 p-4 text-green-800"><strong>Prossima azione:</strong> {analysis.action}</div></div> : <p className="text-gray-500">Registra una comunicazione reale per creare storico, task e prossimo passo.</p>}</div><div className="rounded-3xl bg-white border p-5 lg:col-span-2"><h2 className="font-bold text-lg mb-4">Storico comunicazioni</h2><div className="grid md:grid-cols-2 gap-3">{conversations.map((item) => { const c = contacts.find((x) => x.id === item.contactId); return <div key={item.id} className="rounded-2xl border p-4"><div className="flex justify-between gap-3"><div className="font-semibold">{c?.name || 'Contatto eliminato'}</div><div className="text-xs text-gray-500">{fmtDate(item.createdAt)}</div></div><div className="text-xs text-gray-500 mt-1">{item.channel || 'Nota'} · {item.stage || 'Stadio non indicato'}</div><div className="mt-2 text-sm text-gray-600 max-h-24 overflow-hidden">{item.text}</div><div className="mt-3 rounded-xl bg-stone-50 p-3 text-sm"><strong>{item.analysis.score}/100 · {item.analysis.topic}</strong><br />{item.analysis.summary}</div></div> })}</div>{conversations.length === 0 && <p className="text-gray-500">Ancora nessuna comunicazione salvata.</p>}</div></div>}

  {section === 'mailing' && <div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5"><div><div className="flex items-center gap-3"><Mail className="w-6 h-6" /><h2 className="font-bold text-xl">Mailing list per CCN/BCC</h2></div><p className="text-sm text-gray-500 mt-2">Genera un elenco email pronto da copiare nel campo <strong>CCN</strong>. Il CRM non invia email: l’invio resta manuale e sotto il tuo controllo.</p></div><button onClick={copyMailingList} disabled={mailingEmails.length === 0} className="rounded-2xl bg-gray-900 text-white px-5 py-3 font-semibold disabled:opacity-40"><Copy className="w-4 h-4 inline mr-2" />{mailingCopied ? 'Copiato' : 'Copia elenco CCN'}</button></div><div className="grid md:grid-cols-4 gap-3 mb-5"><div><label className="text-xs font-semibold text-gray-500">Priorità</label><select value={mailingPriority} onChange={(e) => setMailingPriority(e.target.value as MailingPriorityFilter)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"><option value="Tutte">Tutte</option>{priorityLevels.map((p) => <option key={p} value={p}>Priorità {p}</option>)}</select></div><div><label className="text-xs font-semibold text-gray-500">Stadio comunicazione</label><select value={mailingStage} onChange={(e) => setMailingStage(e.target.value as MailingStageFilter)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"><option value="Tutti">Tutti</option>{outreachStages.map((s) => <option key={s} value={s}>{s}</option>)}</select></div><div><label className="text-xs font-semibold text-gray-500">Separatore</label><select value={mailingSeparator} onChange={(e) => setMailingSeparator(e.target.value as MailingSeparator)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"><option value="punto e virgola">Punto e virgola</option><option value="virgola">Virgola</option></select></div><div className="rounded-2xl bg-stone-50 p-4"><div className="text-xs text-gray-500">Email selezionate</div><div className="text-2xl font-bold">{mailingEmails.length}</div><div className="text-xs text-gray-500">Escluse senza email valida: {excludedEmailCount}</div></div></div><textarea readOnly value={mailingText || 'Nessuna email valida con i filtri attuali.'} className="w-full min-h-36 rounded-2xl border p-4 bg-stone-50 text-sm" /><div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Uso consigliato:</strong> incolla questo elenco nel campo CCN/BCC, non nel campo A. Per ridurre spam e blocchi, invia piccoli gruppi, personalizza il testo e registra poi la comunicazione nella sezione Comunicazioni.</div></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{mailingContacts.map((contact) => <div key={contact.id} className="rounded-2xl bg-white border p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{contact.name}</div><div className="text-sm text-gray-500">{contact.category || contact.role || 'Categoria non indicata'} · Priorità {contact.priorityLevel || 'B'}</div></div><span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-1">{contact.outreachStage || 'Da qualificare'}</span></div><div className="mt-3 text-sm font-medium text-gray-800 break-all">{contactEmail(contact)}</div><div className="mt-2 text-xs text-gray-500">{contact.personalizationHook || contact.messageAngle || 'Completa gancio e angolo prima dell’invio se vuoi una mail più efficace.'}</div></div>)}</div>{mailingContacts.length === 0 && <div className="rounded-3xl bg-white border p-6 text-gray-500">Nessun contatto con email valida nei filtri selezionati. Completa i campi email nel Database 100 oppure allarga i filtri.</div>}</div>}
  {section === 'agent' && <div className="rounded-3xl bg-white border p-5 max-w-4xl"><div className="flex items-center gap-3 mb-5"><Bot className="w-6 h-6" /><h2 className="font-bold text-xl">Agente operativo sui tuoi dati</h2></div><div className="rounded-2xl bg-stone-50 p-5 mb-4"><p>{answer}</p></div><div className="flex gap-3"><input value={question} onChange={(e) => setQuestion(e.target.value)} className="flex-1 rounded-2xl border px-4 py-3" placeholder="Es: chi devo contattare oggi? a che punto sono i 100 contatti?" /><button onClick={() => askAgent()} className="rounded-2xl bg-gray-900 text-white px-5 font-semibold"><Send className="w-4 h-4 inline mr-2" />Invia</button></div><div className="flex flex-wrap gap-2 mt-4">{['Chi devo contattare oggi?', 'A che punto sono i 100 contatti?', 'Quali lead sono caldi?', 'Mostrami i task aperti', 'Riassumi le conversazioni'].map((p) => <button key={p} onClick={() => askAgent(p)} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50"><MessageSquareText className="w-3 h-3 inline mr-1" />{p}</button>)}</div><div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900"><Database className="w-4 h-4 inline mr-2" />In questa versione gratuita l’agente usa regole locali e solo i dati del profilo attivo. Per sincronizzazione tra dispositivi o invii automatici reali si potrà aggiungere un database cloud in seguito.</div></div>}
  </main></div></div>
}
