# Deploy e test del CRM con assistente closer

Questo pacchetto contiene due correzioni centrali: il fix del middleware che impediva l’accesso a `/auth/login` sul deploy live e il nuovo **assistente closer operativo** nella sezione `/demo`.

## Cosa è stato corretto

| Area | Correzione |
|---|---|
| Login `/auth/login` | Il middleware ora è fail-safe: se le variabili Supabase non sono presenti su Vercel, non genera più errore runtime e lascia caricare le pagine. |
| Agente closer | Aggiunto framework professionale con stadi conversazione, prossima mossa, follow-up, gestione obiezioni, appuntamento e closing morbido. |
| API consulting | Aggiunta azione `playbook` per ottenere una guida strutturata su lead, obiezione e prossimo passo. |
| Demo CRM | La sezione Agente mostra email e WhatsApp suggeriti, pulsanti manuali di copia/apertura, marcatura invio e programmazione follow-up. |

## Procedura di deploy su Vercel

Carica l’intero progetto aggiornato oppure collega questo contenuto al repository usato da Vercel. Dopo il deploy, apri direttamente:

```text
https://TUO-DOMINIO/auth/login
https://TUO-DOMINIO/demo
```

`/auth/login` deve mostrare la pagina di accesso. `/demo`, se Supabase è configurato, deve reindirizzare al login quando non sei autenticato; se Supabase non è configurato, deve comunque caricarsi senza errore 500.

## Variabili ambiente consigliate

| Variabile | Quando serve | Nota |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Persistenza cloud e login | Deve essere impostata nel progetto Vercel per usare Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Persistenza cloud e login | Deve corrispondere alla anon key pubblica Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | API server e sincronizzazione avanzata | Non va esposta al client. |

## Test minimo post-deploy

| Passo | Esito atteso |
|---|---|
| Aprire `/auth/login` | Pagina login visibile, nessun `MIDDLEWARE_INVOCATION_FAILED`. |
| Aprire `/demo` senza login | Redirect al login se Supabase è configurato, oppure caricamento local-first se Supabase non è configurato. |
| Entrare nella sezione Agente | Titolo “Agente closer operativo sui tuoi dati”. |
| Selezionare un lead | Vedi stadio conversazione, prossima mossa, follow-up consigliato, email e WhatsApp suggeriti. |
| Usare “Programma follow-up” | Viene creato un task locale/cloud collegato al lead. |
| Registrare una comunicazione | Lo storico aggiorna analisi, stadio e prossima azione. |

## Verifiche locali già superate

Sono già stati eseguiti con esito positivo:

```text
npm run type-check
npm run build
```

È stato inoltre verificato localmente che `GET /auth/login` risponde `200 OK` e che l’API `/api/ai/consulting` con `action: playbook` genera correttamente uno step di gestione obiezione con follow-up.
