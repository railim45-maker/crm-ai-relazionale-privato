-- ============================================================
-- CRM AI RELAZIONALE — SCHEMA POSTGRESQL COMPLETO
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- USERS (gestito da Supabase Auth, tabella profili)
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('admin','user','readonly')),
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- COMPANIES
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  sector text,
  website text,
  address text,
  city text,
  province text,
  country text DEFAULT 'Italia',
  notes text,
  created_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX idx_companies_name ON companies(lower(name));

-- CONTACTS
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text,
  email text,
  phone text,
  whatsapp text,
  telegram text,
  linkedin text,
  website text,
  address text,
  city text,
  province text,
  country text DEFAULT 'Italia',
  status text DEFAULT 'Lead' CHECK (status IN ('Lead','Prospect','Interessato','Cliente','Partner','Collaboratore','Ambassador','Inattivo','Archiviato')),
  trust_level int DEFAULT 5 CHECK (trust_level BETWEEN 1 AND 10),
  interest_level int DEFAULT 5 CHECK (interest_level BETWEEN 0 AND 10),
  potential_value numeric(12,2),
  first_contact_at timestamptz,
  last_contact_at timestamptz,
  archived_at timestamptz,
  notes text,
  tags text[],
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CONVERSATIONS
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  channel text NOT NULL CHECK (channel IN ('whatsapp','telegram','email','zoom','meet','teams','telefono','nota_vocale','manual')),
  raw_content text,
  transcription text,
  audio_url text,
  duration_seconds int,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- AI SUMMARIES
CREATE TABLE public.ai_summaries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  summary text NOT NULL,
  extracted_data jsonb DEFAULT '{}',
  opportunities jsonb DEFAULT '[]',
  suggested_actions jsonb DEFAULT '[]',
  embedding vector(1536),
  confidence float DEFAULT 0.8,
  model_used text DEFAULT 'claude-sonnet-4-20250514',
  created_at timestamptz DEFAULT now()
);

-- TOPICS
CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  area text NOT NULL,
  name text NOT NULL,
  description text,
  sort_order int DEFAULT 0
);
INSERT INTO topics (area, name, sort_order) VALUES
  ('Autodeterminazione','Autodeterminazione individuale',1),
  ('Autodeterminazione','Autodeterminazione comunitaria',2),
  ('Autodeterminazione','Percorsi formativi',3),
  ('Tokenizzazione','Tokenizzazione immobiliare',4),
  ('Tokenizzazione','Tokenizzazione aziendale',5),
  ('Tokenizzazione','Blockchain e smart contract',6),
  ('AI e Automazioni','Agenti AI',7),
  ('AI e Automazioni','Automazioni aziendali',8),
  ('AI e Automazioni','CRM AI',9),
  ('AI e Automazioni','Chatbot e assistenti virtuali',10),
  ('Web','Landing page e funnel',11),
  ('Web','Siti web e ecommerce',12),
  ('Web','Marketing digitale',13),
  ('Energia','Efficientamento energetico',14),
  ('Energia','Comunità energetiche',15),
  ('Net Free','Presentazione progetto',16),
  ('Net Free','Adesione Net Free',17),
  ('Net Free','Formazione e affiliazione',18),
  ('Educazione Finanziaria','Moneta scritturale',19),
  ('Educazione Finanziaria','Sistemi monetari',20),
  ('Partnership','Collaborazioni e networking',21),
  ('Partnership','Joint venture',22);

-- CONTACT_TOPICS (interessi per topic)
CREATE TABLE public.contact_topics (
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  interest_level int DEFAULT 5 CHECK (interest_level BETWEEN 0 AND 10),
  conversion_probability float DEFAULT 0.0 CHECK (conversion_probability BETWEEN 0 AND 1),
  material_sent jsonb DEFAULT '[]',
  first_interest_at timestamptz DEFAULT now(),
  last_interest_at timestamptz DEFAULT now(),
  PRIMARY KEY (contact_id, topic_id)
);

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  area text NOT NULL,
  name text NOT NULL,
  description text,
  base_price numeric(12,2),
  active boolean DEFAULT true,
  sort_order int DEFAULT 0
);
INSERT INTO services (area, name, base_price) VALUES
  ('Autodeterminazione','Formazione autodeterminazione',500),
  ('Autodeterminazione','Consulenza individuale',150),
  ('Tokenizzazione','Consulenza tokenizzazione',800),
  ('Tokenizzazione','Progettazione token',2000),
  ('AI e Automazioni','CRM AI personalizzato',3000),
  ('AI e Automazioni','Chatbot aziendale',1500),
  ('AI e Automazioni','Workflow automation',1200),
  ('Web','Landing page',800),
  ('Web','Funnel completo',1500),
  ('Web','Sito web',2500),
  ('Energia','Consulenza energetica',300),
  ('Energia','Comunità energetica',5000),
  ('Net Free','Adesione Net Free',0),
  ('Educazione Finanziaria','Webinar educazione finanziaria',100),
  ('Educazione Finanziaria','Percorso formativo',400);

-- OPPORTUNITIES
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  stage text DEFAULT 'Nuovo Lead' CHECK (stage IN ('Nuovo Lead','Primo Contatto','Interesse','Qualificazione','Presentazione','Webinar','Consulenza','Proposta','Trattativa','Chiusura','Cliente','Partner')),
  estimated_value numeric(12,2),
  close_probability float DEFAULT 0.1 CHECK (close_probability BETWEEN 0 AND 1),
  expected_close date,
  next_action text,
  notes text,
  lost_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (contact_id, service_id)
);

-- TASKS
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  conversation_id uuid REFERENCES conversations(id),
  title text NOT NULL,
  description text,
  type text DEFAULT 'follow_up' CHECK (type IN ('call','email','send_material','propose_webinar','follow_up','meeting','zoom')),
  status text DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  ai_generated boolean DEFAULT false,
  due_date date,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  type text NOT NULL CHECK (type IN ('chiamata','zoom','meet','consulenza','webinar','incontro_fisico')),
  title text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes int DEFAULT 30,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  meeting_url text,
  notes text,
  briefing jsonb,
  created_at timestamptz DEFAULT now()
);

-- WEBINARS
CREATE TABLE public.webinars (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  area text,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes int DEFAULT 60,
  status text DEFAULT 'draft' CHECK (status IN ('draft','published','live','completed')),
  platform text DEFAULT 'zoom',
  meeting_url text,
  recording_url text,
  max_attendees int,
  created_at timestamptz DEFAULT now()
);

-- WEBINAR_ATTENDEES
CREATE TABLE public.webinar_attendees (
  webinar_id uuid REFERENCES webinars(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  status text DEFAULT 'invited' CHECK (status IN ('invited','registered','attended','absent')),
  registered_at timestamptz,
  attended_at timestamptz,
  followup_done boolean DEFAULT false,
  followup_at timestamptz,
  notes text,
  PRIMARY KEY (webinar_id, contact_id)
);

-- DOCUMENTS
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  title text NOT NULL,
  type text CHECK (type IN ('pdf','presentation','video','contract','link','other')),
  url text,
  sent_at timestamptz,
  viewed_at timestamptz,
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- NOTES
CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id),
  user_id uuid REFERENCES auth.users(id),
  type text DEFAULT 'general' CHECK (type IN ('general','objections','needs','promises','feedback')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- PARTNERSHIPS
CREATE TABLE public.partnerships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES contacts(id),
  program text NOT NULL,
  status text DEFAULT 'proposed' CHECK (status IN ('proposed','active','paused','ended')),
  commission_pct float DEFAULT 0.0,
  referrals_count int DEFAULT 0,
  total_commission numeric(12,2) DEFAULT 0,
  started_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- REFERRALS
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referred_by uuid REFERENCES contacts(id),
  referred_contact uuid REFERENCES contacts(id),
  opportunity_id uuid REFERENCES opportunities(id),
  commission numeric(12,2),
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ── INDICI ───────────────────────────────────
CREATE INDEX idx_contacts_user ON contacts(user_id);
CREATE INDEX idx_contacts_status ON contacts(user_id, status);
CREATE INDEX idx_contacts_interest ON contacts(user_id, interest_level DESC);
CREATE INDEX idx_contacts_last_contact ON contacts(user_id, last_contact_at DESC);
CREATE INDEX idx_contacts_name_trgm ON contacts USING gin((first_name || ' ' || last_name) gin_trgm_ops);
CREATE INDEX idx_conversations_contact ON conversations(contact_id, occurred_at DESC);
CREATE INDEX idx_conversations_user ON conversations(user_id, occurred_at DESC);
CREATE INDEX idx_ai_summaries_contact ON ai_summaries(contact_id);
CREATE INDEX idx_ai_summaries_embedding ON ai_summaries USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_tasks_user_due ON tasks(user_id, due_date, status);
CREATE INDEX idx_tasks_contact ON tasks(contact_id, status);
CREATE INDEX idx_opportunities_contact ON opportunities(contact_id, stage);
CREATE INDEX idx_opportunities_stage ON opportunities(stage, close_probability DESC);
CREATE INDEX idx_appointments_user ON appointments(user_id, scheduled_at);
CREATE INDEX idx_webinar_attendees_contact ON webinar_attendees(contact_id);
CREATE INDEX idx_contact_topics_interest ON contact_topics(interest_level DESC);
