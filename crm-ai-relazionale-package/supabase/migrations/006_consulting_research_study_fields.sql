-- ============================================================
-- 006 - Campi consulenziali per ricerca guidata, studio su misura e closer
-- ============================================================
-- Migrazione idempotente: aggiunge al CRM reale i campi già necessari alla demo
-- local-first, senza rompere i record esistenti.

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS research_entry_mode text DEFAULT 'Azienda',
  ADD COLUMN IF NOT EXISTS commercial_name text,
  ADD COLUMN IF NOT EXISTS company_legal_name text,
  ADD COLUMN IF NOT EXISTS commercial_aliases text,
  ADD COLUMN IF NOT EXISTS public_sources text,
  ADD COLUMN IF NOT EXISTS facebook_page_candidates text,
  ADD COLUMN IF NOT EXISTS confirmed_facebook_page text,
  ADD COLUMN IF NOT EXISTS person_company_links text,
  ADD COLUMN IF NOT EXISTS public_complaints text,
  ADD COLUMN IF NOT EXISTS research_summary text,
  ADD COLUMN IF NOT EXISTS probable_needs text,
  ADD COLUMN IF NOT EXISTS recommended_questions text,
  ADD COLUMN IF NOT EXISTS recommended_path text,
  ADD COLUMN IF NOT EXISTS confidence_score int DEFAULT 35 CHECK (confidence_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS personalization_hook text,
  ADD COLUMN IF NOT EXISTS message_angle text,
  ADD COLUMN IF NOT EXISTS outreach_stage text DEFAULT 'Da qualificare',
  ADD COLUMN IF NOT EXISTS source_batch text,
  ADD COLUMN IF NOT EXISTS paid_share_capital numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS real_estate_value numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inventory_value numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS equipment_value numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS receivables_value numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cash_value numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS brand_value numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS annual_revenue numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS annual_ebitda numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS annual_energy_cost numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expected_energy_saving_pct numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS annual_service_cost numeric(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS preferred_energy_path text DEFAULT 'Da valutare',
  ADD COLUMN IF NOT EXISTS study_notes text,
  ADD COLUMN IF NOT EXISTS service_plafond_notes text;

CREATE INDEX IF NOT EXISTS idx_contacts_outreach_stage ON public.contacts(outreach_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_confidence_score ON public.contacts(confidence_score);
CREATE INDEX IF NOT EXISTS idx_contacts_research_text ON public.contacts USING gin(to_tsvector('italian', coalesce(research_summary,'') || ' ' || coalesce(probable_needs,'') || ' ' || coalesce(recommended_path,'')));

COMMENT ON COLUMN public.contacts.public_sources IS 'URL o note delle fonti pubbliche consultate: sito ufficiale, social verificati, registri, recensioni, pagine uBroker/PEF/Blotix pertinenti.';
COMMENT ON COLUMN public.contacts.expected_energy_saving_pct IS 'Percentuale simulata e modificabile: non rappresenta una garanzia di risparmio.';
COMMENT ON COLUMN public.contacts.preferred_energy_path IS 'Percorso energia preferito o da confrontare: uBroker, PEF Power, Altro, Da valutare.';
COMMENT ON COLUMN public.contacts.confidence_score IS 'Punteggio interno di qualità ricerca pubblica 0-100, non indicatore di affidabilità assoluta.';
