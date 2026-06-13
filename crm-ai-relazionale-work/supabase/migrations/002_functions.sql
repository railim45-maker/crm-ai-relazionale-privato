-- ============================================================
-- FUNZIONI POSTGRESQL — CRM AI
-- ============================================================

-- Vista dashboard
CREATE OR REPLACE VIEW v_dashboard AS
SELECT
  u.id AS user_id,
  COUNT(c.id) FILTER (WHERE c.status='Lead') AS leads_count,
  COUNT(c.id) FILTER (WHERE c.status='Prospect') AS prospects_count,
  COUNT(c.id) FILTER (WHERE c.status='Interessato') AS interested_count,
  COUNT(c.id) FILTER (WHERE c.status='Cliente') AS clients_count,
  COUNT(c.id) FILTER (WHERE c.status='Partner') AS partners_count,
  COUNT(c.id) FILTER (WHERE c.last_contact_at < NOW()-INTERVAL'30 days' AND c.status NOT IN ('Archiviato','Inattivo') AND c.archived_at IS NULL) AS inactive_30d,
  COUNT(o.id) FILTER (WHERE o.stage NOT IN ('Chiusura','Cliente','Partner')) AS open_opportunities,
  COALESCE(SUM(o.estimated_value) FILTER (WHERE o.stage NOT IN ('Chiusura','Cliente','Partner')),0) AS pipeline_value,
  COALESCE(SUM(o.estimated_value*o.close_probability) FILTER (WHERE o.stage NOT IN ('Chiusura','Cliente','Partner')),0) AS weighted_pipeline,
  COUNT(t.id) FILTER (WHERE t.status='pending' AND t.due_date < CURRENT_DATE) AS overdue_tasks,
  COUNT(t.id) FILTER (WHERE t.status='pending' AND t.due_date = CURRENT_DATE) AS due_today,
  COUNT(a.id) FILTER (WHERE DATE(a.scheduled_at)=CURRENT_DATE) AS appointments_today,
  COUNT(w.id) FILTER (WHERE w.scheduled_at BETWEEN NOW() AND NOW()+INTERVAL'7 days') AS upcoming_webinars
FROM auth.users u
LEFT JOIN contacts c ON c.user_id=u.id AND c.archived_at IS NULL
LEFT JOIN opportunities o ON o.contact_id=c.id
LEFT JOIN tasks t ON t.user_id=u.id
LEFT JOIN appointments a ON a.user_id=u.id
LEFT JOIN webinars w ON w.created_by=u.id
GROUP BY u.id;

-- Priorità del giorno
CREATE OR REPLACE FUNCTION get_today_priorities(p_user_id uuid)
RETURNS TABLE(priority_type text, contact_id uuid, contact_name text, reason text, score int, suggested_action text, preferred_channel text)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 'task_due'::text, t.contact_id,
    (c.first_name||' '||c.last_name)::text,
    ('Task: '||t.title)::text,
    CASE t.priority WHEN 'high' THEN 90 WHEN 'medium' THEN 60 ELSE 30 END,
    ('Completa: '||t.title)::text,
    COALESCE(c.whatsapp,c.email,c.phone,'email')::text
  FROM tasks t JOIN contacts c ON c.id=t.contact_id
  WHERE t.user_id=p_user_id AND t.status='pending' AND t.due_date<=CURRENT_DATE AND c.archived_at IS NULL

  UNION ALL

  SELECT 'hot_followup'::text, c.id,
    (c.first_name||' '||c.last_name)::text,
    ('Non contattato da '||EXTRACT(DAY FROM NOW()-c.last_contact_at)::int||' giorni (interesse: '||c.interest_level||'/10)')::text,
    (c.interest_level*8+(10-LEAST(EXTRACT(DAY FROM NOW()-c.last_contact_at)::int,10)))::int,
    'Follow-up personalizzato'::text,
    COALESCE(c.whatsapp,c.telegram,c.email,'email')::text
  FROM contacts c
  WHERE c.user_id=p_user_id AND c.interest_level>=6
    AND c.last_contact_at BETWEEN NOW()-INTERVAL'14 days' AND NOW()-INTERVAL'3 days'
    AND c.status NOT IN ('Archiviato','Inattivo')

  UNION ALL

  SELECT 'proposal_followup'::text, o.contact_id,
    (c.first_name||' '||c.last_name)::text,
    ('Proposta attiva da '||EXTRACT(DAY FROM NOW()-o.updated_at)::int||' giorni')::text,
    85,
    'Segui la proposta'::text,
    COALESCE(c.email,c.phone,'email')::text
  FROM opportunities o JOIN contacts c ON c.id=o.contact_id
  WHERE c.user_id=p_user_id AND o.stage IN ('Proposta','Trattativa')
    AND o.updated_at < NOW()-INTERVAL'2 days'

  ORDER BY score DESC LIMIT 20;
END;$$;

-- Relationship score
CREATE OR REPLACE FUNCTION calculate_relationship_score(p_contact_id uuid)
RETURNS TABLE(score int, frequency_score int, trust_score int, engagement_score int, recency_penalty int, breakdown jsonb)
LANGUAGE plpgsql AS $$
DECLARE
  v_contact contacts%ROWTYPE;
  v_conv_count int; v_webinars int; v_days int;
  v_freq int; v_trust int; v_engage int; v_recency int;
BEGIN
  SELECT * INTO v_contact FROM contacts WHERE id=p_contact_id;
  SELECT COUNT(*) INTO v_conv_count FROM conversations WHERE contact_id=p_contact_id AND occurred_at>NOW()-INTERVAL'90 days';
  SELECT COUNT(*) INTO v_webinars FROM webinar_attendees WHERE contact_id=p_contact_id AND status='attended';
  v_days := EXTRACT(DAY FROM NOW()-v_contact.last_contact_at)::int;
  v_freq := LEAST(25, v_conv_count*4);
  v_trust := COALESCE(v_contact.trust_level,5)*2;
  v_engage := LEAST(25, v_webinars*5+COALESCE(v_contact.interest_level,5));
  v_recency := GREATEST(0, 30-GREATEST(0,v_days-14)*2);
  RETURN QUERY SELECT
    v_freq+v_trust+v_engage+v_recency,
    v_freq, v_trust, v_engage,
    GREATEST(0,v_days-14)*2,
    jsonb_build_object('conversations_90d',v_conv_count,'webinars_attended',v_webinars,'days_since_last',v_days,'trust_level',v_contact.trust_level,'interest_level',v_contact.interest_level);
END;$$;

-- Semantic search
CREATE OR REPLACE FUNCTION search_summaries_by_similarity(
  query_embedding vector(1536), user_id_filter uuid,
  contact_id_filter uuid DEFAULT NULL, similarity_threshold float DEFAULT 0.65, match_count int DEFAULT 10)
RETURNS TABLE(contact_id uuid, contact_name text, conversation_id uuid, occurred_at timestamptz, summary text, similarity float)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT s.contact_id, (c.first_name||' '||c.last_name)::text,
    s.conversation_id, conv.occurred_at, s.summary,
    1-(s.embedding<=>query_embedding) AS similarity
  FROM ai_summaries s
  JOIN conversations conv ON conv.id=s.conversation_id
  JOIN contacts c ON c.id=s.contact_id
  WHERE c.user_id=user_id_filter
    AND (contact_id_filter IS NULL OR s.contact_id=contact_id_filter)
    AND s.embedding IS NOT NULL
    AND 1-(s.embedding<=>query_embedding)>similarity_threshold
  ORDER BY s.embedding<=>query_embedding
  LIMIT match_count;
END;$$;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER tr_contacts_updated BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_opportunities_updated BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
