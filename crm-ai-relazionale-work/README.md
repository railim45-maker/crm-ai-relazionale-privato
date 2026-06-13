# CRM AI Relazionale

Una piattaforma CRM di nuova generazione con intelligenza artificiale integrata per la gestione e valorizzazione delle relazioni commerciali.

## Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **AI**: Claude API (Anthropic) + Whisper (OpenAI)
- **Vector Search**: pgvector (RAG su conversazioni)
- **Automazioni**: n8n

## Setup rapido

### 1. Prerequisiti

- Node.js 18+
- Account Supabase
- API Key Anthropic (Claude)
- API Key OpenAI (Whisper)

### 2. Installazione

```bash
npm install
```

### 3. Variabili d'ambiente

Copia `.env.example` in `.env.local` e compila:

```bash
cp .env.example .env.local
```

Valori da configurare:
- `NEXT_PUBLIC_SUPABASE_URL` — dalla console Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — dalla console Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — dalla console Supabase (Settings > API)
- `ANTHROPIC_API_KEY` — da console.anthropic.com
- `OPENAI_API_KEY` — da platform.openai.com

### 4. Database

```bash
# Installa Supabase CLI
npm install -g supabase

# Collega il progetto
supabase link --project-ref YOUR_PROJECT_REF

# Applica le migrazioni in ordine
supabase db push
```

Oppure esegui manualmente nell'SQL editor di Supabase:
1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_functions.sql`
3. `supabase/migrations/003_rls.sql`

### 5. Avvio

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Funzionalità principali

### Gestione Contatti
- Scheda contatto dinamica con timeline relazionale
- Relationship Score automatico (0-100)
- Mappa degli interessi per area tematica
- Storia completa delle conversazioni

### Analisi AI delle Conversazioni
- Upload di testo, audio (trascrizione Whisper) o file .txt
- Estrazione automatica di: bisogni, opportunità, obiezioni, interessi
- Aggiornamento automatico del profilo contatto
- Creazione automatica di task di follow-up

### Agente AI Centrale
- Chat in linguaggio naturale con tutti i dati del CRM
- "Chi devo contattare oggi?", "Quali lead sono caldi?", ecc.
- Ricerca semantica RAG su tutte le conversazioni

### Pipeline Commerciale
- Vista Kanban con 10 stadi
- Score lead automatico
- Forecast ricavi

### Automazioni n8n
- Ingestion automatica da WhatsApp
- Notifiche priorità giornaliere
- Follow-up post-webinar

## Agenti AI specializzati

Il sistema include 10 agenti AI con prompt dedicati in `lib/agents-prompts.ts`:

1. **Agente Centrale** — orchestratore, risponde in linguaggio naturale
2. **Knowledge Extraction** — estrae dati strutturati da conversazioni
3. **Contact Intelligence** — analisi profonda singolo contatto
4. **Sales Agent** — scoring lead e forecast
5. **Follow-Up Agent** — messaggi personalizzati per canale
6. **Webinar Agent** — matching e sequenze post-evento
7. **Relationship Agent** — salute relazionale e nurturing
8. **Calendar Agent** — agenda e briefing pre-appuntamento
9. **Partnership Agent** — identificazione partner/ambassador
10. **Opportunity Agent** — opportunità latenti e lookalike

## Struttura del progetto

```
app/                    Next.js App Router
├── auth/              Autenticazione
├── dashboard/         Pagine principali CRM
└── api/               API Routes

components/            Componenti React
lib/                   Utilities, Supabase client, RAG pipeline
supabase/migrations/   Schema SQL e funzioni PostgreSQL
n8n/workflows/         Workflow automazioni
types/                 TypeScript types
```

## GDPR

- Row Level Security abilitata su tutte le tabelle
- Ogni utente accede solo ai propri dati
- Nessun dato condiviso tra utenti diversi
- Archiviazione EU tramite Supabase (regione Frankfurt)

## Roadmap MVP

**Fase 1 (settimane 1-2)**: Auth + Contatti + Upload conversazioni AI
**Fase 2 (settimane 3-4)**: Pipeline + Task + Dashboard metriche
**Fase 3 (settimane 5-6)**: Agente AI chat + Webinar + Calendar
**Fase 4 (settimane 7-8)**: n8n automazioni + WhatsApp + Notifiche
**Fase 5 (settimane 9-10)**: Test, ottimizzazioni, deploy produzione
