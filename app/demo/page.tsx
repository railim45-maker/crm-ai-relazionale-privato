/*
 * FILE GENERATO DA MANUS - PAGINA DEMO - CRM dimostrativo con NetFree e LCR 6x6
 * DESTINAZIONE ESATTA: app/demo/page.tsx
 * FUNZIONE: Sostituisce la demo: include campi Studio su misura con titolo, unità e spiegazione vicino agli input.
 * NOTA: in Next.js il nome deve restare page.tsx; distingue la pagina il percorso della cartella.
 */

'use client'

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Bot, Building2, CalendarDays, Calculator, CheckSquare, ChevronRight, ClipboardList, Clock, Copy, Database, Download, LogIn, LogOut, Mail, MessageSquareText, Pencil, Phone, Plus, Save, Search, Send, ShieldCheck, Star, Trash2, TrendingUp, Upload, UserPlus, Users, Zap } from 'lucide-react'

type ContactStatus = 'Lead' | 'Prospect' | 'Interessato' | 'Cliente' | 'Partner'
type Priority = 'Alta' | 'Media' | 'Bassa'
type PriorityLevel = 'A' | 'B' | 'C'
type OutreachStage = 'Da qualificare' | 'Ricerca guidata' | 'Video da preparare' | 'Primo invio' | 'Follow-up 1' | 'Risposta ricevuta' | 'Demo richiesta' | 'Non interessato' | 'Sospeso'
type NetFreeStage = 'Non avviato' | 'Lead raccolto' | 'Da qualificare con rispetto' | 'Strategia da definire' | 'Primo contatto relazionale' | 'Dialogo aperto' | 'Da approfondire' | 'Non coerente ora' | 'Non interessato'
type LcrSelectionOutcome = 'Da valutare' | 'Approvato' | 'Bocciato' | 'Non presente'
type LcrAlignmentFlag = 'Da valutare' | 'Allineato' | 'Non allineato'
type LcrAvailabilityWindow = 'Da definire' | 'Mattina' | 'Pomeriggio' | 'Sera' | 'Personalizzata'
type LcrPefDelegationStatus = 'Non avviata' | 'Task interno creato' | 'Delegabile dopo conferma' | 'Completata manualmente'
type Section = 'dashboard' | 'contacts' | 'calendar' | 'pipeline' | 'conversations' | 'research' | 'study' | 'netfree' | 'lcr' | 'team' | 'investors' | 'documents' | 'materials' | 'mailing' | 'agent'
type Channel = 'Email' | 'Telefono' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Telegram' | 'TikTok' | 'LinkedIn' | 'Video' | 'Nota interna'
type UserRole = 'Amministratore' | 'Socio' | 'Collaboratore'
type RelationshipType = 'Cliente' | 'Collaboratore' | 'Socio' | 'Partner operativo' | 'Investitore' | 'Entrambi'
type CollaboratorStage = 'Candidato' | 'Colloquio' | 'Materiale inviato' | 'Onboarding' | 'Attivo' | 'Da sviluppare' | 'Team leader'
type InvestorStage = 'Potenziale' | 'Qualificato' | 'LOI da inviare' | 'LOI inviata' | 'Due diligence' | 'Investitore' | 'Follow-up'
type DocumentStage = 'Da preparare' | 'Inviato' | 'In revisione' | 'Firmato' | 'Archiviato'
type MailingPriorityFilter = 'Tutte' | PriorityLevel
type MailingStageFilter = 'Tutti' | OutreachStage
type MailingSeparator = 'virgola' | 'punto e virgola'
type CommunicationTemplate = 'opener' | 'diagnose' | 'qualify' | 'tailored' | 'position' | 'close'
type SalesTone = 'Cordiale' | 'Soft' | 'Consulenziale' | 'Diretto gentile'
type StrategicIntent = 'Aprire relazione' | 'Capire bisogno' | 'Gestire obiezione' | 'Proporre mini-demo' | 'Chiudere appuntamento'
type ResearchEntryMode = 'Azienda' | 'Persona fisica'
type CloudPersistenceStatus = 'verifica' | 'cloud' | 'locale' | 'errore' | 'salvataggio'
type MeetAutomationStatus = 'verifica' | 'collegato' | 'non_collegato' | 'errore' | 'creazione'

type Contact = {
  id: string
  dbId?: string
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
  paidShareCapital?: number
  realEstateValue?: number
  inventoryValue?: number
  equipmentValue?: number
  receivablesValue?: number
  cashValue?: number
  brandValue?: number
  annualRevenue?: number
  annualEbitda?: number
  annualEnergyCost?: number
  expectedEnergySavingPct?: number
  annualServiceCost?: number
  preferredEnergyPath?: 'Da valutare' | 'uBroker' | 'PEF Power' | 'Altro'
  studyNotes?: string
  servicePlafondNotes?: string
  researchEntryMode?: ResearchEntryMode
  personFirstName?: string
  personLastName?: string
  personCity?: string
  companyLegalName?: string
  commercialName?: string
  commercialAliases?: string
  publicSources?: string
  facebookPageCandidates?: string
  confirmedFacebookPage?: string
  socialFacebookUrl?: string
  socialInstagramUrl?: string
  personCompanyLinks?: string
  publicComplaints?: string
  researchSummary?: string
  probableNeeds?: string
  recommendedQuestions?: string
  recommendedPath?: string
  confidenceScore?: number
  relationshipType?: RelationshipType
  ownerName?: string
  sponsorName?: string
  collaboratorStage?: CollaboratorStage
  collaboratorRole?: string
  investorStage?: InvestorStage
  investorProfile?: string
  expectedInvestment?: number
  loiStatus?: DocumentStage
  contractStatus?: DocumentStage
  sharedDocuments?: string
  adminKpiNotes?: string
  voiceDeskSegment?: 'Ristorante' | 'Hotel' | 'Generico'
  voiceDeskEmailSentCount?: number
  voiceDeskEmailOpenCount?: number
  voiceDeskDemoClickCount?: number
  voiceDeskCallClickCount?: number
  voiceDeskLastAction?: string
  voiceDeskLastActionAt?: string
  netFreeStage?: NetFreeStage
  netFreeCandidateReason?: string
  netFreeConsentToCall?: boolean
  netFreeConsentAt?: string
  netFreeSharedWithClaudioAt?: string
  netFreeClaudioFeedback?: string
  netFreeNextStep?: string
  netFreeEstimatedOpportunity?: string
  netFreePreferredPhone?: string
  netFreeLeadProfile?: string
  netFreePreferredChannel?: string
  netFreePreferredTimeWindow?: string
  netFreeCallTone?: string
  netFreeBriefForClaudio?: string
  lcrAvailabilityWindow?: LcrAvailabilityWindow
  lcrCustomAvailability?: string
  lcrAgendaLink?: string
  lcrZoomLink?: string
  lcrVoiceSentAt?: string
  lcrPositiveReplyAt?: string
  lcrAppointmentAt?: string
  lcrZoomCompletedAt?: string
  lcrPrequalVoiceListened?: LcrAlignmentFlag
  lcrEthicsAligned?: LcrAlignmentFlag
  lcrMindsetAligned?: LcrAlignmentFlag
  lcrNetFreeAligned?: LcrAlignmentFlag
  lcrTokenizationAligned?: LcrAlignmentFlag
  lcrSelectionOutcome?: LcrSelectionOutcome
  lcrSelectionNotes?: string
  lcrTag?: string
  lcrPefDelegationStatus?: LcrPefDelegationStatus
  lcrPefTechnicianNote?: string
  lcrMatrixSponsorId?: string
  lcrMatrixParentId?: string
  lcrMatrixPosition?: number
  lcrMatrixLevel?: number
  lcrMatrixSlot?: number
  lcrDirectPeopleCount?: number
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
  dbId?: string
  name: string
  role?: UserRole
  allowedMaterialIds?: string[]
  permissionNotes?: string
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
const outreachStages: OutreachStage[] = ['Da qualificare', 'Ricerca guidata', 'Video da preparare', 'Primo invio', 'Follow-up 1', 'Risposta ricevuta', 'Demo richiesta', 'Non interessato', 'Sospeso']
const channels: Channel[] = ['Email', 'Telefono', 'WhatsApp', 'Instagram', 'Facebook', 'Telegram', 'TikTok', 'LinkedIn', 'Video', 'Nota interna']
const salesTones: SalesTone[] = ['Cordiale', 'Soft', 'Consulenziale', 'Diretto gentile']
const strategicIntents: StrategicIntent[] = ['Aprire relazione', 'Capire bisogno', 'Gestire obiezione', 'Proporre mini-demo', 'Chiudere appuntamento']
const userRoles: UserRole[] = ['Amministratore', 'Socio', 'Collaboratore']
const relationshipTypes: RelationshipType[] = ['Cliente', 'Collaboratore', 'Socio', 'Partner operativo', 'Investitore', 'Entrambi']
const netFreeStages: NetFreeStage[] = ['Non avviato', 'Lead raccolto', 'Da qualificare con rispetto', 'Strategia da definire', 'Primo contatto relazionale', 'Dialogo aperto', 'Da approfondire', 'Non coerente ora', 'Non interessato']
const lcrSelectionOutcomes: LcrSelectionOutcome[] = ['Da valutare', 'Approvato', 'Bocciato', 'Non presente']
const lcrAlignmentFlags: LcrAlignmentFlag[] = ['Da valutare', 'Allineato', 'Non allineato']
const lcrAvailabilityWindows: LcrAvailabilityWindow[] = ['Da definire', 'Mattina', 'Pomeriggio', 'Sera', 'Personalizzata']
const lcrPefDelegationStatuses: LcrPefDelegationStatus[] = ['Non avviata', 'Task interno creato', 'Delegabile dopo conferma', 'Completata manualmente']
const MASSIVE_NETFREE_IMPORT_THRESHOLD = 750
const NETFREE_IMPORT_GUARD_MS = 10 * 60 * 1000
const NETFREE_CLOUD_SYNC_BATCH_SIZE = 200
const claudioNetworkerName = 'Claudio Giustini'
const claudioNetworkerPhone = '+393355394222'
const claudioNetworkerPhoneDisplay = '+39 335 539 4222'
const voiceDeskRestaurantPhone = '+3904611220247'
const voiceDeskRestaurantPhoneDisplay = '+39 0461 1220247'
const voiceDeskHotelPhone = '+390464748832'
const voiceDeskHotelPhoneDisplay = '+39 0464 748832'
const voiceDeskDemoUrl = 'https://www.voicedesk.it/'
const voiceDeskHotelVideoUrl = '/materiali/voicedesk/video-demo-hotel.mp4'
const collaboratorStages: CollaboratorStage[] = ['Candidato', 'Colloquio', 'Materiale inviato', 'Onboarding', 'Attivo', 'Da sviluppare', 'Team leader']
const investorStages: InvestorStage[] = ['Potenziale', 'Qualificato', 'LOI da inviare', 'LOI inviata', 'Due diligence', 'Investitore', 'Follow-up']
const documentStages: DocumentStage[] = ['Da preparare', 'Inviato', 'In revisione', 'Firmato', 'Archiviato']

type NetworkMaterial = {
  id: string
  area: string
  title: string
  target: string
  need: string
  level: 'Interesse' | 'Qualificazione' | 'Operativo'
  link: string
  assets: Array<{ label: string; href?: string; hotelOnly?: boolean }>
  message: string
  consultantUse: string
  caution: string
  dataToAsk: string[]
  nextStep: string
}

const networkMaterials: NetworkMaterial[] = [
  {
    id: 'voicedesk',
    area: 'VoiceDesk',
    title: 'Assistente vocale AI per chiamate, richieste e prenotazioni',
    target: 'PMI operative, ristoranti, hotel, studi medici, assistenza tecnica, retail e servizi B2B',
    need: 'Ridurre chiamate perse, richieste ripetitive e dispersione del primo contatto.',
    level: 'Interesse',
    link: 'https://www.voicedesk.it/',
    assets: [{ label: 'Sito/demo VoiceDesk', href: 'https://www.voicedesk.it/' }, { label: 'Video esempio strutture ricettive', href: voiceDeskHotelVideoUrl, hotelOnly: true }, { label: 'Messaggio WhatsApp' }, { label: 'Scheda settore da preparare sul lead' }],
    message: 'Ti mando VoiceDesk perché mi sembra collegato al tema chiamate, richieste ripetitive e primo contatto clienti. L’idea non è sostituire lo staff, ma capire se un assistente vocale AI può recuperare contatti e liberare tempo operativo.',
    consultantUse: 'Usalo quando il lead parla di telefonate perse, reception sovraccarica, prenotazioni, FAQ o gestione fuori orario. Prima misura il problema, poi proponi una mini-demo.',
    caution: 'Non promettere risultati automatici: verifica sempre volumi, processi, privacy, integrazioni e controllo umano.',
    dataToAsk: ['Numero chiamate o richieste mensili', 'Canali usati: telefono, WhatsApp, sito, email', 'Domande frequenti dei clienti', 'Gestionale, calendario o CRM già in uso'],
    nextStep: 'Mappare 10 richieste frequenti e proporre una discovery call breve.'
  },
  {
    id: 'blotix',
    area: 'Blotix',
    title: 'Asset reali, tokenizzazione e protocollo Web3',
    target: 'Proprietari immobiliari, imprenditori, investitori evoluti e aziende con asset documentabili',
    need: 'Valorizzare patrimonio o asset non liquidi con un percorso informativo su tokenizzazione e collaterale digitale.',
    level: 'Qualificazione',
    link: 'https://blotix.io',
    assets: [{ label: 'Protocollo Blotix PDF', href: 'https://drive.google.com/file/d/1z3BQjnApIaGsEze1TPKULYKYY1KdZTgo/view?usp=sharing' }, { label: 'Tokenomics 2.0 ITA PDF', href: 'https://drive.google.com/file/d/1Wx6bqV8aS5FwlqyCoApQPXXflbz_2Kgs/view?usp=sharing' }, { label: 'Tokenomics 2.0 ENG PDF', href: 'https://drive.google.com/file/d/1gt_Wbz4rt6hp0TTSmt4-zDCUpPZ2oPji/view?usp=sharing' }, { label: 'Video Blotix: Asset e DeFi', href: 'https://drive.google.com/file/d/1q-HQomiLFoMEaeltzsmSOZzoVe0pt8go/view?usp=sharing' }, { label: 'Video Blotix: Patrimonio Attivo', href: 'https://drive.google.com/file/d/1-gfKthfIKvAwxoifG_er73RzryUiUQEK/view?usp=sharing' }, { label: 'Infografica Blotix', href: 'https://drive.google.com/file/d/1RQRMOEdxItUOXWgsCyDxr6vt7in4omn9/view?usp=sharing' }],
    message: 'Ti condivido una sintesi su Blotix: è un ecosistema che collega asset reali e strumenti digitali. Guardalo come materiale informativo; poi, se vuoi, lo analizziamo insieme con attenzione a funzionamento, rischi, documenti ufficiali e verifiche necessarie.',
    consultantUse: 'Usalo solo dopo aver capito se il lead ha asset reali, immobili, azienda, capitale o patrimonio da documentare. Va spiegato come approfondimento, non come promessa finanziaria.',
    caution: 'Non parlare mai di rendimento garantito e non personalizzare raccomandazioni d’investimento. Chiarire sempre rischi, documenti, audit, condizioni e natura informativa del materiale.',
    dataToAsk: ['Asset documentabili', 'Valore indicativo e titolarità', 'Obiettivo: liquidità, valorizzazione, crescita o studio', 'Livello di comprensione Web3/DeFi'],
    nextStep: 'Aprire i documenti ufficiali con il cliente e registrare dubbi, obiezioni e verifiche richieste.'
  },
  {
    id: 'pef-cliente',
    area: 'PEF Power',
    title: 'Energia green, bollette e consulenza luce/gas',
    target: 'Privati, famiglie, microimprese e aziende con bisogno energetico concreto',
    need: 'Valutare luce/gas con attenzione a trasparenza, assistenza, consumi e possibile risparmio.',
    level: 'Operativo',
    link: 'https://www.pefpower.it/it/home',
    assets: [{ label: 'Sito PEF Power', href: 'https://www.pefpower.it/it/home' }, { label: 'Checklist bolletta' }, { label: 'Scheda comparativa energia' }],
    message: 'Ti mando il riferimento PEF Power: l’obiettivo è valutare luce/gas con attenzione a trasparenza, assistenza e possibile risparmio. Se mi mandi una bolletta recente posso aiutarti a leggerla meglio e capire se ha senso approfondire.',
    consultantUse: 'Usalo quando il lead cita bollette alte, fornitore attuale, energia green, casa, negozio o multi-sede. Il valore nasce dalla lettura concreta dei dati, non da una promessa generica.',
    caution: 'Non promettere risparmi prima di leggere bolletta, consumi, POD/PDR e condizioni attuali.',
    dataToAsk: ['Bolletta recente', 'POD/PDR', 'Uso domestico o business', 'Consumi annui e potenza', 'Problemi con fornitore attuale'],
    nextStep: 'Creare task: richiedere bolletta e preparare lettura comparativa.'
  },
  {
    id: 'pef-collaboratore',
    area: 'PEF Italia',
    title: 'Percorso collaboratore e piano carriera',
    target: 'Collaboratori, consulenti energia, partner commerciali e team leader',
    need: 'Spiegare percorso formativo, punti carriera, requisiti e crescita rete senza creare aspettative scorrette.',
    level: 'Qualificazione',
    link: 'https://gest.pefitalia.it/area-riservata/DOCUMENTI%20COLLABORATORE/2_LETTERE%20DI%20INCARICO/5_COLLABORATORI%20SENZA%20PARTITA%20IVA/03_Piano%20Commerciale%20All%20A%20Carriera%20CF.pdf',
    assets: [{ label: 'Video Piano Carriera PEF Italia', href: 'https://drive.google.com/file/d/1ii-hHYxtPudo9EwDOHZDn7rPIW6DaWOZ/view?usp=sharing' }, { label: 'PDF Piano Commerciale PEF Italia', href: 'https://gest.pefitalia.it/area-riservata/DOCUMENTI%20COLLABORATORE/2_LETTERE%20DI%20INCARICO/5_COLLABORATORI%20SENZA%20PARTITA%20IVA/03_Piano%20Commerciale%20All%20A%20Carriera%20CF.pdf' }],
    message: 'Ti mando il materiale del piano PEF: guardalo come percorso formativo. La cosa importante è distinguere punti carriera, provvigioni reali, requisiti business e regole di equilibrio della rete.',
    consultantUse: 'Usalo con persone interessate a collaborare o sviluppare rete. Separare sempre cliente energia da collaboratore commerciale.',
    caution: 'Non presentare il piano come guadagno certo. Spiegare regole, requisiti, clausole, attività necessaria e bilanciamento rete.',
    dataToAsk: ['Esperienza commerciale', 'Tempo dedicabile', 'Rete relazionale reale', 'Preferenza: cliente, collaboratore o team leader', 'Obiettivi e aspettative'],
    nextStep: 'Programmare onboarding e chiarire punti, livelli, business mix e regole operative.'
  },
  {
    id: 'ubroker',
    area: 'Ubroker',
    title: 'Benchmark energia, web-app e assistenza diretta',
    target: 'Privati e aziende che vogliono confrontare bolletta, trasparenza, sconti e gestione digitale',
    need: 'Avere un riferimento energia alternativo o comparativo quando il bisogno è bolletta e chiarezza.',
    level: 'Interesse',
    link: 'https://ubroker.it',
    assets: [{ label: 'Sito Ubroker', href: 'https://ubroker.it' }, { label: 'Scheda comparativa energia' }],
    message: 'Ti mando anche Ubroker come riferimento energia. Può essere utile per confrontare offerta, trasparenza, assistenza e gestione digitale della bolletta prima di decidere quale percorso approfondire.',
    consultantUse: 'Usalo come benchmark quando il lead vuole capire alternative energia, app, sconti, assistenza o leggibilità dei costi.',
    caution: 'Non sostituire la verifica contrattuale: il confronto va fatto sui dati reali della fornitura.',
    dataToAsk: ['Bolletta e consumi', 'Fornitore attuale', 'Uso domestico o business', 'Problemi di assistenza', 'Aspettative su app e sconti'],
    nextStep: 'Preparare checklist energia e decidere se indirizzare verso PEF, Ubroker o ulteriore confronto.'
  }
]

const allMaterialIds = networkMaterials.map((material) => material.id)
const defaultCollaboratorMaterialIds = ['voicedesk', 'pef-cliente', 'ubroker']

function normalizeProfile(profile: Partial<CrmProfile>, fallbackName = 'Io'): CrmProfile {
  const timestamp = nowIso()
  const role = userRoles.includes(profile.role as UserRole) ? profile.role as UserRole : 'Collaboratore'
  const rawAllowed = Array.isArray(profile.allowedMaterialIds) ? profile.allowedMaterialIds : []
  const allowedMaterialIds = rawAllowed.length ? rawAllowed.filter((id) => allMaterialIds.includes(id)) : (role === 'Amministratore' ? allMaterialIds : defaultCollaboratorMaterialIds)
  return {
    id: profile.id || id('profilo'),
    dbId: profile.dbId,
    name: profile.name || fallbackName,
    role,
    allowedMaterialIds,
    permissionNotes: profile.permissionNotes || '',
    createdAt: profile.createdAt || timestamp,
    updatedAt: profile.updatedAt || timestamp,
  }
}

function materialAccessLabel(profile: CrmProfile | undefined, currentRole: UserRole) {
  if (currentRole === 'Amministratore') return 'Accesso completo amministratore'
  const allowed = profile?.allowedMaterialIds?.length || 0
  return `${allowed} servizi/materiali autorizzati`
}


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
  paidShareCapital: 0,
  realEstateValue: 0,
  inventoryValue: 0,
  equipmentValue: 0,
  receivablesValue: 0,
  cashValue: 0,
  brandValue: 0,
  annualRevenue: 0,
  annualEbitda: 0,
  annualEnergyCost: 0,
  expectedEnergySavingPct: 0,
  annualServiceCost: 0,
  preferredEnergyPath: 'Da valutare',
  studyNotes: '',
  servicePlafondNotes: '',
  researchEntryMode: 'Azienda',
  personFirstName: '',
  personLastName: '',
  personCity: '',
  companyLegalName: '',
  commercialName: '',
  commercialAliases: '',
  publicSources: '',
  facebookPageCandidates: '',
  confirmedFacebookPage: '',
  socialFacebookUrl: '',
  socialInstagramUrl: '',
  personCompanyLinks: '',
  publicComplaints: '',
  researchSummary: '',
  probableNeeds: '',
  recommendedQuestions: '',
  recommendedPath: '',
  confidenceScore: 35,
  relationshipType: 'Cliente',
      ownerName: '',
      sponsorName: '',
      collaboratorStage: 'Candidato',
      collaboratorRole: '',
      investorStage: 'Potenziale',
      investorProfile: '',
      expectedInvestment: 0,
      loiStatus: 'Da preparare',
      contractStatus: 'Da preparare',
      sharedDocuments: '',
      adminKpiNotes: '',
      voiceDeskSegment: 'Generico',
      voiceDeskEmailSentCount: 0,
      voiceDeskEmailOpenCount: 0,
      voiceDeskDemoClickCount: 0,
      voiceDeskCallClickCount: 0,
      voiceDeskLastAction: '',
      voiceDeskLastActionAt: '',
      netFreeStage: 'Non avviato',
      netFreeCandidateReason: '',
      netFreeConsentToCall: false,
      netFreeConsentAt: '',
      netFreeSharedWithClaudioAt: '',
      netFreeClaudioFeedback: '',
      netFreeNextStep: '',
      netFreeEstimatedOpportunity: '',
      netFreePreferredPhone: '',
      netFreeLeadProfile: '',
      netFreePreferredChannel: '',
      netFreePreferredTimeWindow: '',
      netFreeCallTone: '',
      netFreeBriefForClaudio: '',
      lcrAvailabilityWindow: 'Da definire',
      lcrCustomAvailability: '',
      lcrAgendaLink: '',
      lcrZoomLink: '',
      lcrVoiceSentAt: '',
      lcrPositiveReplyAt: '',
      lcrAppointmentAt: '',
      lcrZoomCompletedAt: '',
      lcrPrequalVoiceListened: 'Da valutare',
      lcrEthicsAligned: 'Da valutare',
      lcrMindsetAligned: 'Da valutare',
      lcrNetFreeAligned: 'Da valutare',
      lcrTokenizationAligned: 'Da valutare',
      lcrSelectionOutcome: 'Da valutare',
      lcrSelectionNotes: '',
      lcrTag: '',
      lcrPefDelegationStatus: 'Non avviata',
      lcrPefTechnicianNote: '',
      lcrMatrixSponsorId: '',
      lcrMatrixParentId: '',
      lcrMatrixPosition: 0,
      lcrMatrixLevel: 0,
      lcrMatrixSlot: 0,
      lcrDirectPeopleCount: 0,
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
function addDays(days: number) { const date = new Date(); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10) }
function monthKey(value: Date | string = new Date()) { const date = typeof value === 'string' ? new Date(value || today()) : value; return Number.isNaN(date.getTime()) ? today().slice(0, 7) : date.toISOString().slice(0, 7) }
function daysInMonth(month: string) { const [year, rawMonth] = month.split('-').map(Number); const date = new Date(year, (rawMonth || 1), 0); const total = date.getDate(); return Array.from({ length: total }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`) }
function calendarEventKind(task: Task) { const title = task.title.toLowerCase(); if (title.includes('follow')) return 'Follow-up'; if (title.includes('appunt') || title.includes('call') || title.includes('demo') || title.includes('incontro')) return 'Appuntamento'; if (title.includes('studio') || title.includes('plafond') || title.includes('valut')) return 'Studio'; return 'Attività' }
function calendarEventClass(task: Task) { const kind = calendarEventKind(task); if (task.completed) return 'border-stone-200 bg-stone-50 text-stone-500'; if (kind === 'Follow-up') return 'border-amber-200 bg-amber-50 text-amber-900'; if (kind === 'Appuntamento') return 'border-blue-200 bg-blue-50 text-blue-900'; if (kind === 'Studio') return 'border-teal-200 bg-teal-50 text-teal-900'; return priorityClass(task.priority) }
function id(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
function euro(value: number) { return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0) }
function fmtDate(value: string) { if (!value) return 'Non impostata'; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat('it-IT').format(d) }

function detectVoiceDeskSegment(contact?: Partial<Contact> | null): 'Ristorante' | 'Hotel' | 'Generico' {
  const haystack = [contact?.category, contact?.role, contact?.company, contact?.notes, contact?.messageAngle, contact?.personalizationHook, contact?.services].filter(Boolean).join(' ').toLowerCase()
  if (/hotel|albergo|b&b|bed and breakfast|ospitalit|reception|camere|booking|resort|residence|agriturismo|affittacamere|casa vacanze|case vacanze|campeggio|camping|glamping|villaggio turistico/.test(haystack)) return 'Hotel'
  if (/ristorante|trattoria|pizzeria|osteria|bar|food|cucina|tavoli|prenotazioni/.test(haystack)) return 'Ristorante'
  return 'Generico'
}

function voiceDeskProfile(contact?: Partial<Contact> | null) {
  const segment = contact?.voiceDeskSegment && contact.voiceDeskSegment !== 'Generico' ? contact.voiceDeskSegment : detectVoiceDeskSegment(contact)
  if (segment === 'Hotel') return { segment, label: 'Struttura ricettiva', phone: voiceDeskHotelPhone, displayPhone: voiceDeskHotelPhoneDisplay, context: 'reception, richieste ospiti e prenotazioni' }
  if (segment === 'Ristorante') return { segment, label: 'Ristorante', phone: voiceDeskRestaurantPhone, displayPhone: voiceDeskRestaurantPhoneDisplay, context: 'prenotazioni, richieste tavoli e chiamate fuori orario' }
  return { segment: 'Generico' as const, label: 'Attività da confermare', phone: voiceDeskHotelPhone, displayPhone: voiceDeskHotelPhoneDisplay, context: 'prime chiamate, richieste clienti e appuntamenti' }
}

function voiceDeskCallLine(contact?: Partial<Contact> | null) {
  const profile = voiceDeskProfile(contact)
  return `Chiama la demo VoiceDesk: ${profile.displayPhone}`
}

function voiceDeskCallHref(contact?: Partial<Contact> | null) {
  return `tel:${voiceDeskProfile(contact).phone}`
}

function isVoiceDeskHotelContact(contact?: Partial<Contact> | null) {
  return voiceDeskProfile(contact).segment === 'Hotel'
}

function voiceDeskHotelVideoLink() {
  if (typeof window === 'undefined') return voiceDeskHotelVideoUrl
  return `${window.location.origin}${voiceDeskHotelVideoUrl}`
}

function voiceDeskHotelVideoLine() {
  return `Guarda questo esempio: ${voiceDeskHotelVideoLink()}`
}

function buildVoiceDeskSocialTemplate(contact: Contact, channel: Channel = 'Instagram') {
  const profile = voiceDeskProfile(contact)
  const person = (contact.decisionMakerName || contact.name || 'buongiorno').trim()
  const business = (contact.company || contact.name || 'la sua attività').trim()
  if (profile.segment === 'Hotel') return `Hai visto cosa può fare per la tua struttura ricettiva?
${voiceDeskHotelVideoLine()}`
  return `Buongiorno ${person}, le lascio una demo telefonica rapida di VoiceDesk per ${business}.

${voiceDeskCallLine(contact)}

Risponde direttamente la demo dedicata a ${profile.label.toLowerCase()}.`
}

function safeTrackTarget(url: string) {
  return encodeURIComponent(url)
}

function buildTrackedVoiceDeskUrl(contact: Contact, event: 'open' | 'demo' | 'call', target: string) {
  if (typeof window === 'undefined') return target
  const contactKey = contact.dbId || contact.id
  if (!contactKey) return target
  return `${window.location.origin}/api/voicedesk-track?contact=${encodeURIComponent(contactKey)}&event=${encodeURIComponent(event)}&target=${safeTrackTarget(target)}`
}

function buildVoiceDeskEmailTemplate(contact: Contact) {
  const profile = voiceDeskProfile(contact)
  const demoLink = buildTrackedVoiceDeskUrl(contact, 'demo', voiceDeskDemoUrl)
  const callLink = buildTrackedVoiceDeskUrl(contact, 'call', voiceDeskCallHref(contact))
  const openPixel = buildTrackedVoiceDeskUrl(contact, 'open', '')
  const subject = profile.segment === 'Hotel' ? 'Hai visto cosa può fare per la tua struttura ricettiva?' : profile.segment === 'Ristorante' ? 'Demo prenotazioni pronta' : 'Demo VoiceDesk pronta'
  const person = (contact.decisionMakerName || contact.name || 'buongiorno').trim()
  const hotelBody = `Buongiorno ${person},

Hai visto cosa può fare per la tua struttura ricettiva?

Ti allego un video esempio molto breve: se ti riconosci nel problema, ha senso parlarne; se non è rilevante, nessun problema.

${voiceDeskHotelVideoLine()}

A presto.`
  const defaultBody = `Buongiorno ${person},

le lascio una demo telefonica rapida di VoiceDesk per ${profile.context}.

${voiceDeskCallLine(contact)}

A presto.`
  const body = profile.segment === 'Hotel' ? hotelBody : defaultBody
  const html = profile.segment === 'Hotel'
    ? `<p>Buongiorno ${person},</p><p><strong>Hai visto cosa può fare per la tua struttura ricettiva?</strong></p><p>Ti allego un video esempio molto breve: se ti riconosci nel problema, ha senso parlarne; se non è rilevante, nessun problema.</p><p><a href="${voiceDeskHotelVideoLink()}" style="display:inline-block;background:#111827;color:#ffffff;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:700">Guarda il video esempio</a></p><p style="font-size:13px;color:#6b7280">Il video va allegato alla mail; il pulsante resta come link di riserva se l’allegato non viene visualizzato.</p><img src="${openPixel}" width="1" height="1" alt="" style="display:none" />`
    : `<p>Buongiorno ${person},</p><p>le lascio una demo telefonica rapida di <strong>VoiceDesk</strong> per ${profile.context}.</p><p><a href="${callLink}" style="display:inline-block;background:#111827;color:#ffffff;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:700">Chiama la demo VoiceDesk</a></p><p style="font-size:14px;color:#374151">Numero diretto: <strong>${profile.displayPhone}</strong></p><p><a href="${demoLink}">Apri la landing VoiceDesk</a></p><img src="${openPixel}" width="1" height="1" alt="" style="display:none" />`
  return { subject, body, html, profile, demoLink, callLink }
}

function topics(value: string) { return value.split(',').map((item) => item.trim()).filter(Boolean) }
function statusClass(status: ContactStatus) { return ({ Lead: 'bg-blue-50 text-blue-700 border-blue-200', Prospect: 'bg-amber-50 text-amber-700 border-amber-200', Interessato: 'bg-purple-50 text-purple-700 border-purple-200', Cliente: 'bg-green-50 text-green-700 border-green-200', Partner: 'bg-teal-50 text-teal-700 border-teal-200' })[status] }
function priorityClass(priority: Priority) { return ({ Alta: 'bg-red-50 text-red-700 border-red-200', Media: 'bg-amber-50 text-amber-700 border-amber-200', Bassa: 'bg-stone-50 text-stone-700 border-stone-200' })[priority] }
function priorityLevelClass(priority?: PriorityLevel) { return ({ A: 'bg-red-50 text-red-700 border-red-200', B: 'bg-amber-50 text-amber-700 border-amber-200', C: 'bg-stone-50 text-stone-700 border-stone-200' })[priority || 'B'] }
function stageClass(stage?: OutreachStage) { return ({ 'Da qualificare': 'bg-slate-50 text-slate-700 border-slate-200', 'Ricerca guidata': 'bg-cyan-50 text-cyan-700 border-cyan-200', 'Video da preparare': 'bg-blue-50 text-blue-700 border-blue-200', 'Primo invio': 'bg-indigo-50 text-indigo-700 border-indigo-200', 'Follow-up 1': 'bg-amber-50 text-amber-700 border-amber-200', 'Risposta ricevuta': 'bg-purple-50 text-purple-700 border-purple-200', 'Demo richiesta': 'bg-green-50 text-green-700 border-green-200', 'Non interessato': 'bg-red-50 text-red-700 border-red-200', Sospeso: 'bg-stone-50 text-stone-700 border-stone-200' })[stage || 'Da qualificare'] }
function normalizeContact(contact: Contact): Contact { const safeTopics = Array.isArray((contact as any).topics) ? (contact as any).topics.map((topic: any) => String(topic || '').trim()).filter(Boolean) : String((contact as any).topics || '').split(/[;,|]/).map((topic) => topic.trim()).filter(Boolean); return { ...contact, topics: safeTopics, name: String((contact as any).name || 'Lead da completare'), company: contact.company || String((contact as any).name || 'Lead da completare'), city: contact.city || 'Milano', priorityLevel: contact.priorityLevel || 'B', outreachStage: contact.outreachStage || 'Da qualificare', generalEmail: contact.generalEmail || contact.email || '', sourceBatch: contact.sourceBatch || '', preferredEnergyPath: contact.preferredEnergyPath || 'Da valutare', researchEntryMode: contact.researchEntryMode || 'Azienda', commercialName: contact.commercialName || contact.company || contact.name, companyLegalName: contact.companyLegalName || '', commercialAliases: contact.commercialAliases || '', publicSources: contact.publicSources || '', facebookPageCandidates: contact.facebookPageCandidates || '', confirmedFacebookPage: contact.confirmedFacebookPage || '', socialFacebookUrl: contact.socialFacebookUrl || contact.confirmedFacebookPage || '', socialInstagramUrl: contact.socialInstagramUrl || '', personCompanyLinks: contact.personCompanyLinks || '', publicComplaints: contact.publicComplaints || '', researchSummary: contact.researchSummary || '', probableNeeds: contact.probableNeeds || '', recommendedQuestions: contact.recommendedQuestions || '', recommendedPath: contact.recommendedPath || '', confidenceScore: typeof contact.confidenceScore === 'number' ? contact.confidenceScore : 35, relationshipType: contact.relationshipType || 'Cliente', ownerName: contact.ownerName || '', sponsorName: contact.sponsorName || '', collaboratorStage: contact.collaboratorStage || 'Candidato', collaboratorRole: contact.collaboratorRole || '', investorStage: contact.investorStage || 'Potenziale', investorProfile: contact.investorProfile || '', expectedInvestment: num(contact.expectedInvestment), loiStatus: contact.loiStatus || 'Da preparare', contractStatus: contact.contractStatus || 'Da preparare', sharedDocuments: contact.sharedDocuments || '', adminKpiNotes: contact.adminKpiNotes || '', voiceDeskSegment: contact.voiceDeskSegment || detectVoiceDeskSegment(contact), voiceDeskEmailSentCount: Number(contact.voiceDeskEmailSentCount || 0), voiceDeskEmailOpenCount: Number(contact.voiceDeskEmailOpenCount || 0), voiceDeskDemoClickCount: Number(contact.voiceDeskDemoClickCount || 0), voiceDeskCallClickCount: Number(contact.voiceDeskCallClickCount || 0), voiceDeskLastAction: contact.voiceDeskLastAction || '', voiceDeskLastActionAt: contact.voiceDeskLastActionAt || '', netFreeStage: contact.netFreeStage || 'Non avviato', netFreeCandidateReason: contact.netFreeCandidateReason || '', netFreeConsentToCall: Boolean(contact.netFreeConsentToCall), netFreeConsentAt: contact.netFreeConsentAt || '', netFreeSharedWithClaudioAt: contact.netFreeSharedWithClaudioAt || '', netFreeClaudioFeedback: contact.netFreeClaudioFeedback || '', netFreeNextStep: contact.netFreeNextStep || '', netFreeEstimatedOpportunity: contact.netFreeEstimatedOpportunity || '', netFreePreferredPhone: contact.netFreePreferredPhone || contact.phone || '', netFreeLeadProfile: contact.netFreeLeadProfile || contact.researchSummary || '', netFreePreferredChannel: contact.netFreePreferredChannel || '', netFreePreferredTimeWindow: contact.netFreePreferredTimeWindow || '', netFreeCallTone: contact.netFreeCallTone || '', netFreeBriefForClaudio: contact.netFreeBriefForClaudio || '', lcrAvailabilityWindow: contact.lcrAvailabilityWindow || 'Da definire', lcrCustomAvailability: contact.lcrCustomAvailability || '', lcrAgendaLink: contact.lcrAgendaLink || '', lcrZoomLink: contact.lcrZoomLink || '', lcrVoiceSentAt: contact.lcrVoiceSentAt || '', lcrPositiveReplyAt: contact.lcrPositiveReplyAt || '', lcrAppointmentAt: contact.lcrAppointmentAt || '', lcrZoomCompletedAt: contact.lcrZoomCompletedAt || '', lcrPrequalVoiceListened: contact.lcrPrequalVoiceListened || 'Da valutare', lcrEthicsAligned: contact.lcrEthicsAligned || 'Da valutare', lcrMindsetAligned: contact.lcrMindsetAligned || 'Da valutare', lcrNetFreeAligned: contact.lcrNetFreeAligned || 'Da valutare', lcrTokenizationAligned: contact.lcrTokenizationAligned || 'Da valutare', lcrSelectionOutcome: contact.lcrSelectionOutcome || 'Da valutare', lcrSelectionNotes: contact.lcrSelectionNotes || '', lcrTag: contact.lcrTag || '', lcrPefDelegationStatus: contact.lcrPefDelegationStatus || 'Non avviata', lcrPefTechnicianNote: contact.lcrPefTechnicianNote || '', lcrMatrixSponsorId: contact.lcrMatrixSponsorId || '', lcrMatrixParentId: contact.lcrMatrixParentId || '', lcrMatrixPosition: Number(contact.lcrMatrixPosition || 0), lcrMatrixLevel: Number(contact.lcrMatrixLevel || 0), lcrMatrixSlot: Number(contact.lcrMatrixSlot || 0), lcrDirectPeopleCount: Number(contact.lcrDirectPeopleCount || 0) } }
function num(value?: number | string) { const parsed = typeof value === 'string' ? Number(value.replace(',', '.')) : Number(value || 0); return Number.isFinite(parsed) ? parsed : 0 }
function pct(value?: number) { return `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(num(value))}%` }

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
  const socialFacebookUrl = firstMatch(text, /(https?:\/\/(?:www\.)?(?:facebook|fb)\.com\/[^\s,;]+)/i) || firstMatch(text, /(?:facebook|pagina facebook)\s*:?\s*(@?[A-Za-z0-9._-]+)/i)
  const socialInstagramUrl = firstMatch(text, /(https?:\/\/(?:www\.)?instagram\.com\/[^\s,;]+)/i) || firstMatch(text, /(?:instagram|ig)\s*:?\s*(@?[A-Za-z0-9._-]+)/i)
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
    socialFacebookUrl ? `Facebook indicato: ${socialFacebookUrl}` : '',
    socialInstagramUrl ? `Instagram indicato: ${socialInstagramUrl}` : '',
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
    socialFacebookUrl,
    socialInstagramUrl,
    confirmedFacebookPage: socialFacebookUrl,
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

function valuationSnapshot(contact?: Contact) {
  const assetBase = num(contact?.paidShareCapital) + num(contact?.realEstateValue) + num(contact?.inventoryValue) + num(contact?.equipmentValue) + num(contact?.receivablesValue) + num(contact?.cashValue) + num(contact?.brandValue)
  const ebitdaComponent = Math.max(0, num(contact?.annualEbitda) * 3)
  const estimatedCompanyValue = Math.max(0, assetBase + ebitdaComponent)
  const annualTokenYield = estimatedCompanyValue * 0.025
  const annualServiceCost = num(contact?.annualServiceCost)
  const annualEnergyCost = num(contact?.annualEnergyCost)
  const expectedEnergySaving = annualEnergyCost * (num(contact?.expectedEnergySavingPct) / 100)
  const totalCoverage = annualTokenYield + expectedEnergySaving
  const surplusOrGap = totalCoverage - annualServiceCost
  return { assetBase, ebitdaComponent, estimatedCompanyValue, annualTokenYield, annualServiceCost, annualEnergyCost, expectedEnergySaving, totalCoverage, surplusOrGap }
}
function valuationReadiness(contact?: Contact) {
  if (!contact) return 0
  const fields = [contact.paidShareCapital, contact.realEstateValue, contact.inventoryValue, contact.equipmentValue, contact.receivablesValue, contact.cashValue, contact.brandValue, contact.annualRevenue, contact.annualEbitda, contact.annualEnergyCost, contact.annualServiceCost]
  return Math.round(fields.filter((v) => num(v) > 0).length / fields.length * 100)
}
function tailoredStudyPrompt(contact?: Contact) {
  if (!contact) return 'Seleziona un lead per costruire uno studio su misura.'
  const snap = valuationSnapshot(contact)
  const energyPath = contact.preferredEnergyPath || 'Da valutare'
  const businessName = (contact.company || contact.name || 'azienda selezionata').trim()
  return `Studio su misura per ${businessName}: prima comprendere bisogni, costi attuali e obiettivi; poi proporre un plafond servizi sostenibile. Valore aziendale indicativo ${euro(snap.estimatedCompanyValue)}, potenziale 2,5% annuo ${euro(snap.annualTokenYield)}, risparmio energia stimato ${euro(snap.expectedEnergySaving)}, copertura totale ${euro(snap.totalCoverage)} rispetto a servizi per ${euro(snap.annualServiceCost)}. Percorso energia: ${energyPath}. Nota: ${contact.studyNotes || 'raccogliere capitale sociale versato, immobili, magazzino, attrezzature, marginalità, costi energia e priorità personali prima di proporre.'}`
}



function compactLines(value?: string) { return (value || '').split(/\n|;/).map((item) => item.trim()).filter(Boolean) }
function confidenceLabel(score?: number) { const value = Math.max(0, Math.min(100, num(score))); return value >= 75 ? 'Alta' : value >= 45 ? 'Media' : 'Bassa' }
function splitPersonName(contact?: Contact) {
  const base = `${contact?.decisionMakerName || contact?.name || ''}`.trim()
  const parts = base.split(/\s+/).filter(Boolean)
  return { firstName: contact?.personFirstName || parts[0] || '', lastName: contact?.personLastName || parts.slice(1).join(' ') || '', fullName: [contact?.personFirstName || parts[0] || '', contact?.personLastName || parts.slice(1).join(' ') || ''].filter(Boolean).join(' ') || base }
}
function leadResearchSnapshot(contact?: Contact) {
  if (!contact) return { score: 0, label: 'Bassa', sources: [] as string[], needs: [] as string[], questions: [] as string[], queries: [] as string[], missing: [] as string[], summary: 'Seleziona o crea un lead per avviare la ricerca guidata.' }
  const mode = contact.researchEntryMode || 'Azienda'
  const person = splitPersonName(contact)
  const business = (contact.commercialName || contact.company || contact.name || '').trim()
  const legal = (contact.companyLegalName || '').trim()
  const city = contact.city || contact.personCity || 'città da verificare'
  const aliases = compactLines(contact.commercialAliases)
  const sources = compactLines(contact.publicSources)
  const needs = compactLines(contact.probableNeeds)
  const questions = compactLines(contact.recommendedQuestions)
  const scoreParts = [contact.website, contact.phone, contact.email || contact.generalEmail || contact.decisionMakerEmail, contact.city, contact.publicSources, contact.researchSummary, contact.probableNeeds, contact.recommendedPath, contact.confirmedFacebookPage, contact.companyLegalName || contact.commercialName].filter(Boolean).length
  const score = Math.max(num(contact.confidenceScore), Math.min(95, Math.round(scoreParts * 9.5)))
  const missing = [!contact.website ? 'sito/dominio' : '', !contact.phone ? 'telefono pubblico' : '', !contact.city ? 'città/sede' : '', !contact.publicSources ? 'fonti pubbliche verificate' : '', !contact.probableNeeds ? 'bisogni probabili' : '', !contact.recommendedPath ? 'percorso consigliato' : '', !contact.researchSummary ? 'sintesi consulenziale' : ''].filter(Boolean)
  const baseQueries = mode === 'Persona fisica'
    ? [`${person.fullName} ${city}`, `${person.fullName} ${business}`.trim(), `${person.fullName} LinkedIn azienda`, `${person.fullName} telefono email attività`]
    : [`${business} ${city}`, `${business} sito ufficiale telefono email`, `${business} Facebook Instagram recensioni`, legal ? `${legal} ${city}` : `${business} ragione sociale partita iva`]
  const queries = Array.from(new Set([...baseQueries, ...aliases.map((alias) => `${alias} ${city}`)])).filter((item) => item.trim().length > 3)
  const summary = contact.researchSummary || `Ricerca ${mode.toLowerCase()} per ${mode === 'Persona fisica' ? person.fullName || contact.name : business}. Verificare solo fonti pubbliche coerenti: sito, telefono, dominio email, città, ragione sociale o ruolo dichiarato. Non associare pagine social solo per somiglianza del nome.`
  return { score, label: confidenceLabel(score), sources, needs, questions, queries, missing, summary }
}
function buildGuidedCloserContext(contact?: Contact) {
  if (!contact) return 'Nessun contatto selezionato.'
  const research = leadResearchSnapshot(contact)
  const snap = valuationSnapshot(contact)
  const coverage = snap.annualServiceCost > 0 ? `${euro(snap.totalCoverage)} su ${euro(snap.annualServiceCost)}` : 'da calcolare dopo raccolta dati'
  return `Contesto consulenziale: ${research.summary} Bisogni probabili: ${research.needs.join('; ') || 'da verificare con domande aperte'}. Percorso consigliato: ${contact.recommendedPath || 'diagnosi prima della proposta'}. Copertura servizi indicativa: ${coverage}. Confidenza ricerca: ${research.label} (${research.score}/100).`
}

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
  if (lower.includes('messaggio') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('closing') || lower.includes('chiud') || lower.includes('soft')) { const target = hot[0]; const business = (target.company || target.name).trim(); const person = (target.decisionMakerName || target.name).trim(); return `Messaggio pronto per il cliente: Buongiorno ${person}, le scrivo in modo molto diretto e senza proposta preconfezionata. Per ${business}, qual è oggi la richiesta dei clienti che vi fa perdere più tempo o che rischia di non ricevere risposta nel momento giusto? Se ha senso, posso prepararle un esempio molto breve e concreto, senza impegno.` }
  if (lower.includes('studio') || lower.includes('token') || lower.includes('plafond') || lower.includes('bollette') || lower.includes('energia')) { const target = hot[0]; const snap = valuationSnapshot(target); return `${tailoredStudyPrompt(target)} Prossima mossa: raccogli i dati mancanti e non vendere subito; costruisci un vestito su misura legato a problemi reali, copertura economica e priorità della persona.` }
  if (lower.includes('pipeline') || lower.includes('valore')) return `La pipeline totale stimata è ${euro(pipeline)}. ${statuses.map((s) => `${s}: ${euro(contacts.filter((c) => c.status === s).reduce((sum, c) => sum + c.value, 0))}`).join('; ')}.`
  if (lower.includes('conversazioni') || lower.includes('analisi')) return `Hai archiviato ${conversations.length} comunicazioni. Ultima analisi: ${conversations[0]?.analysis.summary || 'nessuna analisi ancora presente'}`
  return `Sintesi operativa: ${contacts.length}/100 contatti, ${aList.length} A-list, ${openTasks.length} task aperti. La mossa più utile ora è lavorare su ${hot[0].name}: ${hot[0].nextAction || hot[0].messageAngle || 'definisci il prossimo contatto'}.`
}


const valuationFieldGroups: Array<{ title: string; description: string; fields: Array<{ key: keyof ContactDraft; label: string; unit: string; help: string; span?: string }> }> = [
  {
    title: 'Base patrimoniale indicativa',
    description: 'Inserisci solo valori ragionevolmente documentabili. Questi numeri formano la base dei beni e dei valori già presenti in azienda.',
    fields: [
      { key: 'paidShareCapital', label: 'Capitale versato', unit: '€', help: 'Capitale sociale effettivamente versato e risultante dai documenti societari.' },
      { key: 'realEstateValue', label: 'Valore immobili', unit: '€', help: 'Stima prudente di fabbricati, terreni o immobili intestati o realmente disponibili all’attività.' },
      { key: 'inventoryValue', label: 'Magazzino', unit: '€', help: 'Valore indicativo di scorte, merci, prodotti o materiali vendibili/utilizzabili.' },
      { key: 'equipmentValue', label: 'Impianti e attrezzature', unit: '€', help: 'Valore residuo o commerciale di macchinari, arredi, strumenti, impianti e dotazioni operative.' },
      { key: 'receivablesValue', label: 'Crediti esigibili', unit: '€', help: 'Fatture da incassare, crediti commerciali o importi ragionevolmente recuperabili.' },
      { key: 'cashValue', label: 'Liquidità disponibile', unit: '€', help: 'Cassa, banca e disponibilità immediate che possono sostenere il percorso.' },
      { key: 'brandValue', label: 'Avviamento / brand', unit: '€', help: 'Valore commerciale stimato di reputazione, posizione, clientela, marchio o storico vendite.', span: 'md:col-span-2' },
    ],
  },
  {
    title: 'Economia attuale, servizi ed energia',
    description: 'Questi campi chiariscono capacità economica, marginalità e copertura dei servizi proposti, senza obbligare a una proposta standard.',
    fields: [
      { key: 'annualRevenue', label: 'Fatturato annuo', unit: '€ / anno', help: 'Ricavi lordi degli ultimi 12 mesi o dell’ultimo bilancio disponibile.' },
      { key: 'annualEbitda', label: 'EBITDA / margine operativo', unit: '€ / anno', help: 'Margine operativo indicativo prima di interessi, imposte, ammortamenti e svalutazioni.' },
      { key: 'annualServiceCost', label: 'Costo annuo servizi proposti', unit: '€ / anno', help: 'Totale annuo del percorso che vuoi proporre: CRM, Voice Desk, automazioni, consulenza, marketing o formazione.' },
      { key: 'annualEnergyCost', label: 'Costo annuo energia', unit: '€ / anno', help: 'Spesa annua indicativa di luce/gas/energia da usare per stimare eventuale risparmio.' },
      { key: 'expectedEnergySavingPct', label: 'Risparmio energia stimato', unit: '%', help: 'Percentuale prudente di risparmio atteso sul costo energia, da confermare con verifica successiva.' },
    ],
  },
]

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
  const [calendarMonth, setCalendarMonth] = useState(monthKey())
  const [conversation, setConversation] = useState('')
  const [communicationChannel, setCommunicationChannel] = useState<Channel>('Email')
  const [communicationStage, setCommunicationStage] = useState<OutreachStage>('Primo invio')
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null)
  const [question, setQuestion] = useState('Chi devo contattare oggi?')
  const [answer, setAnswer] = useState('Carica il primo batch o inserisci i tuoi contatti qualificati: userò quei dati per suggerire priorità, follow-up e prossime azioni.')
  const [search, setSearch] = useState('')
  const [netFreeListQuery, setNetFreeListQuery] = useState('')
  const [netFreeArchiveLoading, setNetFreeArchiveLoading] = useState(false)
  const [mailingPriority, setMailingPriority] = useState<MailingPriorityFilter>('A')
  const [mailingStage, setMailingStage] = useState<MailingStageFilter>('Tutti')
  const [mailingSeparator, setMailingSeparator] = useState<MailingSeparator>('punto e virgola')
  const [mailingCopied, setMailingCopied] = useState(false)
  const [assistedTemplate, setAssistedTemplate] = useState<CommunicationTemplate>('opener')
  const [salesTone, setSalesTone] = useState<SalesTone>('Soft')
  const [strategicIntent, setStrategicIntent] = useState<StrategicIntent>('Capire bisogno')
  const [assistedFeedback, setAssistedFeedback] = useState('')
  const [studySavedFeedback, setStudySavedFeedback] = useState('')
  const [researchSavedFeedback, setResearchSavedFeedback] = useState('')
  const [quickPasteText, setQuickPasteText] = useState('')
  const [quickPasteFeedback, setQuickPasteFeedback] = useState('')
  const contactsRef = useRef<Contact[]>([])
  const netFreeImportGuardUntilRef = useRef(0)
  const [cloudStatus, setCloudStatus] = useState<CloudPersistenceStatus>('verifica')
  const [cloudMessage, setCloudMessage] = useState('Verifico se il CRM può salvare sul database persistente.')
  const [cloudReady, setCloudReady] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [currentRole, setCurrentRole] = useState<UserRole>('Amministratore')
  const [meetStatus, setMeetStatus] = useState<MeetAutomationStatus>('verifica')
  const [meetMessage, setMeetMessage] = useState('Verifico collegamento Google Calendar/Meet.')
  const [meetAccountLabel, setMeetAccountLabel] = useState('')
  const [meetTime, setMeetTime] = useState('10:00')
  const [meetDuration, setMeetDuration] = useState(30)
  const [meetNotes, setMeetNotes] = useState('')

  async function checkAuthUser() {
    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const localEmail = typeof window !== 'undefined' ? window.localStorage.getItem('crm_demo_auth_email') : ''
      setAuthEmail(data.user?.email || localEmail || '')
    } catch {
      setAuthEmail('')
    }
  }

  async function signOutFromDemo() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('crm_demo_auth_email')
        window.localStorage.removeItem('crm_demo_login_mode')
      }
      setAuthEmail('')
      setAnswer('Sei uscito dalla sessione locale. Puoi continuare a usare la demo oppure rientrare dal pulsante Accedi.')
    }
  }

  function goToLogin() {
    window.location.href = '/auth/login?redirect=/demo'
  }

  async function checkGoogleMeetStatus() {
    setMeetStatus('verifica')
    setMeetMessage('Verifico collegamento Google Calendar/Meet...')
    try {
      const response = await fetch('/api/google/status', { cache: 'no-store' })
      const payload = await response.json().catch(() => ({}))
      if (response.status === 401) {
        setMeetStatus('non_collegato')
        setMeetAccountLabel('')
        setMeetMessage('Accedi al CRM per usare la creazione automatica degli appuntamenti Meet.')
        return
      }
      if (!response.ok || !payload.connected) {
        setMeetStatus('non_collegato')
        setMeetAccountLabel('')
        setMeetMessage(payload.reason || 'Google Calendar/Meet non è ancora collegato. Serve collegarlo una sola volta.')
        return
      }
      setMeetStatus('collegato')
      setMeetAccountLabel(payload.email || payload.displayName || 'Google Calendar')
      setMeetMessage(`Google Meet collegato: ${payload.email || payload.displayName || 'account attivo'}. Conferma un appuntamento dal CRM e l’invito parte da Calendar.`)
    } catch {
      setMeetStatus('errore')
      setMeetAccountLabel('')
      setMeetMessage('Non riesco a verificare Google Calendar/Meet. Controlla configurazione e accesso.')
    }
  }

  function connectGoogleMeet() {
    window.location.href = '/api/google/connect'
  }

  function isNetFreeContact(contact: Contact) {
    return Boolean((contact.netFreeStage && contact.netFreeStage !== 'Non avviato') || contact.netFreeCandidateReason || contact.netFreeLeadProfile || contact.netFreeBriefForClaudio || contact.sourceBatch?.toLowerCase().includes('netfree'))
  }

  function isMassiveNetFreeSnapshot(snapshot: Contact[]) {
    return snapshot.length >= MASSIVE_NETFREE_IMPORT_THRESHOLD || snapshot.filter(isNetFreeContact).length >= MASSIVE_NETFREE_IMPORT_THRESHOLD
  }

  function isNetFreeImportGuardActive() {
    return Date.now() < netFreeImportGuardUntilRef.current
  }

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

  async function loadCloudContacts(localSnapshot: Contact[] = []) {
    setCloudStatus('verifica')
    setCloudMessage('Controllo collegamento al database persistente...')
    try {
      const response = await fetch('/api/contacts?format=demo', { cache: 'no-store' })
      if (response.status === 401) {
        setCloudStatus('locale')
        setCloudReady(false)
        setCloudMessage('Accesso non effettuato: i dati restano solo nel browser. Per ritrovarli ogni giorno, accedi al CRM e collega il database.')
        return
      }
      if (response.status === 503) {
        setCloudStatus('locale')
        setCloudReady(false)
        setCloudMessage('Modalità locale attiva: Supabase non è ancora configurato con chiavi reali. I dati restano nel browser; usa Backup prima di chiudere.')
        return
      }
      if (!response.ok) throw new Error('Database non disponibile')
      const payload = await response.json()
      const cloudContacts = Array.isArray(payload.contacts) ? payload.contacts.map(normalizeContact) : []
      const currentSnapshot = contactsRef.current
      const protectLocalImport = isNetFreeImportGuardActive() || isMassiveNetFreeSnapshot(currentSnapshot) || (localSnapshot.length > cloudContacts.length && isMassiveNetFreeSnapshot(localSnapshot))
      setCloudStatus('cloud')
      setCloudReady(!protectLocalImport)
      setCloudMessage(protectLocalImport
        ? `Database persistente raggiunto, ma non sovrascrivo l’archivio NetFree locale/massivo: cloud ${cloudContacts.length} contatti, locale ${Math.max(currentSnapshot.length, localSnapshot.length)} contatti. Esporta un Backup o sincronizza a blocchi.`
        : `Database persistente attivo: ${cloudContacts.length} contatti caricati dal cloud.`)
      if (cloudContacts.length > 0 && !protectLocalImport) {
        setContacts(cloudContacts)
        setSelectedContactId(cloudContacts[0]?.id || '')
      } else if (cloudContacts.length === 0 && localSnapshot.length > 0 && !protectLocalImport) {
        await syncCloudContacts(localSnapshot, 'Ho trovato dati locali: li sto copiando nel database persistente.')
      }
    } catch {
      setCloudStatus('errore')
      setCloudReady(false)
      setCloudMessage('Database non raggiungibile: continuo in modalità locale. Usa Backup/Importa finché il deploy non ha Supabase configurato.')
    }
  }

  async function syncCloudContacts(snapshot: Contact[] = contacts, customMessage?: string) {
    if (!snapshot.length) return
    const isMassiveSnapshot = isMassiveNetFreeSnapshot(snapshot)
    const isManualOrImportSync = Boolean(customMessage)
    if ((isNetFreeImportGuardActive() || isMassiveSnapshot) && !isManualOrImportSync) {
      setCloudStatus('locale')
      setCloudReady(false)
      setCloudMessage('Sync automatico sospeso per archivio NetFree massivo: i contatti restano visibili nella sessione. Usa Backup oppure avvia/riavvia la sincronizzazione cloud a blocchi dopo aver configurato Supabase.')
      return
    }
    const batchSize = isMassiveSnapshot ? NETFREE_CLOUD_SYNC_BATCH_SIZE : Math.max(snapshot.length, 1)
    const totalBatches = Math.ceil(snapshot.length / batchSize)
    const savedContacts: Contact[] = []
    const errors: string[] = []
    setCloudStatus('salvataggio')
    setCloudReady(false)
    setCloudMessage(customMessage || (isMassiveSnapshot ? `Salvataggio cloud NetFree a blocchi: 0/${snapshot.length} contatti.` : 'Salvataggio automatico dei contatti sul database persistente...'))
    try {
      for (let index = 0; index < snapshot.length; index += batchSize) {
        const batch = snapshot.slice(index, index + batchSize)
        const batchNumber = Math.floor(index / batchSize) + 1
        if (isMassiveSnapshot) setCloudMessage(`Salvataggio cloud NetFree a blocchi: blocco ${batchNumber}/${totalBatches}, ${Math.min(index + batch.length, snapshot.length)}/${snapshot.length} contatti.`)
        const response = await fetch('/api/contacts/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts: batch }),
        })
        const rawPayload = await response.text()
        let payload: any = {}
        try { payload = rawPayload ? JSON.parse(rawPayload) : {} } catch { payload = { error: rawPayload } }
        const apiMessage = String(payload?.message || payload?.error || '').trim()
        const partialErrors = Array.isArray(payload?.errors) ? payload.errors.filter(Boolean).slice(0, 3).map(String) : []

        if (response.status === 401) {
          setCloudStatus('locale')
          setCloudReady(false)
          setCloudMessage(apiMessage || 'Non sei autenticato: modifiche salvate solo nel browser. Accedi per renderle persistenti.')
          return
        }
        if (response.status === 503) {
          setCloudStatus('locale')
          setCloudReady(false)
          setCloudMessage(apiMessage || 'Cloud non configurato: modifiche salvate nel browser. Inserisci URL, anon key e service role Supabase reali nel deploy.')
          return
        }
        if (!response.ok && response.status !== 207) throw new Error(apiMessage || `Sincronizzazione fallita con stato ${response.status}`)

        const saved = Array.isArray(payload.saved) ? payload.saved.map(normalizeContact) : []
        savedContacts.push(...saved)
        if (partialErrors.length) errors.push(...partialErrors)
      }

      if (savedContacts.length > 0 && savedContacts.length >= snapshot.length) setContacts(savedContacts)
      const partial = errors.length > 0 || savedContacts.length < snapshot.length
      setCloudStatus(partial ? 'errore' : 'cloud')
      setCloudReady(!partial)
      setCloudMessage(partial
        ? `Sincronizzazione parziale: salvati ${savedContacts.length}/${snapshot.length} contatti. Dettagli: ${errors.slice(0, 2).join(' · ') || 'alcuni contatti non sono stati confermati dal cloud'}. Esegui Backup prima di chiudere.`
        : `Salvato sul database persistente: ${savedContacts.length || snapshot.length} contatti${isMassiveSnapshot ? ' NetFree sincronizzati a blocchi' : ''}.`)
    } catch (error: any) {
      setCloudStatus('locale')
      setCloudReady(false)
      setCloudMessage(`Cloud non raggiungibile: dati mantenuti localmente. Motivo: ${error?.message || 'errore di rete o configurazione'}. Esporta un backup prima di chiudere.`)
    }
  }

  useEffect(() => {
    void checkAuthUser()
    try {
      const savedProfiles = window.localStorage.getItem(PROFILE_LIST_KEY)
      let parsedProfiles = savedProfiles ? JSON.parse(savedProfiles) as CrmProfile[] : []
      parsedProfiles = Array.isArray(parsedProfiles) ? parsedProfiles.map((profile, index) => normalizeProfile(profile, index === 0 ? 'Io' : `Profilo ${index + 1}`)) : []
      if (!Array.isArray(parsedProfiles) || parsedProfiles.length === 0) {
        const timestamp = nowIso()
        parsedProfiles = [normalizeProfile({ id: 'profilo-io', name: 'Io', role: 'Amministratore', allowedMaterialIds: allMaterialIds, createdAt: timestamp, updatedAt: timestamp })]
        window.localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(parsedProfiles))
      }
      const savedActive = window.localStorage.getItem(ACTIVE_PROFILE_KEY)
      const nextActive = parsedProfiles.find((profile) => profile.id === savedActive)?.id || parsedProfiles[0].id
      setProfiles(parsedProfiles)
      setActiveProfileId(nextActive)
      window.localStorage.setItem(ACTIVE_PROFILE_KEY, nextActive)
      loadProfileData(nextActive, nextActive === parsedProfiles[0].id)
      const localSnapshot = (() => { try { const stored = window.localStorage.getItem(profileStorageKey(nextActive)); const parsed = stored ? JSON.parse(stored) as StoredCrmData : null; return Array.isArray(parsed?.contacts) ? parsed.contacts.map(normalizeContact) : [] } catch { return [] } })()
      void loadCloudContacts(localSnapshot)
    } catch {
      const timestamp = nowIso()
      const fallback = [normalizeProfile({ id: 'profilo-io', name: 'Io', role: 'Amministratore', allowedMaterialIds: allMaterialIds, createdAt: timestamp, updatedAt: timestamp })]
      setProfiles(fallback); setActiveProfileId(fallback[0].id); loadProfileData(fallback[0].id, true); void loadCloudContacts([])
    }
    setHydrated(true)
  }, [])

  useEffect(() => { contactsRef.current = contacts }, [contacts])

  useEffect(() => { if (hydrated) void checkGoogleMeetStatus() }, [hydrated, authEmail])

  useEffect(() => {
    if (!hydrated || !activeProfileId) return
    if (isNetFreeImportGuardActive() || isMassiveNetFreeSnapshot(contacts)) {
      setCloudStatus('locale')
      setCloudReady(false)
      setCloudMessage('Archivio NetFree massivo caricato e visibile in sessione. Salvataggio locale automatico sospeso per evitare quota browser e overwrite: esporta subito un Backup oppure importa/sincronizza a blocchi.')
      return
    }
    try {
      window.localStorage.setItem(profileStorageKey(activeProfileId), JSON.stringify({ contacts, tasks, conversations }))
    } catch (error: any) {
      setCloudStatus('locale')
      setCloudReady(false)
      const isQuota = String(error?.name || error?.message || '').toLowerCase().includes('quota')
      setCloudMessage(isQuota
        ? 'Il browser non riesce a salvare localmente tutti i lead NetFree perché il file è molto grande. I contatti restano visibili in questa sessione: esporta subito un Backup o lavora con database cloud attivo.'
        : `Salvataggio locale non riuscito: ${error?.message || 'errore del browser'}. Esporta un Backup prima di chiudere.`)
      try { window.localStorage.removeItem(profileStorageKey(activeProfileId)) } catch {}
    }
  }, [contacts, tasks, conversations, hydrated, activeProfileId])
  useEffect(() => {
    if (!hydrated || !cloudReady || cloudStatus === 'salvataggio') return
    const timer = window.setTimeout(() => { void syncCloudContacts(contacts) }, 1200)
    return () => window.clearTimeout(timer)
  }, [contacts, hydrated, cloudReady])
  useEffect(() => { if (hydrated) window.localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(profiles)) }, [profiles, hydrated])
  useEffect(() => { if (section === 'study' && selectedContact) setDraft(draftFromContact(selectedContact)) }, [section, selectedContactId])

  const activeProfile = useMemo(() => profiles.find((profile) => profile.id === activeProfileId), [profiles, activeProfileId])
  const selectedContact = useMemo(() => contacts.find((c) => c.id === selectedContactId) || contacts[0], [contacts, selectedContactId])
  const filteredContacts = useMemo(() => {
    const q = search.toLowerCase().trim()
    return q ? contacts.filter((c) => [c.name, c.company, c.role, c.email, c.phone, c.notes, c.topics.join(' '), c.category, c.subcategory, c.city, c.website, c.socialFacebookUrl, c.socialInstagramUrl, c.confirmedFacebookPage, c.decisionMakerName, c.personalizationHook, c.messageAngle, c.outreachStage, c.priorityLevel].join(' ').toLowerCase().includes(q)) : contacts
  }, [contacts, search])
  const openTasks = tasks.filter((t) => !t.completed)
  const calendarDays = useMemo(() => daysInMonth(calendarMonth), [calendarMonth])
  const calendarTasks = useMemo(() => tasks.filter((task) => task.due).slice().sort((a, b) => a.due.localeCompare(b.due)), [tasks])
  const overdueTasks = calendarTasks.filter((task) => !task.completed && task.due < today())
  const monthTasks = calendarTasks.filter((task) => task.due.slice(0, 7) === calendarMonth)
  const monthLabel = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(new Date(`${calendarMonth}-01`))
  const metrics = {
    active: contacts.length,
    pipeline: contacts.reduce((sum, c) => sum + c.value, 0),
    tasks: openTasks.length,
    hot: contacts.filter((c) => c.priorityLevel === 'A' || c.interest >= 8 || c.value >= 5000).length,
    aList: contacts.filter((c) => c.priorityLevel === 'A').length,
    qualified: contacts.filter((c) => c.website || c.email || c.generalEmail || c.decisionMakerName || c.decisionMakerEmail).length,
    collaborators: contacts.filter((c) => ['Collaboratore', 'Socio', 'Partner operativo', 'Entrambi'].includes(c.relationshipType || '')).length,
    activeCollaborators: contacts.filter((c) => ['Attivo', 'Team leader'].includes(c.collaboratorStage || '')).length,
    investors: contacts.filter((c) => ['Investitore', 'Entrambi'].includes(c.relationshipType || '') || c.investorStage === 'Investitore').length,
    investorPipeline: contacts.reduce((sum, c) => sum + (['Investitore', 'Entrambi'].includes(c.relationshipType || '') ? num(c.expectedInvestment) : 0), 0),
    documentsPending: contacts.filter((c) => c.loiStatus !== 'Firmato' || c.contractStatus !== 'Firmato').length,
  }
  const visibleContacts = currentRole === 'Amministratore' ? contacts : contacts.filter((contact) => !contact.ownerName || contact.ownerName === activeProfile?.name || contact.sponsorName === activeProfile?.name)
  const collaboratorContacts = visibleContacts.filter((c) => ['Collaboratore', 'Socio', 'Partner operativo', 'Entrambi'].includes(c.relationshipType || ''))
  const investorContacts = visibleContacts.filter((c) => ['Investitore', 'Entrambi'].includes(c.relationshipType || '') || c.investorStage === 'Investitore')
  const documentContacts = visibleContacts.filter((c) => c.sharedDocuments || c.loiStatus !== 'Da preparare' || c.contractStatus !== 'Da preparare' || ['Cliente', 'Investitore', 'Entrambi'].includes(c.relationshipType || ''))
  const isAdmin = currentRole === 'Amministratore'
  const permittedMaterialIds = isAdmin ? allMaterialIds : (activeProfile?.allowedMaterialIds?.length ? activeProfile.allowedMaterialIds : defaultCollaboratorMaterialIds)
  const permittedRecommendedMaterials = recommendedNetworkMaterials(selectedContact).filter(({ material }) => isAdmin || permittedMaterialIds.includes(material.id))
  const blockedNetworkMaterials = networkMaterials.filter((material) => !permittedMaterialIds.includes(material.id))
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
  const voiceDeskStats = useMemo(() => contacts.reduce((acc, contact) => {
    acc.sent += Number(contact.voiceDeskEmailSentCount || 0)
    acc.open += Number(contact.voiceDeskEmailOpenCount || 0)
    acc.demo += Number(contact.voiceDeskDemoClickCount || 0)
    acc.call += Number(contact.voiceDeskCallClickCount || 0)
    return acc
  }, { sent: 0, open: 0, demo: 0, call: 0 }), [contacts])


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
      paidShareCapital: contact.paidShareCapital || 0,
      realEstateValue: contact.realEstateValue || 0,
      inventoryValue: contact.inventoryValue || 0,
      equipmentValue: contact.equipmentValue || 0,
      receivablesValue: contact.receivablesValue || 0,
      cashValue: contact.cashValue || 0,
      brandValue: contact.brandValue || 0,
      annualRevenue: contact.annualRevenue || 0,
      annualEbitda: contact.annualEbitda || 0,
      annualEnergyCost: contact.annualEnergyCost || 0,
      expectedEnergySavingPct: contact.expectedEnergySavingPct || 0,
      annualServiceCost: contact.annualServiceCost || 0,
      preferredEnergyPath: contact.preferredEnergyPath || 'Da valutare',
      studyNotes: contact.studyNotes || '',
      servicePlafondNotes: contact.servicePlafondNotes || '',
      researchEntryMode: contact.researchEntryMode || 'Azienda',
      personFirstName: contact.personFirstName || splitPersonName(contact).firstName,
      personLastName: contact.personLastName || splitPersonName(contact).lastName,
      personCity: contact.personCity || contact.city || '',
      companyLegalName: contact.companyLegalName || '',
      commercialName: contact.commercialName || contact.company || contact.name,
      commercialAliases: contact.commercialAliases || '',
      publicSources: contact.publicSources || '',
      facebookPageCandidates: contact.facebookPageCandidates || '',
      confirmedFacebookPage: contact.confirmedFacebookPage || '',
      socialFacebookUrl: contact.socialFacebookUrl || contact.confirmedFacebookPage || '',
      socialInstagramUrl: contact.socialInstagramUrl || '',
      personCompanyLinks: contact.personCompanyLinks || '',
      publicComplaints: contact.publicComplaints || '',
      researchSummary: contact.researchSummary || '',
      probableNeeds: contact.probableNeeds || '',
      recommendedQuestions: contact.recommendedQuestions || '',
      recommendedPath: contact.recommendedPath || '',
      confidenceScore: typeof contact.confidenceScore === 'number' ? contact.confidenceScore : 35,
      relationshipType: contact.relationshipType || 'Cliente',
      ownerName: contact.ownerName || '',
      sponsorName: contact.sponsorName || '',
      collaboratorStage: contact.collaboratorStage || 'Candidato',
      collaboratorRole: contact.collaboratorRole || '',
      investorStage: contact.investorStage || 'Potenziale',
      investorProfile: contact.investorProfile || '',
      expectedInvestment: contact.expectedInvestment || 0,
      loiStatus: contact.loiStatus || 'Da preparare',
      contractStatus: contact.contractStatus || 'Da preparare',
      sharedDocuments: contact.sharedDocuments || '',
      adminKpiNotes: contact.adminKpiNotes || '',
      voiceDeskSegment: contact.voiceDeskSegment || detectVoiceDeskSegment(contact),
      voiceDeskEmailSentCount: contact.voiceDeskEmailSentCount || 0,
      voiceDeskEmailOpenCount: contact.voiceDeskEmailOpenCount || 0,
      voiceDeskDemoClickCount: contact.voiceDeskDemoClickCount || 0,
      voiceDeskCallClickCount: contact.voiceDeskCallClickCount || 0,
      voiceDeskLastAction: contact.voiceDeskLastAction || '',
      voiceDeskLastActionAt: contact.voiceDeskLastActionAt || '',
      netFreeStage: contact.netFreeStage || 'Non avviato',
      netFreeCandidateReason: contact.netFreeCandidateReason || '',
      netFreeConsentToCall: Boolean(contact.netFreeConsentToCall),
      netFreeConsentAt: contact.netFreeConsentAt || '',
      netFreeSharedWithClaudioAt: contact.netFreeSharedWithClaudioAt || '',
      netFreeClaudioFeedback: contact.netFreeClaudioFeedback || '',
      netFreeNextStep: contact.netFreeNextStep || '',
      netFreeEstimatedOpportunity: contact.netFreeEstimatedOpportunity || '',
      netFreePreferredPhone: contact.netFreePreferredPhone || contact.phone || '',
      netFreeLeadProfile: contact.netFreeLeadProfile || contact.researchSummary || '',
      netFreePreferredChannel: contact.netFreePreferredChannel || '',
      netFreePreferredTimeWindow: contact.netFreePreferredTimeWindow || '',
      netFreeCallTone: contact.netFreeCallTone || '',
      netFreeBriefForClaudio: contact.netFreeBriefForClaudio || '',
      lcrAvailabilityWindow: contact.lcrAvailabilityWindow || 'Da definire',
      lcrCustomAvailability: contact.lcrCustomAvailability || '',
      lcrAgendaLink: contact.lcrAgendaLink || '',
      lcrZoomLink: contact.lcrZoomLink || '',
      lcrVoiceSentAt: contact.lcrVoiceSentAt || '',
      lcrPositiveReplyAt: contact.lcrPositiveReplyAt || '',
      lcrAppointmentAt: contact.lcrAppointmentAt || '',
      lcrZoomCompletedAt: contact.lcrZoomCompletedAt || '',
      lcrPrequalVoiceListened: contact.lcrPrequalVoiceListened || 'Da valutare',
      lcrEthicsAligned: contact.lcrEthicsAligned || 'Da valutare',
      lcrMindsetAligned: contact.lcrMindsetAligned || 'Da valutare',
      lcrNetFreeAligned: contact.lcrNetFreeAligned || 'Da valutare',
      lcrTokenizationAligned: contact.lcrTokenizationAligned || 'Da valutare',
      lcrSelectionOutcome: contact.lcrSelectionOutcome || 'Da valutare',
      lcrSelectionNotes: contact.lcrSelectionNotes || '',
      lcrTag: contact.lcrTag || '',
      lcrPefDelegationStatus: contact.lcrPefDelegationStatus || 'Non avviata',
      lcrPefTechnicianNote: contact.lcrPefTechnicianNote || '',
      lcrMatrixSponsorId: contact.lcrMatrixSponsorId || '',
      lcrMatrixParentId: contact.lcrMatrixParentId || '',
      lcrMatrixPosition: Number(contact.lcrMatrixPosition || 0),
      lcrMatrixLevel: Number(contact.lcrMatrixLevel || 0),
      lcrMatrixSlot: Number(contact.lcrMatrixSlot || 0),
      lcrDirectPeopleCount: Number(contact.lcrDirectPeopleCount || 0),
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
      paidShareCapital: num(draft.paidShareCapital),
      realEstateValue: num(draft.realEstateValue),
      inventoryValue: num(draft.inventoryValue),
      equipmentValue: num(draft.equipmentValue),
      receivablesValue: num(draft.receivablesValue),
      cashValue: num(draft.cashValue),
      brandValue: num(draft.brandValue),
      annualRevenue: num(draft.annualRevenue),
      annualEbitda: num(draft.annualEbitda),
      annualEnergyCost: num(draft.annualEnergyCost),
      expectedEnergySavingPct: num(draft.expectedEnergySavingPct),
      annualServiceCost: num(draft.annualServiceCost),
      preferredEnergyPath: draft.preferredEnergyPath || 'Da valutare',
      studyNotes: draft.studyNotes?.trim(),
      servicePlafondNotes: draft.servicePlafondNotes?.trim(),
      researchEntryMode: draft.researchEntryMode || 'Azienda',
      personFirstName: draft.personFirstName?.trim(),
      personLastName: draft.personLastName?.trim(),
      personCity: draft.personCity?.trim(),
      companyLegalName: draft.companyLegalName?.trim(),
      commercialName: draft.commercialName?.trim() || draft.company.trim() || draft.name.trim(),
      commercialAliases: draft.commercialAliases?.trim(),
      publicSources: draft.publicSources?.trim(),
      facebookPageCandidates: draft.facebookPageCandidates?.trim(),
      confirmedFacebookPage: draft.confirmedFacebookPage?.trim(),
      socialFacebookUrl: draft.socialFacebookUrl?.trim() || draft.confirmedFacebookPage?.trim(),
      socialInstagramUrl: draft.socialInstagramUrl?.trim(),
      personCompanyLinks: draft.personCompanyLinks?.trim(),
      publicComplaints: draft.publicComplaints?.trim(),
      researchSummary: draft.researchSummary?.trim(),
      probableNeeds: draft.probableNeeds?.trim(),
      recommendedQuestions: draft.recommendedQuestions?.trim(),
      recommendedPath: draft.recommendedPath?.trim(),
      confidenceScore: num(draft.confidenceScore),
      relationshipType: draft.relationshipType || 'Cliente',
      ownerName: draft.ownerName?.trim(),
      sponsorName: draft.sponsorName?.trim(),
      collaboratorStage: draft.collaboratorStage || 'Candidato',
      collaboratorRole: draft.collaboratorRole?.trim(),
      investorStage: draft.investorStage || 'Potenziale',
      investorProfile: draft.investorProfile?.trim(),
      expectedInvestment: num(draft.expectedInvestment),
      loiStatus: draft.loiStatus || 'Da preparare',
      contractStatus: draft.contractStatus || 'Da preparare',
      sharedDocuments: draft.sharedDocuments?.trim(),
      adminKpiNotes: draft.adminKpiNotes?.trim(),
      voiceDeskSegment: draft.voiceDeskSegment || detectVoiceDeskSegment(draft),
      voiceDeskEmailSentCount: Number(draft.voiceDeskEmailSentCount || 0),
      voiceDeskEmailOpenCount: Number(draft.voiceDeskEmailOpenCount || 0),
      voiceDeskDemoClickCount: Number(draft.voiceDeskDemoClickCount || 0),
      voiceDeskCallClickCount: Number(draft.voiceDeskCallClickCount || 0),
      voiceDeskLastAction: draft.voiceDeskLastAction || '',
      voiceDeskLastActionAt: draft.voiceDeskLastActionAt || '',
      netFreeStage: draft.netFreeStage || 'Non avviato',
      netFreeCandidateReason: draft.netFreeCandidateReason?.trim(),
      netFreeConsentToCall: Boolean(draft.netFreeConsentToCall),
      netFreeConsentAt: draft.netFreeConsentAt || '',
      netFreeSharedWithClaudioAt: draft.netFreeSharedWithClaudioAt || '',
      netFreeClaudioFeedback: draft.netFreeClaudioFeedback?.trim(),
      netFreeNextStep: draft.netFreeNextStep?.trim(),
      netFreeEstimatedOpportunity: draft.netFreeEstimatedOpportunity?.trim(),
      netFreePreferredPhone: draft.netFreePreferredPhone?.trim(),
      netFreeLeadProfile: draft.netFreeLeadProfile?.trim(),
      netFreePreferredChannel: draft.netFreePreferredChannel?.trim(),
      netFreePreferredTimeWindow: draft.netFreePreferredTimeWindow?.trim(),
      netFreeCallTone: draft.netFreeCallTone?.trim(),
      netFreeBriefForClaudio: draft.netFreeBriefForClaudio?.trim(),
      lcrAvailabilityWindow: draft.lcrAvailabilityWindow || 'Da definire',
      lcrCustomAvailability: draft.lcrCustomAvailability?.trim(),
      lcrAgendaLink: draft.lcrAgendaLink?.trim(),
      lcrZoomLink: draft.lcrZoomLink?.trim(),
      lcrVoiceSentAt: draft.lcrVoiceSentAt || '',
      lcrPositiveReplyAt: draft.lcrPositiveReplyAt || '',
      lcrAppointmentAt: draft.lcrAppointmentAt || '',
      lcrZoomCompletedAt: draft.lcrZoomCompletedAt || '',
      lcrPrequalVoiceListened: draft.lcrPrequalVoiceListened || 'Da valutare',
      lcrEthicsAligned: draft.lcrEthicsAligned || 'Da valutare',
      lcrMindsetAligned: draft.lcrMindsetAligned || 'Da valutare',
      lcrNetFreeAligned: draft.lcrNetFreeAligned || 'Da valutare',
      lcrTokenizationAligned: draft.lcrTokenizationAligned || 'Da valutare',
      lcrSelectionOutcome: draft.lcrSelectionOutcome || 'Da valutare',
      lcrSelectionNotes: draft.lcrSelectionNotes?.trim(),
      lcrTag: draft.lcrTag?.trim(),
      lcrPefDelegationStatus: draft.lcrPefDelegationStatus || 'Non avviata',
      lcrPefTechnicianNote: draft.lcrPefTechnicianNote?.trim(),
      lcrMatrixSponsorId: draft.lcrMatrixSponsorId?.trim(),
      lcrMatrixParentId: draft.lcrMatrixParentId?.trim(),
      lcrMatrixPosition: num(draft.lcrMatrixPosition),
      lcrMatrixLevel: num(draft.lcrMatrixLevel),
      lcrMatrixSlot: num(draft.lcrMatrixSlot),
      lcrDirectPeopleCount: num(draft.lcrDirectPeopleCount),
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

  function saveStudyFromDraft() {
    if (!selectedContact) return
    const timestamp = nowIso()
    const updates: Partial<Contact> = {
      paidShareCapital: num(draft.paidShareCapital),
      realEstateValue: num(draft.realEstateValue),
      inventoryValue: num(draft.inventoryValue),
      equipmentValue: num(draft.equipmentValue),
      receivablesValue: num(draft.receivablesValue),
      cashValue: num(draft.cashValue),
      brandValue: num(draft.brandValue),
      annualRevenue: num(draft.annualRevenue),
      annualEbitda: num(draft.annualEbitda),
      annualEnergyCost: num(draft.annualEnergyCost),
      expectedEnergySavingPct: num(draft.expectedEnergySavingPct),
      annualServiceCost: num(draft.annualServiceCost),
      preferredEnergyPath: draft.preferredEnergyPath || 'Da valutare',
      studyNotes: draft.studyNotes?.trim(),
      servicePlafondNotes: draft.servicePlafondNotes?.trim(),
      updatedAt: timestamp,
    }
    setContacts((current) => current.map((c) => c.id === selectedContact.id ? { ...c, ...updates } : c))
    const updatedContact = { ...selectedContact, ...updates }
    const snap = valuationSnapshot(updatedContact)
    const studyText = tailoredStudyPrompt(updatedContact)
    const result = analyzeConversation(studyText, updatedContact)
    setConversations((current) => [{ id: id('conversation'), contactId: selectedContact.id, text: studyText, channel: 'Nota interna', stage: 'Risposta ricevuta', analysis: result, createdAt: timestamp }, ...current])
    setTasks((current) => [{ id: id('task'), title: `Studio su misura ${selectedContact.name}: verificare dati e proporre plafond da ${euro(snap.annualServiceCost)}`, contactId: selectedContact.id, priority: snap.surplusOrGap >= 0 ? 'Media' : 'Alta', due: addDays(2), completed: false, createdAt: timestamp }, ...current])
    setAnalysis(result)
    setStudySavedFeedback('Studio salvato nel lead')
    setTimeout(() => setStudySavedFeedback(''), 2400)
  }

  function saveGuidedResearchFromDraft() {
    if (!selectedContact) return
    const timestamp = nowIso()
    const researchContact: Contact = { ...selectedContact, ...contactFromDraft(timestamp), updatedAt: timestamp }
    const snapshot = leadResearchSnapshot(researchContact)
    const primaryNeed = compactLines(researchContact.probableNeeds)[0] || 'capire i problemi reali prima di proporre soluzioni'
    const primaryQuestion = compactLines(researchContact.recommendedQuestions)[0] || 'Qual è oggi il problema più urgente da risolvere: costi, richieste, personale, energia o valorizzazione aziendale?'
    const updates: Partial<Contact> = {
      ...researchContact,
      personalizationHook: researchContact.personalizationHook || `dati pubblici e contesto di ${contactBusinessName(researchContact)} indicano temi da verificare con prudenza`,
      messageAngle: researchContact.messageAngle || `aprire una diagnosi su ${primaryNeed}, senza proporre un pacchetto standard`,
      outreachStage: 'Ricerca guidata',
      nextAction: `Validare ricerca (${snapshot.label}) e usare domanda guida: ${primaryQuestion}`,
      updatedAt: timestamp,
    }
    setContacts((current) => current.map((c) => c.id === selectedContact.id ? { ...c, ...updates } : c))
    const note = `${buildGuidedCloserContext(researchContact)}\n\nQuery suggerite:\n${snapshot.queries.map((query) => `- ${query}`).join('\n')}\n\nDati mancanti:\n${snapshot.missing.map((item) => `- ${item}`).join('\n') || '- nessun dato essenziale mancante'}`
    const result = analyzeConversation(note, researchContact)
    setConversations((current) => [{ id: id('conversation'), contactId: selectedContact.id, text: note, channel: 'Nota interna', stage: 'Ricerca guidata', analysis: result, createdAt: timestamp }, ...current])
    setTasks((current) => [{ id: id('task'), title: `Completare ricerca guidata ${selectedContact.name}: verificare ${snapshot.missing.slice(0, 3).join(', ') || 'fonti e bisogni'}`, contactId: selectedContact.id, priority: snapshot.score >= 75 ? 'Media' : 'Alta', due: addDays(1), completed: false, createdAt: timestamp }, ...current])
    setAnalysis(result)
    setResearchSavedFeedback('Ricerca salvata nel lead')
    setTimeout(() => setResearchSavedFeedback(''), 2400)
  }


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
  function moveTask(taskId: string, due: string) { setTasks((current) => current.map((task) => task.id === taskId ? { ...task, due } : task)); const task = tasks.find((item) => item.id === taskId); if (task) setContacts((current) => current.map((contact) => contact.id === task.contactId ? { ...contact, nextAction: `${calendarEventKind(task)} spostato al ${fmtDate(due)}: ${task.title}`, updatedAt: nowIso() } : contact)) }
  function createCalendarEvent(kind: 'Appuntamento' | 'Follow-up') { if (!selectedContact) return; const title = kind === 'Appuntamento' ? `Appuntamento ${selectedContact.name}: call/demo da confermare` : `Follow-up ${selectedContact.name}: prossima domanda closer`; setTasks((current) => [{ id: id('task'), title, contactId: selectedContact.id, priority: selectedContact.priorityLevel === 'A' ? 'Alta' : 'Media', due: taskDue || today(), completed: false, createdAt: nowIso() }, ...current]); setContacts((current) => current.map((contact) => contact.id === selectedContact.id ? { ...contact, outreachStage: kind === 'Appuntamento' ? 'Demo richiesta' : 'Follow-up 1', nextAction: `${kind} programmato per ${fmtDate(taskDue || today())}.`, updatedAt: nowIso() } : contact)) }

  async function confirmMeetAppointment() {
    if (!selectedContact) return
    if (!taskDue || !meetTime) { window.alert('Imposta giorno e ora prima di confermare.'); return }
    setMeetStatus('creazione')
    setMeetMessage('Creo evento Google Calendar, link Meet, invito email e salvataggio CRM...')
    try {
      const scheduledAt = new Date(`${taskDue}T${meetTime}:00`).toISOString()
      const response = await fetch('/api/appointments/confirm-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: selectedContact.id,
          contactDbId: selectedContact.dbId,
          contact: selectedContact,
          contactName: selectedContact.decisionMakerName || selectedContact.name,
          attendeeEmail: selectedContact.decisionMakerEmail || selectedContact.generalEmail || selectedContact.email,
          scheduledAt,
          durationMinutes: meetDuration,
          notes: meetNotes,
          title: `Appuntamento Meet · ${selectedContact.decisionMakerName || selectedContact.name}`,
          source: 'CRM AI Relazionale',
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok && response.status !== 207) throw new Error(payload.error || payload.details || 'Creazione appuntamento non riuscita')
      const meetingUrl = payload.meetingUrl || payload.appointment?.meeting_url || ''
      setMeetStatus('collegato')
      setMeetMessage(payload.message || 'Appuntamento creato: evento Calendar, link Meet e invito email generati automaticamente.')
      setTasks((current) => [{ id: id('task'), title: `Appuntamento Meet ${selectedContact.name}`, contactId: selectedContact.id, priority: selectedContact.priorityLevel === 'A' ? 'Alta' : 'Media', due: taskDue, completed: false, createdAt: nowIso() }, ...current])
      setContacts((current) => current.map((contact) => contact.id === selectedContact.id ? { ...contact, outreachStage: 'Demo richiesta', nextAction: `Appuntamento Meet confermato per ${fmtDate(taskDue)} alle ${meetTime}.${meetingUrl ? ` Link: ${meetingUrl}` : ''}`, updatedAt: nowIso(), lcrAppointmentAt: scheduledAt, lcrAgendaLink: payload.googleHtmlLink || contact.lcrAgendaLink, lcrZoomLink: meetingUrl || contact.lcrZoomLink } : contact))
      setMeetNotes('')
    } catch (error: any) {
      setMeetStatus('errore')
      setMeetMessage(error?.message || 'Creazione automatica non riuscita. Verifica Google, Supabase e login.')
    }
  }
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


  function closerStepLabel(step: CommunicationTemplate) {
    return ({ opener: 'Apertura delicata', diagnose: 'Domande strategiche', qualify: 'Qualificazione bisogno', tailored: 'Studio su misura', position: 'Soluzione soft', close: 'Call o demo' })[step]
  }

  function contactDisplayName(contact: Contact) { return (contact.decisionMakerName || contact.name).trim() }
  function contactBusinessName(contact: Contact) { return (contact.company || contact.name).trim() }
  function cleanPhoneForWhatsApp(phone: string) { return phone.replace(/[^0-9]/g, '') }
  function normalizeWhatsAppPhone(phone: string) {
    const digits = cleanPhoneForWhatsApp(phone)
    if (!digits) return ''
    if (digits.startsWith('00')) return digits.slice(2)
    if (digits.startsWith('39') && digits.length >= 11) return digits
    if (digits.startsWith('3') && digits.length === 10) return `39${digits}`
    if (digits.startsWith('0') && digits.length >= 9) return `39${digits.slice(1)}`
    return digits
  }
  function whatsappStatus(contact: Contact) {
    const phone = normalizeWhatsAppPhone(contact.phone)
    if (!contact.phone.trim()) return 'Telefono assente: il messaggio WhatsApp verrà copiato.'
    if (phone.length < 10) return 'Telefono da verificare: copia il testo se WhatsApp non si apre.'
    return `WhatsApp pronto: +${phone}`
  }
  function emailStatus(contact: Contact) {
    const email = contactEmail(contact)
    if (!email) return 'Email assente: verrà aperta una bozza senza destinatario e copiabile.'
    if (!isValidEmail(email)) return 'Email da verificare: controlla il campo prima dell’invio.'
    return `Email pronta: ${email}`
  }

  function strategicQuestions(contact: Contact): string[] {
    const business = contactBusinessName(contact)
    const category = (contact.category || contact.role || 'attività').toLowerCase()
    return [
      `Qual è oggi la richiesta ripetitiva che fa perdere più tempo a ${business}?`,
      `Le capita di perdere contatti perché arrivano fuori orario, nei momenti pieni o su canali diversi?`,
      `Quanto pesa per una ${category} rispondere sempre bene a domande su disponibilità, prezzi, servizi e prenotazioni?`,
      `Se una parte del primo contatto fosse già ordinata e filtrata, quale problema operativo risolverebbe per primo?`,
    ]
  }

  function conversationObjective(step: CommunicationTemplate) {
    return ({
      opener: 'Aprire la conversazione senza vendere subito, usando un dettaglio specifico del lead.',
      diagnose: 'Far emergere problemi, colli di bottiglia e richieste ripetitive tramite domande mirate.',
      qualify: 'Capire frequenza, urgenza, valore economico e disponibilità a migliorare il processo.',
      tailored: 'Costruire un vestito su misura: valore aziendale, plafond servizi, energia e priorità personali prima del preventivo.',
      position: 'Collegare il problema emerso a Voice Desk o alla soluzione del progetto attivo in modo naturale.',
      close: 'Portare il lead a una call, demo o prova breve con un passo semplice e non pressante.',
    })[step]
  }

  function toneInstruction(tone: SalesTone) {
    return ({
      Cordiale: 'tono caldo, umano e rispettoso, con frasi semplici e zero pressione',
      Soft: 'tono leggero, non invasivo, orientato a una domanda utile prima della proposta',
      Consulenziale: 'tono professionale: diagnosi, contesto operativo e proposta solo se emerge valore',
      'Diretto gentile': 'tono sintetico e chiaro, ma sempre educato e senza urgenze artificiali',
    })[tone]
  }

  function intentInstruction(intent: StrategicIntent) {
    return ({
      'Aprire relazione': 'obiettivo: aprire una conversazione naturale, senza vendere subito',
      'Capire bisogno': 'obiettivo: far emergere il problema reale con una domanda concreta',
      'Gestire obiezione': 'obiettivo: abbassare la pressione, riconoscere il dubbio e proporre un passo piccolo',
      'Proporre mini-demo': 'obiettivo: offrire un esempio pratico e reversibile, non un impegno',
      'Chiudere appuntamento': 'obiettivo: portare a una call breve o a un esempio scritto con scelta semplice',
    })[intent]
  }

  const internalDisclosureWords = ['ricerca', 'fonte', 'fonti', 'reclamo', 'reclami', 'confidenza', 'score', 'punteggio', 'lead caldo', 'priorità a', 'priorità b', 'database', 'crm', 'abbiamo analizzato', 'ho analizzato', 'dati assorbiti', 'bisogno probabile', 'gancio utile', 'pipeline', 'social candidate', 'pagina candidata']

  function sanitizeClientPhrase(value: string | undefined, fallback: string) {
    const cleaned = (value || '')
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line && !internalDisclosureWords.some((word) => line.toLowerCase().includes(word)))
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/^(ho notato|abbiamo notato|risulta che)\s+/i, '')
      .trim()
    return cleaned.length >= 12 ? cleaned : fallback
  }

  function publicClientNeed(contact: Contact) {
    return sanitizeClientPhrase(
      compactLines(contact.probableNeeds)[0] || contact.messageAngle,
      'ordinare il primo contatto con clienti, richieste ripetitive e follow-up senza appesantire lo staff'
    )
  }

  function publicOpeningContext(contact: Contact) {
    const business = contactBusinessName(contact)
    const category = (contact.category || contact.role || 'attività').toLowerCase()
    const safeHook = sanitizeClientPhrase(contact.personalizationHook, '')
    if (safeHook) return `mi occupo di rendere più fluido il primo contatto con i clienti e penso possa essere un tema interessante anche per ${business}.`
    return `per realtà ${category} come ${business}, il primo contatto con clienti e richieste operative spesso passa da più canali e può diventare dispersivo.`
  }

  function softClosingGuidance(contact: Contact) {
    const business = contactBusinessName(contact)
    const hook = sanitizeClientPhrase(contact.personalizationHook, `il primo contatto dei clienti con ${business}`)
    const likelyNeed = publicClientNeed(contact)
    const nextStep = strategicIntent === 'Chiudere appuntamento' ? 'proporre 10 minuti oppure un esempio scritto' : strategicIntent === 'Proporre mini-demo' ? 'preparare una mini-demo basata su 2-3 richieste tipiche' : strategicIntent === 'Gestire obiezione' ? 'chiedere qual è il dubbio principale e offrire un passo senza impegno' : 'fare una sola domanda diagnostica e ascoltare la risposta'
    return { business, hook, likelyNeed, nextStep, tone: toneInstruction(salesTone), intent: intentInstruction(strategicIntent), openingContext: publicOpeningContext(contact) }
  }

  function strategicCoachNote(contact?: Contact) {
    if (!contact) return 'Seleziona un lead: l’assistente ti suggerirà tono, obiettivo, messaggio e prossima mossa senza trasformare il CRM in lavoro amministrativo.'
    const guide = softClosingGuidance(contact)
    return `Nota interna — non copiare al cliente. Strategia per ${guide.business}: ${guide.intent}. Usa ${guide.tone}. Contesto da usare solo come orientamento: ${guide.hook}. Punto da verificare con domanda naturale: ${guide.likelyNeed}. Prossima mossa: ${guide.nextStep}. Nel messaggio finale non citare ricerca interna, conteggi, fonti, punteggi o strumenti: al lead deve arrivare solo valore pratico.`
  }


  function closerStageDashboard(contact?: Contact) {
    if (!contact) return { label: 'Nessun lead selezionato', principle: 'Seleziona un lead per vedere la guida closer.', nextMove: 'Scegli un contatto caldo o crea un lead da testo incollato.', followUpDays: 0, followUpText: 'Nessun follow-up', suggestedTemplate: 'opener' as CommunicationTemplate, suggestedIntent: 'Capire bisogno' as StrategicIntent, objection: 'Quando il lead risponde, incolla la risposta in Comunicazioni: il CRM suggerirà la gestione più prudente.' }
    const stage = contact.outreachStage || 'Da qualificare'
    const base = { objection: 'Se emerge un dubbio, riconoscilo prima di rispondere: “Capisco, ha senso verificarlo prima di fare passi avanti”.' }
    if (stage === 'Da qualificare' || stage === 'Ricerca guidata') return { ...base, label: 'Apertura relazione', principle: 'Non vendere subito: usa un contesto prudente e fai una sola domanda diagnostica.', nextMove: 'Invia opener soft o completa prima il contesto interno se mancano sito, referente o punto operativo da verificare.', followUpDays: 3, followUpText: `Follow-up suggerito: ${fmtDate(addDays(3))}`, suggestedTemplate: 'opener' as CommunicationTemplate, suggestedIntent: 'Aprire relazione' as StrategicIntent }
    if (stage === 'Primo invio') return { ...base, label: 'Attesa risposta / diagnosi', principle: 'La prossima mossa deve semplificare la risposta, non alzare la pressione.', nextMove: 'Se non risponde, invia follow-up con una domanda ancora più facile; se risponde, qualifica bisogno e urgenza.', followUpDays: 3, followUpText: `Follow-up suggerito: ${fmtDate(addDays(3))}`, suggestedTemplate: 'diagnose' as CommunicationTemplate, suggestedIntent: 'Capire bisogno' as StrategicIntent }
    if (stage === 'Follow-up 1') return { ...base, label: 'Follow-up non invasivo', principle: 'Riprendi il filo offrendo un micro-valore o una scelta semplice.', nextMove: 'Invia un messaggio breve: “se oggi dovesse alleggerire un solo punto, quale sarebbe?”.', followUpDays: 4, followUpText: `Secondo follow-up solo se utile: ${fmtDate(addDays(4))}`, suggestedTemplate: 'diagnose' as CommunicationTemplate, suggestedIntent: 'Capire bisogno' as StrategicIntent }
    if (stage === 'Risposta ricevuta') return { ...base, label: 'Qualifica e gestione obiezioni', principle: 'Trasforma la risposta in una diagnosi: canale, frequenza, impatto e decisore.', nextMove: 'Se c’è interesse, chiedi 2-3 dettagli. Se c’è dubbio, abbassa la pressione e proponi esempio scritto.', followUpDays: 2, followUpText: `Rilancio consigliato: ${fmtDate(addDays(2))}`, suggestedTemplate: 'qualify' as CommunicationTemplate, suggestedIntent: 'Gestire obiezione' as StrategicIntent }
    if (stage === 'Video da preparare') return { ...base, label: 'Valore su misura', principle: 'Prepara un esempio concreto prima del preventivo.', nextMove: 'Crea mini-demo o messaggio su 2-3 richieste reali e chiedi se vuole vederlo in 10 minuti.', followUpDays: 2, followUpText: `Invio esempio entro: ${fmtDate(addDays(2))}`, suggestedTemplate: 'tailored' as CommunicationTemplate, suggestedIntent: 'Proporre mini-demo' as StrategicIntent }
    if (stage === 'Demo richiesta') return { ...base, label: 'Appuntamento / closing morbido', principle: 'Porta alla micro-decisione: call breve, esempio scritto o prossimo step datato.', nextMove: 'Proponi due opzioni semplici e conferma giorno o formato.', followUpDays: 1, followUpText: `Conferma entro: ${fmtDate(addDays(1))}`, suggestedTemplate: 'close' as CommunicationTemplate, suggestedIntent: 'Chiudere appuntamento' as StrategicIntent }
    return { ...base, label: stage, principle: 'Mantieni relazione rispettosa e documenta il motivo dello stadio.', nextMove: contact.nextAction || 'Definisci una prossima azione manuale.', followUpDays: 7, followUpText: `Ricontrollo soft: ${fmtDate(addDays(7))}`, suggestedTemplate: 'opener' as CommunicationTemplate, suggestedIntent: 'Aprire relazione' as StrategicIntent }
  }

  function objectionReply(contact?: Contact) {
    const business = contact ? contactBusinessName(contact) : 'il lead'
    const person = contact ? contactDisplayName(contact) : 'il contatto'
    if (strategicIntent !== 'Gestire obiezione') return `Se ${business} non risponde, non insistere: invia un follow-up con una domanda a risposta facile e registra il prossimo controllo.`
    return `Buongiorno ${person}, capisco perfettamente. Prima di fare qualsiasi passo, preferirei chiarire il dubbio principale: riguarda priorità, costo, fiducia nello strumento o tempi interni? In base a quello le preparo una risposta concreta o un esempio piccolo, senza impegno.`
  }

  function buildEmailTemplate(contact: Contact): { subject: string; body: string; html?: string } {
    if (assistedTemplate === 'opener') return buildVoiceDeskEmailTemplate(contact)
    const person = contactDisplayName(contact)
    const business = contactBusinessName(contact)
    const city = contact.city || 'la sua zona'
    const guide = softClosingGuidance(contact)
    const category = (contact.category || contact.role || 'attività').toLowerCase()
    const questions = strategicQuestions(contact)
    const gentleClose = strategicIntent === 'Chiudere appuntamento'
      ? 'Le andrebbe bene sentirci 10 minuti, oppure preferisce che le mandi prima un esempio scritto?'
      : strategicIntent === 'Proporre mini-demo'
        ? `Se vuole, posso prepararle una mini-demo testuale su un caso tipico di ${business}, così valuta subito se ha senso.`
        : strategicIntent === 'Gestire obiezione'
          ? 'Se in questo momento non è una priorità, nessun problema: mi basta capire quale aspetto avrebbe senso eventualmente approfondire più avanti.'
          : 'Se mi risponde anche solo con due righe, capisco se ha senso prepararle un esempio utile oppure se non è il momento.'

    if (assistedTemplate === 'diagnose') return {
      subject: `Una domanda pratica su ${business}`,
      body: `Buongiorno ${person},

le scrivo in modo molto diretto ma leggero: prima di parlare di soluzioni, vorrei capire se questo tema è reale anche per voi.

${guide.openingContext.charAt(0).toUpperCase() + guide.openingContext.slice(1)} Capita spesso che richieste, informazioni, disponibilità, prenotazioni o primi contatti assorbano tempo nei momenti meno comodi.

La domanda è questa: ${questions[0]}

${gentleClose}

Resto a disposizione,
Voice Desk`
    }

    if (assistedTemplate === 'qualify') return {
      subject: `Capire se può essere utile per ${business}`,
      body: `Buongiorno ${person},

per capire se posso esserle davvero utile, le chiederei solo tre cose rapide.

1. Da quale canale arrivano più richieste: telefono, email, WhatsApp o sito?
2. Quali richieste richiedono spesso le stesse risposte?
3. Se potesse migliorare un solo punto del primo contatto con il cliente, quale sceglierebbe?

L’idea non è aggiungere complessità, ma capire se si può alleggerire un passaggio concreto: ${guide.likelyNeed}.

Sulla base delle sue risposte posso prepararle un esempio pratico, senza impegno e senza proposta preconfezionata.

Resto a disposizione,
Voice Desk`
    }

    if (assistedTemplate === 'tailored') return {
      subject: `Un esempio ragionato per ${business}`,
      body: `Buongiorno ${person},

secondo me per ${business} ha più senso partire da un piccolo ragionamento pratico, non da un preventivo standard.

L’idea non è aggiungere complessità, ma capire se si può alleggerire un passaggio concreto: ${guide.likelyNeed}.

Il primo passo potrebbe essere molto semplice: capire quali richieste si ripetono, quali fanno perdere tempo e quali invece devono restare gestite in modo personale. Da lì si può valutare se una piccola automazione o una migliore organizzazione del primo contatto può portare beneficio reale.

${gentleClose}

Resto a disposizione,
Voice Desk`
    }

    if (assistedTemplate === 'position') return {
      subject: `Esempio concreto per ${business}`,
      body: `Buongiorno ${person},

per una ${category}${city ? ` a ${city}` : ''}, il punto non è “mettere un robot” davanti ai clienti. Il punto è ordinare il primo contatto, filtrare le richieste ripetitive e lasciare allo staff ciò che richiede attenzione umana.

In pratica: meno dispersione, più continuità e controllo sempre vostro.

${gentleClose}

Resto a disposizione,
Voice Desk`
    }

    if (assistedTemplate === 'close') return {
      subject: `Passo semplice per ${business}`,
      body: `Buongiorno ${person},

se per lei ha senso, farei un passo molto semplice: preparo un esempio concreto su ${business}, basato su 2 o 3 richieste tipiche che ricevete spesso.

Così può valutare subito se l’idea è utile. Se non vede valore, ci fermiamo lì senza impegno.

Le andrebbe bene una call breve di 10 minuti oppure preferisce ricevere prima un esempio scritto?

Resto a disposizione,
Voice Desk`
    }

    return {
      subject: `Idea pratica per ${business}`,
      body: `Buongiorno ${person},

le scrivo perché ${guide.openingContext}

Per una ${category} come ${business}${city ? ` a ${city}` : ''}, spesso il primo contatto con clienti e potenziali clienti si disperde tra telefonate, messaggi, email e richieste ripetitive.

L’idea non è aggiungere complessità, ma capire se si può alleggerire un passaggio concreto: ${guide.likelyNeed}.

Prima di proporle qualcosa, le farei solo una domanda: qual è oggi la richiesta che vi fa perdere più tempo o che rischia di restare senza risposta nel momento giusto?

${gentleClose}

Resto a disposizione,
Voice Desk`
    }
  }

  function buildWhatsAppTemplate(contact: Contact): string {
    if (isVoiceDeskHotelContact(contact)) return `Hai visto cosa può fare per la tua struttura ricettiva?
${voiceDeskHotelVideoLine()}`
    const person = contactDisplayName(contact)
    const business = contactBusinessName(contact)
    const guide = softClosingGuidance(contact)
    const questions = strategicQuestions(contact)

    if (assistedTemplate === 'diagnose') return `Buongiorno ${person}, sono di Voice Desk. Le faccio una domanda pratica, senza proposta preconfezionata: ${questions[0]} Se ha senso, le preparo un esempio breve su ${business}.`
    if (assistedTemplate === 'qualify') return `Buongiorno ${person}, per capire se posso esserle utile su ${business}: da quale canale arrivano più richieste, telefono, email, WhatsApp o sito? E quali portano via più tempo?`
    if (assistedTemplate === 'tailored') return `Buongiorno ${person}, prima di parlare di soluzioni preferirei capire la situazione reale di ${business}. L’obiettivo sarebbe alleggerire un passaggio concreto: ${guide.likelyNeed}. Vuole che le prepari un esempio molto breve?`
    if (assistedTemplate === 'position') return `Buongiorno ${person}, l’idea per ${business} non è sostituire lo staff, ma ordinare il primo contatto e filtrare le richieste ripetitive mantenendo controllo umano. Vuole un esempio concreto?`
    if (assistedTemplate === 'close') return `Buongiorno ${person}, se ha senso facciamo un passo semplice: mini-demo di 10 minuti o esempio scritto su ${business}. Così valuta subito se è utile, senza impegno. Cosa preferisce?`
    return `Buongiorno ${person}, sono di Voice Desk. Le scrivo in modo molto diretto: per ${business}, quale richiesta dei clienti vi fa perdere più tempo o rischia di non ricevere risposta nel momento giusto?`
  }

  function setTemporaryAssistedFeedback(message: string) {
    setAssistedFeedback(message)
    setTimeout(() => setAssistedFeedback(''), 2400)
  }

  function copyAssistedMessage(kind: 'email' | 'whatsapp' | 'social', socialChannel: Channel = 'Instagram') {
    if (!selectedContact) return
    const text = kind === 'email' ? `${buildEmailTemplate(selectedContact).subject}\n\n${buildEmailTemplate(selectedContact).body}` : kind === 'whatsapp' ? buildWhatsAppTemplate(selectedContact) : buildVoiceDeskSocialTemplate(selectedContact, socialChannel)
    const label = kind === 'email' ? 'Email copiata' : kind === 'whatsapp' ? 'WhatsApp copiato' : `${socialChannel} copiato`
    navigator.clipboard.writeText(text).then(() => setTemporaryAssistedFeedback(label)).catch(() => window.alert('Non sono riuscito a copiare automaticamente. Seleziona il testo e copialo manualmente.'))
  }


  function materialFitScore(material: NetworkMaterial, contact?: Contact | null) {
    if (!contact) return 0
    const haystack = [contact.category, contact.subcategory, contact.role, contact.services, contact.messageAngle, contact.personalizationHook, contact.probableNeeds, contact.recommendedPath, contact.studyNotes, contact.servicePlafondNotes, contact.topics.join(' ')].join(' ').toLowerCase()
    const keywordsById: Record<string, string[]> = {
      voicedesk: ['telefono', 'chiamate', 'prenotazioni', 'richieste', 'reception', 'hotel', 'ristorante', 'studio', 'crm', 'clienti'],
      blotix: ['immobile', 'asset', 'patrimonio', 'token', 'defi', 'liquidità', 'azienda', 'capitale', 'investitore'],
      'pef-cliente': ['energia', 'bolletta', 'luce', 'gas', 'green', 'fornitura', 'risparmio'],
      'pef-collaboratore': ['collaboratore', 'rete', 'carriera', 'consulente', 'team', 'partnership'],
      ubroker: ['energia', 'bolletta', 'luce', 'gas', 'sconti', 'app', 'assistenza', 'fornitore']
    }
    return (keywordsById[material.id] || []).reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0)
  }

  function recommendedNetworkMaterials(contact?: Contact | null) {
    return [...networkMaterials]
      .map((material) => ({ material, score: materialFitScore(material, contact) }))
      .sort((a, b) => b.score - a.score)
  }

  function copyNetworkMaterialMessage(material: NetworkMaterial) {
    const prefix = selectedContact ? `${contactDisplayName(selectedContact)}, ` : ''
    const text = `${prefix}${material.message}`
    navigator.clipboard.writeText(text).then(() => setTemporaryAssistedFeedback(`Messaggio ${material.area} copiato`)).catch(() => window.alert('Non sono riuscito a copiare automaticamente. Seleziona il testo e copialo manualmente.'))
  }

  function saveNetworkMaterialTask(material: NetworkMaterial) {
    if (!selectedContact) {
      window.alert('Seleziona prima un lead: potrò creare il follow-up sul contatto corretto.')
      return
    }
    const due = addDays(material.level === 'Operativo' ? 1 : 3)
    setTasks((current) => [{ id: id('task'), title: `Materiale ${material.area}: ${material.nextStep}`, contactId: selectedContact.id, priority: selectedContact.priorityLevel === 'A' ? 'Alta' : 'Media', due, completed: false, createdAt: nowIso() }, ...current])
    setContacts((current) => current.map((contact) => contact.id === selectedContact.id ? { ...contact, nextAction: `Materiale ${material.area} inviato/da inviare. Prossimo passo: ${material.nextStep}`, notes: `${contact.notes || ''}
${today()} · Materiale ${material.area}: ${material.title}. Dati da chiedere: ${material.dataToAsk.join(', ')}.`.trim(), outreachStage: contact.outreachStage === 'Da qualificare' ? 'Primo invio' : contact.outreachStage, updatedAt: nowIso() } : contact))
    setTemporaryAssistedFeedback(`Task ${material.area} creato`)
  }


  function trackVoiceDeskEvent(contactId: string, event: 'sent' | 'open' | 'demo' | 'call') {
    const actionLabel = event === 'sent' ? 'Email VoiceDesk inviata' : event === 'open' ? 'Email VoiceDesk aperta' : event === 'demo' ? 'Demo VoiceDesk cliccata' : 'Chiamata demo avviata'
    setContacts((current) => current.map((contact) => {
      if (contact.id !== contactId) return contact
      const patch: Partial<Contact> = { voiceDeskLastAction: actionLabel, voiceDeskLastActionAt: nowIso(), updatedAt: nowIso() }
      if (event === 'sent') patch.voiceDeskEmailSentCount = Number(contact.voiceDeskEmailSentCount || 0) + 1
      if (event === 'open') patch.voiceDeskEmailOpenCount = Number(contact.voiceDeskEmailOpenCount || 0) + 1
      if (event === 'demo') patch.voiceDeskDemoClickCount = Number(contact.voiceDeskDemoClickCount || 0) + 1
      if (event === 'call') patch.voiceDeskCallClickCount = Number(contact.voiceDeskCallClickCount || 0) + 1
      if (event === 'demo' || event === 'call') patch.nextAction = 'Lead caldo: ha interagito con la demo VoiceDesk. Richiamare entro 24 ore con domanda sul bisogno.'
      return normalizeContact({ ...contact, ...patch })
    }))
  }

  function openVoiceDeskDemo(contact: Contact) {
    trackVoiceDeskEvent(contact.id, 'demo')
    window.open(buildTrackedVoiceDeskUrl(contact, 'demo', voiceDeskDemoUrl), '_blank', 'noopener,noreferrer')
    setTemporaryAssistedFeedback('Click demo VoiceDesk registrato')
  }

  function openVoiceDeskCall(contact: Contact) {
    const profile = voiceDeskProfile(contact)
    trackVoiceDeskEvent(contact.id, 'call')
    window.location.href = buildTrackedVoiceDeskUrl(contact, 'call', `tel:${profile.phone}`)
    setTemporaryAssistedFeedback(`Chiamata demo ${profile.label} registrata`)
  }

  function copyVoiceDeskHtml(contact: Contact) {
    const template = buildVoiceDeskEmailTemplate(contact)
    navigator.clipboard.writeText(template.html).then(() => setTemporaryAssistedFeedback('HTML email VoiceDesk copiato')).catch(() => window.alert('Non sono riuscito a copiare automaticamente.'))
  }

  function openMailto(contact: Contact) {
    const email = contactEmail(contact)
    const template = buildEmailTemplate(contact)
    const recipient = isValidEmail(email) ? encodeURIComponent(email) : ''
    const url = `mailto:${recipient}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`
    window.location.href = url
    if (!recipient) copyAssistedMessage('email')
    if (assistedTemplate === 'opener') trackVoiceDeskEvent(contact.id, 'sent')
    setTemporaryAssistedFeedback(recipient ? 'Email VoiceDesk aperta e contatore aggiornato' : 'Bozza email copiata')
    if (email && !isValidEmail(email)) window.alert('L’indirizzo email sembra incompleto o non valido: ho aperto una bozza senza destinatario e copiato il testo.')
  }

  function buildWhatsAppDirectUrl(contact: Contact, message?: string) {
    const phone = normalizeWhatsAppPhone(contact.phone)
    if (!phone || phone.length < 10) return ''
    const base = `https://wa.me/${phone}`
    return message ? `${base}?text=${encodeURIComponent(message)}` : base
  }


  function normalizeSocialProfileUrl(value: string | undefined, network: 'Facebook' | 'Instagram') {
    const raw = (value || '').trim()
    if (!raw) return ''
    const cleaned = raw.replace(/[),.;]+$/g, '')
    if (/^https?:\/\//i.test(cleaned)) return cleaned
    if (/^(facebook|fb|instagram)\.com\//i.test(cleaned) || /^www\.(facebook|fb|instagram)\.com\//i.test(cleaned)) return `https://${cleaned}`
    const handle = cleaned.replace(/^@/, '').replace(/^\//, '')
    if (!handle || /\s/.test(handle)) return ''
    return network === 'Instagram' ? `https://www.instagram.com/${handle}` : `https://www.facebook.com/${handle}`
  }

  function contactFacebookUrl(contact: Contact) {
    const candidate = contact.socialFacebookUrl || contact.confirmedFacebookPage || compactLines(contact.facebookPageCandidates || '')[0] || ''
    return normalizeSocialProfileUrl(candidate, 'Facebook')
  }

  function contactInstagramUrl(contact: Contact) {
    return normalizeSocialProfileUrl(contact.socialInstagramUrl || '', 'Instagram')
  }

  function openSocialProfile(contact: Contact, channel: 'Facebook' | 'Instagram') {
    const url = channel === 'Facebook' ? contactFacebookUrl(contact) : contactInstagramUrl(contact)
    if (!url) {
      window.alert(`Profilo ${channel} mancante. Apri Modifica e inserisci URL o handle del contatto.`)
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
    setSelectedContactId(contact.id)
    setTemporaryAssistedFeedback(`${channel} aperto`)
  }

  function copySocialContactMessage(contact: Contact, channel: 'Facebook' | 'Instagram') {
    const message = buildVoiceDeskSocialTemplate(contact, channel)
    navigator.clipboard.writeText(message).then(() => {
      markContacted(contact.id, channel)
      setTemporaryAssistedFeedback(`Messaggio ${channel} copiato e contatto aggiornato`)
    }).catch(() => window.alert('Non sono riuscito a copiare automaticamente il messaggio social.'))
  }

  function openLeadWhatsAppDirect(contact: Contact) {
    const url = buildWhatsAppDirectUrl(contact)
    if (!url) {
      window.alert('Questo lead non ha un numero WhatsApp valido. Apri Modifica e completa il campo Telefono.')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
    setSelectedContactId(contact.id)
    setTemporaryAssistedFeedback('Chat WhatsApp aperta')
  }

  function openWhatsApp(contact: Contact) {
    const message = buildWhatsAppTemplate(contact)
    const url = buildWhatsAppDirectUrl(contact, message)
    if (!url) { copyAssistedMessage('whatsapp'); window.alert('Questo contatto non ha un numero WhatsApp valido: ho copiato il messaggio negli appunti.'); return }
    window.open(url, '_blank', 'noopener,noreferrer')
    setTemporaryAssistedFeedback('WhatsApp aperto')
  }

  function stageAfterAssistedMessage(): OutreachStage {
    if (assistedTemplate === 'close') return 'Demo richiesta'
    if (assistedTemplate === 'diagnose' || assistedTemplate === 'qualify' || assistedTemplate === 'tailored' || assistedTemplate === 'position') return 'Follow-up 1'
    return 'Primo invio'
  }

  function markContacted(contactId: string, channel: Channel = 'Email') {
    const contact = contacts.find((item) => item.id === contactId)
    if (!contact) return
    const text = channel === 'WhatsApp' ? buildWhatsAppTemplate(contact) : ['Instagram', 'Facebook', 'Telegram', 'TikTok', 'LinkedIn'].includes(channel) ? buildVoiceDeskSocialTemplate(contact, channel) : buildEmailTemplate(contact).body
    const nextStage = stageAfterAssistedMessage()
    const result = analyzeConversation(text, contact)
    setConversations((current) => [{ id: id('conversation'), contactId, text, channel, stage: nextStage, analysis: result, createdAt: nowIso() }, ...current])
    setContacts((current) => current.map((c) => c.id === contactId ? { ...c, lastContact: today(), outreachStage: nextStage, nextAction: `${closerStepLabel(assistedTemplate)} inviato: attendere risposta e preparare la prossima domanda.`, updatedAt: nowIso() } : c))
    setAnalysis(result)
    setTemporaryAssistedFeedback('Contatto aggiornato')
  }

  function scheduleFollowUp(contactId: string, days = 3) {
    const contact = contacts.find((item) => item.id === contactId)
    if (!contact) return
    const due = addDays(days)
    setTasks((current) => [{ id: id('task'), title: `Follow-up ${contact.name}: ${closerStepLabel(assistedTemplate)} / prossima domanda`, contactId, priority: contact.priorityLevel === 'A' ? 'Alta' : 'Media', due, completed: false, createdAt: nowIso() }, ...current])
    setContacts((current) => current.map((c) => c.id === contactId ? { ...c, outreachStage: 'Follow-up 1', nextAction: `Follow-up programmato per ${fmtDate(due)}: proseguire con ${closerStepLabel(assistedTemplate).toLowerCase()}.`, updatedAt: nowIso() } : c))
    setTemporaryAssistedFeedback(`Follow-up ${fmtDate(due)}`)
  }

  function updateContactGovernance(contactId: string, patch: Partial<Contact>) {
    setContacts((current) => current.map((contact) => contact.id === contactId ? normalizeContact({ ...contact, ...patch, updatedAt: nowIso() }) : contact))
  }

  function setSelectedRelationship(type: RelationshipType) {
    if (!selectedContact) { window.alert('Seleziona prima un contatto da classificare.'); return }
    const patch: Partial<Contact> = { relationshipType: type, ownerName: selectedContact.ownerName || activeProfile?.name || '', sponsorName: selectedContact.sponsorName || activeProfile?.name || '' }
    if (['Collaboratore', 'Socio', 'Partner operativo', 'Entrambi'].includes(type)) patch.collaboratorStage = selectedContact.collaboratorStage || 'Candidato'
    if (['Investitore', 'Entrambi'].includes(type)) patch.investorStage = selectedContact.investorStage || 'Potenziale'
    updateContactGovernance(selectedContact.id, patch)
    setTemporaryAssistedFeedback(`Classificazione aggiornata: ${type}`)
  }

  function createGovernanceTask(contact: Contact, title: string, priority: Priority = 'Media') {
    setTasks((current) => [{ id: id('task'), title, contactId: contact.id, priority, due: addDays(2), completed: false, createdAt: nowIso() }, ...current])
    setTemporaryAssistedFeedback('Task creato')
  }

  function buildNetFreeIntroMessage(contact: Contact) {
    const person = (contact.decisionMakerName || contact.name || 'buongiorno').trim()
    const business = (contact.company || contact.name || 'la tua attività').trim()
    return `Buongiorno ${person}, sto raccogliendo informazioni per capire se esiste un punto di contatto utile con ${business}, senza forzature e senza proposte preconfezionate.

L'obiettivo è ascoltare il contesto reale, capire eventuali bisogni e valutare solo dopo quale strada abbia senso. Se preferisci, possiamo partire da due informazioni semplici: qual è oggi la priorità più importante per te e quale canale ti è più comodo per parlarne?`
  }

  function buildNetFreeStrategySheet(contact: Contact) {
    const preferredPhone = contact.netFreePreferredPhone || contact.phone || 'non indicato'
    const leadProfile = contact.netFreeLeadProfile || contact.researchSummary || contact.notes || 'profilo base ancora da completare con ascolto leggero'
    const preferredChannel = contact.netFreePreferredChannel || (contactInstagramUrl(contact) ? 'Instagram' : contactFacebookUrl(contact) ? 'Facebook' : contact.phone ? 'WhatsApp/Telefono' : contact.email ? 'Email' : 'Da qualificare')
    const preferredTimeWindow = contact.netFreePreferredTimeWindow || 'da chiedere/confermare senza pressione'
    const callTone = contact.netFreeCallTone || 'caldo, rispettoso, esplorativo: ascoltare prima di proporre'
    const respectfulBrief = contact.netFreeBriefForClaudio || contact.notes || contact.netFreeCandidateReason || 'Nessun brief aggiuntivo: partire da ascolto, contesto e poche domande naturali.'
    return `Scheda strategica interna NetFree — lead da valutare, non da inviare automaticamente.

Nome contatto: ${contact.decisionMakerName || contact.name}
Azienda/struttura: ${contact.company || contact.name}
Telefono/numero utile: ${preferredPhone}
Email: ${contact.decisionMakerEmail || contact.email || contact.generalEmail || 'non indicata'}
Facebook: ${contactFacebookUrl(contact) || 'non indicato'}
Instagram: ${contactInstagramUrl(contact) || 'non indicato'}
Categoria: ${contact.category || 'non indicata'}
Città: ${contact.city || 'non indicata'}
Canale probabilmente più naturale: ${preferredChannel}
Fascia o momento consigliato: ${preferredTimeWindow}
Tono consigliato: ${callTone}
Profilo base lead: ${leadProfile}
Motivo di interesse potenziale: ${contact.netFreeCandidateReason || contact.probableNeeds || contact.messageAngle || 'da chiarire con ascolto'}
Stadio NetFree: ${contact.netFreeStage || 'Lead raccolto'}
Nota strategica: ${respectfulBrief}

Principio operativo: questo lead resta nel database come opportunità relazionale. Prima di qualunque telefonata o coinvolgimento di terzi va scelta una strategia coerente con la filosofia del progetto: rispetto, utilità reale, consenso esplicito, nessuna pressione e nessuna proposta scollegata dal bisogno emerso.`
  }

  function updateNetFreeStage(contactId: string, stage: NetFreeStage) {
    const timestamp = nowIso()
    const nextAction = stage === 'Strategia da definire'
      ? 'Definire internamente canale, tono e motivazione prima di qualsiasi contatto.'
      : stage === 'Primo contatto relazionale'
        ? 'Preparare un messaggio leggero orientato ad ascolto e utilità reale.'
        : undefined
    setContacts((current) => current.map((contact) => contact.id === contactId ? { ...contact, netFreeStage: stage, updatedAt: timestamp, nextAction: nextAction || contact.nextAction } : contact))
  }

  function markNetFreeStrategicReview(contact: Contact) {
    const timestamp = nowIso()
    setContacts((current) => current.map((item) => item.id === contact.id ? { ...item, netFreeStage: 'Strategia da definire', netFreeConsentToCall: false, netFreeConsentAt: '', netFreeSharedWithClaudioAt: '', nextAction: 'Valutare strategia di contatto coerente con la filosofia del progetto.', updatedAt: timestamp } : item))
    setTasks((current) => [{ id: id('task'), title: `Definire strategia relazionale per ${contact.name}`, contactId: contact.id, priority: 'Media', due: addDays(2), completed: false, createdAt: timestamp }, ...current])
    setTemporaryAssistedFeedback('Lead mantenuto: strategia da definire prima di ogni contatto')
  }

  function copyNetFreeStrategySheet(contact: Contact) {
    navigator.clipboard.writeText(buildNetFreeStrategySheet(contact)).then(() => setTemporaryAssistedFeedback('Scheda strategica NetFree copiata')).catch(() => window.alert('Non sono riuscito a copiare automaticamente.'))
  }

  function copyNetFreeIntro(contact: Contact) {
    navigator.clipboard.writeText(buildNetFreeIntroMessage(contact)).then(() => setTemporaryAssistedFeedback('Messaggio consenso NetFree copiato')).catch(() => window.alert('Non sono riuscito a copiare automaticamente.'))
  }


  function matrixPlacement(position: number) {
    if (position <= 0) return { parentPosition: 0, level: 0, slot: 0 }
    let level = 1
    let previousTotal = 0
    let levelCapacity = 6
    while (position > previousTotal + levelCapacity) {
      previousTotal += levelCapacity
      level += 1
      levelCapacity *= 6
    }
    const offset = position - previousTotal - 1
    if (level === 1) return { parentPosition: 0, level, slot: offset + 1 }
    const previousLevelCapacity = levelCapacity / 6
    const parentPosition = previousTotal - previousLevelCapacity + 1 + (offset % previousLevelCapacity)
    const slot = Math.floor(offset / previousLevelCapacity) + 1
    return { parentPosition, level, slot }
  }

  function lcrApprovedList(list = contacts) {
    return list.filter((contact) => contact.lcrSelectionOutcome === 'Approvato').slice().sort((a, b) => Number(a.lcrMatrixPosition || 0) - Number(b.lcrMatrixPosition || 0) || a.createdAt.localeCompare(b.createdAt))
  }

  function buildLcrVoiceScript(contact: Contact) {
    const person = contact.decisionMakerName || contact.name || 'ciao'
    return `Ciao ${person}, ti mando questo vocale perché sto selezionando solo poche persone, massimo sei, per un progetto che non voglio spiegare in modo freddo o commerciale.

Non è una proposta da prendere al volo e non è per tutti. Prima voglio capire se c'è allineamento su valori, visione e modo di lavorare. Se ti incuriosisce, ti mando un link per fissare una Zoom breve di 15 minuti. Se non è il momento giusto, nessun problema.`
  }

  function buildLcrAgendaMessage(contact: Contact) {
    const agenda = contact.lcrAgendaLink || '[inserire link agenda]'
    return `Perfetto ${contact.decisionMakerName || contact.name}, ti lascio qui il link per scegliere uno spazio da 15 minuti: ${agenda}

Gli slot sono tassativi perché l'obiettivo non è convincere, ma capire rapidamente se ha senso proseguire. Dopo la prenotazione riceverai il link Zoom dedicato.`
  }

  function buildLcrZoomGuide(contact: Contact) {
    const zoom = contact.lcrZoomLink || "[link Zoom dinamico dell'appuntamento]"
    return `Guida interna Zoom LCR — ${contact.name}

Durata massima: 15 minuti.
Link Zoom dinamico: ${zoom}
Fascia preferita: ${contact.lcrAvailabilityWindow || 'Da definire'}${contact.lcrCustomAvailability ? ` · ${contact.lcrCustomAvailability}` : ''}

Domande guida:
1. Hai ascoltato il vocale e cosa ti ha colpito?
2. Ti riconosci in un progetto dove prima si valuta la persona e poi l'opportunità?
3. Quanto è importante per te costruire in modo etico, senza pressione e senza scorciatoie?
4. Sei aperto a comprendere NetFree, tokenizzazione e strumenti collegati solo dopo aver capito la filosofia?
5. Se non fosse adatto a te, accetteresti serenamente un no o un rinvio?

Esito da registrare: Approvato, Bocciato o Da valutare. Se approvato, la fase PEF diventa un task interno da gestire manualmente con un tecnico, senza passaggi automatici non presidiati.`
  }

  function buildLcrOutcomeMessage(contact: Contact, outcome: LcrSelectionOutcome) {
    if (outcome === 'Approvato') return `Ciao ${contact.decisionMakerName || contact.name}, grazie per il confronto. Per me c'è allineamento e possiamo procedere con il prossimo passaggio in modo ordinato. Ti aggiorno io sui dettagli operativi, senza fretta e mantenendo tutto chiaro.`
    if (outcome === 'Bocciato') return `Ciao ${contact.decisionMakerName || contact.name}, grazie davvero per il tempo. Preferisco essere coerente: in questo momento non forzerei il percorso. Restiamo in contatto con serenità, senza nessuna pressione.`
    return `Ciao ${contact.decisionMakerName || contact.name}, grazie per il confronto. Mi prendo un momento per rivedere le note e capire se il percorso è davvero adatto. Ti aggiorno con calma.`
  }

  function copyLcrText(text: string, feedback: string) {
    navigator.clipboard.writeText(text).then(() => setTemporaryAssistedFeedback(feedback)).catch(() => window.alert('Non sono riuscito a copiare automaticamente.'))
  }

  function updateLcrContact(contactId: string, patch: Partial<Contact>) {
    setContacts((current) => current.map((contact) => contact.id === contactId ? normalizeContact({ ...contact, ...patch, updatedAt: nowIso() }) : contact))
  }

  function markLcrManualStep(contact: Contact, step: 'voice' | 'positive' | 'zoom') {
    const timestamp = nowIso()
    const patch: Partial<Contact> = step === 'voice'
      ? { lcrVoiceSentAt: timestamp, nextAction: 'Attendere risposta al vocale LCR; se positiva, inviare manualmente link agenda.' }
      : step === 'positive'
        ? { lcrPositiveReplyAt: timestamp, nextAction: 'Inviare manualmente link agenda e registrare slot Zoom da 15 minuti.' }
        : { lcrZoomCompletedAt: timestamp, nextAction: 'Registrare esito selezione LCR: approvato, bocciato o da valutare.' }
    updateLcrContact(contact.id, patch)
    setTemporaryAssistedFeedback('Passaggio LCR registrato come attività manuale')
  }

  function setLcrOutcome(contact: Contact, outcome: LcrSelectionOutcome) {
    const timestamp = nowIso()
    let patch: Partial<Contact> = { lcrSelectionOutcome: outcome, lcrTag: outcome === 'Approvato' ? 'OK LCR' : outcome === 'Bocciato' ? 'Bocciato LCR' : 'Da valutare LCR', updatedAt: timestamp }
    if (outcome === 'Approvato') {
      const approved = lcrApprovedList(contacts.filter((item) => item.id !== contact.id))
      const position = contact.lcrMatrixPosition && contact.lcrSelectionOutcome === 'Approvato' ? contact.lcrMatrixPosition : approved.length + 1
      const placement = matrixPlacement(position)
      const parent = placement.parentPosition ? approved.find((item) => Number(item.lcrMatrixPosition || 0) === placement.parentPosition) : undefined
      const directCount = contacts.filter((item) => item.lcrMatrixParentId === contact.id && item.lcrSelectionOutcome === 'Approvato').length
      patch = { ...patch, status: 'Partner', relationshipType: 'Partner operativo', collaboratorStage: 'Onboarding', lcrPefDelegationStatus: contact.lcrPefDelegationStatus === 'Completata manualmente' ? contact.lcrPefDelegationStatus : 'Task interno creato', lcrMatrixPosition: position, lcrMatrixLevel: placement.level, lcrMatrixSlot: placement.slot, lcrMatrixParentId: parent?.id || '', lcrMatrixSponsorId: contact.lcrMatrixSponsorId || activeProfileId, lcrDirectPeopleCount: directCount, nextAction: 'Preparare manualmente task PEF/tecnico e confermare i passaggi successivi senza automatismi.' }
      setTasks((current) => [{ id: id('task'), title: `Gestire manualmente passaggio PEF per ${contact.name}`, contactId: contact.id, priority: 'Alta', due: addDays(1), completed: false, createdAt: timestamp }, ...current])
    } else if (outcome === 'Bocciato') {
      patch = { ...patch, status: 'Lead', collaboratorStage: 'Candidato', lcrPefDelegationStatus: 'Non avviata', nextAction: 'Non forzare il contatto: mantenere relazione aperta solo se naturale.' }
    }
    updateLcrContact(contact.id, patch)
    setTemporaryAssistedFeedback(`Esito LCR aggiornato: ${outcome}`)
  }

  function askAgent(prompt?: string) { const q = prompt || question; setQuestion(q); setAnswer(agentAnswer(q, contacts, tasks, conversations)) }
  function switchProfile(profileId: string) { setActiveProfileId(profileId); window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId); loadProfileData(profileId); resetDraft(); setAnalysis(null); setAnswer('Profilo cambiato. Ricarico eventuali dati persistenti dal cloud.'); void loadCloudContacts([]) }
  function createProfile() { const name = newProfileName.trim(); if (!name) return; const timestamp = nowIso(); const newProfile = normalizeProfile({ id: id('profilo'), name, role: 'Collaboratore', allowedMaterialIds: defaultCollaboratorMaterialIds, createdAt: timestamp, updatedAt: timestamp }); setProfiles((current) => [...current, newProfile]); setNewProfileName(''); setActiveProfileId(newProfile.id); window.localStorage.setItem(ACTIVE_PROFILE_KEY, newProfile.id); setContacts([]); setTasks([]); setConversations([]); setSelectedContactId(''); resetDraft(); setAnalysis(null); setAnswer(`Profilo ${name} creato. I dati saranno separati dagli altri profili locali e partiranno con permessi standard collaboratore.`) }
  function updateProfilePermissions(profileId: string, patch: Partial<CrmProfile>) { const timestamp = nowIso(); setProfiles((current) => current.map((profile) => profile.id === profileId ? normalizeProfile({ ...profile, ...patch, updatedAt: timestamp }, profile.name) : profile)) }
  function toggleProfileMaterial(profileId: string, materialId: string) { setProfiles((current) => current.map((profile) => { if (profile.id !== profileId) return profile; const currentAllowed = profile.allowedMaterialIds?.length ? profile.allowedMaterialIds : defaultCollaboratorMaterialIds; const nextAllowed = currentAllowed.includes(materialId) ? currentAllowed.filter((id) => id !== materialId) : [...currentAllowed, materialId]; return normalizeProfile({ ...profile, allowedMaterialIds: nextAllowed, updatedAt: nowIso() }, profile.name) })) }
  function exportData() { const blob = new Blob([JSON.stringify({ profile: activeProfile, contacts, tasks, conversations }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `relazione-crm-${activeProfile?.name || 'profilo'}-backup-${today()}.json`.replace(/\s+/g, '-').toLowerCase(); a.click(); URL.revokeObjectURL(url) }
  function importData(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const parsed = JSON.parse(String(reader.result)) as StoredCrmData; const nextContacts = Array.isArray(parsed.contacts) ? parsed.contacts.map(normalizeContact) : []; const nextTasks = Array.isArray(parsed.tasks) ? parsed.tasks : []; const nextConversations = Array.isArray(parsed.conversations) ? parsed.conversations : []; setContacts(nextContacts); setTasks(nextTasks); setConversations(nextConversations); setSelectedContactId(nextContacts[0]?.id || ''); setAnswer('Backup importato nel profilo attivo. Gli altri profili non sono stati modificati.'); } catch { window.alert('Il file selezionato non sembra un backup valido del CRM.') } finally { event.target.value = '' } }; reader.readAsText(file) }

  function detectCsvDelimiter(csv: string) {
    const firstLine = csv.split(/\r?\n/).find((line) => line.trim()) || ''
    const candidates = [',', ';', '\t']
    return candidates.map((delimiter) => ({ delimiter, count: firstLine.split(delimiter).length - 1 })).sort((a, b) => b.count - a.count)[0]?.delimiter || ','
  }

  function parseCsvRows(csv: string, delimiter = ',') {
    const rows: string[][] = []
    let row: string[] = []
    let cell = ''
    let quoted = false
    for (let i = 0; i < csv.length; i += 1) {
      const char = csv[i]
      const next = csv[i + 1]
      if (char === '"' && quoted && next === '"') { cell += '"'; i += 1; continue }
      if (char === '"') { quoted = !quoted; continue }
      if (char === delimiter && !quoted) { row.push(cell); cell = ''; continue }
      if ((char === '\n' || char === '\r') && !quoted) {
        if (char === '\r' && next === '\n') i += 1
        row.push(cell)
        if (row.some((value) => value.trim())) rows.push(row)
        row = []
        cell = ''
        continue
      }
      cell += char
    }
    row.push(cell)
    if (row.some((value) => value.trim())) rows.push(row)
    return rows
  }

  function normalizeImportKey(key: string) {
    return key.trim().replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  function netFreeDedupeKey(contact: Partial<Contact>) {
    const identity = (contact.phone || contact.email || contact.socialInstagramUrl || contact.socialFacebookUrl || contact.name || '').toLowerCase().trim()
    return `${(contact.name || '').toLowerCase().trim()}|${identity}`
  }

  function netFreeContactFromRecord(record: Record<string, any>, index: number, timestamp: string): Contact {
    const normalizedEntries = Object.entries(record || {}).map(([key, value]) => [normalizeImportKey(key), value] as const)
    const normalizedRecord = Object.fromEntries(normalizedEntries)
    const get = (...keys: string[]) => {
      for (const key of keys) {
        const value = normalizedRecord[normalizeImportKey(key)]
        if (value !== undefined && value !== null && String(value).trim()) return String(value).trim()
      }
      return ''
    }
    const name = get('name', 'nome', 'leadName', 'contactName') || `Lead NetFree ${index + 1}`
    const phone = get('phone', 'telefono', 'mobile', 'cellulare', 'claudioPreferredPhone')
    const email = get('email', 'mail', 'generalEmail')
    const preferredChannel = get('preferredContactChannel', 'canalePreferito', 'channel')
    const preferredTimeWindow = get('bestCallWindow', 'bestMessageWindow', 'fasciaOraria', 'orarioPreferito')
    const leadProfile = [get('leadOccupation', 'occupazione'), get('leadBusinessContext', 'contesto')].filter(Boolean).join(' · ') || get('leadBusinessContext', 'contesto', 'researchSummary')
    const candidateReason = get('netFreeCandidateReason', 'motivoNetFree', 'candidateReason', 'probableNeeds')
    const sourceId = get('id', 'sourceId') || `netfree-${index + 1}`
    return normalizeContact({
      id: `netfree-${sourceId.replace(/[^a-zA-Z0-9_-]/g, '-')}`,
      name,
      company: get('company', 'azienda') || name,
      role: get('role', 'ruolo') || '',
      email,
      phone,
      status: 'Lead',
      interest: preferredChannel === 'WhatsApp/Telefono' ? 7 : 6,
      trust: 5,
      value: 0,
      topics: ['NetFree', preferredChannel || 'Da qualificare'].filter(Boolean),
      nextAction: 'Lead raccolto: definire internamente strategia, canale e tono prima di qualsiasi contatto.',
      notes: get('claudioLeadBrief', 'netFreeBriefForClaudio', 'note', 'notes'),
      category: get('category', 'categoria') || 'Lead NetFree',
      subcategory: get('leadOpennessLevel', 'subcategory', 'sottocategoria') || 'Da qualificare',
      city: get('city', 'città', 'citta'),
      address: get('address', 'indirizzo'),
      website: get('website', 'sito'),
      generalEmail: email,
      decisionMakerName: get('decisionMakerName', 'referente') || name,
      decisionMakerRole: get('decisionMakerRole', 'ruoloReferente'),
      decisionMakerEmail: get('decisionMakerEmail') || email,
      estimatedSize: '',
      priceRange: '',
      rating: '',
      reviews: '',
      services: 'NetFree; networking relazionale; valutazione opportunità',
      priorityLevel: num(get('confidenceScore', 'score')) >= 85 ? 'A' : 'B',
      messageAngle: candidateReason,
      personalizationHook: `Canale consigliato: ${preferredChannel || 'da qualificare'}; finestra migliore: ${get('bestMessageWindow') || preferredTimeWindow || 'da verificare'}.`,
      outreachStage: 'Da qualificare',
      sourceBatch: 'Import NetFree curato',
      createdAt: timestamp,
      updatedAt: timestamp,
      lastContact: today(),
      socialInstagramUrl: get('socialInstagramUrl', 'instagram'),
      socialFacebookUrl: get('socialFacebookUrl', 'facebook'),
      confidenceScore: num(get('confidenceScore', 'score')),
      relationshipType: 'Partner operativo',
      netFreeStage: get('netFreeStage') as NetFreeStage || 'Lead raccolto',
      netFreeCandidateReason: candidateReason,
      netFreeConsentToCall: false,
      netFreeConsentAt: '',
      netFreeSharedWithClaudioAt: '',
      netFreeClaudioFeedback: '',
      netFreeNextStep: 'Raccogliere informazioni base e definire una strategia relazionale rispettosa.',
      netFreeEstimatedOpportunity: get('leadOpennessLevel'),
      netFreePreferredPhone: get('claudioPreferredPhone') || phone,
      netFreeLeadProfile: leadProfile,
      netFreePreferredChannel: preferredChannel,
      netFreePreferredTimeWindow: preferredTimeWindow,
      netFreeCallTone: get('claudioCallTone'),
      netFreeBriefForClaudio: get('claudioLeadBrief', 'netFreeBriefForClaudio'),
    } as Contact)
  }

  function processNetFreeImportRaw(rawInput: string, sourceLabel = 'file selezionato') {
    const raw = String(rawInput || '').trim()
    if (!raw) throw new Error('file vuoto')
    const timestamp = nowIso()
    let records: Record<string, any>[] = []
    if (raw.startsWith('{') || raw.startsWith('[')) {
      const parsed = JSON.parse(raw)
      records = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.contacts)
          ? parsed.contacts
          : Array.isArray(parsed.leads)
            ? parsed.leads
            : Array.isArray(parsed.records)
              ? parsed.records
              : Array.isArray(parsed.items)
                ? parsed.items
                : Array.isArray(parsed.data)
                  ? parsed.data
                  : []
    } else {
      const delimiter = detectCsvDelimiter(raw)
      const rows = parseCsvRows(raw, delimiter)
      const [headers, ...dataRows] = rows
      if (!headers?.length) throw new Error('CSV vuoto')
      const normalizedHeaders = headers.map((header) => header.trim()).map((header, index) => header || `__empty_${index}`)
      records = dataRows.map((row) => Object.fromEntries(normalizedHeaders.map((header, index) => [header, row[index]?.trim() || '']).filter(([header]) => !String(header).startsWith('__empty_'))))
    }
    const importedContacts = records
      .filter((record) => record && typeof record === 'object' && !Array.isArray(record))
      .map((record, index) => netFreeContactFromRecord(record, index, timestamp))
      .filter((contact) => String(contact.name || '').trim())
    if (importedContacts.length === 0) throw new Error('nessun lead riconosciuto')
    const existing = new Set(contacts.map(netFreeDedupeKey))
    const fresh = importedContacts.filter((contact) => {
      const key = netFreeDedupeKey(contact)
      if (existing.has(key)) return false
      existing.add(key)
      return true
    })
    const skipped = importedContacts.length - fresh.length
    if (fresh.length > 0) {
      const netFreeTaskLimit = 25
      const nextContacts = [...fresh, ...contacts].map(normalizeContact)
      if (fresh.length > MASSIVE_NETFREE_IMPORT_THRESHOLD) {
        netFreeImportGuardUntilRef.current = Date.now() + NETFREE_IMPORT_GUARD_MS
        setCloudReady(false)
        setCloudStatus('salvataggio')
        setCloudMessage('Import NetFree massivo completato: preparo la sincronizzazione Supabase a blocchi. Se il database non è ancora configurato, i lead restano visibili in sessione e puoi esportare un Backup.')
      }
      setContacts(nextContacts)
      setSelectedContactId(fresh[0].id)
      setTasks((current) => [
        ...fresh.slice(0, netFreeTaskLimit).map((contact) => ({ id: id('task'), title: `Qualificare lead NetFree ${contact.name}: completare dati base e strategia di contatto`, contactId: contact.id, priority: contact.priorityLevel === 'A' ? 'Alta' as Priority : 'Media' as Priority, due: addDays(2), completed: false, createdAt: timestamp })),
        ...current,
      ])
      if (fresh.length > MASSIVE_NETFREE_IMPORT_THRESHOLD) {
        void syncCloudContacts(nextContacts, `Import NetFree completato: avvio salvataggio Supabase a blocchi per ${nextContacts.length} contatti.`)
      }
    }
    setSection('netfree')
    setAnswer(fresh.length > 0
      ? `Import NetFree completato da ${sourceLabel}: ${fresh.length} nuovi lead aggiunti, ${skipped} duplicati saltati. Totale candidati NetFree dopo l’import: ${netFreeContacts.length + fresh.length}. Trovi la lista nella sezione NetFree, sotto “Lista contatti importati”. Ho selezionato il primo lead importato. Se Supabase è configurato, il CRM avvia il salvataggio cloud a blocchi; in caso contrario esporta subito un Backup.`
      : `Import NetFree letto correttamente da ${sourceLabel}, ma non ho aggiunto nuovi lead: le ${importedContacts.length} righe risultano già presenti in questo profilo. Se vuoi ricaricare da zero, usa Reset oppure importa in un profilo nuovo.`)
  }

  async function loadBundledNetFreeArchive() {
    setNetFreeArchiveLoading(true)
    try {
      const response = await fetch('/data/netfree-unified-contacts.json', { cache: 'no-store' })
      if (!response.ok) throw new Error(`archivio pubblico non trovato (${response.status}). Verifica che il file sia in public/data/netfree-unified-contacts.json`)
      const raw = await response.text()
      processNetFreeImportRaw(raw, 'archivio pubblico NetFree')
    } catch (error: any) {
      window.alert(`Non riesco a caricare l’archivio NetFree automatico. Metti netfree-unified-contacts.json in public/data oppure usa Import NetFree dati. Dettaglio: ${error?.message || 'errore sconosciuto'}`)
    } finally {
      setNetFreeArchiveLoading(false)
    }
  }

  function importNetFreeCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        processNetFreeImportRaw(String(reader.result || ''), file.name || 'file selezionato')
      } catch (error: any) {
        window.alert(`File NetFree non valido o non leggibile. Usa CSV o JSON curato. Dettaglio: ${error?.message || 'formato non riconosciuto'}`)
      } finally {
        event.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  function clearAllData() { if (!window.confirm(`Vuoi cancellare solo i dati locali del profilo ${activeProfile?.name || 'attivo'}? Gli altri profili resteranno separati.`)) return; setContacts([]); setTasks([]); setConversations([]); setSelectedContactId(''); resetDraft(); setAnalysis(null); setAnswer('Dati del profilo attivo cancellati. Puoi ricominciare inserendo contatti reali.') }

  const stageGroups = outreachStages.map((stage) => ({
    stage,
    items: contacts.filter((contact) => (contact.outreachStage || 'Da qualificare') === stage),
  }))
  const netFreeContacts = contacts.filter(isNetFreeContact)
  const netFreeStageGroups = netFreeStages.map((stage) => ({
    stage,
    items: netFreeContacts.filter((contact) => (contact.netFreeStage || 'Non avviato') === stage),
  }))
  const filteredNetFreeContacts = netFreeContacts.filter((contact) => {
    const q = netFreeListQuery.trim().toLowerCase()
    if (!q) return true
    return [contact.name, contact.phone, contact.email, contact.city, contact.netFreePreferredChannel, contact.netFreeLeadProfile, contact.netFreeCandidateReason, contact.netFreeStage]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
  const visibleNetFreeContacts = filteredNetFreeContacts.slice(0, 150)
  const hiddenNetFreeContactsCount = Math.max(0, filteredNetFreeContacts.length - visibleNetFreeContacts.length)
  const lcrContacts = contacts.filter((contact) => contact.lcrSelectionOutcome && contact.lcrSelectionOutcome !== 'Non presente')
  const lcrApprovedContacts = lcrApprovedList()
  const lcrMatrixPreview = lcrApprovedContacts.map((contact, index) => {
    const position = Number(contact.lcrMatrixPosition || index + 1)
    const placement = matrixPlacement(position)
    const parent = placement.parentPosition ? lcrApprovedContacts.find((item) => Number(item.lcrMatrixPosition || 0) === placement.parentPosition) : undefined
    return { contact, position, placement, parent }
  })
  const investorStageGroups = investorStages.map((stage) => ({
    stage,
    items: investorContacts.filter((contact) => (contact.investorStage || 'Potenziale') === stage),
  }))

  const nav = [{ id: 'dashboard', label: 'Dashboard', icon: TrendingUp }, { id: 'contacts', label: 'Database 100', icon: Users }, { id: 'calendar', label: 'Calendario', icon: CalendarDays }, { id: 'pipeline', label: 'Flusso', icon: ChevronRight }, { id: 'conversations', label: 'Comunicazioni', icon: Upload }, { id: 'research', label: 'Ricerca guidata', icon: Search }, { id: 'study', label: 'Studio su misura', icon: Calculator }, { id: 'netfree', label: 'NetFree', icon: Phone }, { id: 'lcr', label: 'LCR 6x6', icon: CheckSquare }, { id: 'team', label: 'Soci e rete', icon: UserPlus }, { id: 'investors', label: 'Investitori', icon: TrendingUp }, { id: 'documents', label: 'Contratti e LOI', icon: ClipboardList }, { id: 'materials', label: 'Materiali', icon: ClipboardList }, { id: 'mailing', label: 'Mailing CCN', icon: Mail }, { id: 'agent', label: 'Agente', icon: Bot }] as const

  return (
    <div className="min-h-screen bg-[#f7f6f1] text-gray-900"><div className="flex min-h-screen"><aside className="hidden md:flex w-72 flex-col border-r border-stone-200 bg-white/90 p-5"><div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">AI</div><div><div className="font-bold text-lg">RelazioneCRM</div><div className="text-xs text-gray-500">Database privato</div></div></div><nav className="space-y-2">{nav.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${section === item.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-stone-100 text-gray-700'}`}><Icon className="w-4 h-4" /> {item.label}</button> })}</nav><div className="mt-auto rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-900"><strong className="block mb-1">Uso privato operativo</strong>Database cloud se autenticato; fallback locale con backup se il collegamento non è disponibile.</div></aside><main className="flex-1 p-3 pb-28 md:p-8 md:pb-8 max-w-7xl mx-auto w-full"><header className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-8"><div><h1 className="text-3xl font-bold tracking-tight">CRM privato · 100 contatti qualificati</h1><p className="text-gray-500 mt-1">Gestisci lead premium, comunicazioni, follow-up e backup. Se il database è collegato, i contatti restano persistenti dopo ogni riapertura.</p><div className="mt-3 flex flex-col sm:flex-row gap-2"><div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold ${cloudStatus === 'cloud' ? 'bg-green-50 border-green-200 text-green-800' : cloudStatus === 'salvataggio' ? 'bg-blue-50 border-blue-200 text-blue-800' : cloudStatus === 'locale' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'}`}><Database className="w-4 h-4 shrink-0" /><span>{cloudMessage}</span></div><div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold ${authEmail ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}><ShieldCheck className="w-4 h-4 shrink-0" />{authEmail ? `Accesso: ${authEmail}` : 'Modalità locale attiva: login serve solo per cloud'}</div><select value={currentRole} onChange={(e) => setCurrentRole(e.target.value as UserRole)} className="rounded-2xl border px-3 py-2 text-xs font-semibold bg-white" aria-label="Ruolo operativo">{userRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></div></div><div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2"><select value={section} onChange={(e) => setSection(e.target.value as Section)} className="md:hidden col-span-2 sm:col-span-1 rounded-xl border bg-white px-3 py-3 text-sm font-semibold" aria-label="Sezione CRM">{nav.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><button onClick={importMilanoBatch1} className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 text-sm inline-flex items-center gap-2"><Database className="w-4 h-4" />Carica Batch Milano 1</button><button onClick={exportData} className="px-4 py-2 rounded-xl border bg-white hover:bg-stone-50 text-sm inline-flex items-center gap-2"><Download className="w-4 h-4" />Backup</button><label className="px-4 py-2 rounded-xl border bg-white hover:bg-stone-50 text-sm inline-flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" />Importa<input type="file" accept="application/json" onChange={importData} className="hidden" /></label><label className="px-4 py-2 rounded-xl border bg-teal-50 hover:bg-teal-100 text-teal-800 text-sm inline-flex items-center gap-2 cursor-pointer"><Database className="w-4 h-4" />Import NetFree dati<input type="file" accept=".csv,.json,text/csv,application/json" onChange={importNetFreeCsv} className="hidden" /></label><button onClick={loadBundledNetFreeArchive} disabled={netFreeArchiveLoading} className="px-4 py-2 rounded-xl border bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm inline-flex items-center gap-2 justify-center disabled:opacity-50"><Database className="w-4 h-4" />{netFreeArchiveLoading ? 'Carico NetFree...' : 'Carica archivio NetFree 2914'}</button><button onClick={clearAllData} className="px-4 py-2 rounded-xl border bg-white hover:bg-red-50 text-sm text-red-700 inline-flex items-center gap-2 justify-center"><Trash2 className="w-4 h-4" />Reset</button>{authEmail ? <button onClick={signOutFromDemo} className="col-span-2 sm:col-span-1 px-4 py-2 rounded-xl border bg-white hover:bg-stone-50 text-sm inline-flex items-center gap-2 justify-center"><LogOut className="w-4 h-4" />Esci</button> : <button onClick={goToLogin} className="col-span-2 sm:col-span-1 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black text-sm inline-flex items-center gap-2 justify-center"><LogIn className="w-4 h-4" />Accedi</button>}</div></header><section className="mb-8 rounded-3xl border bg-white p-5"><div className="flex flex-col xl:flex-row xl:items-end gap-4 justify-between"><div><div className="flex items-center gap-2 text-sm font-semibold text-blue-800"><ShieldCheck className="w-4 h-4" /> Profili separati per te e soci</div><p className="text-gray-600 mt-1">Profilo attivo: <strong>{activeProfile?.name || 'Profilo locale'}</strong>. Con database attivo i contatti vengono ricaricati dal cloud; in modalità locale usa Backup/Importa per non perdere dati.</p></div><div className="flex flex-col md:flex-row gap-2 md:items-center"><select value={activeProfileId} onChange={(e) => switchProfile(e.target.value)} className="rounded-2xl border px-4 py-3 bg-white min-w-48">{profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</select><div className="flex gap-2"><input value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} className="rounded-2xl border px-4 py-3 w-48" placeholder="Nome socio/profilo" /><button onClick={createProfile} className="rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800"><UserPlus className="w-4 h-4 inline mr-2" />Crea</button></div></div></div>{isAdmin && <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50 p-4"><div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"><div><div className="text-sm font-bold text-blue-900">Permessi servizi/materiali per profilo attivo</div><p className="text-sm text-blue-900/80 mt-1">Decidi quali servizi e documenti un socio o collaboratore può aprire e condividere. L’amministratore vede sempre tutto; i profili non amministratori vedono solo i materiali autorizzati.</p></div><select value={activeProfile?.role || 'Collaboratore'} onChange={(e) => activeProfile && updateProfilePermissions(activeProfile.id, { role: e.target.value as UserRole, allowedMaterialIds: e.target.value === 'Amministratore' ? allMaterialIds : activeProfile.allowedMaterialIds })} className="rounded-2xl border px-4 py-3 bg-white min-w-48">{userRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></div><div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">{networkMaterials.map((material) => { const checked = activeProfile?.role === 'Amministratore' || !!activeProfile?.allowedMaterialIds?.includes(material.id); return <label key={material.id} className={`rounded-2xl border p-3 bg-white flex items-start gap-3 ${checked ? 'border-blue-200' : 'border-stone-200 opacity-75'}`}><input type="checkbox" checked={checked} disabled={!activeProfile || activeProfile.role === 'Amministratore'} onChange={() => activeProfile && toggleProfileMaterial(activeProfile.id, material.id)} className="mt-1" /><span><span className="block text-sm font-bold">{material.area}</span><span className="block text-xs text-gray-600">{material.title}</span></span></label> })}</div><textarea value={activeProfile?.permissionNotes || ''} onChange={(e) => activeProfile && updateProfilePermissions(activeProfile.id, { permissionNotes: e.target.value })} className="mt-4 w-full rounded-2xl border p-3 text-sm bg-white" placeholder="Note interne sui permessi: es. può condividere solo VoiceDesk e PEF cliente; Blotix solo dopo autorizzazione admin..." /></div>}
</section>

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


  {section === 'calendar' && <section className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-5"><div className="flex flex-col xl:flex-row xl:items-start gap-5 justify-between"><div className="flex-1"><div className="flex items-center gap-2 text-sm font-semibold text-blue-900"><CalendarDays className="w-4 h-4" /> Automazione appuntamenti Google Meet</div><h2 className="text-xl font-bold mt-1">Conferma una volta: Calendar crea link Meet, invito e CRM</h2><p className="text-sm text-blue-950/80 mt-2">Seleziona il lead, giorno e ora; poi premi conferma. Il sistema crea l’evento Google Calendar con link Meet, invia l’invito al partecipante se ha email e salva l’appuntamento su Supabase. Vale per contatti ordinari e NetFree.</p><div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${meetStatus === 'collegato' ? 'bg-green-50 border-green-200 text-green-800' : meetStatus === 'creazione' || meetStatus === 'verifica' ? 'bg-white border-blue-200 text-blue-900' : meetStatus === 'errore' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>{meetMessage}</div></div><div className="xl:w-[520px] rounded-3xl border bg-white p-4 space-y-3"><div className="grid md:grid-cols-2 gap-3"><label className="text-sm font-semibold">Lead<select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-3 bg-white">{contacts.slice(0, 300).map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}</select></label><label className="text-sm font-semibold">Giorno<input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-3" /></label><label className="text-sm font-semibold">Ora<input type="time" value={meetTime} onChange={(e) => setMeetTime(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-3" /></label><label className="text-sm font-semibold">Durata<select value={meetDuration} onChange={(e) => setMeetDuration(Number(e.target.value))} className="mt-1 w-full rounded-2xl border px-3 py-3 bg-white"><option value={30}>30 minuti</option><option value={45}>45 minuti</option><option value={60}>60 minuti</option><option value={90}>90 minuti</option></select></label></div><textarea value={meetNotes} onChange={(e) => setMeetNotes(e.target.value)} className="w-full rounded-2xl border p-3 text-sm" placeholder="Note interne per briefing appuntamento, non obbligatorie..." /><div className="flex flex-col sm:flex-row gap-2"><button onClick={confirmMeetAppointment} disabled={!selectedContact || meetStatus === 'creazione'} className="flex-1 rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800 disabled:opacity-40"><Send className="w-4 h-4 inline mr-2" />Conferma appuntamento Meet</button><button onClick={connectGoogleMeet} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><CalendarDays className="w-4 h-4 inline mr-2" />{meetStatus === 'collegato' ? 'Ricollega Google' : 'Collega Google'}</button></div><div className="text-xs text-gray-600"><strong>Account:</strong> {meetAccountLabel || 'non collegato'} · <strong>Email lead:</strong> {(selectedContact?.decisionMakerEmail || selectedContact?.generalEmail || selectedContact?.email || 'mancante')}</div></div></div></section>}

  {section === 'dashboard' && <div className="space-y-6"><div className="rounded-3xl border bg-white p-5 flex flex-col lg:flex-row gap-4 lg:items-center"><div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center"><Bot className="w-5 h-5" /></div><div className="flex-1"><div className="font-semibold">Agente operativo · Prossima mossa</div><div className="text-gray-600">{suggestion}</div></div><button onClick={() => setSection('agent')} className="px-5 py-3 rounded-2xl border bg-stone-50 hover:bg-stone-100">Interroga agente</button></div><div className="grid grid-cols-2 lg:grid-cols-7 gap-4"><div className="rounded-3xl bg-white border p-5"><Users className="w-5 h-5 text-blue-600 mb-3" /><div className="text-sm text-gray-500">Database</div><div className="text-3xl font-bold">{metrics.active}/100</div></div><div className="rounded-3xl bg-white border p-5"><Star className="w-5 h-5 text-red-600 mb-3" /><div className="text-sm text-gray-500">A-list</div><div className="text-3xl font-bold">{metrics.aList}</div></div><div className="rounded-3xl bg-white border p-5"><ClipboardList className="w-5 h-5 text-green-600 mb-3" /><div className="text-sm text-gray-500">Qualificati</div><div className="text-3xl font-bold">{metrics.qualified}</div></div><button onClick={() => setSection('research')} className="rounded-3xl bg-white border p-5 text-left hover:bg-stone-50"><Search className="w-5 h-5 text-cyan-600 mb-3" /><div className="text-sm text-gray-500">Ricerca guidata</div><div className="text-3xl font-bold">{contacts.filter((c) => c.researchSummary || c.publicSources).length}</div><div className="text-xs text-gray-500 mt-1">lead contestualizzati</div></button><div className="rounded-3xl bg-white border p-5"><CheckSquare className="w-5 h-5 text-orange-600 mb-3" /><div className="text-sm text-gray-500">Task aperti</div><div className="text-3xl font-bold">{metrics.tasks}</div></div><div className="rounded-3xl bg-white border p-5"><TrendingUp className="w-5 h-5 text-purple-600 mb-3" /><div className="text-sm text-gray-500">Pipeline stimata</div><div className="text-3xl font-bold">{euro(metrics.pipeline)}</div></div><button onClick={() => setSection('study')} className="rounded-3xl bg-white border p-5 text-left hover:bg-stone-50"><Calculator className="w-5 h-5 text-teal-600 mb-3" /><div className="text-sm text-gray-500">Studio su misura</div><div className="text-3xl font-bold">2,5%</div><div className="text-xs text-gray-500 mt-1">tokenizzazione + plafond</div></button></div>{isAdmin && <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5"><div className="flex items-center gap-3 mb-4"><ShieldCheck className="w-5 h-5 text-indigo-700" /><div><h2 className="font-bold text-lg">KPI amministratore · soci, collaboratori e investitori</h2><p className="text-sm text-indigo-900/80">Questi indicatori sono pensati per la vista amministratore: soci e collaboratori lavorano sui propri contatti senza vedere il quadro complessivo.</p></div></div><div className="grid md:grid-cols-5 gap-3"><div className="rounded-2xl bg-white border p-4"><div className="text-xs text-gray-500">Collaboratori rete</div><div className="text-2xl font-bold">{metrics.collaborators}</div></div><div className="rounded-2xl bg-white border p-4"><div className="text-xs text-gray-500">Attivi / leader</div><div className="text-2xl font-bold">{metrics.activeCollaborators}</div></div><div className="rounded-2xl bg-white border p-4"><div className="text-xs text-gray-500">Investitori</div><div className="text-2xl font-bold">{metrics.investors}</div></div><div className="rounded-2xl bg-white border p-4"><div className="text-xs text-gray-500">Pipeline investitori</div><div className="text-2xl font-bold">{euro(metrics.investorPipeline)}</div></div><div className="rounded-2xl bg-white border p-4"><div className="text-xs text-gray-500">Documenti da seguire</div><div className="text-2xl font-bold">{metrics.documentsPending}</div></div></div></div>}<div className="grid lg:grid-cols-2 gap-6"><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg mb-4">Follow-up aperti</h2><div className="space-y-3">{openTasks.slice(0, 6).map((task) => { const c = contacts.find((x) => x.id === task.contactId); return <div key={task.id} className="rounded-2xl border p-4 flex items-center gap-3"><input type="checkbox" checked={task.completed} onChange={() => setTasks((current) => current.map((x) => x.id === task.id ? { ...x, completed: !x.completed } : x))} /><div className="flex-1"><div className="font-semibold">{task.title}</div><div className="text-sm text-gray-500">{c?.name || 'Contatto eliminato'} · {fmtDate(task.due)}</div></div><span className={`text-xs border rounded-lg px-2 py-1 ${priorityClass(task.priority)}`}>{task.priority}</span><button onClick={() => setTasks((current) => current.filter((x) => x.id !== task.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button></div> })}{openTasks.length === 0 && <p className="text-gray-500">Nessun task aperto. Carica il batch o crea un follow-up da un contatto.</p>}</div></div><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg mb-4">Aggiungi task rapido</h2><div className="space-y-3"><select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="w-full rounded-2xl border px-4 py-3 bg-white"><option value="">Seleziona contatto</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full rounded-2xl border px-4 py-3" placeholder="Es. completare email, inviare video, follow-up..." /><div className="grid grid-cols-2 gap-3"><input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} className="rounded-2xl border px-4 py-3" /><select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as Priority)} className="rounded-2xl border px-4 py-3 bg-white"><option>Alta</option><option>Media</option><option>Bassa</option></select></div><button onClick={saveTask} disabled={!selectedContact || !taskTitle.trim()} className="w-full rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800 disabled:opacity-40"><Plus className="w-4 h-4 inline mr-2" />Salva task</button></div></div></div></div>}

  {section === 'calendar' && <div className="space-y-6"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><div><div className="flex items-center gap-3"><CalendarDays className="w-6 h-6 text-blue-700" /><h2 className="font-bold text-xl">Calendario commerciale · appuntamenti e follow-up</h2></div><p className="text-gray-600 mt-2">Ogni scheda nasce dai task già presenti nel CRM: puoi spostare un follow-up cambiando data o trascinando la scheda sul giorno corretto. I dati restano nel profilo locale e nel backup.</p></div><div className="flex flex-wrap gap-2"><input type="month" value={calendarMonth} onChange={(e) => setCalendarMonth(e.target.value || monthKey())} className="rounded-2xl border px-4 py-3 bg-white" /><button onClick={() => setCalendarMonth(monthKey())} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50">Oggi</button></div></div></div><div className="grid lg:grid-cols-[1fr_360px] gap-6"><div className="rounded-3xl bg-white border p-5"><div className="flex items-center justify-between mb-4"><div><h3 className="font-bold text-lg capitalize">{monthLabel}</h3><p className="text-sm text-gray-500">{monthTasks.filter((task) => !task.completed).length} eventi aperti nel mese</p></div><div className="flex gap-2 text-xs"><span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-800">Appuntamenti</span><span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">Follow-up</span><span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-teal-800">Studio</span></div></div><div className="grid md:grid-cols-7 gap-3">{calendarDays.map((day) => { const dayTasks = monthTasks.filter((task) => task.due === day); return <div key={day} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const taskId = event.dataTransfer.getData('text/plain'); if (taskId) moveTask(taskId, day) }} className={`min-h-40 rounded-2xl border p-3 ${day === today() ? 'bg-blue-50 border-blue-200' : 'bg-stone-50 border-stone-200'}`}><div className="flex items-center justify-between mb-2"><span className="font-bold text-sm">{new Date(day).getDate()}</span>{day === today() && <span className="text-[10px] rounded-full bg-blue-700 text-white px-2 py-0.5">oggi</span>}</div><div className="space-y-2">{dayTasks.map((task) => { const contact = contacts.find((item) => item.id === task.contactId); return <div key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', task.id)} className={`rounded-xl border p-2 text-xs cursor-move ${calendarEventClass(task)}`}><div className="flex items-center justify-between gap-2"><span className="font-semibold">{calendarEventKind(task)}</span><input type="checkbox" checked={task.completed} onChange={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))} /></div><button onClick={() => { setSelectedContactId(task.contactId); setSection('contacts') }} className="text-left font-semibold mt-1 hover:underline line-clamp-2">{task.title}</button><div className="text-[11px] opacity-80 mt-1">{contact?.name || 'Contatto eliminato'} · {task.priority}</div><input type="date" value={task.due} onChange={(event) => moveTask(task.id, event.target.value)} className="mt-2 w-full rounded-lg border bg-white/80 px-2 py-1 text-[11px]" /></div> })}{dayTasks.length === 0 && <div className="text-xs text-gray-400">Libero</div>}</div></div> })}</div></div><div className="space-y-4"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-3">Crea evento commerciale</h3><div className="space-y-3"><select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="w-full rounded-2xl border px-4 py-3 bg-white"><option value="">Seleziona contatto</option>{contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}</select><input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} className="w-full rounded-2xl border px-4 py-3" /><div className="grid grid-cols-2 gap-2"><button onClick={() => createCalendarEvent('Appuntamento')} disabled={!selectedContact} className="rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800 disabled:opacity-40"><Clock className="w-4 h-4 inline mr-2" />Appuntamento</button><button onClick={() => createCalendarEvent('Follow-up')} disabled={!selectedContact} className="rounded-2xl bg-amber-600 text-white px-4 py-3 font-semibold hover:bg-amber-700 disabled:opacity-40">Follow-up</button></div><input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full rounded-2xl border px-4 py-3" placeholder="Oppure descrivi un task personalizzato" /><button onClick={saveTask} disabled={!selectedContact || !taskTitle.trim()} className="w-full rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800 disabled:opacity-40"><Plus className="w-4 h-4 inline mr-2" />Salva task personalizzato</button></div></div><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-3">Scaduti da recuperare</h3><div className="space-y-2">{overdueTasks.slice(0, 6).map((task) => { const contact = contacts.find((item) => item.id === task.contactId); return <div key={task.id} className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm text-red-900"><div className="font-semibold">{task.title}</div><div className="text-xs mt-1">{contact?.name || 'Contatto eliminato'} · era il {fmtDate(task.due)}</div><button onClick={() => moveTask(task.id, today())} className="mt-2 text-xs rounded-xl bg-white border px-3 py-1 hover:bg-red-100">Sposta a oggi</button></div> })}{overdueTasks.length === 0 && <p className="text-sm text-gray-500">Nessun evento scaduto: il ritmo follow-up è sotto controllo.</p>}</div></div><div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-950"><strong className="block mb-1">Regola closer</strong>Ogni conversazione deve finire con un prossimo passo datato: se non c’è una risposta, programma follow-up; se c’è interesse, crea appuntamento o demo e spostalo man mano che cambia la data reale.</div></div></div></div>}


  {section === 'contacts' && <div className="grid lg:grid-cols-[1fr_440px] gap-6"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5"><div className="flex items-center gap-3"><Search className="w-5 h-5 text-gray-400" /><h2 className="font-bold text-lg">Database contatti qualificati</h2></div><button onClick={importMilanoBatch1} className="rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800"><Database className="w-4 h-4 inline mr-2" />Carica Batch Milano 1</button></div><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-2xl border px-4 py-3 mb-4" placeholder="Cerca per struttura, categoria, città, gancio, stadio..." /><div className="space-y-3">{filteredContacts.map((contact) => <div key={contact.id} className={`rounded-2xl border p-4 hover:bg-stone-50 ${selectedContact?.id === contact.id ? 'ring-2 ring-blue-200' : ''}`}><button onClick={() => setSelectedContactId(contact.id)} className="w-full text-left"><div className="flex justify-between gap-3"><div><div className="font-semibold">{contact.name}</div><div className="text-sm text-gray-500">{contact.category || 'Categoria non indicata'} · {contact.city || 'Città non indicata'} · {contact.phone || 'Telefono mancante'}</div></div><div className="flex flex-col gap-1 items-end"><span className={`h-fit text-xs px-2 py-1 rounded-lg border ${priorityLevelClass(contact.priorityLevel)}`}>Priorità {contact.priorityLevel || 'B'}</span><span className={`h-fit text-xs px-2 py-1 rounded-lg border ${stageClass(contact.outreachStage)}`}>{contact.outreachStage || 'Da qualificare'}</span></div></div>{contact.personalizationHook && <div className="mt-3 text-sm text-gray-700 bg-stone-50 rounded-xl p-3">{contact.personalizationHook}</div>}<div className="mt-3 flex flex-wrap gap-2">{contact.topics.map((t) => <span key={t} className="text-xs rounded-lg bg-stone-100 px-2 py-1">{t}</span>)}</div></button><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => startEdit(contact)} className="text-sm rounded-xl border px-3 py-2 hover:bg-white"><Pencil className="w-3 h-3 inline mr-1" />Modifica</button><button onClick={() => openLeadWhatsAppDirect(contact)} disabled={!buildWhatsAppDirectUrl(contact)} title={buildWhatsAppDirectUrl(contact) || 'Numero WhatsApp mancante o non valido'} className="text-sm rounded-xl border px-3 py-2 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:hover:bg-white"><Phone className="w-3 h-3 inline mr-1" />Chat WhatsApp</button><button onClick={() => openSocialProfile(contact, 'Facebook')} disabled={!contactFacebookUrl(contact)} title={contactFacebookUrl(contact) || 'Profilo Facebook mancante'} className="text-sm rounded-xl border px-3 py-2 text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-white">Facebook</button><button onClick={() => openSocialProfile(contact, 'Instagram')} disabled={!contactInstagramUrl(contact)} title={contactInstagramUrl(contact) || 'Profilo Instagram mancante'} className="text-sm rounded-xl border px-3 py-2 text-pink-700 hover:bg-pink-50 disabled:opacity-40 disabled:hover:bg-white">Instagram</button><select value={contact.outreachStage || 'Da qualificare'} onChange={(e) => updateContactStage(contact.id, e.target.value as OutreachStage)} className="text-sm rounded-xl border px-3 py-2 bg-white">{outreachStages.map((s) => <option key={s}>{s}</option>)}</select><button onClick={() => deleteContact(contact.id)} className="text-sm rounded-xl border px-3 py-2 text-red-700 hover:bg-red-50"><Trash2 className="w-3 h-3 inline mr-1" />Elimina</button></div></div>)}{filteredContacts.length === 0 && <p className="text-gray-500">Nessun contatto trovato. Carica il Batch Milano 1 o inserisci il primo lead dal modulo a destra.</p>}</div></div><div className="rounded-3xl bg-white border p-5 h-fit"><h2 className="font-bold text-lg">{editingId ? 'Modifica lead qualificato' : 'Nuovo lead qualificato'}</h2><div className="mt-4 space-y-3"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Nome struttura *" /><div className="grid grid-cols-2 gap-3"><input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Categoria" /><input value={draft.subcategory} onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Sottocategoria" /></div><div className="grid grid-cols-2 gap-3"><input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Città" /><input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Telefono" /></div><input value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Sito web" /><div className="grid grid-cols-2 gap-3"><input value={draft.socialFacebookUrl || ''} onChange={(e) => setDraft({ ...draft, socialFacebookUrl: e.target.value, confirmedFacebookPage: e.target.value || draft.confirmedFacebookPage })} className="rounded-2xl border px-4 py-3" placeholder="Facebook URL o @pagina" /><input value={draft.socialInstagramUrl || ''} onChange={(e) => setDraft({ ...draft, socialInstagramUrl: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Instagram URL o @profilo" /></div><div className="grid grid-cols-2 gap-3"><input value={draft.generalEmail} onChange={(e) => setDraft({ ...draft, generalEmail: e.target.value, email: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Email generale" /><input value={draft.decisionMakerName} onChange={(e) => setDraft({ ...draft, decisionMakerName: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Decision maker" /></div><div className="grid grid-cols-2 gap-3"><input value={draft.decisionMakerRole} onChange={(e) => setDraft({ ...draft, decisionMakerRole: e.target.value, role: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Ruolo decision maker" /><input value={draft.decisionMakerEmail} onChange={(e) => setDraft({ ...draft, decisionMakerEmail: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Email decision maker" /></div><div className="grid grid-cols-3 gap-3"><select value={draft.priorityLevel} onChange={(e) => setDraft({ ...draft, priorityLevel: e.target.value as PriorityLevel })} className="rounded-2xl border px-4 py-3 bg-white">{priorityLevels.map((p) => <option key={p}>{p}</option>)}</select><select value={draft.outreachStage} onChange={(e) => setDraft({ ...draft, outreachStage: e.target.value as OutreachStage })} className="rounded-2xl border px-4 py-3 bg-white col-span-2">{outreachStages.map((s) => <option key={s}>{s}</option>)}</select></div><div className="grid grid-cols-3 gap-3"><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ContactStatus })} className="rounded-2xl border px-4 py-3 bg-white">{statuses.map((s) => <option key={s}>{s}</option>)}</select><input type="number" min="1" max="10" value={draft.interest} onChange={(e) => setDraft({ ...draft, interest: Number(e.target.value) })} className="rounded-2xl border px-4 py-3" placeholder="Interesse" /><input type="number" min="1" max="10" value={draft.trust} onChange={(e) => setDraft({ ...draft, trust: Number(e.target.value) })} className="rounded-2xl border px-4 py-3" placeholder="Fiducia" /></div><div className="grid grid-cols-2 gap-3"><input value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Valutazione" /><input value={draft.reviews} onChange={(e) => setDraft({ ...draft, reviews: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Numero recensioni" /></div><input type="number" value={draft.value} onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })} className="w-full rounded-2xl border px-4 py-3" placeholder="Valore stimato €" /><input value={draft.services} onChange={(e) => setDraft({ ...draft, services: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Servizi: spa, eventi, concierge, prenotazioni..." /><textarea value={draft.personalizationHook} onChange={(e) => setDraft({ ...draft, personalizationHook: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Gancio di personalizzazione" /><textarea value={draft.messageAngle} onChange={(e) => setDraft({ ...draft, messageAngle: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Angolo messaggio / video" /><input value={draft.topicsText} onChange={(e) => setDraft({ ...draft, topicsText: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Temi separati da virgola" /><textarea value={draft.nextAction} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Prossima azione" /><textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="w-full rounded-2xl border px-4 py-3 min-h-24" placeholder="Note interne" /><div className="rounded-2xl border bg-teal-50/60 p-4 space-y-3"><div className="font-semibold text-sm text-teal-900">Percorso NetFree strategico</div><select value={draft.netFreeStage || 'Non avviato'} onChange={(e) => setDraft({ ...draft, netFreeStage: e.target.value as NetFreeStage })} className="w-full rounded-2xl border px-4 py-3 bg-white">{netFreeStages.map((s) => <option key={s}>{s}</option>)}</select><textarea value={draft.netFreeCandidateReason || ''} onChange={(e) => setDraft({ ...draft, netFreeCandidateReason: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Perché inserirlo nel percorso: costo energia, efficientamento, interesse, asset, bisogno operativo..." /><label className="flex items-center gap-2 text-sm text-teal-950"><input type="checkbox" checked={Boolean(draft.netFreeConsentToCall)} onChange={(e) => setDraft({ ...draft, netFreeConsentToCall: e.target.checked, netFreeConsentAt: e.target.checked ? (draft.netFreeConsentAt || today()) : '' })} /> Ha dato disponibilità al dialogo, senza passaggio automatico a terzi</label><textarea value={draft.netFreeClaudioFeedback || ''} onChange={(e) => setDraft({ ...draft, netFreeClaudioFeedback: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Note successive al contatto o alla valutazione strategica" /></div><div className="flex gap-2"><button onClick={saveContact} className="flex-1 rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800"><Save className="w-4 h-4 inline mr-2" />Salva</button>{editingId && <button onClick={resetDraft} className="rounded-2xl border px-4 py-3">Annulla</button>}</div></div></div></div>}

  {section === 'pipeline' && <div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg">Flusso comunicazioni</h2><p className="text-gray-600 mt-1">Sposta ogni contatto nello stadio reale. Per ora l’invio resta manuale: il CRM ti aiuta a non perdere prossima azione e storico.</p></div><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{stageGroups.map(({ stage, items }) => <div key={stage} className="rounded-3xl bg-white border p-4"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold">{stage}</h3><span className="text-xs rounded-full bg-stone-100 px-2 py-1">{items.length}</span></div><div className="space-y-3">{items.map((contact) => <button key={contact.id} onClick={() => { setSelectedContactId(contact.id); setSection('contacts') }} className="w-full text-left rounded-2xl border p-3 hover:bg-stone-50"><div className="font-semibold text-sm">{contact.name}</div><div className="text-xs text-gray-500">Priorità {contact.priorityLevel || 'B'} · {contact.category || 'Categoria n/d'}</div><div className="text-xs text-gray-600 mt-2 line-clamp-2">{contact.nextAction || contact.messageAngle || 'Prossima azione da definire'}</div></button>)}{items.length === 0 && <p className="text-sm text-gray-400">Nessun contatto.</p>}</div></div>)}</div></div>}


  {section === 'netfree' && <div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"><div><h2 className="font-bold text-lg">NetFree</h2><p className="text-gray-600 mt-1">Archivio strategico dei lead NetFree. I contatti restano nel database: prima si valuta canale, tono e utilità reale, poi si decide come muoversi senza automatismi e senza snaturare la filosofia del progetto.</p></div><div className="flex flex-wrap gap-2"><label className="rounded-2xl border bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 cursor-pointer hover:bg-teal-100"><Upload className="w-4 h-4 inline mr-2" />Import dati curati<input type="file" accept=".csv,.json,text/csv,application/json" onChange={importNetFreeCsv} className="hidden" /></label><button onClick={() => selectedContact && copyNetFreeIntro(selectedContact)} disabled={!selectedContact} className="rounded-2xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-stone-50 disabled:opacity-40">Copia approccio leggero</button></div></div><div className="mt-4 grid md:grid-cols-4 gap-3"><div className="rounded-2xl bg-stone-50 border p-4"><div className="text-xs text-gray-500">Candidati NetFree</div><div className="text-2xl font-bold">{netFreeContacts.length}</div></div><div className="rounded-2xl bg-green-50 border border-green-100 p-4"><div className="text-xs text-green-800">Strategia</div><div className="text-2xl font-bold">{netFreeContacts.filter((contact) => contact.netFreeStage === 'Strategia da definire').length}</div></div><div className="rounded-2xl bg-blue-50 border border-blue-100 p-4"><div className="text-xs text-blue-800">In valutazione</div><div className="text-2xl font-bold">{netFreeContacts.filter((contact) => contact.netFreeStage === 'Primo contatto relazionale' || contact.netFreeStage === 'Dialogo aperto').length}</div></div><div className="rounded-2xl bg-amber-50 border border-amber-100 p-4"><div className="text-xs text-amber-800">Da strategia</div><div className="text-2xl font-bold">{netFreeContacts.filter((contact) => contact.netFreeStage === 'Lead raccolto' || contact.netFreeStage === 'Da qualificare con rispetto').length}</div></div></div></div><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"><div><h3 className="font-bold">Lista contatti importati</h3><p className="text-sm text-gray-600 mt-1">Qui trovi i lead caricati da JSON o CSV. Per non bloccare il browser mostro al massimo 150 risultati per volta: usa la ricerca per restringere l’elenco.</p></div><input value={netFreeListQuery} onChange={(e) => setNetFreeListQuery(e.target.value)} className="rounded-2xl border px-4 py-3 min-w-64" placeholder="Cerca nome, telefono, email, città, canale..." /></div><div className="mt-4 text-sm text-gray-600">Risultati: <strong>{filteredNetFreeContacts.length}</strong>{hiddenNetFreeContactsCount > 0 ? ` · mostrati 150, nascosti ${hiddenNetFreeContactsCount}: raffina la ricerca` : ''}</div><div className="mt-4 max-h-[520px] overflow-auto divide-y rounded-2xl border">{visibleNetFreeContacts.map((contact) => <button key={contact.id} onClick={() => setSelectedContactId(contact.id)} className={`w-full text-left p-3 hover:bg-stone-50 ${selectedContactId === contact.id ? 'bg-blue-50' : 'bg-white'}`}><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2"><div><div className="font-semibold">{contact.name}</div><div className="text-xs text-gray-500">{contact.phone || contact.email || contact.netFreePreferredPhone || 'recapito da verificare'} · {contact.city || 'città non indicata'}</div></div><span className="text-xs rounded-full bg-stone-100 px-2 py-1 w-fit">{contact.netFreeStage || 'Da qualificare'}</span></div><div className="text-xs text-gray-600 mt-2 line-clamp-2">{contact.netFreeCandidateReason || contact.netFreeLeadProfile || contact.notes || 'Profilo da completare'}</div></button>)}{visibleNetFreeContacts.length === 0 && <div className="p-4 text-sm text-gray-500">Nessun lead NetFree trovato. Dopo l’import JSON/CSV i contatti compariranno qui.</div>}</div></div><div className="grid lg:grid-cols-[1fr_380px] gap-5"><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{netFreeStageGroups.map(({ stage, items }) => <div key={stage} className="rounded-3xl bg-white border p-4"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">{stage}</h3><span className="text-xs rounded-full bg-stone-100 px-2 py-1">{items.length}</span></div><div className="space-y-3">{items.slice(0, 12).map((contact) => <div key={contact.id} className="rounded-2xl border p-3 hover:bg-stone-50"><button onClick={() => setSelectedContactId(contact.id)} className="w-full text-left"><div className="font-semibold text-sm">{contact.name}</div><div className="text-xs text-gray-500">{contact.netFreePreferredChannel || contact.phone || contact.email || 'Canale da qualificare'} · {contact.netFreePreferredTimeWindow || 'orario da confermare'}</div><div className="text-xs text-gray-600 mt-2 line-clamp-3">{contact.netFreeCandidateReason || contact.netFreeLeadProfile || 'Motivo candidatura da completare'}</div></button><div className="mt-3 flex flex-wrap gap-2"><select value={contact.netFreeStage || 'Non avviato'} onChange={(e) => updateNetFreeStage(contact.id, e.target.value as NetFreeStage)} className="text-xs rounded-xl border px-2 py-2 bg-white">{netFreeStages.map((s) => <option key={s}>{s}</option>)}</select><button onClick={() => copyNetFreeIntro(contact)} className="text-xs rounded-xl border px-2 py-2 hover:bg-white">Consenso</button><button onClick={() => markNetFreeStrategicReview(contact)} className="text-xs rounded-xl border px-2 py-2 text-green-700 hover:bg-green-50">Strategia</button><button onClick={() => copyNetFreeStrategySheet(contact)} className="text-xs rounded-xl border px-2 py-2 text-blue-700 hover:bg-blue-50">Scheda</button></div></div>)}{items.length === 0 && <p className="text-sm text-gray-400">Nessun contatto.</p>}</div></div>)}</div><div className="rounded-3xl bg-white border p-5 h-fit"><h3 className="font-bold">Brief selezionato</h3>{selectedContact ? <div className="mt-4 space-y-3 text-sm"><div><strong>{selectedContact.name}</strong><div className="text-gray-500">{selectedContact.netFreePreferredChannel || 'Canale da qualificare'} · {selectedContact.netFreePreferredPhone || selectedContact.phone || 'numero da verificare'}</div></div><div className="rounded-2xl bg-stone-50 border p-3"><strong>Profilo base</strong><br />{selectedContact.netFreeLeadProfile || selectedContact.researchSummary || 'Da completare'}</div><div className="rounded-2xl bg-stone-50 border p-3"><strong>Fascia e tono</strong><br />{selectedContact.netFreePreferredTimeWindow || 'Orario da confermare'}<br />{selectedContact.netFreeCallTone || 'Tono caldo e rispettoso'}</div><textarea readOnly value={buildNetFreeStrategySheet(selectedContact)} className="w-full min-h-72 rounded-2xl border p-3 text-xs bg-white" /><button onClick={() => navigator.clipboard.writeText(buildNetFreeStrategySheet(selectedContact))} className="w-full rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800">Copia scheda strategica</button></div> : <p className="text-gray-500 mt-3">Seleziona un contatto NetFree per vedere il scheda strategica.</p>}</div></div></div>}


  {section === 'lcr' && <div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"><div><h2 className="font-bold text-lg">LCR · selezione relazionale e matrice 6x6</h2><p className="text-gray-600 mt-1">Implementazione aggiornata del file 7: il CRM guida vocale, agenda, Zoom da 15 minuti, selezione valoriale e posizionamento nella matrice. Ogni invio resta manuale e presidiato: il sistema prepara script, task e stati, senza automatismi che possano intaccare la filosofia del progetto.</p></div><button onClick={() => selectedContact && setLcrOutcome(selectedContact, 'Da valutare')} disabled={!selectedContact} className="rounded-2xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-stone-50 disabled:opacity-40">Includi selezionato in LCR</button></div><div className="mt-4 grid md:grid-cols-4 gap-3"><div className="rounded-2xl bg-stone-50 border p-4"><div className="text-xs text-gray-500">In pipeline LCR</div><div className="text-2xl font-bold">{lcrContacts.length}</div></div><div className="rounded-2xl bg-green-50 border border-green-100 p-4"><div className="text-xs text-green-800">Approvati</div><div className="text-2xl font-bold">{lcrApprovedContacts.length}</div></div><div className="rounded-2xl bg-blue-50 border border-blue-100 p-4"><div className="text-xs text-blue-800">Matrice 6x6</div><div className="text-2xl font-bold">{lcrMatrixPreview.length}/6 diretti</div></div><div className="rounded-2xl bg-amber-50 border border-amber-100 p-4"><div className="text-xs text-amber-800">Task aperti</div><div className="text-2xl font-bold">{openTasks.filter((task) => task.title.toLowerCase().includes('lcr') || task.title.toLowerCase().includes('pef')).length}</div></div></div></div><div className="grid lg:grid-cols-[1fr_420px] gap-5"><div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold mb-3">Contatto e profilazione</h3><select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="w-full rounded-2xl border px-4 py-3 mb-4 bg-white"><option value="">Seleziona contatto</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{selectedContact ? <div className="grid md:grid-cols-2 gap-3 text-sm"><label className="space-y-1"><span className="text-xs font-semibold text-gray-500">Fascia disponibilità</span><select value={selectedContact.lcrAvailabilityWindow || 'Da definire'} onChange={(e) => updateLcrContact(selectedContact.id, { lcrAvailabilityWindow: e.target.value as LcrAvailabilityWindow })} className="w-full rounded-2xl border px-3 py-3 bg-white">{lcrAvailabilityWindows.map((item) => <option key={item}>{item}</option>)}</select></label><label className="space-y-1"><span className="text-xs font-semibold text-gray-500">Fascia personalizzata</span><input value={selectedContact.lcrCustomAvailability || ''} onChange={(e) => updateLcrContact(selectedContact.id, { lcrCustomAvailability: e.target.value })} className="w-full rounded-2xl border px-3 py-3" placeholder="es. lunedì 18:00-19:00" /></label><label className="space-y-1 md:col-span-2"><span className="text-xs font-semibold text-gray-500">Link agenda</span><input value={selectedContact.lcrAgendaLink || ''} onChange={(e) => updateLcrContact(selectedContact.id, { lcrAgendaLink: e.target.value })} className="w-full rounded-2xl border px-3 py-3" placeholder="Link agenda con massimo 3 appuntamenti/ora" /></label><label className="space-y-1 md:col-span-2"><span className="text-xs font-semibold text-gray-500">Link Zoom dinamico</span><input value={selectedContact.lcrZoomLink || ''} onChange={(e) => updateLcrContact(selectedContact.id, { lcrZoomLink: e.target.value })} className="w-full rounded-2xl border px-3 py-3" placeholder="Link Zoom dell'appuntamento, non PMI fisso" /></label></div> : <p className="text-gray-500">Seleziona un contatto per lavorare sulla scheda LCR.</p>}</div>{selectedContact && <div className="rounded-3xl bg-white border p-5"><h3 className="font-bold mb-3">Script manuali e passaggi</h3><div className="grid md:grid-cols-3 gap-2"><button onClick={() => copyLcrText(buildLcrVoiceScript(selectedContact), 'Vocale LCR copiato')} className="rounded-2xl border bg-white px-3 py-3 text-sm font-semibold hover:bg-stone-50">Copia vocale</button><button onClick={() => copyLcrText(buildLcrAgendaMessage(selectedContact), 'Messaggio agenda copiato')} className="rounded-2xl border bg-white px-3 py-3 text-sm font-semibold hover:bg-stone-50">Copia agenda</button><button onClick={() => copyLcrText(buildLcrZoomGuide(selectedContact), 'Guida Zoom copiata')} className="rounded-2xl border bg-white px-3 py-3 text-sm font-semibold hover:bg-stone-50">Copia guida Zoom</button><button onClick={() => markLcrManualStep(selectedContact, 'voice')} className="rounded-2xl bg-blue-700 text-white px-3 py-3 text-sm font-semibold hover:bg-blue-800">Vocale inviato manualmente</button><button onClick={() => markLcrManualStep(selectedContact, 'positive')} className="rounded-2xl bg-green-700 text-white px-3 py-3 text-sm font-semibold hover:bg-green-800">Risposta positiva</button><button onClick={() => markLcrManualStep(selectedContact, 'zoom')} className="rounded-2xl bg-gray-900 text-white px-3 py-3 text-sm font-semibold hover:bg-gray-800">Zoom completata</button></div><div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-950"><strong>Regola file 7:</strong> la Zoom dura 15 minuti, gli slot sono tassativi, il link Zoom deve essere dinamico per appuntamento e il passaggio PEF è un task interno da confermare manualmente.</div></div>}<div className="rounded-3xl bg-white border p-5"><h3 className="font-bold mb-3">Matrice forzata 6x6</h3><div className="overflow-auto"><table className="w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2">Pos.</th><th>Lead</th><th>Livello</th><th>Slot</th><th>Padre operativo</th></tr></thead><tbody>{lcrMatrixPreview.slice(0, 42).map(({ contact, position, placement, parent }) => <tr key={contact.id} className="border-t"><td className="py-2 font-semibold">{position}</td><td>{contact.name}</td><td>{placement.level}</td><td>{placement.slot}</td><td>{parent?.name || 'Radice progetto'}</td></tr>)}{lcrMatrixPreview.length === 0 && <tr><td colSpan={5} className="py-4 text-gray-500">Nessun approvato ancora posizionato.</td></tr>}</tbody></table></div><p className="text-xs text-gray-500 mt-3">La regola applicata è bilanciata e lineare: il 7° va sotto il 1°, l'8° sotto il 2°, fino al riempimento progressivo dei livelli successivi.</p></div></div><div className="rounded-3xl bg-white border p-5 h-fit"><h3 className="font-bold">Scheda selezione</h3>{selectedContact ? <div className="mt-4 space-y-3 text-sm"><div><strong>{selectedContact.name}</strong><div className="text-gray-500">{selectedContact.phone || selectedContact.email || 'canale da completare'}</div></div><div className="grid grid-cols-2 gap-2">{([['Vocale ascoltato','lcrPrequalVoiceListened'], ['Etica','lcrEthicsAligned'], ['Mentalità','lcrMindsetAligned'], ['NetFree','lcrNetFreeAligned'], ['Tokenizzazione','lcrTokenizationAligned']] as const).map(([label, key]) => <label key={key} className="space-y-1"><span className="text-xs font-semibold text-gray-500">{label}</span><select value={(selectedContact[key] as LcrAlignmentFlag) || 'Da valutare'} onChange={(e) => updateLcrContact(selectedContact.id, { [key]: e.target.value } as Partial<Contact>)} className="w-full rounded-xl border px-2 py-2 bg-white">{lcrAlignmentFlags.map((item) => <option key={item}>{item}</option>)}</select></label>)}</div><label className="space-y-1 block"><span className="text-xs font-semibold text-gray-500">Esito selezione</span><select value={selectedContact.lcrSelectionOutcome || 'Da valutare'} onChange={(e) => setLcrOutcome(selectedContact, e.target.value as LcrSelectionOutcome)} className="w-full rounded-2xl border px-3 py-3 bg-white">{lcrSelectionOutcomes.map((item) => <option key={item}>{item}</option>)}</select></label><label className="space-y-1 block"><span className="text-xs font-semibold text-gray-500">Stato task PEF</span><select value={selectedContact.lcrPefDelegationStatus || 'Non avviata'} onChange={(e) => updateLcrContact(selectedContact.id, { lcrPefDelegationStatus: e.target.value as LcrPefDelegationStatus })} className="w-full rounded-2xl border px-3 py-3 bg-white">{lcrPefDelegationStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><textarea value={selectedContact.lcrSelectionNotes || ''} onChange={(e) => updateLcrContact(selectedContact.id, { lcrSelectionNotes: e.target.value })} className="w-full min-h-28 rounded-2xl border p-3" placeholder="Note selezione, segnali di allineamento, dubbi o motivi di rinvio..." /><textarea value={selectedContact.lcrPefTechnicianNote || ''} onChange={(e) => updateLcrContact(selectedContact.id, { lcrPefTechnicianNote: e.target.value })} className="w-full min-h-24 rounded-2xl border p-3" placeholder="Nota interna per eventuale tecnico PEF, da usare solo dopo conferma manuale..." /><div className="rounded-2xl bg-stone-50 border p-3"><strong>Matrice:</strong><br />Posizione {selectedContact.lcrMatrixPosition || 0} · livello {selectedContact.lcrMatrixLevel || 0} · slot {selectedContact.lcrMatrixSlot || 0}</div><div className="grid grid-cols-3 gap-2"><button onClick={() => copyLcrText(buildLcrOutcomeMessage(selectedContact, 'Approvato'), 'Messaggio approvato copiato')} className="rounded-xl border px-2 py-2 text-xs hover:bg-stone-50">Copia OK</button><button onClick={() => copyLcrText(buildLcrOutcomeMessage(selectedContact, 'Bocciato'), 'Messaggio bocciato copiato')} className="rounded-xl border px-2 py-2 text-xs hover:bg-stone-50">Copia no</button><button onClick={() => copyLcrText(buildLcrOutcomeMessage(selectedContact, 'Da valutare'), 'Messaggio attesa copiato')} className="rounded-xl border px-2 py-2 text-xs hover:bg-stone-50">Copia attesa</button></div></div> : <p className="text-gray-500 mt-3">Seleziona un contatto per compilare la selezione LCR.</p>}</div></div></div>}

  {section === 'conversations' && <div className="space-y-6"><div className="grid lg:grid-cols-2 gap-6"><div className="rounded-3xl bg-white border p-5"><h2 className="font-bold text-lg mb-4">Registra comunicazione</h2><select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="w-full rounded-2xl border px-4 py-3 mb-4 bg-white"><option value="">Seleziona contatto</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><div className="grid grid-cols-2 gap-3 mb-4"><select value={communicationChannel} onChange={(e) => setCommunicationChannel(e.target.value as Channel)} className="rounded-2xl border px-4 py-3 bg-white">{channels.map((c) => <option key={c}>{c}</option>)}</select><select value={communicationStage} onChange={(e) => setCommunicationStage(e.target.value as OutreachStage)} className="rounded-2xl border px-4 py-3 bg-white">{outreachStages.map((s) => <option key={s}>{s}</option>)}</select></div>{selectedContact && <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900 mb-4"><strong>Gancio:</strong> {selectedContact.personalizationHook || 'gancio non compilato'}<br /><strong>Angolo:</strong> {selectedContact.messageAngle || 'angolo messaggio non compilato'}</div>}<textarea value={conversation} onChange={(e) => setConversation(e.target.value)} className="w-full min-h-52 rounded-2xl border p-4" placeholder="Incolla email inviata, nota telefonata, risposta ricevuta, script video o appunto operativo..." /><button onClick={runAnalysis} disabled={!selectedContact || !conversation.trim()} className="mt-4 w-full rounded-2xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800 disabled:opacity-40"><Upload className="w-4 h-4 inline mr-2" />Salva, aggiorna stadio e genera follow-up</button></div><div className="rounded-3xl bg-white border p-5"><div className="flex items-center justify-between gap-3 mb-4"><h2 className="font-bold text-lg">Comunicazioni assistite</h2>{assistedFeedback && <span className="text-xs rounded-full bg-green-50 text-green-700 px-3 py-1 border border-green-100">{assistedFeedback}</span>}</div><select value={selectedContact?.id || ''} onChange={(e) => setSelectedContactId(e.target.value)} className="w-full rounded-2xl border px-4 py-3 mb-3 bg-white"><option value="">Seleziona contatto</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={assistedTemplate} onChange={(e) => setAssistedTemplate(e.target.value as CommunicationTemplate)} className="w-full rounded-2xl border px-4 py-3 mb-4 bg-white"><option value="opener">Apertura delicata</option><option value="diagnose">Domande strategiche</option><option value="qualify">Qualificazione bisogno</option><option value="tailored">Studio su misura</option><option value="position">Soluzione soft</option><option value="close">Call o demo</option></select>{selectedContact ? <div className="space-y-4"><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950"><div className="font-semibold mb-1">{selectedContact.name}</div><div>{selectedContact.category || selectedContact.role || 'Categoria non indicata'}{selectedContact.city ? ` · ${selectedContact.city}` : ''}</div><div className="mt-2"><strong>Gancio:</strong> {selectedContact.personalizationHook || 'da completare'}</div><div><strong>Angolo:</strong> {selectedContact.messageAngle || 'da completare'}</div><div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-white/70 border border-blue-100 px-3 py-2">{emailStatus(selectedContact)}</div><div className="rounded-xl bg-white/70 border border-blue-100 px-3 py-2">{whatsappStatus(selectedContact)}</div></div></div><div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-950"><div className="font-semibold mb-2">Obiettivo closer: {closerStepLabel(assistedTemplate)}</div><p>{conversationObjective(assistedTemplate)}</p>{assistedTemplate === 'tailored' && <button onClick={() => setSection('study')} className="mt-3 rounded-xl bg-teal-700 text-white px-3 py-2 text-xs font-semibold hover:bg-teal-800"><Calculator className="w-3 h-3 inline mr-1" />Apri studio su misura</button>}<div className="mt-3 font-semibold">Domande guida</div><ul className="list-disc pl-5 mt-1 space-y-1">{strategicQuestions(selectedContact).slice(0, 3).map((question) => <li key={question}>{question}</li>)}</ul></div><div className="rounded-2xl bg-stone-50 border p-4"><div className="text-xs font-semibold text-gray-500 mb-1">Oggetto email</div><div className="font-medium">{buildEmailTemplate(selectedContact).subject}</div><div className="text-xs font-semibold text-gray-500 mt-4 mb-1">Anteprima messaggio</div><pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 max-h-52 overflow-auto">{assistedTemplate === 'opener' ? buildEmailTemplate(selectedContact).body : `${conversationObjective(assistedTemplate)}\n\n${buildEmailTemplate(selectedContact).body}`}</pre>{assistedTemplate === 'opener' && <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">{(() => { const vd = buildVoiceDeskEmailTemplate(selectedContact); return <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="text-xs font-semibold text-blue-700 uppercase">Primo contatto VoiceDesk</div><div className="font-bold text-blue-950">{isVoiceDeskHotelContact(selectedContact) ? vd.profile.label : `${vd.profile.label} · ${vd.profile.displayPhone}`}</div></div><span className="rounded-full bg-white px-3 py-1 text-xs text-blue-700 border border-blue-100">Oggetto: {vd.subject}</span></div><div className="grid sm:grid-cols-2 gap-2">{isVoiceDeskHotelContact(selectedContact) ? <a href={voiceDeskHotelVideoUrl} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-sky-700 text-white px-4 py-3 text-center font-semibold hover:bg-sky-800 sm:col-span-2">Apri video esempio</a> : <><button onClick={() => openVoiceDeskDemo(selectedContact)} className="rounded-2xl bg-white border border-blue-100 px-4 py-3 font-semibold text-blue-800 hover:bg-blue-100">Apri demo VoiceDesk</button><button onClick={() => openVoiceDeskCall(selectedContact)} className="rounded-2xl bg-gray-900 text-white px-4 py-3 font-semibold hover:bg-gray-800"><Phone className="w-4 h-4 inline mr-2" />Prova chiamata demo</button></>}<button onClick={() => copyVoiceDeskHtml(selectedContact)} className="rounded-2xl bg-white border border-blue-100 px-4 py-3 font-semibold text-blue-800 hover:bg-blue-100 sm:col-span-2"><Copy className="w-4 h-4 inline mr-2" />Copia HTML email</button></div><div className="grid grid-cols-4 gap-2 text-center text-xs"><div className="rounded-xl bg-white p-2"><div className="font-bold text-lg">{selectedContact.voiceDeskEmailSentCount || 0}</div><div className="text-gray-500">email</div></div><div className="rounded-xl bg-white p-2"><div className="font-bold text-lg">{selectedContact.voiceDeskEmailOpenCount || 0}</div><div className="text-gray-500">viste</div></div><div className="rounded-xl bg-white p-2"><div className="font-bold text-lg">{selectedContact.voiceDeskDemoClickCount || 0}</div><div className="text-gray-500">demo</div></div><div className="rounded-xl bg-white p-2"><div className="font-bold text-lg">{selectedContact.voiceDeskCallClickCount || 0}</div><div className="text-gray-500">call</div></div></div><div className="text-xs text-blue-900">Ultima azione: {selectedContact.voiceDeskLastAction || 'nessuna'} {selectedContact.voiceDeskLastActionAt ? `· ${fmtDate(selectedContact.voiceDeskLastActionAt)}` : ''}</div></div> })()}</div>}</div><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">{!isVoiceDeskHotelContact(selectedContact) && <button onClick={() => openVoiceDeskCall(selectedContact)} className="rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800"><Phone className="w-4 h-4 inline mr-2" />Chiama demo {voiceDeskProfile(selectedContact).displayPhone}</button>}<button onClick={() => openMailto(selectedContact)} className="rounded-2xl bg-gray-900 text-white px-4 py-3 font-semibold hover:bg-gray-800"><Mail className="w-4 h-4 inline mr-2" />Apri email</button><button onClick={() => openWhatsApp(selectedContact)} className="rounded-2xl bg-green-700 text-white px-4 py-3 font-semibold hover:bg-green-800"><Phone className="w-4 h-4 inline mr-2" />Apri WhatsApp</button><button onClick={() => copyAssistedMessage('email')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-2" />Copia email</button><button onClick={() => copyAssistedMessage('whatsapp')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-2" />Copia WhatsApp</button><button onClick={() => copyAssistedMessage('social', 'Instagram')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-2" />Copia Instagram</button><button onClick={() => copyAssistedMessage('social', 'Facebook')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-2" />Copia Facebook</button><button onClick={() => copyAssistedMessage('social', 'Telegram')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-2" />Copia Telegram</button><button onClick={() => copyAssistedMessage('social', 'TikTok')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-2" />Copia TikTok</button><button onClick={() => markContacted(selectedContact.id, 'Email')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><CheckSquare className="w-4 h-4 inline mr-2" />Segna email</button><button onClick={() => markContacted(selectedContact.id, 'WhatsApp')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><CheckSquare className="w-4 h-4 inline mr-2" />Segna WhatsApp</button><button onClick={() => markContacted(selectedContact.id, 'Instagram')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><CheckSquare className="w-4 h-4 inline mr-2" />Segna social</button></div>{isVoiceDeskHotelContact(selectedContact) && <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"><strong className="block mb-2">Video esempio per strutture ricettive</strong><video controls className="w-full rounded-2xl border bg-black" src={voiceDeskHotelVideoUrl} /><div className="mt-3 grid sm:grid-cols-2 gap-2"><a href={voiceDeskHotelVideoUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-sky-700 text-white px-3 py-2 text-center font-semibold hover:bg-sky-800">Apri video</a><button onClick={() => navigator.clipboard.writeText(buildWhatsAppTemplate(selectedContact)).then(() => setTemporaryAssistedFeedback('Messaggio struttura ricettiva copiato: allega il video demo')).catch(() => window.alert('Non sono riuscito a copiare automaticamente.'))} className="rounded-xl border bg-white px-3 py-2 font-semibold hover:bg-sky-100">Copia messaggio breve</button></div><p className="mt-2 text-xs text-sky-800">Per WhatsApp, email e social: copia il messaggio breve e allega questo video. Nessuna chiamata demo nel primo invio: il video deve chiarire subito l’interesse reale della struttura.</p></div>}<div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950"><strong className="block mb-1">Messaggio social pulito</strong><pre className="whitespace-pre-wrap font-sans">{buildVoiceDeskSocialTemplate(selectedContact, 'Instagram')}</pre><p className="mt-2 text-xs text-blue-800">{isVoiceDeskHotelContact(selectedContact) ? 'Per le strutture ricettive il primo invio resta volutamente semplice: messaggio breve più video allegato, senza chiamata demo.' : 'Il numero viene mostrato come telefono leggibile: sui dispositivi mobili è cliccabile direttamente, senza link tecnici.'}</p></div><button onClick={() => scheduleFollowUp(selectedContact.id, 3)} className="w-full rounded-2xl bg-blue-700 text-white px-4 py-3 font-semibold hover:bg-blue-800"><Plus className="w-4 h-4 inline mr-2" />Programma follow-up tra 3 giorni</button><p className="text-xs text-gray-500">{isVoiceDeskHotelContact(selectedContact) ? 'Per le strutture ricettive il CRM prepara email, WhatsApp e messaggi social con gancio diretto e video da allegare. Il primo contatto serve a scremare chi non è interessato, senza spingere subito la chiamata.' : 'Il CRM prepara email, WhatsApp e messaggi social con numero demo VoiceDesk pulito e diretto. Il pulsante “Chiama demo” usa un collegamento telefonico immediato come landing page; nei testi copiati appare solo il numero, così resta comprensibile su Instagram, Facebook, Telegram, TikTok e altri canali.'}</p></div> : <p className="text-gray-500">Seleziona un lead per generare email, WhatsApp, social e prossimi passi assistiti.</p>}</div><div className="rounded-3xl bg-white border p-5 lg:col-span-2"><h2 className="font-bold text-lg mb-4">Ultima analisi</h2>{analysis ? <div className="space-y-4"><div className="rounded-2xl bg-blue-50 p-4"><div className="text-sm text-blue-700">Score opportunità</div><div className="text-3xl font-bold text-blue-900">{analysis.score}/100</div></div><div><div className="text-sm text-gray-500">Sintesi</div><p className="font-medium">{analysis.summary}</p></div><div><div className="text-sm text-gray-500 mb-2">Bisogni / attenzioni</div>{analysis.needs.map((n) => <div key={n} className="rounded-xl border px-3 py-2 mb-2">{n}</div>)}</div><div className="rounded-2xl bg-green-50 p-4 text-green-800"><strong>Prossima azione:</strong> {analysis.action}</div></div> : <p className="text-gray-500">Registra una comunicazione reale oppure usa il modulo assistito per creare storico, task e prossimo passo.</p>}</div><div className="rounded-3xl bg-white border p-5 lg:col-span-2"><h2 className="font-bold text-lg mb-4">Storico comunicazioni</h2><div className="grid md:grid-cols-2 gap-3">{conversations.map((item) => { const c = contacts.find((x) => x.id === item.contactId); return <div key={item.id} className="rounded-2xl border p-4"><div className="flex justify-between gap-3"><div className="font-semibold">{c?.name || 'Contatto eliminato'}</div><div className="text-xs text-gray-500">{fmtDate(item.createdAt)}</div></div><div className="text-xs text-gray-500 mt-1">{item.channel || 'Nota'} · {item.stage || 'Stadio non indicato'}</div><div className="mt-2 text-sm text-gray-600 max-h-24 overflow-hidden">{item.text}</div><div className="mt-3 rounded-xl bg-stone-50 p-3 text-sm"><strong>{item.analysis.score}/100 · {item.analysis.topic}</strong><br />{item.analysis.summary}</div></div> })}</div>{conversations.length === 0 && <p className="text-gray-500">Ancora nessuna comunicazione salvata.</p>}</div></div></div>}



  {section === 'research' && <div className="space-y-6"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><div><div className="flex items-center gap-3"><Search className="w-6 h-6 text-cyan-700" /><h2 className="font-bold text-xl">Ricerca intelligente lead · percorso guidato</h2></div><p className="text-gray-600 mt-2">Parti da azienda o persona fisica, raccogli solo dati pubblici pertinenti, gestisci differenza tra ragione sociale e nome commerciale, poi genera diagnosi, domande e messaggi closer coerenti.</p></div>{researchSavedFeedback && <span className="text-xs rounded-full bg-green-50 text-green-700 px-3 py-1 border border-green-100">{researchSavedFeedback}</span>}</div></div><div className="grid lg:grid-cols-[1fr_420px] gap-6"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-4">1. Seleziona lead e punto di partenza</h3><select value={selectedContact?.id || ''} onChange={(e) => { const c = contacts.find((item) => item.id === e.target.value); setSelectedContactId(e.target.value); if (c) setDraft(draftFromContact(c)) }} className="w-full rounded-2xl border px-4 py-3 mb-4 bg-white"><option value="">Seleziona lead</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{selectedContact ? <div className="space-y-5"><div className="grid md:grid-cols-2 gap-3"><button onClick={() => setDraft({ ...draft, researchEntryMode: 'Azienda' })} className={`rounded-2xl border px-4 py-4 text-left ${draft.researchEntryMode === 'Azienda' ? 'bg-cyan-50 border-cyan-200 text-cyan-900' : 'bg-white hover:bg-stone-50'}`}><Building2 className="w-5 h-5 mb-2" /><strong>Parto da azienda/attività</strong><p className="text-sm mt-1">Uso nome commerciale, ragione sociale, sito, telefono, città e pagine pubbliche.</p></button><button onClick={() => setDraft({ ...draft, researchEntryMode: 'Persona fisica' })} className={`rounded-2xl border px-4 py-4 text-left ${draft.researchEntryMode === 'Persona fisica' ? 'bg-cyan-50 border-cyan-200 text-cyan-900' : 'bg-white hover:bg-stone-50'}`}><Users className="w-5 h-5 mb-2" /><strong>Parto da persona fisica</strong><p className="text-sm mt-1">Uso nome, cognome, email, telefono e collego aziende solo con segnali forti.</p></button></div><div><h4 className="font-semibold mb-3">Identità e disambiguazione</h4><div className="grid md:grid-cols-2 gap-3"><input value={draft.commercialName || ''} onChange={(e) => setDraft({ ...draft, commercialName: e.target.value, company: e.target.value || draft.company })} className="rounded-2xl border px-4 py-3" placeholder="Nome commerciale / insegna" /><input value={draft.companyLegalName || ''} onChange={(e) => setDraft({ ...draft, companyLegalName: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Ragione sociale, se diversa" /><input value={draft.personFirstName || ''} onChange={(e) => setDraft({ ...draft, personFirstName: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Nome persona" /><input value={draft.personLastName || ''} onChange={(e) => setDraft({ ...draft, personLastName: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Cognome persona" /><input value={draft.city || ''} onChange={(e) => setDraft({ ...draft, city: e.target.value, personCity: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Città / sede" /><input value={draft.website || ''} onChange={(e) => setDraft({ ...draft, website: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Sito / dominio" /></div><textarea value={draft.commercialAliases || ''} onChange={(e) => setDraft({ ...draft, commercialAliases: e.target.value })} className="w-full min-h-20 rounded-2xl border p-4 mt-3" placeholder="Alias, brand, insegne, pagine note: uno per riga o separati da ;" /></div><div><h4 className="font-semibold mb-3">2. Fonti pubbliche e social candidate</h4><div className="grid md:grid-cols-2 gap-3"><textarea value={draft.publicSources || ''} onChange={(e) => setDraft({ ...draft, publicSources: e.target.value })} className="min-h-32 rounded-2xl border p-4" placeholder="Fonti pubbliche verificate: sito, Google Business, LinkedIn, recensioni, directory, comunicati..." /><textarea value={draft.facebookPageCandidates || ''} onChange={(e) => setDraft({ ...draft, facebookPageCandidates: e.target.value })} className="min-h-32 rounded-2xl border p-4" placeholder="Pagine Facebook/social candidate con motivo: telefono uguale, dominio, città, categoria, descrizione coerente..." /></div><input value={draft.confirmedFacebookPage || ''} onChange={(e) => setDraft({ ...draft, confirmedFacebookPage: e.target.value })} className="w-full rounded-2xl border px-4 py-3 mt-3" placeholder="Pagina social confermata o 'da verificare'" /><textarea value={draft.personCompanyLinks || ''} onChange={(e) => setDraft({ ...draft, personCompanyLinks: e.target.value })} className="w-full min-h-20 rounded-2xl border p-4 mt-3" placeholder="Collegamenti persona-azienda: ruolo dichiarato, dominio email, telefono pubblico, sito, città coerente..." /><textarea value={draft.publicComplaints || ''} onChange={(e) => setDraft({ ...draft, publicComplaints: e.target.value })} className="w-full min-h-24 rounded-2xl border p-4 mt-3" placeholder="Lamentele o segnali pubblici ricorrenti, formulati come ipotesi da verificare e mai come accusa." /></div><div><h4 className="font-semibold mb-3">3. Diagnosi consulenziale per il closer</h4><textarea value={draft.researchSummary || ''} onChange={(e) => setDraft({ ...draft, researchSummary: e.target.value })} className="w-full min-h-28 rounded-2xl border p-4" placeholder="Sintesi: che attività fa, per chi lavora, cosa sembra importante, cosa va verificato." /><textarea value={draft.probableNeeds || ''} onChange={(e) => setDraft({ ...draft, probableNeeds: e.target.value })} className="w-full min-h-24 rounded-2xl border p-4 mt-3" placeholder="Bisogni probabili: richieste ripetitive, personale sotto pressione, prenotazioni, CRM, energia, tokenizzazione, marketing..." /><textarea value={draft.recommendedQuestions || ''} onChange={(e) => setDraft({ ...draft, recommendedQuestions: e.target.value })} className="w-full min-h-24 rounded-2xl border p-4 mt-3" placeholder="Domande consigliate da fare al primo contatto, in italiano corretto e non commerciale." /><textarea value={draft.recommendedPath || ''} onChange={(e) => setDraft({ ...draft, recommendedPath: e.target.value })} className="w-full min-h-20 rounded-2xl border p-4 mt-3" placeholder="Percorso consigliato: Voice Desk, CRM, Studio su misura, energia, tokenizzazione/plafond o combinazione." /><div className="grid md:grid-cols-[1fr_160px] gap-3 mt-3"><input value={draft.notes || ''} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Note interne" /><input type="number" min="0" max="100" value={draft.confidenceScore || 0} onChange={(e) => setDraft({ ...draft, confidenceScore: num(e.target.value) })} className="rounded-2xl border px-4 py-3" placeholder="Confidenza 0-100" /></div></div><button onClick={saveGuidedResearchFromDraft} className="w-full rounded-2xl bg-cyan-700 text-white px-4 py-3 font-semibold hover:bg-cyan-800"><Save className="w-4 h-4 inline mr-2" />Salva ricerca, aggiorna lead e crea prossimo passo</button></div> : <p className="text-gray-500">Seleziona un lead o creane uno dal Database prima di avviare la ricerca guidata.</p>}</div><div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-4">Anteprima automatica</h3>{selectedContact ? <div className="space-y-4"><div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-4"><div className="text-sm text-cyan-700">Confidenza ricerca</div><div className="text-3xl font-bold text-cyan-950">{leadResearchSnapshot({ ...selectedContact, ...draft }).score}/100</div><div className="text-sm text-cyan-800">{leadResearchSnapshot({ ...selectedContact, ...draft }).label}</div></div><div><div className="text-sm font-semibold text-gray-500 mb-2">Query suggerite</div><div className="space-y-2">{leadResearchSnapshot({ ...selectedContact, ...draft }).queries.slice(0, 7).map((query) => <div key={query} className="rounded-xl border px-3 py-2 text-sm bg-white">{query}</div>)}</div></div><div><div className="text-sm font-semibold text-gray-500 mb-2">Dati mancanti</div>{leadResearchSnapshot({ ...selectedContact, ...draft }).missing.map((item) => <div key={item} className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-sm text-amber-900 mb-2">{item}</div>)}</div><div className="rounded-2xl bg-stone-50 border p-4 text-sm"><strong>Contesto closer</strong><p className="mt-2">{buildGuidedCloserContext({ ...selectedContact, ...draft })}</p></div><div className="grid gap-3"><button onClick={() => setSection('conversations')} className="rounded-2xl bg-gray-900 text-white px-4 py-3 font-semibold hover:bg-gray-800"><MessageSquareText className="w-4 h-4 inline mr-2" />Vai ai messaggi closer</button><button onClick={() => setSection('study')} className="rounded-2xl border bg-white px-4 py-3 font-semibold hover:bg-stone-50"><Calculator className="w-4 h-4 inline mr-2" />Apri studio economico</button></div></div> : <p className="text-gray-500">L’anteprima compare dopo aver selezionato un lead.</p>}</div><div className="rounded-3xl bg-white border p-5 text-sm text-gray-700"><h3 className="font-bold text-lg text-gray-900 mb-2">Regole ecologiche</h3><p>Usa solo fonti pubbliche pertinenti. Le pagine Facebook vanno proposte come candidate quando coincidono più segnali: telefono, sito, città, categoria, descrizione e contenuti. Le lamentele pubbliche vanno trasformate in domande eleganti, mai in accuse. Il preventivo arriva solo dopo diagnosi e conteggi personalizzati.</p></div></div></div></div>}

  {section === 'study' && <div className="space-y-6"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><div><div className="flex items-center gap-3"><Calculator className="w-6 h-6 text-teal-700" /><h2 className="font-bold text-xl">Studio su misura · Tokenizzazione, plafond servizi ed energia</h2></div><p className="text-gray-600 mt-2">Questa sezione non vende un prodotto standard: raccoglie dati patrimoniali, economici e operativi per costruire un preventivo unico, sostenibile e coerente con la situazione reale della persona o dell’azienda.</p></div>{studySavedFeedback && <span className="text-xs rounded-full bg-green-50 text-green-700 px-3 py-1 border border-green-100">{studySavedFeedback}</span>}</div></div><div className="grid lg:grid-cols-[1fr_420px] gap-6"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-4">Dati per stima valore e plafond</h3><select value={selectedContact?.id || ''} onChange={(e) => { const c = contacts.find((item) => item.id === e.target.value); setSelectedContactId(e.target.value); if (c) setDraft(draftFromContact(c)) }} className="w-full rounded-2xl border px-4 py-3 mb-4 bg-white"><option value="">Seleziona lead/azienda</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{selectedContact ? <div className="space-y-5"><div className="rounded-2xl bg-teal-50 border border-teal-100 p-4 text-sm text-teal-950"><strong>{selectedContact.name}</strong><br />{selectedContact.category || selectedContact.role || 'Categoria non indicata'}{selectedContact.city ? ` · ${selectedContact.city}` : ''}<br /><span className="text-teal-800">Completezza dati studio: {valuationReadiness(selectedContact)}%</span></div>{valuationFieldGroups.map((group) => <div key={group.title} className="rounded-2xl border bg-stone-50 p-4"><h4 className="font-semibold">{group.title}</h4><p className="text-sm text-gray-600 mt-1 mb-4">{group.description}</p><div className="grid md:grid-cols-2 gap-3">{group.fields.map((field) => <label key={String(field.key)} className={`rounded-2xl border bg-white p-4 ${field.span || ''}`}><div className="flex items-start justify-between gap-3"><div><span className="block text-sm font-semibold text-gray-900">{field.label}</span><span className="block text-xs text-gray-500 mt-0.5">{field.unit}</span></div><span className="text-[10px] rounded-full bg-stone-100 px-2 py-1 text-gray-600">dato studio</span></div><input type="number" value={Number(draft[field.key] || 0)} onChange={(e) => setDraft({ ...draft, [field.key]: num(e.target.value) })} className="mt-3 w-full rounded-xl border px-3 py-2" placeholder={`Inserisci ${field.label.toLowerCase()}`} /><p className="text-xs text-gray-600 mt-2 leading-relaxed">{field.help}</p></label>)}<label className="rounded-2xl border bg-white p-4"><span className="block text-sm font-semibold text-gray-900">Percorso energia preferito</span><span className="block text-xs text-gray-500 mt-0.5">Scelta consulenziale</span><select value={draft.preferredEnergyPath || 'Da valutare'} onChange={(e) => setDraft({ ...draft, preferredEnergyPath: e.target.value as Contact['preferredEnergyPath'] })} className="mt-3 w-full rounded-xl border px-3 py-2 bg-white"><option>Da valutare</option><option>uBroker</option><option>PEF Power</option><option>Altro</option></select><p className="text-xs text-gray-600 mt-2">Indica se il tema energia va solo verificato o se esiste già un percorso commerciale preferito.</p></label></div></div>)}<textarea value={draft.studyNotes || ''} onChange={(e) => setDraft({ ...draft, studyNotes: e.target.value })} className="w-full min-h-28 rounded-2xl border p-4" placeholder="Problemi attuali, priorità personali, obiezioni, desideri: es. bollette alte, reception sovraccarica, crescita, liquidità, ristrutturazione, personale, passaggio generazionale..." /><textarea value={draft.servicePlafondNotes || ''} onChange={(e) => setDraft({ ...draft, servicePlafondNotes: e.target.value })} className="w-full min-h-24 rounded-2xl border p-4" placeholder="Plafond servizi da includere: Voice Desk, CRM, automazioni, consulenza, marketing, energia, formazione, partnership..." /><button onClick={saveStudyFromDraft} className="w-full rounded-2xl bg-teal-700 text-white px-4 py-3 font-semibold hover:bg-teal-800"><Save className="w-4 h-4 inline mr-2" />Salva studio nel lead e crea follow-up</button></div> : <p className="text-gray-500">Seleziona un lead per iniziare lo studio personalizzato.</p>}</div><div className="space-y-4">{selectedContact && (() => { const previewContact = { ...selectedContact, ...draft } as Contact; const snap = valuationSnapshot(previewContact); return <><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-4">Risultato economico indicativo</h3><div className="space-y-3"><div className="rounded-2xl bg-stone-50 p-4"><div className="text-sm text-gray-500">Valore aziendale indicativo</div><div className="text-3xl font-bold">{euro(snap.estimatedCompanyValue)}</div><div className="text-xs text-gray-500 mt-1">Base patrimoniale {euro(snap.assetBase)} + componente redditività {euro(snap.ebitdaComponent)}</div></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-blue-50 p-4"><div className="text-xs text-blue-700">2,5% annuo potenziale</div><div className="text-xl font-bold text-blue-950">{euro(snap.annualTokenYield)}</div></div><div className="rounded-2xl bg-green-50 p-4"><div className="text-xs text-green-700">Risparmio energia stimato</div><div className="text-xl font-bold text-green-950">{euro(snap.expectedEnergySaving)}</div></div></div><div className={`rounded-2xl p-4 ${snap.surplusOrGap >= 0 ? 'bg-green-50 text-green-900' : 'bg-amber-50 text-amber-900'}`}><div className="text-sm font-semibold">Copertura rispetto ai servizi</div><div className="text-2xl font-bold">{euro(snap.totalCoverage)} / {euro(snap.annualServiceCost)}</div><div className="text-sm mt-1">{snap.surplusOrGap >= 0 ? `Margine positivo indicativo: ${euro(snap.surplusOrGap)}` : `Gap da coprire o rimodulare: ${euro(Math.abs(snap.surplusOrGap))}`}</div></div></div></div><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-3">Percorso consulenziale consigliato</h3><p className="text-sm text-gray-700">{tailoredStudyPrompt(previewContact)}</p><div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Nota operativa:</strong> questa è una simulazione commerciale preliminare, non una perizia, non una consulenza finanziaria regolamentata e non una promessa di rendimento. Serve a costruire un preventivo unico e un percorso coerente con bisogni reali, documenti e verifiche successive.</div></div><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg mb-3">Domande da fare prima di proporre</h3><div className="space-y-2 text-sm"><div className="rounded-xl border p-3">Quali costi oggi pesano di più: personale, energia, tecnologia, marketing o dispersione richieste?</div><div className="rounded-xl border p-3">Quali beni o valori aziendali sono documentabili: capitale versato, immobili, magazzino, attrezzature, crediti, avviamento?</div><div className="rounded-xl border p-3">Il cliente cerca più liquidità, riduzione costi, crescita commerciale o protezione operativa?</div><div className="rounded-xl border p-3">Sull’energia ha più senso verificare azzeramento bollette, efficientamento, rinegoziazione o percorso uBroker/PEF Power?</div></div></div></> })()}</div></div></div>}

  {section === 'mailing' && <div className="space-y-5"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5"><div><div className="flex items-center gap-3"><Mail className="w-6 h-6" /><h2 className="font-bold text-xl">Mailing list per CCN/BCC</h2></div><p className="text-sm text-gray-500 mt-2">Genera un elenco email pronto da copiare nel campo <strong>CCN</strong>. Il CRM non invia email: l’invio resta manuale e sotto il tuo controllo.</p></div><button onClick={copyMailingList} disabled={mailingEmails.length === 0} className="rounded-2xl bg-gray-900 text-white px-5 py-3 font-semibold disabled:opacity-40"><Copy className="w-4 h-4 inline mr-2" />{mailingCopied ? 'Copiato' : 'Copia elenco CCN'}</button></div><div className="grid md:grid-cols-4 gap-3 mb-5"><div className="md:col-span-4 grid sm:grid-cols-4 gap-3"><div className="rounded-2xl bg-blue-50 p-4"><div className="text-xs text-blue-700">Email VoiceDesk</div><div className="text-2xl font-bold text-blue-900">{voiceDeskStats.sent}</div></div><div className="rounded-2xl bg-emerald-50 p-4"><div className="text-xs text-emerald-700">Aperture tracciate</div><div className="text-2xl font-bold text-emerald-900">{voiceDeskStats.open}</div></div><div className="rounded-2xl bg-violet-50 p-4"><div className="text-xs text-violet-700">Click demo</div><div className="text-2xl font-bold text-violet-900">{voiceDeskStats.demo}</div></div><div className="rounded-2xl bg-amber-50 p-4"><div className="text-xs text-amber-700">Chiamate avviate</div><div className="text-2xl font-bold text-amber-900">{voiceDeskStats.call}</div></div></div><div><label className="text-xs font-semibold text-gray-500">Priorità</label><select value={mailingPriority} onChange={(e) => setMailingPriority(e.target.value as MailingPriorityFilter)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"><option value="Tutte">Tutte</option>{priorityLevels.map((p) => <option key={p} value={p}>Priorità {p}</option>)}</select></div><div><label className="text-xs font-semibold text-gray-500">Stadio comunicazione</label><select value={mailingStage} onChange={(e) => setMailingStage(e.target.value as MailingStageFilter)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"><option value="Tutti">Tutti</option>{outreachStages.map((s) => <option key={s} value={s}>{s}</option>)}</select></div><div><label className="text-xs font-semibold text-gray-500">Separatore</label><select value={mailingSeparator} onChange={(e) => setMailingSeparator(e.target.value as MailingSeparator)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"><option value="punto e virgola">Punto e virgola</option><option value="virgola">Virgola</option></select></div><div className="rounded-2xl bg-stone-50 p-4"><div className="text-xs text-gray-500">Email selezionate</div><div className="text-2xl font-bold">{mailingEmails.length}</div><div className="text-xs text-gray-500">Escluse senza email valida: {excludedEmailCount}</div></div></div><textarea readOnly value={mailingText || 'Nessuna email valida con i filtri attuali.'} className="w-full min-h-36 rounded-2xl border p-4 bg-stone-50 text-sm" /><div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Uso consigliato:</strong> incolla questo elenco nel campo CCN/BCC, non nel campo A. Per ridurre spam e blocchi, invia piccoli gruppi, personalizza il testo e registra poi la comunicazione nella sezione Comunicazioni.</div></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{mailingContacts.map((contact) => <div key={contact.id} className="rounded-2xl bg-white border p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{contact.name}</div><div className="text-sm text-gray-500">{contact.category || contact.role || 'Categoria non indicata'} · Priorità {contact.priorityLevel || 'B'}</div></div><span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-1">{contact.outreachStage || 'Da qualificare'}</span></div><div className="mt-3 text-sm font-medium text-gray-800 break-all">{contactEmail(contact)}</div><div className="mt-2 text-xs text-gray-500">{contact.personalizationHook || contact.messageAngle || 'Completa gancio e angolo prima dell’invio se vuoi una mail più efficace.'}</div></div>)}</div>{mailingContacts.length === 0 && <div className="rounded-3xl bg-white border p-6 text-gray-500">Nessun contatto con email valida nei filtri selezionati. Completa i campi email nel Database 100 oppure allarga i filtri.</div>}</div>}



  {section === 'team' && <div className="space-y-6"><div className="rounded-3xl bg-white border p-5"><div className="flex items-center gap-3"><UserPlus className="w-6 h-6 text-blue-700" /><h2 className="font-bold text-xl">Soci e collaboratori · pipeline separata dai clienti</h2></div><p className="text-gray-600 mt-2">Usa questa vista per seguire candidati, collaboratori attivi, soci e partner senza confonderli con i lead cliente. Il filtro operativo dipende dal ruolo selezionato: l’amministratore vede tutto, soci e collaboratori vedono solo ciò che è assegnato o sponsorizzato dal profilo attivo.</p></div><div className="grid lg:grid-cols-[1fr_360px] gap-6"><div className="space-y-3">{collaboratorContacts.map((contact) => <div key={contact.id} className="rounded-3xl bg-white border p-5"><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3"><div><div className="text-xs uppercase font-bold text-blue-700">{contact.relationshipType || 'Collaboratore'} · {contact.collaboratorStage || 'Candidato'}</div><h3 className="font-bold text-lg mt-1">{contact.name}</h3><p className="text-sm text-gray-600 mt-1">Owner: <strong>{contact.ownerName || 'non assegnato'}</strong> · Sponsor: <strong>{contact.sponsorName || 'non indicato'}</strong></p><p className="text-sm text-gray-600 mt-1">Ruolo previsto: {contact.collaboratorRole || contact.role || 'da definire'}</p></div><span className={`text-xs rounded-full border px-2 py-1 ${priorityLevelClass(contact.priorityLevel)}`}>Priorità {contact.priorityLevel || 'B'}</span></div><div className="mt-4 grid md:grid-cols-3 gap-3"><select value={contact.relationshipType || 'Collaboratore'} onChange={(e) => updateContactGovernance(contact.id, { relationshipType: e.target.value as RelationshipType })} className="rounded-2xl border px-3 py-2 bg-white text-sm">{relationshipTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select><select value={contact.collaboratorStage || 'Candidato'} onChange={(e) => updateContactGovernance(contact.id, { collaboratorStage: e.target.value as CollaboratorStage })} className="rounded-2xl border px-3 py-2 bg-white text-sm">{collaboratorStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select><input value={contact.ownerName || ''} onChange={(e) => updateContactGovernance(contact.id, { ownerName: e.target.value })} className="rounded-2xl border px-3 py-2 text-sm" placeholder="Assegnato a / socio" /></div><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => { setSelectedContactId(contact.id); setSection('contacts') }} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50">Apri scheda</button><button onClick={() => createGovernanceTask(contact, `Onboarding collaboratore ${contact.name}: verificare documenti, ruolo e prossima call`)} className="rounded-xl bg-blue-700 text-white px-3 py-2 text-sm hover:bg-blue-800">Task onboarding</button><button onClick={() => updateContactGovernance(contact.id, { collaboratorStage: 'Attivo', status: 'Partner' })} className="rounded-xl bg-green-700 text-white px-3 py-2 text-sm hover:bg-green-800">Segna attivo</button></div></div>)}{collaboratorContacts.length === 0 && <div className="rounded-3xl bg-white border p-6 text-gray-600">Nessun collaboratore classificato. Seleziona un contatto e usa il pannello laterale per classificarlo come collaboratore, socio o partner operativo.</div>}</div><aside className="space-y-4"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg">Classifica selezionato</h3><p className="text-sm text-gray-600 mt-2">Contatto: <strong>{selectedContact ? contactBusinessName(selectedContact) : 'nessuno'}</strong></p><div className="mt-3 grid gap-2"><button onClick={() => setSelectedRelationship('Collaboratore')} className="rounded-2xl border px-4 py-3 text-left hover:bg-stone-50">Collaboratore</button><button onClick={() => setSelectedRelationship('Socio')} className="rounded-2xl border px-4 py-3 text-left hover:bg-stone-50">Socio</button><button onClick={() => setSelectedRelationship('Partner operativo')} className="rounded-2xl border px-4 py-3 text-left hover:bg-stone-50">Partner operativo</button><button onClick={() => setSelectedRelationship('Entrambi')} className="rounded-2xl border px-4 py-3 text-left hover:bg-stone-50">Cliente + collaboratore</button></div></div><div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><strong className="block mb-1">Regola anti-sovrapposizione</strong>Il cliente valuta un servizio; il collaboratore sviluppa rete, attività e formazione. Usa una scheda unica solo quando la persona è davvero “Entrambi”, ma mantieni pipeline e task separati.</div></aside></div></div>}

  {section === 'investors' && (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border p-5">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-purple-700" />
          <h2 className="font-bold text-xl">Investitori · potenziali e attivi</h2>
        </div>
        <p className="text-gray-600 mt-2">Questa pipeline separa potenziali investitori, investitori qualificati, LOI, due diligence e investitori attivi. È utile per Blotix, asset, operazioni patrimoniali o opportunità che richiedono documentazione e follow-up prudente.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {investorStageGroups.map(({ stage, items }) => (
          <div key={stage} className="rounded-3xl bg-white border p-4">
            <h3 className="font-bold text-sm mb-3">{stage} · {items.length}</h3>
            <div className="space-y-3">
              {items.map((contact) => (
                <div key={contact.id} className="rounded-2xl border p-3 bg-stone-50">
                  <div className="font-semibold">{contact.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{contact.investorProfile || 'Profilo da qualificare'} · {euro(contact.expectedInvestment || 0)}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => { setSelectedContactId(contact.id); setSection('contacts') }} className="text-xs rounded-lg border bg-white px-2 py-1">Apri</button>
                    <button
                      onClick={() => updateContactGovernance(contact.id, {
                        investorStage: stage === 'Potenziale'
                          ? 'Qualificato'
                          : stage === 'Qualificato'
                            ? 'LOI da inviare'
                            : stage === 'LOI da inviare'
                              ? 'LOI inviata'
                              : stage === 'LOI inviata'
                                ? 'Due diligence'
                                : stage === 'Due diligence'
                                  ? 'Investitore'
                                  : 'Follow-up',
                      })}
                      className="text-xs rounded-lg bg-purple-700 text-white px-2 py-1"
                    >
                      Avanza
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-xs text-gray-400">Nessun nominativo</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white border p-5">
        <h3 className="font-bold text-lg">Classifica investitore selezionato</h3>
        <div className="grid md:grid-cols-4 gap-3 mt-3">
          <button onClick={() => setSelectedRelationship('Investitore')} className="rounded-2xl bg-purple-700 text-white px-4 py-3 font-semibold">Imposta investitore</button>
          <button onClick={() => selectedContact && updateContactGovernance(selectedContact.id, { investorStage: 'LOI da inviare', loiStatus: 'Da preparare', relationshipType: selectedContact.relationshipType === 'Cliente' ? 'Investitore' : selectedContact.relationshipType })} className="rounded-2xl border px-4 py-3 font-semibold hover:bg-stone-50">Prepara LOI</button>
          <button onClick={() => selectedContact && createGovernanceTask(selectedContact, `Investor follow-up ${selectedContact.name}: verificare profilo, LOI e prossima call`, 'Alta')} className="rounded-2xl border px-4 py-3 font-semibold hover:bg-stone-50">Task follow-up</button>
          <button onClick={() => setSection('documents')} className="rounded-2xl border px-4 py-3 font-semibold hover:bg-stone-50">Vai ai documenti</button>
        </div>
      </div>
    </div>
  )}

  {section === 'documents' && <div className="space-y-6"><div className="rounded-3xl bg-white border p-5"><div className="flex items-center gap-3"><ClipboardList className="w-6 h-6 text-green-700" /><h2 className="font-bold text-xl">Documentazione · LOI, contrattualistica e kit clienti</h2></div><p className="text-gray-600 mt-2">Qui controlli cosa condividere quando un lead diventa cliente, collaboratore o investitore. La funzione gestisce lo stato dei documenti; la validazione legale e la firma restano sempre da fare sui template ufficiali approvati.</p></div><div className="grid lg:grid-cols-[1fr_360px] gap-6"><div className="space-y-3">{documentContacts.map((contact) => <div key={contact.id} className="rounded-3xl bg-white border p-5"><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3"><div><div className="text-xs uppercase font-bold text-green-700">{contact.relationshipType || 'Cliente'} · documenti</div><h3 className="font-bold text-lg mt-1">{contact.name}</h3><p className="text-sm text-gray-600 mt-1">LOI: <strong>{contact.loiStatus || 'Da preparare'}</strong> · Contratto cliente: <strong>{contact.contractStatus || 'Da preparare'}</strong></p></div><button onClick={() => { setSelectedContactId(contact.id); setSection('contacts') }} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50">Apri scheda</button></div><div className="mt-4 grid md:grid-cols-2 gap-3"><select value={contact.loiStatus || 'Da preparare'} onChange={(e) => updateContactGovernance(contact.id, { loiStatus: e.target.value as DocumentStage })} className="rounded-2xl border px-3 py-2 bg-white text-sm">{documentStages.map((stage) => <option key={stage} value={stage}>LOI · {stage}</option>)}</select><select value={contact.contractStatus || 'Da preparare'} onChange={(e) => updateContactGovernance(contact.id, { contractStatus: e.target.value as DocumentStage })} className="rounded-2xl border px-3 py-2 bg-white text-sm">{documentStages.map((stage) => <option key={stage} value={stage}>Contratto · {stage}</option>)}</select></div><textarea value={contact.sharedDocuments || ''} onChange={(e) => updateContactGovernance(contact.id, { sharedDocuments: e.target.value })} className="mt-3 w-full min-h-20 rounded-2xl border p-3 text-sm" placeholder="Link Drive, nome template, LOI condivisa, contratto inviato, note documentali..." /><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => createGovernanceTask(contact, `Preparare documentazione per ${contact.name}: LOI, contratto e allegati coerenti con il percorso`, 'Alta')} className="rounded-xl bg-green-700 text-white px-3 py-2 text-sm hover:bg-green-800">Task documenti</button><button onClick={() => updateContactGovernance(contact.id, { loiStatus: 'Inviato' })} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50">LOI inviata</button><button onClick={() => updateContactGovernance(contact.id, { contractStatus: 'Inviato' })} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50">Contratto inviato</button></div></div>)}{documentContacts.length === 0 && <div className="rounded-3xl bg-white border p-6 text-gray-600">Nessun documento ancora tracciato. Classifica un contatto come cliente, investitore o “Entrambi”, poi imposta LOI o contratto.</div>}</div><aside className="space-y-4"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg">Kit documentale consigliato</h3><div className="mt-3 space-y-3 text-sm"><div className="rounded-2xl border p-3 bg-stone-50"><strong>Lead → Cliente</strong><br />Proposta, contratto cliente, privacy, consenso, allegati operativi e materiali di servizio.</div><div className="rounded-2xl border p-3 bg-stone-50"><strong>Investitore</strong><br />LOI, scheda opportunità, documenti informativi, verifica profilo, due diligence e contrattualistica approvata.</div><div className="rounded-2xl border p-3 bg-stone-50"><strong>Collaboratore</strong><br />Lettera incarico, piano carriera, policy comunicazione, onboarding, materiali formativi.</div></div></div><div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm text-red-900"><strong className="block mb-1">Nota di controllo</strong>Il CRM traccia stato e condivisione, ma non sostituisce revisione legale, verifica identità, consenso privacy o firma dei documenti ufficiali.</div></aside></div></div>}

  {section === 'materials' && <div className="space-y-6"><div className="rounded-3xl bg-white border p-5"><div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"><div><div className="flex items-center gap-3"><ClipboardList className="w-6 h-6 text-indigo-700" /><h2 className="font-bold text-xl">Libreria materiali · lead e consulenze</h2></div><p className="text-gray-600 mt-2">Usa Blotix, PEF, VoiceDesk e Ubroker come strumenti mirati: prima qualifica il bisogno, poi condividi un solo materiale coerente, infine registra reazione e follow-up. Per soci e collaboratori la libreria viene filtrata dai permessi assegnati al profilo attivo.</p><div className="mt-3 inline-flex rounded-full border bg-stone-50 px-3 py-1 text-xs font-semibold text-gray-700">{materialAccessLabel(activeProfile, currentRole)}</div></div>{assistedFeedback && <span className="text-xs rounded-full bg-green-50 text-green-700 px-3 py-1 border border-green-100">{assistedFeedback}</span>}</div></div><div className="grid lg:grid-cols-[1fr_360px] gap-6"><div className="grid md:grid-cols-2 gap-4">{permittedRecommendedMaterials.map(({ material, score }) => <div key={material.id} className={`rounded-3xl bg-white border p-5 ${score > 0 ? 'ring-2 ring-indigo-100' : ''}`}><div className="flex items-start justify-between gap-3"><div><div className="text-xs uppercase font-bold text-indigo-700">{material.area} · {material.level}</div><h3 className="font-bold text-lg mt-1">{material.title}</h3><p className="text-sm text-gray-600 mt-2">{material.need}</p></div>{score > 0 && <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-1">Consigliato</span>}</div><div className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm"><strong>Target:</strong> {material.target}</div><div className="mt-3"><div className="text-xs font-semibold text-gray-500 mb-2">Messaggio condivisibile</div><p className="text-sm text-gray-700 rounded-2xl border p-4 bg-white">{material.message}</p></div><div className="mt-3 grid sm:grid-cols-2 gap-2"><button onClick={() => copyNetworkMaterialMessage(material)} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-1" />Copia messaggio</button><a href={material.link} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm text-center"><Send className="w-4 h-4 inline mr-1" />Apri link</a><button onClick={() => saveNetworkMaterialTask(material)} className="sm:col-span-2 rounded-xl bg-indigo-700 text-white px-3 py-2 text-sm hover:bg-indigo-800"><Plus className="w-4 h-4 inline mr-1" />Crea task e nota CRM</button></div><div className="mt-4 text-sm"><div className="font-semibold mb-2">Materiali disponibili</div><div className="flex flex-wrap gap-2">{material.assets.filter((asset) => !asset.hotelOnly || (selectedContact && isVoiceDeskHotelContact(selectedContact))).map((asset) => asset.href ? <a key={asset.label} href={asset.href} target="_blank" rel="noopener noreferrer" className="text-xs rounded-full bg-blue-50 text-blue-800 border border-blue-100 px-2 py-1 hover:bg-blue-100">{asset.label}</a> : <span key={asset.label} className="text-xs rounded-full bg-blue-50 text-blue-800 border border-blue-100 px-2 py-1">{asset.label}</span>)}</div></div><div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Cautela:</strong> {material.caution}</div></div>)}</div><aside className="space-y-4"><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg">Diagnosi rapida</h3><p className="text-sm text-gray-600 mt-2">Lead selezionato: <strong>{selectedContact ? contactBusinessName(selectedContact) : 'nessuno'}</strong></p><div className="mt-4 space-y-3 text-sm">{['Chiamate, richieste ripetitive o prenotazioni → VoiceDesk', 'Bolletta, luce/gas o trasparenza fornitore → PEF Power / Ubroker', 'Asset, immobili, patrimonio o liquidità → Blotix', 'Interesse a collaborare o creare rete → PEF Italia'].map((rule) => <div key={rule} className="rounded-2xl border p-3 bg-stone-50">{rule}</div>)}</div></div><div className="rounded-3xl bg-white border p-5"><h3 className="font-bold text-lg">Dati da chiedere</h3><div className="mt-3 space-y-3">{permittedRecommendedMaterials.slice(0, 2).map(({ material }) => <div key={material.id} className="rounded-2xl border p-4"><div className="font-semibold text-sm">{material.area}</div><ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">{material.dataToAsk.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div></div>{!isAdmin && blockedNetworkMaterials.length > 0 && <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5 text-sm text-gray-700"><strong className="block mb-2">Materiali non abilitati per questo profilo</strong><div className="flex flex-wrap gap-2">{blockedNetworkMaterials.map((material) => <span key={material.id} className="rounded-full border bg-white px-2 py-1 text-xs">{material.area}</span>)}</div><p className="mt-3 text-xs text-gray-500">Per abilitarli entra come amministratore, seleziona il profilo del collaboratore e spunta i servizi autorizzati.</p></div>}<div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-950"><strong className="block mb-1">Regola di uso</strong>Il materiale non sostituisce la consulenza: serve ad aprire un approfondimento ordinato. Nel messaggio al lead evita promesse, tecnicismi non richiesti e riferimenti interni al CRM.</div></aside></div></div>}

  {section === 'agent' && <div className="rounded-3xl bg-white border p-5 max-w-5xl"><div className="flex items-center gap-3 mb-5"><Bot className="w-6 h-6" /><div><h2 className="font-bold text-xl">Agente closer operativo sui tuoi dati</h2><p className="text-sm text-gray-500">Guida conversazioni, obiezioni, follow-up e appuntamenti senza invii automatici: decidi sempre tu cosa copiare o aprire.</p></div></div><div className="grid md:grid-cols-3 gap-3 mb-4"><div><label className="text-xs font-semibold text-gray-500">Tono vendita</label><select value={salesTone} onChange={(e) => setSalesTone(e.target.value as SalesTone)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white">{salesTones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}</select></div><div><label className="text-xs font-semibold text-gray-500">Obiettivo</label><select value={strategicIntent} onChange={(e) => setStrategicIntent(e.target.value as StrategicIntent)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white">{strategicIntents.map((intent) => <option key={intent} value={intent}>{intent}</option>)}</select></div><div><label className="text-xs font-semibold text-gray-500">Template</label><select value={assistedTemplate} onChange={(e) => setAssistedTemplate(e.target.value as CommunicationTemplate)} className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"><option value="opener">Opener soft</option><option value="diagnose">Diagnosi</option><option value="qualify">Qualifica</option><option value="tailored">Su misura</option><option value="position">Posizionamento</option><option value="close">Closing morbido</option></select></div></div><div className="grid lg:grid-cols-3 gap-4 mb-4"><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900"><div className="text-xs uppercase font-bold mb-1">Stadio conversazione</div><div className="text-lg font-bold">{closerStageDashboard(selectedContact || undefined).label}</div><p className="mt-2">{closerStageDashboard(selectedContact || undefined).principle}</p></div><div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-900"><div className="text-xs uppercase font-bold mb-1">Prossima mossa</div><p>{closerStageDashboard(selectedContact || undefined).nextMove}</p><div className="mt-2 font-semibold">{closerStageDashboard(selectedContact || undefined).followUpText}</div></div><div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900"><div className="text-xs uppercase font-bold mb-1">Obiezione / risposta</div><p>{objectionReply(selectedContact || undefined)}</p></div></div><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 mb-4 text-sm text-blue-900"><strong>Coach strategico:</strong> {strategicCoachNote(selectedContact || undefined)}</div>{selectedContact && <div className="grid md:grid-cols-2 gap-4 mb-4"><div className="rounded-2xl border p-4"><div className="text-xs font-semibold text-gray-500 mb-2">Email suggerita</div><div className="font-semibold mb-2">{buildEmailTemplate(selectedContact).subject}</div><pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{buildEmailTemplate(selectedContact).body}</pre><div className="flex flex-wrap gap-2 mt-3"><button onClick={() => copyAssistedMessage('email')} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-1" />Copia email</button><button onClick={() => openMailto(selectedContact)} className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm"><Mail className="w-4 h-4 inline mr-1" />Apri email</button></div></div><div className="rounded-2xl border p-4"><div className="text-xs font-semibold text-gray-500 mb-2">WhatsApp suggerito</div><pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{buildWhatsAppTemplate(selectedContact)}</pre><div className="text-xs text-gray-500 mt-2">{whatsappStatus(selectedContact)}</div><div className="flex flex-wrap gap-2 mt-3"><button onClick={() => copyAssistedMessage('whatsapp')} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50"><Copy className="w-4 h-4 inline mr-1" />Copia WhatsApp</button><button onClick={() => openWhatsApp(selectedContact)} className="rounded-xl bg-green-700 text-white px-3 py-2 text-sm"><Phone className="w-4 h-4 inline mr-1" />Apri WhatsApp</button><button onClick={() => markContacted(selectedContact.id, 'WhatsApp')} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50"><CheckSquare className="w-4 h-4 inline mr-1" />Segna inviato</button><button onClick={() => scheduleFollowUp(selectedContact.id, closerStageDashboard(selectedContact).followUpDays || 3)} className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50"><Zap className="w-4 h-4 inline mr-1" />Programma follow-up</button></div>{assistedFeedback && <div className="mt-3 rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">{assistedFeedback}</div>}</div></div>}<div className="rounded-2xl bg-stone-50 p-5 mb-4 whitespace-pre-wrap"><p>{answer}</p></div><div className="flex flex-col sm:flex-row gap-3"><input value={question} onChange={(e) => setQuestion(e.target.value)} className="flex-1 rounded-2xl border px-4 py-3 text-base" placeholder="Es: chi devo contattare oggi?" /><button onClick={() => askAgent()} className="rounded-2xl bg-gray-900 text-white px-5 py-3 font-semibold"><Send className="w-4 h-4 inline mr-2" />Invia</button></div><div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 mt-4">{['Chi devo contattare oggi?', 'A che punto sono i 100 contatti?', 'Quali lead sono caldi?', 'Mostrami i task aperti', 'Riassumi le conversazioni', 'Genera messaggio soft closing', 'Prepara WhatsApp cordiale', 'Gestisci obiezione senza pressione', 'Prepara appuntamento di 10 minuti', 'Follow-up non invasivo'].map((p) => <button key={p} onClick={() => askAgent(p)} className="rounded-xl border px-3 py-3 sm:py-2 text-sm hover:bg-stone-50 text-left"><MessageSquareText className="w-3 h-3 inline mr-1" />{p}</button>)}</div><div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900"><Database className="w-4 h-4 inline mr-2" />L’agente usa regole locali gratuite sui dati del profilo attivo. Le fonti e le ricerche di mercato restano interne al CRM; al lead arrivano solo messaggi utili, cordiali e controllati da te.</div></div>}
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-white/95 backdrop-blur px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] grid grid-cols-5 gap-1">{[{ id: 'dashboard', label: 'Home', icon: TrendingUp }, { id: 'contacts', label: 'Lead', icon: Users }, { id: 'materials', label: 'Materiali', icon: ClipboardList }, { id: 'conversations', label: 'Messaggi', icon: MessageSquareText }, { id: 'agent', label: 'Agente', icon: Bot }].map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setSection(item.id as Section)} className={`rounded-2xl px-2 py-2 text-[11px] font-semibold flex flex-col items-center gap-1 ${section === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}><Icon className="w-4 h-4" />{item.label}</button> })}</nav></main></div></div>
  )
}
