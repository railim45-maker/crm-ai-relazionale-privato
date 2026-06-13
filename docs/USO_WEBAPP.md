# Uso immediato della web app CRM AI Relazionale

La web app è stata resa utilizzabile subito tramite una modalità **demo self-contained**, accessibile senza Supabase, senza chiavi AI e senza n8n. Questa modalità serve per provare il flusso operativo principale e validare l'esperienza utente prima di collegare i servizi reali.

## Link temporaneo attivo

Durante questa sessione la web app è stata avviata in modalità produzione ed esposta al seguente indirizzo temporaneo:

[Apri CRM AI Relazionale](https://3000-iffe2nigym2xork8onkw0-66ed7856.us2.manus.computer)

Il link è temporaneo e resta disponibile finché il server della sessione rimane attivo. Per un utilizzo continuativo occorre fare deploy su Vercel, VPS, Supabase hosting integrato con frontend esterno o altro ambiente Next.js compatibile.

## Come provarla subito

Aprendo la homepage, seleziona **Apri demo funzionante**. La demo include una sidebar con le sezioni principali della V1.

| Sezione | Cosa puoi provare subito |
|---|---|
| **Dashboard** | KPI, follow-up prioritari, pipeline commerciale e suggerimento AI del giorno. |
| **Contatti** | Lista contatti demo con azienda, stato relazione, score e prossima azione. |
| **Pipeline** | Vista sintetica delle opportunità commerciali e dei lead caldi. |
| **Carica input** | Simulazione del flusso conversazione → analisi AI → prossima azione. |
| **Agente AI** | Domande rapide e risposte operative basate sui dati demo. |
| **Login reale** | Accesso alla modalità Supabase, da usare quando saranno configurate le credenziali reali. |

## Differenza tra demo e modalità reale

La demo è intenzionalmente locale: i dati non vengono salvati su database e le risposte AI sono simulate per dimostrare il comportamento dell'app. La modalità reale, invece, usa le route API, Supabase, le migrazioni SQL, i prompt agenti e il workflow n8n già inclusi nel pacchetto.

| Aspetto | Demo attuale | Modalità reale |
|---|---|---|
| Database | Dati locali in pagina | Supabase PostgreSQL con RLS |
| AI | Risposte simulate | API AI tramite endpoint `/api/ai/*` |
| Conversazioni | Analisi dimostrativa | Salvataggio, analisi e task reali |
| Automazioni | Workflow documentato/importabile | n8n collegato via webhook |
| Autenticazione | Non richiesta | Supabase Auth |

## Avvio locale dal pacchetto

Dopo aver estratto lo ZIP aggiornato, esegui:

```bash
npm install
npm run type-check
npm run build
npm run start
```

Poi apri `http://localhost:3000` e clicca **Apri demo funzionante**.

## Configurazione dei servizi reali

Per passare dalla demo alla modalità reale, imposta in `.env.local` le variabili Supabase e AI richieste dal progetto. Le migrazioni database sono nella cartella `supabase/migrations`, mentre il workflow n8n importabile si trova in `n8n/workflows/crm_ai_ingest_v1.json`.

## Stato di collaudo

Il progetto è stato verificato con:

```bash
npm run type-check
npm run build
```

Entrambi i controlli risultano completati con esito positivo. La homepage, la dashboard demo, la sezione input conversazioni e l'agente AI sono stati aperti e provati nel browser.
