# Stato pubblicazione permanente

Il CRM AI Relazionale è ora predisposto per la pubblicazione permanente come applicazione Next.js. Il progetto è compilabile, contiene una demo pubblica utilizzabile senza servizi esterni e include la configurazione per deploy su Vercel.

## Stato tecnico

| Voce | Stato | Dettaglio |
|---|---|---|
| Build Next.js | **Completata** | `npm run build` eseguito con successo. |
| TypeScript | **Completato** | `npm run type-check` eseguito con successo. |
| Demo pubblica | **Pronta** | Route `/demo` prerenderizzata come pagina statica. |
| Route API | **Pronte** | Endpoint server-side inclusi per modalità reale. |
| Configurazione Vercel | **Aggiunta** | File `vercel.json` presente nel progetto. |
| Variabili produzione | **Documentate** | File `.env.production.example` presente. |
| Dominio permanente | **Da collegare** | Richiede account hosting o DNS del proprietario. |

## Cosa è già permanente nel codice

Il progetto non dipende più dal link temporaneo della sessione per essere utilizzato: la web app può essere installata, buildata e pubblicata su un hosting Next.js stabile. La demo funziona subito senza credenziali, mentre la modalità reale resta pronta per Supabase, AI e n8n.

## Cosa richiede un passaggio esterno

Per ottenere un URL permanente pubblico serve necessariamente uno spazio hosting esterno, ad esempio Vercel. Questo passaggio richiede accesso a un account personale o aziendale perché il dominio, il progetto e l'eventuale fatturazione appartengono al proprietario del sito.

| Opzione | Intervento richiesto |
|---|---|
| Vercel gratuito | Accesso al tuo account Vercel e import/deploy del progetto. |
| GitHub + Vercel | Creazione repository GitHub, import su Vercel e deploy automatico. |
| Dominio personalizzato | Accesso al pannello DNS del dominio e collegamento al progetto hosting. |
| VPS/self-hosting | Server Linux permanente, Node.js, process manager e reverse proxy. |

## Raccomandazione

La strada più rapida è pubblicare prima la **demo permanente su Vercel**. Dopo il deploy, si potranno collegare Supabase, AI e n8n senza cambiare architettura.
