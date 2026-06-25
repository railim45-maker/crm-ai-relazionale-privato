# Patch completa CRM — login, NetFree, 6x6 e Supabase

Questa cartella contiene i file aggiornati da sostituire nella **root del progetto Next.js**, cioè nella cartella che contiene `package.json`, `app`, `lib` e `public`.

> Non estrarre questa patch dentro `app/`, perché contiene anche file `lib/` e `public/`. Se la estrai dentro `app/`, i percorsi diventano sbagliati e NetFree non verrà caricato.

## File inclusi

| File nella patch | Destinazione esatta nel progetto | Funzione |
|---|---|---|
| `app/demo/page.tsx` | `app/demo/page.tsx` | Demo CRM aggiornata con sezioni NetFree, LCR e matrice 6x6. |
| `app/auth/login/page.tsx` | `app/auth/login/page.tsx` | Login cloud se Supabase è configurato, fallback locale se mancano le variabili. |
| `app/dashboard/layout.tsx` | `app/dashboard/layout.tsx` | Protezione dashboard resa compatibile con modalità locale. |
| `lib/supabase-browser.ts` | `lib/supabase-browser.ts` | Client Supabase browser senza blocco rosso quando il cloud non è disponibile. |
| `lib/supabase-config.ts` | `lib/supabase-config.ts` | Verifica sicura di placeholder e variabili Supabase reali. |
| `lib/supabase.ts` | `lib/supabase.ts` | Client server/admin con fallback non bloccante. |
| `public/data/netfree-unified-contacts.json` | `public/data/netfree-unified-contacts.json` | Archivio NetFree pubblico da 2914 contatti da caricare come lead. |
| `docs/DIAGNOSI_SUPABASE_NON_COLLEGATO.md` | facoltativo | Diagnosi per variabili Supabase e deploy pulito. |

## Installazione pulita

Prima fai una copia di sicurezza del progetto. Poi copia il contenuto della patch sopra la root del progetto, mantenendo la struttura delle cartelle.

Da terminale, se sei nella root del progetto:

```bash
rm -rf .next
pnpm install
pnpm build
pnpm start
```

Se usi Vercel o un altro hosting, dopo aver sostituito i file devi fare un **redeploy pulito**. Se vuoi usare Supabase reale, controlla che nel deploy siano presenti queste variabili con valori reali, non placeholder:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TUO-PROGETTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Verifica rapida in browser

Dopo il nuovo avvio apri `/demo`. Devi vedere la navigazione con le sezioni **NetFree** e **LCR 6x6**. Se i contatti non compaiono subito, usa il pulsante della demo per caricare l’archivio NetFree pubblico; il file deve essere raggiungibile a:

```text
/public/data/netfree-unified-contacts.json
```

Nel browser l’URL effettivo sarà:

```text
https://tuo-dominio/data/netfree-unified-contacts.json
```

## Nota importante

Se continui a non vedere NetFree o 6x6, quasi certamente il sito sta servendo una build vecchia oppure i file sono stati copiati nella cartella sbagliata. In quel caso elimina `.next`, svuota cache del deploy e rifai la build.
