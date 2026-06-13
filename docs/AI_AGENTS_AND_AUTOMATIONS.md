# CRM AI Relazionale — Agenti AI e Automazioni Operative

**Autore:** Manus AI  
**Stato:** V1 funzionante / V1+ estendibile  
**Repository di lavoro:** `/home/ubuntu/crm-ai-relazionale-work`

## 1. Obiettivo del deliverable

Questo documento consolida la parte **AI & Automazioni** del CRM AI Relazionale partendo dal codice già presente nello ZIP e dagli interventi minimi effettuati per rendere il progetto compilabile. La logica adottata è conservativa: non si introducono integrazioni complesse finché la V1 non è stabile, ma si prepara una struttura coerente per collegare agenti, database, API e workflow n8n.

> La V1 deve coprire un flusso verticale completo: ricezione o caricamento di una conversazione, analisi AI, aggiornamento del profilo contatto, generazione di opportunità e creazione di task di follow-up.

## 2. Matrice degli agenti AI

Il progetto contiene già il file `lib/agents-prompts.ts`, che definisce **10 agenti specializzati**. La tabella seguente chiarisce quali agenti sono immediatamente utilizzabili nella V1 e quali vanno attivati nella V1+ quando saranno disponibili più dati storici, integrazioni e automazioni.

| Agente | Ruolo operativo | Priorità | Uso nella V1 |
|---|---|---:|---|
| **Agente Centrale CRM** | Risponde in linguaggio naturale e coordina contatti, task, opportunità e webinar | Alta | Attivo come interfaccia conversazionale principale |
| **Knowledge Extraction Agent** | Estrae dati strutturati da chat, email, note e trascrizioni | Alta | Attivo per analisi conversazioni e creazione task |
| **Contact Intelligence Agent** | Costruisce profili relazionali profondi per singolo contatto | Alta | Attivo su scheda contatto e insight individuali |
| **Sales Agent** | Ordina lead caldi, opportunità bloccate e forecast commerciale | Media | Attivabile su pipeline quando ci sono dati sufficienti |
| **Follow-Up Agent** | Genera promemoria e messaggi personalizzati per canale | Alta | Attivo per task e suggerimenti del giorno |
| **Webinar Agent** | Suggerisce inviti, follow-up post-webinar e opportunità evento | Media | Attivabile appena si usa il modulo webinar |
| **Relationship Agent** | Monitora salute relazionale, stagnazione e nurturing | Media | V1+ dopo accumulo storico relazionale |
| **Calendar Agent** | Prepara briefing appuntamenti e suggerisce slot/azioni | Media | V1+ con integrazione calendario reale |
| **Partnership Agent** | Identifica partner, ambassador e referral | Bassa | V1+ dopo segmentazione contatti e storico clienti |
| **Opportunity Agent** | Trova opportunità latenti e lookalike commerciali | Media | V1+ dopo prime conversioni e topic storici |

## 3. Implementazione minima consigliata

Nella prima versione non è necessario orchestrare tutti gli agenti in parallelo. La scelta più efficiente è usare tre agenti reali e mantenere gli altri come prompt pronti, richiamabili successivamente.

| Flusso | Agente principale | Endpoint/API collegata | Output atteso |
|---|---|---|---|
| Chat CRM | Agente Centrale CRM | `/api/ai/chat` | Risposte operative su contatti, task, pipeline e priorità |
| Analisi conversazione | Knowledge Extraction Agent | `/api/conversations/analyze` | JSON con contatto, bisogni, opportunità, task e summary |
| Priorità del giorno | Follow-Up Agent + query SQL | `/api/ai/priorities` | Lista di lead e follow-up da gestire oggi |
| CRUD contatti | Contact Intelligence Agent in lettura | `/api/contacts`, `/api/contacts/[id]` | Scheda contatto aggiornata e interrogabile |
| Task automatici | Follow-Up Agent | `/api/tasks` | Task creati o aggiornati in base all’analisi |
| Automazioni esterne | Agente Centrale + n8n | `/api/webhooks/ingest` | Eventi salvati in `automation_events` |

## 4. Contratto dati per l’analisi conversazione

La V1 deve trattare ogni conversazione come una fonte di memoria relazionale. Il formato minimo da produrre dall’AI è un JSON stabile, validabile e riutilizzabile dal backend. Questo contratto è già coerente con il prompt del **Knowledge Extraction Agent**.

```json
{
  "contact": {
    "first_name": "Mario",
    "last_name": "Rossi",
    "company": "Esempio SRL",
    "role": "Titolare",
    "email": "mario@example.com",
    "phone": "+39...",
    "city": "Roma"
  },
  "needs": [
    {
      "type": "explicit",
      "description": "Vuole automatizzare il follow-up commerciale",
      "urgency": "high"
    }
  ],
  "interests": {
    "ai_automazioni": 9,
    "tokenizzazione": 3,
    "energia": 1
  },
  "opportunities": [
    {
      "service": "CRM AI / Automazioni",
      "probability": 0.78,
      "reasoning": "Ha espresso esigenza diretta e urgenza operativa",
      "materials_to_send": ["demo CRM", "case study automazioni"],
      "webinar_to_propose": "AI Automazioni per professionisti"
    }
  ],
  "suggested_tasks": [
    {
      "title": "Inviare demo CRM AI a Mario Rossi",
      "type": "send_material",
      "due_days": 1,
      "priority": "high"
    }
  ],
  "summary": "Mario Rossi è interessato ad automatizzare follow-up e gestione lead. Serve inviare una demo e proporre una call operativa."
}
```

## 5. Workflow n8n essenziale

Il workflow V1 non deve ancora coprire WhatsApp, Gmail, Zoom e calendario in modo completo. Deve invece standardizzare il flusso base, così ogni canale futuro userà lo stesso contratto dati.

| Step | Nodo logico | Funzione | Stato V1 |
|---|---|---|---|
| 1 | Trigger Webhook n8n | Riceve testo, canale, contatto opzionale e user_id | Pronto |
| 2 | Normalizzazione payload | Converte input esterno nel formato interno | Pronto |
| 3 | Invio al CRM | Chiama `/api/webhooks/ingest` per registrare evento | Pronto |
| 4 | Analisi AI | Chiama `/api/conversations/analyze` quando l’input è una conversazione | Collegabile |
| 5 | Aggiornamento CRM | Usa risposta AI per aggiornare contatto/task/opportunità | Collegabile |
| 6 | Notifica operatore | Restituisce summary e prossima azione | Collegabile |

## 6. Variabili ambiente necessarie

La V1 può funzionare in modalità progressiva. Senza chiavi AI o webhook esterni, il frontend e le API CRUD rimangono utilizzabili; con le variabili complete, si abilita l’intero flusso intelligente.

| Variabile | Obbligatoria | Uso |
|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sì | Connessione Supabase lato client/server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sì | Sessioni utente e RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Sì per API server | Operazioni server-side protette |
| `ANTHROPIC_API_KEY` | No, ma consigliata | Analisi e chat AI se si usa Claude |
| `OPENAI_API_KEY` | No, ma consigliata | Whisper o modelli OpenAI compatibili |
| `WEBHOOK_INGEST_SECRET` | Sì per n8n pubblico | Protezione endpoint `/api/webhooks/ingest` |

## 7. Sequenza di attivazione raccomandata

Per ottimizzare tempi e risorse, la sequenza migliore non è implementare tutti i canali subito. Prima si stabilizza il nucleo, poi si aggiungono i canali.

| Ordine | Attivazione | Motivazione |
|---:|---|---|
| 1 | Contatti, task e pipeline base | Sono necessari per vedere valore immediato |
| 2 | Upload/incolla conversazioni | Permette di usare materiale già disponibile senza integrazioni esterne |
| 3 | Analisi AI strutturata | Trasforma conversazioni in memoria CRM |
| 4 | n8n webhook generico | Prepara l’ingresso multicanale senza dipendere da un provider |
| 5 | WhatsApp/Gmail/Zoom | Da collegare quando il nucleo è stabile |
| 6 | RAG con pgvector | Utile quando lo storico conversazioni diventa ampio |
| 7 | Orchestrazione completa 10 agenti | Da attivare dopo validazione della V1 |

## 8. Stato operativo dopo questa fase

Dopo questa fase il progetto dispone di una base AI/automazioni coerente: i prompt agenti sono già in codice, le API essenziali sono presenti, il webhook di ingestione è pronto e la build Next.js è stata verificata. La V1 non è più solo un wireframe: è una base applicativa compilabile, con una traiettoria chiara verso integrazioni reali.
