# File da implementare per CRM consulenziale con fonti, conteggi, closer e AI opzionale

Questo documento accompagna i file già creati nella cartella del progetto. L’obiettivo è trasformare la demo locale in una base **realmente implementabile** anche nel backend: ricerca guidata, conteggi da fonti pubbliche, studio su misura, messaggi stile closer e AI gratuita/configurabile.

## File consegnati o modificati

| File | Azione | Scopo |
|---|---:|---|
| `lib/consulting-intelligence.ts` | Nuovo | Modulo centrale con fonti pubbliche, conteggi, simulazioni prudenziali, ricerca guidata, studio su misura, messaggi closer e fallback AI rule-based gratuito. |
| `app/api/ai/consulting/route.ts` | Nuovo | Endpoint utilizzabile dalla UI per ottenere riferimenti, ricerca, studio e messaggi senza dipendere da provider AI a pagamento. |
| `app/api/ai/chat/route.ts` | Sostituito | L’agente ora usa prima provider configurati, poi fallback gratuito locale/rule-based. Supporta anche provider OpenAI-compatible locali tramite variabili ambiente. |
| `app/api/contacts/[id]/route.ts` | Modificato | Il `PATCH` ora accetta e salva i nuovi campi di ricerca guidata, energia, tokenizzazione, studio e closer. |
| `supabase/migrations/006_consulting_research_study_fields.sql` | Nuovo | Migrazione idempotente per aggiungere al database reale i campi mancanti. |
| `docs/FONTI_PUBBLICHE_CONTEGGI_CRM.md` | Aggiornato in fase di ricerca | Registro delle fonti pubbliche controllate e delle cautele da mantenere. |

## Variabili AI gratuite o configurabili

Il CRM funziona anche senza chiavi esterne grazie al fallback `free-rule-based`. Se vuoi collegare un motore locale gratuito, ad esempio Ollama o LM Studio, imposta:

```bash
LOCAL_AI_BASE_URL=http://localhost:11434/v1
LOCAL_AI_MODEL=llama3.1
LOCAL_AI_API_KEY=local
```

In alternativa puoi usare un provider OpenAI-compatible:

```bash
OPENAI_COMPATIBLE_BASE_URL=https://provider.example.com/v1
OPENAI_COMPATIBLE_MODEL=nome-modello
OPENAI_COMPATIBLE_API_KEY=chiave
```

Se è presente `ANTHROPIC_API_KEY`, la route chat può usare Anthropic. Se non è presente, non fallisce: risponde con il motore gratuito rule-based.

## Conteggi e fonti pubbliche

Il modulo `PUBLIC_REFERENCES` non inventa conteggi commerciali. Mantiene un registro prudente delle fonti controllate e separa i dati verificati dalle ipotesi operative.

| Fonte | Uso nel CRM | Regola prudenziale |
|---|---|---|
| uBroker | Percorso energia alternativo o comparativo | Non promettere risparmi; verificare condizioni aggiornate. |
| PEF Power | Analisi energia e assistenza/offerte da validare | Usare costo annuo energia e percentuale stimata inserita dall’utente. |
| Blotix | Valorizzazione/tokenizzazione simulata | Il 2,5% è solo parametro di simulazione modificabile, non rendimento garantito. |
| Strategie closer | Sequenza comunicativa in 6 passaggi | Generare bozze e domande, non inviare automaticamente. |
| AI locale/opzionale | Supporto a testi e priorità | Il CRM deve funzionare anche gratis senza inviare dati fuori. |

## Passi di implementazione

1. Copiare i nuovi file nella stessa struttura del progetto.
2. Eseguire la migrazione `006_consulting_research_study_fields.sql` su Supabase.
3. Riavviare Next.js.
4. Testare `npm run type-check`.
5. Collegare gradualmente la UI reale alle route `/api/ai/consulting` e `/api/ai/chat`.

## Verifica già effettuata

È stato eseguito `npm run type-check` e il controllo TypeScript è terminato senza errori.
