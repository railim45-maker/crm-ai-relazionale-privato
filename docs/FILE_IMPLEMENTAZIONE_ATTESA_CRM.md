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
| `app/demo/page.tsx` | Modificato | Aggiunge il pannello **Inserimento rapido**: incolli dati trovati online, il CRM estrae nome, azienda, referente, email, telefono, città, indirizzo, settore, note interne, bisogno probabile, prossima azione e crea subito una scheda lead o cliente. |

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

Il modulo `PUBLIC_REFERENCES` non inventa conteggi commerciali. Mantiene un registro prudente delle fonti controllate e separa i dati verificati dalle ipotesi operative. **Questi riferimenti servono al consulente e al CRM, non devono essere copiati automaticamente nelle email al lead.** Nelle comunicazioni esterne vanno inseriti solo elementi utili e costruttivi per il potenziale cliente: problema osservato, domanda diagnostica, possibile beneficio operativo, proposta di confronto breve.

| Fonte | Uso nel CRM | Regola prudenziale |
|---|---|---|
| uBroker | Percorso energia alternativo o comparativo | Non promettere risparmi; verificare condizioni aggiornate. |
| PEF Power | Analisi energia e assistenza/offerte da validare | Usare costo annuo energia e percentuale stimata inserita dall’utente. |
| Blotix | Valorizzazione/tokenizzazione simulata | Il 2,5% è solo parametro di simulazione modificabile, non rendimento garantito. |
| Strategie closer | Sequenza comunicativa in 6 passaggi | Generare bozze e domande orientate al valore del lead; non includere fonti di ricerca di mercato o ragionamenti interni. |
| AI locale/opzionale | Supporto a testi e priorità | Il CRM deve funzionare anche gratis senza inviare dati fuori. |

## Regola per email e WhatsApp al lead

Le email e i messaggi WhatsApp generati da `buildCloserMessage` devono essere **client-facing**, cioè leggibili e utili per il lead senza mostrare il lavoro interno. La ricerca pubblica, i conteggi, i confronti tra fornitori e le note su uBroker, PEF Power o Blotix restano disponibili nello studio interno e nella ricerca guidata, ma non compaiono nella bozza esterna salvo richiesta esplicita del lead o decisione manuale del consulente.

| Tipo di informazione | Dove deve stare | Esempio corretto |
|---|---|---|
| Fonti, URL, conteggi, benchmark, ragionamenti di mercato | CRM interno / studio consulenziale | “Confidenza ricerca 75/100; verificare condizioni energia.” |
| Domanda diagnostica e problema operativo | Email / WhatsApp al lead | “Quale richiesta dei clienti oggi vi fa perdere più tempo?” |
| Possibile percorso di valore | Email / WhatsApp al lead | “Possiamo partire da una mini-diagnosi e preparare un esempio concreto.” |
| Nomi provider e ipotesi economiche | Solo se richiesti o autorizzati | “Valutiamo insieme le opzioni più adatte, senza proposta preconfezionata.” |

## Inserimento rapido lead/clienti

La demo ora contiene un pannello sempre visibile chiamato **Inserimento rapido**. Il flusso è pensato per evitare gestione manuale lenta: l’operatore copia i dati trovati, li incolla nel riquadro, sceglie **Crea lead**, **Crea cliente** oppure **Aggiorna selezionato**, e il CRM compila una scheda lavorabile.

| Azione | Quando usarla | Effetto nel CRM |
|---|---|---|
| **Crea lead** | Quando il contatto non è ancora cliente e va qualificato. | Crea una nuova scheda con stato `Lead`, stadio `Da qualificare`, note interne, bisogno probabile e task di verifica. |
| **Crea cliente** | Quando il soggetto è già cliente o va gestito come cliente acquisito. | Crea una scheda con stato `Cliente`, livello fiducia/interesse più alto e task operativo. |
| **Aggiorna selezionato** | Quando hai già una scheda aperta e trovi nuovi dati. | Unisce i nuovi dati con quelli esistenti senza cancellare note, fonti interne e domande consigliate. |

Il parser riconosce dati ricorrenti come email, telefoni, cellulare, indirizzo, sito, città, referente/titolare, azienda e settore stimato. Per strutture turistiche, hotel, camping, ristorazione, studi professionali e agenzie, assegna anche servizi potenziali e domande diagnostiche iniziali. Le informazioni incollate vengono salvate come **note interne**, mentre le comunicazioni esterne restano pulite e orientate al valore del lead.

Esempio pratico di testo da incollare:

```text
Il titolare del Camping Pfirsich, situato a Borghetto Santo Spirito, SV, è Giulia Alizeri.
E-mail: pfirsich.camping@gmail.com
Telefono Fisso: +39 0182 940606
Telefono Cellulare: +39 329 5988642
Indirizzo: Via Privata Alizeri 1, 17052 Borghetto Santo Spirito (SV)
```

Dopo il salvataggio, la scheda diventa subito utilizzabile: puoi aprirla nel database, correggere eventuali campi mancanti, generare il messaggio diagnostico, programmare follow-up e mantenere lo storico.

## Passi di implementazione

1. Copiare i nuovi file nella stessa struttura del progetto.
2. Eseguire la migrazione `006_consulting_research_study_fields.sql` su Supabase.
3. Riavviare Next.js.
4. Testare `npm run type-check`.
5. Testare `npm run build`.
6. Collegare gradualmente la UI reale alle route `/api/ai/consulting` e `/api/ai/chat` se si passa dalla demo local-first al backend persistente.

## Verifica già effettuata

Sono stati eseguiti `npm run type-check` e `npm run build`; entrambi sono terminati correttamente dopo l’aggiunta dell’inserimento rapido lead/clienti.

## Aggiornamento: assistente strategico per messaggistica soft-closing

Il CRM è stato esteso per supportare non solo l’archiviazione dei lead, ma anche la preparazione della **prossima mossa commerciale**. Nella sezione **Agente** sono ora disponibili tre controlli operativi: tono di vendita, obiettivo conversazionale e template di messaggio. Questo permette di generare comunicazioni coerenti con il metodo richiesto: cordiali, soft, non invasive e orientate a guidare la conversazione verso diagnosi, fiducia, mini-demo, appuntamento o closing morbido.

| Funzione | Uso pratico | Risultato atteso |
|---|---|---|
| Tono vendita | Scegli tra Cordiale, Soft, Consulenziale e Diretto gentile. | Il messaggio evita pressione e mantiene un approccio umano. |
| Obiettivo | Scegli tra apertura relazione, comprensione bisogno, gestione obiezione, mini-demo o appuntamento. | Il CRM suggerisce la prossima mossa invece di produrre messaggi generici. |
| Template | Usa opener, diagnosi, qualifica, su misura, posizionamento o closing morbido. | Email e WhatsApp seguono una sequenza logica di vendita consultiva. |
| Coach strategico | Legge il lead selezionato e propone gancio, bisogno da verificare e passo successivo. | Il venditore resta concentrato sulla conversazione, non sull’amministrazione del CRM. |

La regola implementata resta coerente con l’impostazione precedente: **le fonti, i conteggi e la ricerca interna non vengono inseriti nei messaggi al lead**. L’assistente usa quei dati solo come contesto per aiutare il venditore a scegliere gancio, domanda e prossima azione. Al potenziale cliente arrivano solo elementi utili: una domanda concreta, un beneficio pratico e un invito leggero al passo successivo.

Esempio di utilizzo consigliato: seleziona un lead, imposta tono **Soft**, obiettivo **Capire bisogno** e template **Diagnosi**. Il CRM produrrà un messaggio che non tenta di vendere subito, ma apre una conversazione con una domanda mirata. Se il lead risponde positivamente, puoi passare a **Proporre mini-demo** o **Chiudere appuntamento**.

## Verifica aggiornata

Dopo l’aggiunta dell’assistente strategico sono stati rieseguiti `npm run type-check` e `npm run build`; entrambi sono terminati correttamente.


## Correzione critica: persistenza reale dei lead/clienti

Il problema segnalato era corretto: un CRM che si apre vuoto non è utilizzabile come strumento di lavoro. La demo precedente era **local-first**, quindi poteva mostrare dati solo se il browser, il profilo e lo stesso dominio conservavano il `localStorage`. In produzione questo non basta, perché un nuovo deploy, un dominio diverso, una sessione non autenticata o un browser diverso possono far sembrare il CRM vuoto anche senza un reset volontario.

La nuova implementazione introduce una persistenza più sicura. All’apertura della demo, il CRM tenta di caricare i contatti da `/api/contacts?format=demo`. Se l’utente è autenticato e Supabase è configurato nel deploy, i lead vengono caricati dal database e non devono essere reinseriti ogni giorno. Se invece l’utente non è autenticato o il database non è raggiungibile, il CRM mostra chiaramente che sta lavorando in **modalità locale** e invita a usare Backup/Importa fino alla correzione della configurazione.

| Stato visibile nel CRM | Significato pratico | Cosa fare |
|---|---|---|
| Database persistente attivo | I contatti sono caricati e salvati sul database cloud. | Puoi lavorare normalmente: i lead devono riapparire alla riapertura. |
| Salvataggio automatico | Il CRM sta copiando le modifiche nel database. | Attendere qualche secondo prima di chiudere. |
| Accesso non effettuato | La pagina non ha un utente autenticato, quindi il database non può sapere a chi assegnare i contatti. | Effettuare login dal CRM prima di lavorare in modo definitivo. |
| Database non raggiungibile | Supabase o le variabili ambiente del deploy non sono disponibili. | Non inserire grandi liste senza esportare un backup; correggere configurazione Vercel/Supabase. |

File aggiunti o modificati per questa correzione:

| File | Funzione |
|---|---|
| `lib/demo-crm-mapping.ts` | Converte i contatti della demo nel formato della tabella `contacts` e conserva i campi extra nel campo `metadata`. |
| `app/api/contacts/route.ts` | Ora può restituire i contatti anche in formato demo tramite `?format=demo` e accetta nuovi contatti provenienti dalla demo. |
| `app/api/contacts/[id]/route.ts` | Ora può aggiornare contatti in formato demo senza perdere i campi operativi. |
| `app/api/contacts/sync/route.ts` | Nuova route di sincronizzazione massiva: crea o aggiorna i contatti della demo nel database persistente dell’utente autenticato. |
| `app/demo/page.tsx` | Aggiunto caricamento cloud all’avvio, autosalvataggio sul database, fallback locale e indicatore visibile dello stato di persistenza. |

Dopo il nuovo deploy, la regola operativa è semplice: **prima fai login, poi apri la demo e verifica che compaia “Database persistente attivo”**. Solo dopo questo messaggio conviene iniziare a inserire molti lead. Se compare modalità locale, si può testare il CRM, ma prima di chiudere bisogna esportare un backup.
