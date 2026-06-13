# Database Supabase/PostgreSQL — Schema Operativo CRM AI Relazionale

**Autore:** Manus AI  
**Data:** 06 giugno 2026  
**Formato:** migrazioni Supabase progressive, compatibili con una V1 funzionante e una V1+ estendibile.

## 1. Obiettivo dello schema

Lo schema è stato organizzato per supportare sia il **flusso MVP immediato** sia le estensioni successive senza dover rifare la base dati. Le migrazioni `001`, `002` e `003` costituiscono il nucleo applicativo già presente nello ZIP; le migrazioni `004` e `005` aggiungono moduli operativi, audit, automazioni, agenti AI configurabili e dati demo. PostgreSQL consente di modellare relazioni forti, vincoli e indici in modo nativo, mentre Supabase aggiunge autenticazione, policy RLS e funzioni RPC integrate nel flusso applicativo.[1] [2]

## 2. Migrazioni disponibili

| File | Ruolo | Stato |
|---|---|---|
| `001_schema.sql` | Crea estensioni, tabelle core, topic, servizi, opportunità, conversazioni, task e indici principali. | Presente e riutilizzato. |
| `002_functions.sql` | Crea vista dashboard, funzione priorità giornaliere, score relazione e ricerca semantica. | Presente e riutilizzato. |
| `003_rls.sql` | Abilita Row Level Security sulle tabelle operative e policy ownership. | Presente e riutilizzato. |
| `004_operational_extensions.sql` | Aggiunge consensi GDPR, allegati, canali, import job, agenti AI, run AI, automazioni, webhook, notifiche, template e audit log. | Aggiunta in questa sessione. |
| `005_demo_seed_function.sql` | Aggiunge funzione `seed_demo_data(p_user_id)` per popolare una demo coerente. | Aggiunta in questa sessione. |

## 3. Copertura tabelle

Con le estensioni operative, lo schema supera le 25 tabelle richieste e resta diviso tra core CRM, AI, automazioni, privacy e audit.

| Categoria | Tabelle principali |
|---|---|
| **Identità e profili** | `user_profiles`, `companies`, `contacts` |
| **Conversazioni e conoscenza** | `conversations`, `ai_summaries`, `notes`, `documents`, `attachments` |
| **Interessi e offerta** | `topics`, `contact_topics`, `services` |
| **Vendita e relazione** | `opportunities`, `tasks`, `appointments`, `webinars`, `webinar_attendees` |
| **Partnership** | `partnerships`, `referrals` |
| **AI operativa** | `ai_agents`, `ai_agent_runs` |
| **Automazioni e integrazioni** | `channel_accounts`, `import_jobs`, `automation_events`, `webhook_endpoints` |
| **Governance** | `contact_consents`, `notifications`, `message_templates`, `audit_logs` |

## 4. Funzioni e viste operative

La vista `v_dashboard` produce i KPI principali della schermata iniziale. La funzione `get_today_priorities(p_user_id)` alimenta i suggerimenti giornalieri e la funzione `calculate_relationship_score(p_contact_id)` fornisce un punteggio sintetico della relazione. La funzione `search_summaries_by_similarity` utilizza embeddings `vector(1536)` per interrogazioni semantiche su riassunti e conversazioni, coerentemente con il modello di ricerca vettoriale fornito da pgvector.[3]

| Oggetto SQL | Utilizzo applicativo |
|---|---|
| `v_dashboard` | KPI dashboard: lead, prospect, clienti, pipeline, task e webinar. |
| `get_today_priorities` | Follow-up prioritari, lead caldi e proposte da seguire. |
| `calculate_relationship_score` | Valutazione relazione basata su frequenza, fiducia, engagement e recency. |
| `search_summaries_by_similarity` | Base RAG per chat AI e memoria relazionale. |
| `seed_demo_data` | Demo rapida con contatti, opportunità, task, conversazioni e webinar. |

## 5. Sicurezza e RLS

Le policy RLS presenti adottano il principio “owner-only”: l’utente autenticato può accedere solo ai record collegati al proprio `auth.uid()`. Le tabelle globali come `topics` e `services` sono leggibili da tutti gli utenti autenticati o pubblici secondo policy dedicate, perché rappresentano cataloghi di riferimento. Supabase raccomanda Row Level Security per controllare l’accesso direttamente a livello di database, riducendo il rischio di esposizione accidentale tramite API.[2]

> La RLS non sostituisce audit, consenso e minimizzazione dati. Per questo sono state aggiunte tabelle dedicate a **consensi**, **audit log**, **allegati** e **run AI**, utili per tracciabilità e governance.

## 6. Ordine di applicazione consigliato

| Step | Comando/azione | Risultato |
|---|---|---|
| 1 | Creare progetto Supabase. | Database e Auth disponibili. |
| 2 | Applicare migrazioni `001` → `005`. | Schema completo installato. |
| 3 | Configurare `.env.local`. | App Next.js collegata a Supabase. |
| 4 | Creare utente demo da Supabase Auth. | Utente autenticabile. |
| 5 | Eseguire `SELECT seed_demo_data('<USER_UUID>');`. | Dashboard popolata con dati dimostrativi. |

## 7. Raccomandazioni operative

La V1 può usare solo le tabelle core e ignorare temporaneamente le estensioni V1+. Le nuove tabelle non rompono il frontend, ma preparano l’ambiente per integrazioni successive con n8n, agenti specializzati, webhook e governance. In produzione conviene aggiungere backup automatici, gestione retention dei file e policy di cancellazione/anonimizzazione per contatti archiviati.

## References

[1]: https://www.postgresql.org/docs/current/ddl-constraints.html "PostgreSQL Documentation — Constraints"  
[2]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Documentation — Row Level Security"  
[3]: https://github.com/pgvector/pgvector "pgvector — Vector similarity search for Postgres"  
[4]: https://supabase.com/docs/guides/database/functions "Supabase Documentation — Database Functions"
