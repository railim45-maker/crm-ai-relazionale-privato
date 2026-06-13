-- ============================================================
-- CRM AI RELAZIONALE — FUNZIONE SEED DEMO
-- Uso consigliato dopo login utente: SELECT seed_demo_data(auth.uid());
-- ============================================================

CREATE OR REPLACE FUNCTION public.seed_demo_data(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_company_netfree uuid;
  v_company_ai uuid;
  v_mario uuid;
  v_giulia uuid;
  v_andrea uuid;
  v_service_ai uuid;
  v_service_webinar uuid;
  v_webinar uuid;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id non può essere null';
  END IF;

  INSERT INTO companies (name, sector, city, country)
  VALUES ('Net Free', 'Community / Formazione', 'Roma', 'Italia')
  ON CONFLICT (lower(name)) DO UPDATE SET sector = EXCLUDED.sector
  RETURNING id INTO v_company_netfree;

  INSERT INTO companies (name, sector, city, country)
  VALUES ('AI Automazioni', 'AI / Automazione', 'Milano', 'Italia')
  ON CONFLICT (lower(name)) DO UPDATE SET sector = EXCLUDED.sector
  RETURNING id INTO v_company_ai;

  SELECT id INTO v_service_ai FROM services WHERE name = 'CRM AI personalizzato' LIMIT 1;
  SELECT id INTO v_service_webinar FROM services WHERE name = 'Webinar educazione finanziaria' LIMIT 1;

  INSERT INTO contacts (user_id, company_id, first_name, last_name, role, email, whatsapp, status, trust_level, interest_level, potential_value, first_contact_at, last_contact_at, notes, tags)
  VALUES
    (p_user_id, v_company_netfree, 'Mario', 'Rossi', 'Imprenditore', 'mario.rossi@example.com', '+390000000001', 'Interessato', 7, 8, 4200, now()-interval '45 days', now()-interval '8 days', 'Interessato a tokenizzazione e percorso Net Free.', ARRAY['lead-caldo','tokenizzazione']),
    (p_user_id, v_company_ai, 'Giulia', 'Lombardi', 'Founder', 'giulia.lombardi@example.com', '+390000000002', 'Prospect', 6, 7, 6200, now()-interval '30 days', now()-interval '1 day', 'Richiede proposta su automazioni AI.', ARRAY['ai','proposta']),
    (p_user_id, v_company_netfree, 'Andrea', 'Ferrari', 'Consulente', 'andrea.ferrari@example.com', '+390000000003', 'Lead', 5, 6, 1500, now()-interval '12 days', now()-interval '4 days', 'Da invitare al prossimo webinar.', ARRAY['webinar','follow-up'])
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_mario FROM contacts WHERE user_id=p_user_id AND email='mario.rossi@example.com' LIMIT 1;
  SELECT id INTO v_giulia FROM contacts WHERE user_id=p_user_id AND email='giulia.lombardi@example.com' LIMIT 1;
  SELECT id INTO v_andrea FROM contacts WHERE user_id=p_user_id AND email='andrea.ferrari@example.com' LIMIT 1;

  INSERT INTO opportunities (contact_id, service_id, stage, estimated_value, close_probability, expected_close, next_action, notes)
  VALUES
    (v_mario, v_service_ai, 'Interesse', 4200, 0.45, current_date + 21, 'Inviare caso studio tokenizzazione + CRM AI', 'Lead caldo con bisogno chiaro.'),
    (v_giulia, v_service_ai, 'Proposta', 6200, 0.60, current_date + 14, 'Follow-up proposta inviata', 'Proposta inviata, attesa feedback.'),
    (v_andrea, v_service_webinar, 'Webinar', 1500, 0.30, current_date + 30, 'Proporre webinar Net Free', 'Interessato a contenuti introduttivi.')
  ON CONFLICT (contact_id, service_id) DO UPDATE
    SET stage=EXCLUDED.stage, estimated_value=EXCLUDED.estimated_value, close_probability=EXCLUDED.close_probability, next_action=EXCLUDED.next_action, updated_at=now();

  INSERT INTO tasks (contact_id, user_id, title, description, type, status, priority, ai_generated, due_date)
  VALUES
    (v_mario, p_user_id, 'Follow-up su tokenizzazione', 'Riprendere il tema tokenizzazione e proporre call di qualificazione.', 'follow_up', 'pending', 'high', true, current_date),
    (v_giulia, p_user_id, 'Verificare proposta AI Automazioni', 'Chiedere feedback sulla proposta e prossimi step.', 'email', 'pending', 'medium', true, current_date),
    (v_andrea, p_user_id, 'Proporre webinar Net Free', 'Inviare invito al prossimo webinar introduttivo.', 'propose_webinar', 'pending', 'medium', true, current_date + 1)
  ON CONFLICT DO NOTHING;

  INSERT INTO conversations (contact_id, user_id, channel, raw_content, transcription, occurred_at)
  VALUES
    (v_mario, p_user_id, 'whatsapp', 'Vorrei capire come tokenizzare un progetto e automatizzare i follow-up dei contatti.', 'Vorrei capire come tokenizzare un progetto e automatizzare i follow-up dei contatti.', now()-interval '8 days'),
    (v_giulia, p_user_id, 'email', 'La proposta sembra interessante, possiamo approfondire integrazione CRM e agenti AI?', 'La proposta sembra interessante, possiamo approfondire integrazione CRM e agenti AI?', now()-interval '1 day'),
    (v_andrea, p_user_id, 'manual', 'Interessato a un webinar Net Free da proporre ai miei contatti.', 'Interessato a un webinar Net Free da proporre ai miei contatti.', now()-interval '4 days')
  ON CONFLICT DO NOTHING;

  INSERT INTO webinars (created_by, title, area, description, scheduled_at, duration_minutes, status, platform, meeting_url, max_attendees)
  VALUES (p_user_id, 'Introduzione Net Free e CRM AI Relazionale', 'Net Free', 'Webinar dimostrativo su relazione, automazioni e opportunità.', current_date + 7 + time '18:00', 60, 'published', 'zoom', 'https://zoom.example.com/demo', 100)
  RETURNING id INTO v_webinar;

  INSERT INTO webinar_attendees (webinar_id, contact_id, status, registered_at)
  VALUES (v_webinar, v_andrea, 'registered', now())
  ON CONFLICT DO NOTHING;

  RETURN jsonb_build_object(
    'status','ok',
    'contacts_created',3,
    'opportunities_created',3,
    'tasks_created',3,
    'webinar_created',v_webinar
  );
END;
$$;
