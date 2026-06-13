export type ContactStatus = 'Lead' | 'Prospect' | 'Interessato' | 'Cliente' | 'Partner' | 'Collaboratore' | 'Ambassador' | 'Inattivo' | 'Archiviato'
export type OpportunityStage = 'Nuovo Lead' | 'Primo Contatto' | 'Interesse' | 'Qualificazione' | 'Presentazione' | 'Webinar' | 'Consulenza' | 'Proposta' | 'Trattativa' | 'Chiusura' | 'Cliente' | 'Partner'
export type TaskType = 'call' | 'email' | 'send_material' | 'propose_webinar' | 'follow_up' | 'meeting' | 'zoom'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type AppointmentType = 'chiamata' | 'zoom' | 'meet' | 'consulenza' | 'webinar' | 'incontro_fisico'
export type Channel = 'whatsapp' | 'telegram' | 'email' | 'zoom' | 'meet' | 'teams' | 'telefono' | 'nota_vocale' | 'manual'

export interface Contact {
  id: string
  user_id: string
  company_id?: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  whatsapp?: string
  telegram?: string
  linkedin?: string
  website?: string
  address?: string
  city?: string
  province?: string
  country?: string
  status: ContactStatus
  trust_level: number
  interest_level: number
  potential_value?: number
  first_contact_at?: string
  last_contact_at?: string
  created_at: string
  updated_at: string
  companies?: Company
  contact_topics?: ContactTopic[]
}

export interface Company {
  id: string
  name: string
  sector?: string
  website?: string
  city?: string
  country?: string
}

export interface Conversation {
  id: string
  contact_id: string
  user_id: string
  channel: Channel
  raw_content?: string
  transcription?: string
  occurred_at: string
  created_at: string
  ai_summaries?: AISummary[]
}

export interface AISummary {
  id: string
  conversation_id: string
  contact_id: string
  summary: string
  extracted_data: ExtractedKnowledge
  opportunities: OpportunityExtracted[]
  suggested_actions: SuggestedTask[]
  confidence: number
  created_at: string
}

export interface Opportunity {
  id: string
  contact_id: string
  service_id: string
  stage: OpportunityStage
  estimated_value?: number
  close_probability: number
  expected_close?: string
  notes?: string
  created_at: string
  updated_at: string
  contacts?: Contact
  services?: Service
}

export interface Service {
  id: string
  area: string
  name: string
  description?: string
  base_price?: number
}

export interface Task {
  id: string
  contact_id: string
  user_id: string
  title: string
  type: TaskType
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  ai_generated: boolean
  due_date?: string
  completed_at?: string
  notes?: string
  contacts?: Contact
}

export interface Appointment {
  id: string
  contact_id: string
  user_id: string
  type: AppointmentType
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  contacts?: Contact
}

export interface Webinar {
  id: string
  title: string
  area: string
  description?: string
  scheduled_at: string
  status: 'draft' | 'published' | 'live' | 'completed'
  recording_url?: string
  created_by: string
  webinar_attendees?: WebinarAttendee[]
}

export interface WebinarAttendee {
  webinar_id: string
  contact_id: string
  status: 'invited' | 'registered' | 'attended' | 'absent'
  followup_done: boolean
  contacts?: Contact
}

export interface Topic {
  id: string
  area: string
  name: string
  description?: string
}

export interface ContactTopic {
  contact_id: string
  topic_id: string
  interest_level: number
  conversion_probability?: number
  first_interest_at?: string
  last_interest_at?: string
  topics?: Topic
}

export interface DashboardMetrics {
  user_id: string
  leads_count: number
  prospects_count: number
  interested_count: number
  clients_count: number
  partners_count: number
  inactive_30d: number
  open_opportunities: number
  pipeline_value: number
  weighted_pipeline: number
  overdue_tasks: number
  due_today: number
  appointments_today: number
  upcoming_webinars: number
}

export interface DailyPriority {
  priority_type: string
  contact_id: string
  contact_name: string
  reason: string
  score: number
  suggested_action: string
  preferred_channel: string
}

export interface ExtractedKnowledge {
  contact: { first_name: string; last_name: string; company: string; role: string; email: string; phone: string; city: string }
  professional_profile: { sector: string; type: string; skills: string[]; company_size: string }
  needs: Array<{ type: 'explicit' | 'implicit'; description: string; urgency: 'low' | 'medium' | 'high' }>
  interests: Record<string, number>
  opportunities: OpportunityExtracted[]
  commitments: { mine: string[]; theirs: string[] }
  objections: Array<{ text: string; type: string }>
  sentiment: { overall: string; temperature: string; suggested_status: string }
  suggested_tasks: SuggestedTask[]
  summary: string
}

export interface OpportunityExtracted {
  service: string
  probability: number
  reasoning: string
  materials_to_send: string[]
  webinar_to_propose: string
}

export interface SuggestedTask {
  title: string
  type: string
  due_days: number
  priority: 'low' | 'medium' | 'high'
}
