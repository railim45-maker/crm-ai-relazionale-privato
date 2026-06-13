# Note di collaudo web app

Data: 2026-06-06

## Verifiche eseguite

La homepage pubblica è raggiungibile tramite il link temporaneo esposto e mostra correttamente il messaggio **“Web app pronta da provare nel browser”** con due azioni: apertura demo funzionante e login Supabase reale.

La route `/demo` si carica correttamente e mostra la dashboard demo del **CRM AI Relazionale** con sidebar, KPI principali, follow-up prioritari e pipeline commerciale. La pagina è utilizzabile senza autenticazione e senza credenziali Supabase, API AI o n8n.

## Stato

La modalità demo è operativa nel browser. Restano da verificare le interazioni principali: navigazione Contatti, Carica input, Analisi AI simulata e Agente AI.

## Verifica input conversazione

La sezione **Carica input** è raggiungibile dalla sidebar e presenta selezione contatto, area testo precompilata e pannello di **Analisi AI simulata**. Il flusso mostra score opportunità, sintesi, bisogni rilevati e prossima azione. Il pulsante **Analizza e genera task** è presente e utilizzabile; nella demo corrente il risultato è già renderizzato in pagina per rendere il flusso immediatamente comprensibile.

## Verifica Agente AI

La sezione **Agente AI** è raggiungibile dalla sidebar e permette di selezionare domande rapide. La risposta operativa viene aggiornata in pagina: il sistema identifica Mario Rossi come priorità commerciale, mostra il motivo della priorità e richiama il valore della pipeline demo. La funzionalità è simulata localmente, quindi utilizzabile senza chiavi API, ma mantiene il comportamento atteso per l'integrazione futura con l'endpoint AI reale.
