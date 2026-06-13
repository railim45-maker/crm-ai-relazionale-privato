# Blueprint MVP Funzionante — CRM AI Relazionale

**Autore:** Manus AI  
**Data:** 06 giugno 2026  
**Stato tecnico corrente:** progetto Next.js/Supabase estratto dallo ZIP, corretto nei blocchi TypeScript principali e verificato con `npm run type-check` e `npm run build`.

## 1. Principio operativo

La scelta più efficiente non è ricostruire il CRM da zero, ma trasformare il materiale già fornito in una **V1 verticale funzionante**. Il progetto allegato contiene già una base reale: frontend Next.js, route API, migrazioni Supabase, viste dashboard, RLS, pipeline AI e pagine operative. L’intervento prioritario consiste quindi nel consolidare ciò che esiste, chiudere i collegamenti mancanti e rendere il sistema pronto per una demo tecnica o per il collegamento a servizi reali.

> Un **MVP verticale** copre un flusso completo dall’input al risultato, anche se con un set ridotto di funzionalità. Nel tuo caso il flusso minimo è: contatto → conversazione → analisi AI → aggiornamento CRM → task/follow-up → dashboard.

## 2. Stato reale del progetto dopo l’audit

| Area | Stato attuale verificato | Valutazione operativa |
|---|---|---|
| **Frontend Next.js** | Dashboard, login, contatti, dettaglio contatto, pipeline, task, calendario, webinar, upload conversazioni e chat AI sono presenti. | Base già utilizzabile; restano da completare alcune viste collegate dalla sidebar. |
| **Database Supabase/PostgreSQL** | Sono presenti tre migrazioni: schema principale, funzioni SQL/RPC e Row Level Security. | Buona base MVP; da rafforzare con seed, viste materializzate e hardening GDPR. |
| **API applicative** | Sono presenti route per chat AI, priorità, contatti e analisi conversazioni. | Flusso end-to-end già impostato; va migliorata gestione errori, fallback e logging. |
| **AI e RAG** | È presente una route AI semplice e una pipeline RAG più completa nel codice. | La pipeline avanzata esiste ma non è ancora pienamente collegata alle UI principali. |
| **Build e qualità codice** | Type-check e build produzione ora passano. | La base è tecnicamente compilabile; resta un warning Supabase non bloccante. |

## 3. Funzioni disponibili nella V1 immediata

La V1 immediata può già essere presentata come un CRM AI relazionale navigabile, con dati reali se Supabase viene configurato. Le funzioni principali sono concentrate su gestione relazione, pipeline e input conversazioni.

| Modulo | Funzione disponibile | Note pratiche |
|---|---|---|
| **Autenticazione** | Login con Supabase Auth. | Richiede progetto Supabase e variabili `.env.local`. |
| **Dashboard** | KPI, priorità, suggerimenti e vista sintetica CRM. | Usa viste/RPC SQL presenti nelle migrazioni. |
| **Contatti** | Lista contatti, filtri, ricerca e scheda dettaglio. | Include stato, interessi, fiducia, valore potenziale e timeline. |
| **Pipeline** | Board commerciale per fasi con opportunità e valori. | Attualmente è una vista board, non ancora drag-and-drop. |
| **Task** | Elenco attività e follow-up pendenti. | Collegabile ai suggerimenti generati dall’analisi AI. |
| **Calendario/Webinar** | Viste base per appuntamenti e webinar. | Adatte a demo; richiedono dati seed o dati reali. |
| **Upload conversazioni** | Inserimento testo o file e invio a `/api/conversations/analyze`. | Supporta analisi conversazione e creazione task. |
| **Chat AI centrale** | Domande in linguaggio naturale su task, lead caldi e opportunità. | Usa contesto CRM sintetico da database. |

## 4. Funzioni da implementare successivamente

Le funzioni successive non vanno eliminate: vanno ordinate in modo che ogni sprint aumenti valore senza compromettere la base.

| Priorità | Funzione | Perché dopo |
|---|---|---|
| **Alta** | Collegamento pieno della pipeline RAG alla chat AI centrale. | Il codice esiste, ma va integrato nella route attiva e testato sui dati reali. |
| **Alta** | Seed demo coerente con dashboard e wireframe. | Serve per test e presentazioni senza dipendere da dati reali. |
| **Alta** | Pagine mancanti dalla sidebar: conversazioni e insight. | Evita link vuoti e rende la navigazione completa. |
| **Media** | Kanban drag-and-drop con salvataggio fase. | Richiede mutazioni API e gestione stato client. |
| **Media** | Workflow n8n multicanale. | Richiede URL pubblici, credenziali e webhook reali. |
| **Media** | Whisper completo per audio in produzione. | Richiede chiavi, limiti file, storage e gestione costi API. |
| **Bassa iniziale** | 10 agenti specializzati orchestrati. | Utile dopo validazione dei primi tre agenti core. |
| **Bassa iniziale** | Analytics predittivi avanzati. | Dipende da volume dati sufficiente. |

## 5. Architettura tecnica consigliata

L’architettura più efficiente mantiene Next.js come interfaccia applicativa, Supabase come backend dati/autenticazione/storage, API route come layer di orchestrazione e n8n come sistema di automazioni esterne. Supabase documenta esplicitamente il modello di **Row Level Security** per controllare l’accesso ai dati a livello di tabella, mentre n8n è adatto a workflow basati su trigger e integrazioni esterne.[1] [2]

| Layer | Componente | Responsabilità |
|---|---|---|
| **Frontend** | Next.js App Router, React, Tailwind | Dashboard, viste CRM, upload conversazioni, chat AI. |
| **Auth/Data** | Supabase Auth + PostgreSQL | Utenti, contatti, conversazioni, task, opportunità, RLS. |
| **AI Core** | API route Next.js + Claude/OpenAI | Analisi conversazioni, suggerimenti, chat operativa, embeddings. |
| **RAG** | pgvector + funzioni RPC | Ricerca semantica su riassunti e conversazioni. |
| **Automazioni** | n8n webhook/workflow | Trigger WhatsApp/email/Zoom, follow-up, reminder. |
| **Storage** | Supabase Storage | Audio, documenti, trascrizioni e allegati. |

## 6. Roadmap di implementazione ottimizzata

| Ciclo | Obiettivo | Output verificabile |
|---|---|---|
| **Ciclo 1** | Stabilizzare progetto e navigazione. | Type-check/build OK, pagine mancanti chiuse, README operativo. |
| **Ciclo 2** | Rendere dati demo e database pienamente testabili. | Seed SQL, migrazioni ordinate, dashboard popolata. |
| **Ciclo 3** | Collegare AI core in modo robusto. | Analisi conversazione, task generati, risposta chat CRM. |
| **Ciclo 4** | Aggiungere workflow essenziale n8n. | Un webhook end-to-end: input → analisi → CRM → task. |
| **Ciclo 5** | Preparare deploy e demo. | Checklist variabili, istruzioni Supabase, test funzionali. |

## 7. Decisione tecnica chiave

La priorità è avere una piattaforma che **si avvia, compila, naviga e dimostra il valore del CRM AI**. Solo dopo conviene ampliare il numero di agenti, workflow e integrazioni. Questo riduce il rischio di spendere risorse su moduli avanzati prima che il flusso principale sia validato.

## References

[1]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Docs — Row Level Security"  
[2]: https://docs.n8n.io/workflows/ "n8n Docs — Workflows"  
[3]: https://nextjs.org/docs/app "Next.js Docs — App Router"  
[4]: https://github.com/pgvector/pgvector "pgvector — Open-source vector similarity search for Postgres"
