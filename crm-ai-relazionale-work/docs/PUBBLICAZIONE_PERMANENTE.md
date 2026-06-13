# Pubblicazione permanente del CRM AI Relazionale

Il progetto è stato predisposto per essere pubblicato come **sito web permanente**. La modalità consigliata per partire velocemente è pubblicare la demo su **Vercel**, perché supporta nativamente Next.js, build server-side e route API senza dover gestire un server manuale. La stessa base può poi essere collegata a Supabase, AI reali e n8n quando vorrai attivare la versione persistente completa.

## Strategia consigliata

La pubblicazione permanente va divisa in due livelli. Il primo livello è il **sito demo permanente**, che consente di usare e mostrare la piattaforma senza database e senza credenziali esterne. Il secondo livello è la **piattaforma operativa reale**, che richiede Supabase, variabili ambiente AI e configurazione dei webhook n8n.

| Livello | Stato | Cosa serve | Risultato |
|---|---|---|---|
| **Demo permanente** | Pronta | Account Vercel o Netlify | Sito pubblico sempre raggiungibile con dashboard demo, contatti, pipeline, input e agente AI simulato. |
| **CRM reale con login** | Predisposto | Progetto Supabase, migrazioni SQL, variabili ambiente | Utenti autenticati, database persistente, contatti e conversazioni salvati. |
| **AI reale** | Predisposto | Chiavi Anthropic/OpenAI | Analisi conversazioni, priorità e suggerimenti generati da modelli reali. |
| **Automazioni n8n** | Predisposto | n8n Cloud/self-hosted e webhook | Ingestione canali esterni, aggiornamento CRM e task automatici. |

## Pubblicazione rapida su Vercel

1. Crea o accedi a un account su [Vercel](https://vercel.com).
2. Crea un nuovo progetto importando la cartella del repository o caricando il codice su GitHub.
3. Verifica che Vercel riconosca il framework **Next.js**.
4. Imposta le variabili ambiente minime:

| Variabile | Valore demo consigliato |
|---|---|
| `NEXT_PUBLIC_APP_MODE` | `demo` |
| `NEXT_PUBLIC_APP_URL` | URL assegnato da Vercel o dominio personalizzato |

5. Avvia il deploy. La demo funzionerà subito dalla homepage cliccando **Apri demo funzionante**.

## Variabili per versione reale

Quando vorrai rendere il CRM realmente persistente, aggiungi anche le variabili contenute in `.env.production.example`.

| Area | Variabili |
|---|---|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| AI | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` |
| n8n | `N8N_WEBHOOK_SECRET` |
| App | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_MODE` |

## Deploy con dominio personalizzato

Dopo il primo deploy, puoi collegare un dominio acquistato esternamente oppure usare un sottodominio gratuito fornito da Vercel. Per dominio personalizzato, nella dashboard hosting aggiungi il dominio, poi aggiorna i record DNS indicati dal provider. Una volta propagato il DNS, imposta `NEXT_PUBLIC_APP_URL` con il dominio definitivo e rilancia il deploy.

## Controlli eseguiti

Il progetto è stato verificato prima della pubblicazione con i controlli standard:

```bash
npm run type-check
npm run build
```

La demo è stata inoltre testata nel browser con le sezioni principali: homepage, dashboard demo, caricamento input e agente AI.

## File aggiunti per la pubblicazione permanente

| File | Funzione |
|---|---|
| `vercel.json` | Configurazione esplicita per deploy Next.js su Vercel. |
| `.env.production.example` | Template delle variabili ambiente per demo e produzione reale. |
| `docs/PUBBLICAZIONE_PERMANENTE.md` | Guida operativa alla pubblicazione permanente. |
| `docs/USO_WEBAPP.md` | Guida d'uso immediato della web app. |

## Nota operativa

Posso completare direttamente il deploy permanente se accedi al tuo account Vercel/GitHub nel browser o se mi fornisci un repository su cui pubblicare il codice. Senza accesso a un account hosting esterno, posso preparare il progetto e il pacchetto deployabile, ma non posso trasformare il link temporaneo della sessione in un dominio stabile autonomamente.
