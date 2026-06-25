# Diagnosi: perché Supabase non risulta collegato

Ho verificato il progetto senza esporre chiavi sensibili. Il motivo per cui il login mostra Supabase come non collegato è che, nella copia attuale del progetto, le variabili lette dalla build sono ancora **placeholder** o assenti.

| Controllo | Esito |
|---|---|
| File `.env.local` presente | Sì |
| `NEXT_PUBLIC_SUPABASE_URL` | Presente ma placeholder: `https://YOUR_PROJECT.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Presente ma placeholder: `YOUR_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Presente ma placeholder: `YOUR_SERVICE_ROLE_KEY` |
| Variabili Supabase nell’ambiente shell della build | Assenti |
| `vercel.json` | Imposta solo `NEXT_PUBLIC_APP_MODE`, non Supabase |
| Logica del codice | Corretta: considera Supabase collegato solo se URL e chiave anon non sono placeholder |

> In pratica, Supabase può essere stato configurato nel pannello Supabase, ma questa applicazione non sta ricevendo le tre variabili reali durante la build/deploy. Per questo il codice entra nel fallback locale e segnala che il cloud non è configurato.

## Variabili necessarie

Nel file `.env.local` locale, oppure nelle Environment Variables del deploy, devono esserci questi nomi esatti:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TUO-PROGETTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...chiave_anon_pubblica...
SUPABASE_SERVICE_ROLE_KEY=eyJ...chiave_service_role_privata...
```

La variabile `SUPABASE_SERVICE_ROLE_KEY` deve rimanere solo lato server e non va mai pubblicata nel browser, in screenshot o in chat.

## Passaggi consigliati

Se stai lavorando in locale, aggiorna `.env.local`, poi cancella la build e riavvia:

```bash
rm -rf .next
pnpm build
pnpm start
```

Se stai lavorando su Vercel o hosting simile, inserisci le tre variabili nella sezione **Environment Variables** del progetto, per gli ambienti Production e Preview, poi fai un redeploy pulito. Le variabili `NEXT_PUBLIC_*` vengono incorporate nella build del frontend: se le aggiungi dopo, serve una nuova build.

## Conclusione

La causa non è Supabase in sé, ma il collegamento tra applicazione e Supabase: nella copia attuale i valori reali non sono arrivati al progetto/deploy. Appena vengono impostate le variabili reali con i nomi esatti, il login userà Supabase invece della modalità locale.
