# CRM AI Relazionale — Deploy e Collaudo V1

**Autore:** Manus AI  
**Stato:** pacchetto V1 compilabile  
**Ultima verifica tecnica:** `npm run type-check` e `npm run build` completati con esito positivo.

## 1. Cosa contiene questa consegna

Questa consegna trasforma il materiale iniziale in una base applicativa **Next.js + Supabase** realmente compilabile. Il progetto ora include una dashboard navigabile, pagine core, API essenziali, schema database documentato, prompt dei 10 agenti AI e un workflow n8n importabile.

| Area | Stato consegnato | Note operative |
|---|---|---|
| **Frontend Next.js** | Compilabile | Dashboard, contatti, conversazioni, upload, pipeline, task, webinar, calendario, AI chat e insight |
| **Database Supabase** | Consolidato | Migrazioni core più estensioni operative e funzione seed demo |
| **Backend/API** | Compilabile | Contatti, contatto singolo, task, AI chat, priorità, analisi conversazioni, webhook ingest |
| **AI Agents** | Documentati e in codice | 10 agenti definiti in `lib/agents-prompts.ts` e spiegati in `docs/AI_AGENTS_AND_AUTOMATIONS.md` |
| **n8n** | Workflow JSON pronto | File importabile in `n8n/workflows/crm_ai_ingest_v1.json` |
| **Documentazione** | Presente | Blueprint, database, automazioni, manifest e guida deploy |

## 2. Variabili ambiente

Creare un file `.env.local` partendo dalle variabili seguenti. In sviluppo locale si possono iniziare solo Supabase e service role; AI e webhook possono essere aggiunti progressivamente.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_key_optional
OPENAI_API_KEY=your_openai_key_optional
WEBHOOK_INGEST_SECRET=choose_a_long_random_secret
```

## 3. Installazione locale

```bash
npm install
npm run type-check
npm run build
npm run dev
```

La build è già stata verificata nel workspace di lavoro. Se l’ambiente reale usa versioni diverse di Node o Next.js, la prima verifica da eseguire resta `npm run type-check`, seguita da `npm run build`.

## 4. Setup Supabase

Applicare le migrazioni in ordine. Le prime migrazioni sono lo schema core già presente nel progetto; le ultime due sono state aggiunte per completare la parte operativa e demo.

| Ordine | File | Scopo |
|---:|---|---|
| 1 | `supabase/migrations/001_schema.sql` | Tabelle core CRM, contatti, conversazioni, opportunità, task, RAG |
| 2 | `supabase/migrations/002_functions.sql` | Funzioni SQL operative e viste/logiche di supporto |
| 3 | `supabase/migrations/003_rls.sql` | Row Level Security e policy di accesso |
| 4 | `supabase/migrations/004_operational_extensions.sql` | Estensioni operative V1+ per automazioni, audit e configurazioni |
| 5 | `supabase/migrations/005_demo_seed_function.sql` | Funzione seed demo riutilizzabile |

## 5. Collaudo minimo consigliato

Il collaudo deve partire da un utente demo e da pochi dati realistici, evitando di importare subito dati personali o storici estesi. Questo consente di verificare UI, permessi, AI e automazioni in modo controllato.

| Test | Azione | Esito atteso |
|---|---|---|
| Login | Accedere a `/auth/login` | Sessione Supabase attiva |
| Dashboard | Aprire `/dashboard` | KPI e pannelli caricati senza errori |
| Contatti | Aprire `/dashboard/contacts` | Lista contatti visibile o stato vuoto gestito |
| Dettaglio contatto | Aprire `/dashboard/contacts/[id]` | Scheda relazionale caricata |
| Upload conversazione | Aprire `/dashboard/conversations/upload` | Form caricamento disponibile |
| API task | Chiamare `/api/tasks` da utente autenticato | JSON con task o lista vuota |
| AI priorità | Chiamare `/api/ai/priorities` | Priorità generate dalla funzione SQL |
| Webhook n8n | POST a `/api/webhooks/ingest` con secret | Evento registrato in `automation_events` |
| Build | Eseguire `npm run build` | Compilazione completata |

## 6. Import workflow n8n

Importare il file `n8n/workflows/crm_ai_ingest_v1.json` in n8n e impostare le variabili ambiente seguenti nell’istanza n8n.

```bash
CRM_BASE_URL=https://tuo-dominio.app
CRM_WEBHOOK_SECRET=stesso_valore_di_WEBHOOK_INGEST_SECRET
```

Il workflow accetta payload generici da canali esterni. Il formato minimo consigliato è:

```json
{
  "user_id": "uuid-utente-supabase",
  "contact_id": "uuid-contatto-opzionale",
  "source": "whatsapp",
  "channel": "whatsapp",
  "event_type": "conversation_received",
  "conversation_text": "Testo della conversazione da analizzare"
}
```

## 7. Priorità successive

La V1 è ora pronta per essere collegata a un progetto Supabase reale. Le estensioni successive dovrebbero seguire questo ordine: prima credenziali reali e seed demo, poi analisi AI reale su conversazioni, poi n8n con un solo canale, infine RAG avanzato e orchestrazione dei 10 agenti.

| Priorità | Modulo successivo | Motivo |
|---:|---|---|
| 1 | Supabase reale + seed demo | Serve per testare dati e RLS |
| 2 | Analisi AI reale | È il punto di valore principale del CRM |
| 3 | n8n con un canale | Permette automazione controllata senza complessità eccessiva |
| 4 | Import WhatsApp/Gmail/Zoom | Da fare dopo stabilizzazione endpoint |
| 5 | RAG con storico conversazioni | Utile quando il volume dati giustifica ricerca semantica |
| 6 | Multi-agente completo | Da attivare quando i flussi base sono validati |
