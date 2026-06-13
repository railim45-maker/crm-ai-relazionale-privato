-- ============================================================
-- CRM AI RELAZIONALE — ESTENSIONI OPERATIVE V1+
-- Aggiunge moduli enterprise leggeri mantenendo compatibilità con la V1.
-- ============================================================

-- CONSENSI GDPR / PRIVACY
CREATE TABLE IF NOT EXISTS public.contact_consents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL CHECK (consent_type IN ('marketing','profiling','recording','newsletter','data_processing')),
  status text NOT NULL DEFAULT 'granted' CHECK (status IN ('granted','revoked','unknown')),
  source text,
  proof_url text,
  granted_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE (contact_id, consent_type)
);

-- FILE E ALLEGATI OPERATIVI
CREATE TABLE IF NOT EXISTS public.attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  storage_bucket text DEFAULT 'crm-assets',
  storage_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  file_size bigint,
  checksum text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ACCOUNT CANALE: WHATSAPP, TELEGRAM, EMAIL, ZOOM, MEET
CREATE TABLE IF NOT EXISTS public.channel_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('whatsapp','telegram','gmail','outlook','zoom','meet','teams','manual')),
  display_name text,
  external_account_id text,
  status text DEFAULT 'active' CHECK (status IN ('active','paused','error','revoked')),
  last_sync_at timestamptz,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, provider, external_account_id)
);

-- IMPORT / SINCRONIZZAZIONI
CREATE TABLE IF NOT EXISTS public.import_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_account_id uuid REFERENCES channel_accounts(id) ON DELETE SET NULL,
  source text NOT NULL,
  status text DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed','cancelled')),
  total_items int DEFAULT 0,
  processed_items int DEFAULT 0,
  failed_items int DEFAULT 0,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- AGENTI AI CONFIGURABILI
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  system_prompt text NOT NULL,
  tools jsonb DEFAULT '[]',
  model text DEFAULT 'claude-sonnet-4-20250514',
  temperature numeric(3,2) DEFAULT 0.20,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, slug)
);

-- ESECUZIONI AGENTI AI / AUDIT AI
CREATE TABLE IF NOT EXISTS public.ai_agent_runs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES ai_agents(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  input jsonb DEFAULT '{}',
  output jsonb DEFAULT '{}',
  status text DEFAULT 'completed' CHECK (status IN ('queued','running','completed','failed')),
  tokens_input int,
  tokens_output int,
  latency_ms int,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- EVENTI AUTOMAZIONE / N8N
CREATE TABLE IF NOT EXISTS public.automation_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  source text NOT NULL DEFAULT 'n8n',
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  payload jsonb DEFAULT '{}',
  processed boolean DEFAULT false,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- WEBHOOK CONFIGURATI
CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  event_type text NOT NULL,
  target_url text NOT NULL,
  secret_hint text,
  active boolean DEFAULT true,
  last_called_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NOTIFICHE INTERNE
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('task','follow_up','webinar','pipeline','system','ai')),
  title text NOT NULL,
  body text,
  severity text DEFAULT 'info' CHECK (severity IN ('info','success','warning','error')),
  read_at timestamptz,
  action_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- TEMPLATE MESSAGGI / FOLLOW-UP
CREATE TABLE IF NOT EXISTS public.message_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('whatsapp','telegram','email','sms','manual')),
  category text DEFAULT 'follow_up',
  subject text,
  body text NOT NULL,
  variables jsonb DEFAULT '[]',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, name, channel)
);

-- LOG AUDIT APPLICATIVO
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- INDICI OPERATIVI
CREATE INDEX IF NOT EXISTS idx_contact_consents_contact ON contact_consents(contact_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_attachments_contact ON attachments(contact_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channel_accounts_user ON channel_accounts(user_id, provider, status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_user_status ON import_jobs(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_active ON ai_agents(user_id, active);
CREATE INDEX IF NOT EXISTS idx_ai_agent_runs_user_created ON ai_agent_runs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_events_user_processed ON automation_events(user_id, processed, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_user_active ON webhook_endpoints(user_id, active);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_templates_user_channel ON message_templates(user_id, channel, active);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);

-- TRIGGER UPDATED_AT
CREATE TRIGGER tr_channel_accounts_updated BEFORE UPDATE ON channel_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_ai_agents_updated BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_webhook_endpoints_updated BEFORE UPDATE ON webhook_endpoints FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_message_templates_updated BEFORE UPDATE ON message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE contact_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_consents_owner" ON contact_consents USING (auth.uid() = user_id);
CREATE POLICY "attachments_owner" ON attachments USING (auth.uid() = user_id);
CREATE POLICY "channel_accounts_owner" ON channel_accounts USING (auth.uid() = user_id);
CREATE POLICY "import_jobs_owner" ON import_jobs USING (auth.uid() = user_id);
CREATE POLICY "ai_agents_owner_or_global" ON ai_agents USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "ai_agent_runs_owner" ON ai_agent_runs USING (auth.uid() = user_id);
CREATE POLICY "automation_events_owner" ON automation_events USING (auth.uid() = user_id);
CREATE POLICY "webhook_endpoints_owner" ON webhook_endpoints USING (auth.uid() = user_id);
CREATE POLICY "notifications_owner" ON notifications USING (auth.uid() = user_id);
CREATE POLICY "message_templates_owner_or_global" ON message_templates USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "audit_logs_owner" ON audit_logs USING (auth.uid() = user_id);
