-- ============================================================
-- ROW LEVEL SECURITY — GDPR Compliant
-- ============================================================

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_attendees ENABLE ROW LEVEL SECURITY;

-- Contacts: solo il proprietario
CREATE POLICY "contacts_owner" ON contacts USING (auth.uid()=user_id);

-- Conversations: solo il proprietario
CREATE POLICY "conversations_owner" ON conversations USING (auth.uid()=user_id);

-- AI summaries: tramite contatto
CREATE POLICY "ai_summaries_via_contact" ON ai_summaries
  USING (contact_id IN (SELECT id FROM contacts WHERE user_id=auth.uid()));

-- Tasks
CREATE POLICY "tasks_owner" ON tasks USING (auth.uid()=user_id);

-- Appointments
CREATE POLICY "appointments_owner" ON appointments USING (auth.uid()=user_id);

-- Opportunities: tramite contatto
CREATE POLICY "opportunities_via_contact" ON opportunities
  USING (contact_id IN (SELECT id FROM contacts WHERE user_id=auth.uid()));

-- Contact topics: tramite contatto
CREATE POLICY "contact_topics_via_contact" ON contact_topics
  USING (contact_id IN (SELECT id FROM contacts WHERE user_id=auth.uid()));

-- Notes: tramite contatto
CREATE POLICY "notes_via_contact" ON notes
  USING (contact_id IN (SELECT id FROM contacts WHERE user_id=auth.uid()));

-- Documents
CREATE POLICY "documents_owner" ON documents USING (auth.uid()=user_id);

-- Webinar attendees: tramite contatto del proprietario
CREATE POLICY "webinar_attendees_via_contact" ON webinar_attendees
  USING (contact_id IN (SELECT id FROM contacts WHERE user_id=auth.uid()));

-- Topics e services: lettura pubblica
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics_read_all" ON topics FOR SELECT USING (true);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_read_all" ON services FOR SELECT USING (true);

-- Webinars: visibili ai creatori
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "webinars_owner" ON webinars USING (auth.uid()=created_by);
