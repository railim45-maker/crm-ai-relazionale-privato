-- ============================================================
-- CRM AI RELAZIONALE — Persistenza demo/NetFree su Supabase
-- Aggiunge alla tabella contacts i campi usati dal mapper demo
-- e indici utili per ricaricare/deduplicare import NetFree massivi.
-- ============================================================

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS relationship_type text DEFAULT 'Cliente',
  ADD COLUMN IF NOT EXISTS owner_name text,
  ADD COLUMN IF NOT EXISTS sponsor_name text,
  ADD COLUMN IF NOT EXISTS collaborator_stage text DEFAULT 'Candidato',
  ADD COLUMN IF NOT EXISTS collaborator_role text,
  ADD COLUMN IF NOT EXISTS investor_stage text DEFAULT 'Potenziale',
  ADD COLUMN IF NOT EXISTS investor_profile text,
  ADD COLUMN IF NOT EXISTS expected_investment numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS loi_status text DEFAULT 'Da preparare',
  ADD COLUMN IF NOT EXISTS contract_status text DEFAULT 'Da preparare',
  ADD COLUMN IF NOT EXISTS shared_documents text,
  ADD COLUMN IF NOT EXISTS admin_kpi_notes text,
  ADD COLUMN IF NOT EXISTS voicedesk_segment text,
  ADD COLUMN IF NOT EXISTS voicedesk_email_sent_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS voicedesk_email_open_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS voicedesk_demo_click_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS voicedesk_call_click_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS voicedesk_last_action text,
  ADD COLUMN IF NOT EXISTS voicedesk_last_action_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_contacts_user_demo_local_id
  ON public.contacts (user_id, ((metadata->>'demo_local_id')));

CREATE INDEX IF NOT EXISTS idx_contacts_user_source_batch
  ON public.contacts (user_id, ((metadata->>'sourceBatch')));

CREATE INDEX IF NOT EXISTS idx_contacts_user_last_contact_desc
  ON public.contacts (user_id, last_contact_at DESC);
