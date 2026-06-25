# Report finale di allineamento deploy CRM AI Relazionale

**Autore:** Manus AI  
**Data:** 25 giugno 2026  
**Ambito:** verifica locale e deploy pubblico di `crm-ai-relazionale-privato.vercel.app/demo`, con focus su login, Supabase, lavorazione **VoiceDesk 100 aziende**, lavorazione parallela **LCR/NetFree 2914 lead**, matrice **LCR 6x6**, agenda/Zoom e flussi manuali.

## Sintesi esecutiva

La correzione concettuale è fondamentale: i **100 lead VoiceDesk** non devono essere sostituiti dai **2914 lead LCR/NetFree**. Sono due lavorazioni parallele. La prima riguarda aziende che possono facilitare e ottimizzare la gestione delle chiamate con AI tramite VoiceDesk. La seconda riguarda il progetto LCR/NetFree, a cui le persone possono aderire **a prescindere da VoiceDesk** e nel quale, nella prima fase, possono generare reddito passivo dai propri asset.

Il progetto locale è stato quindi aggiornato per mostrare il titolo **“CRM privato · VoiceDesk 100 + LCR/NetFree 2914”**, la sezione **VoiceDesk 100** per la prima lavorazione aziendale e le sezioni **NetFree** e **LCR 6x6** per il flusso parallelo LCR. L’import NetFree/LCR aggiunge i contatti al flusso parallelo e mostra esplicitamente che i 100 lead VoiceDesk aziendali restano separati e non vengono sostituiti.

> Il problema del deploy pubblico resta di allineamento operativo: Vercel sta servendo una vecchia build. Per pubblicare la versione corretta bisogna applicare lo ZIP nella root del repository GitHub collegato a Vercel e fare push sul ramo di produzione. Vercel crea deployment automatici sui push o merge del ramo collegato, di norma `main`.[2]

## Distinzione corretta tra le due lavorazioni

| Lavorazione | Target | Obiettivo | Stato nel CRM aggiornato |
|---|---|---|---|
| **VoiceDesk 100** | Aziende, attività operative, strutture che ricevono chiamate e richieste | Facilitare e ottimizzare la gestione delle chiamate con AI, riducendo dispersione, chiamate perse e lavoro ripetitivo | Sezione `VoiceDesk 100`, pulsante `Carica VoiceDesk 100`, prompt agente dedicato |
| **LCR/NetFree 2914** | Persone e contatti che possono aderire indipendentemente da VoiceDesk | Percorso LCR/NetFree, adesione autonoma e valorizzazione iniziale degli asset per reddito passivo | Sezioni `NetFree` e `LCR 6x6`, archivio `netfree-unified-contacts.json` da 2914 record |

## Esito tecnico verificato

| Area verificata | Stato locale aggiornato | Stato deploy pubblico attuale | Azione richiesta |
|---|---:|---:|---|
| Titolo e posizionamento dei flussi | **OK:** VoiceDesk 100 + LCR/NetFree 2914 | Vecchia versione | Push e redeploy |
| Login senza errore “login cloud non configurato” | **OK** | Da aggiornare con nuovo deploy | Applicare patch e pushare su GitHub |
| File NetFree `public/data/netfree-unified-contacts.json` | **Presente, 13.299.344 byte, 2914 record** | **Assente**, HTTP 404 | Includere il file nel repository e redeployare |
| Flusso VoiceDesk 100 | **Preservato e rinominato correttamente** | Vecchia versione | Push file `app/demo/page.tsx` aggiornato |
| Flusso LCR/NetFree 2914 | **Presente come lavorazione parallela** | Assente | Push file `app/demo/page.tsx` e JSON |
| Matrice LCR 6x6 | **Presente** | Assente | Redeploy della versione aggiornata |
| Configurazione Supabase reale | Placeholder/non presente nei file locali | Dipende dalle variabili Vercel | Impostare variabili reali in Vercel |

## Prove raccolte sul deploy pubblico

La scansione del deploy pubblico ha scaricato l’HTML di `/demo` e gli asset Next.js generati. L’HTML pubblico contiene ancora la vecchia stringa **“100 contatti qualificati”** e non contiene le stringhe aggiornate **“VoiceDesk 100 + LCR/NetFree 2914”**, **“NetFree”**, **“2914”**, **“6x6”**, **“Matrice forzata”** o **“Carica archivio NetFree”**. Inoltre, il file pubblico `/data/netfree-unified-contacts.json` restituisce **HTTP 404**.

| Controllo pubblico | Risultato |
|---|---:|
| `100 contatti qualificati` nell’HTML pubblico | **Presente** |
| `VoiceDesk 100 + LCR/NetFree 2914` nell’HTML pubblico | **Assente** |
| `NetFree` nell’HTML pubblico | **Assente** |
| `2914` nell’HTML pubblico | **Assente** |
| `6x6` nell’HTML pubblico | **Assente** |
| `/data/netfree-unified-contacts.json` | **HTTP 404** |

Questo conferma che Vercel non sta servendo la copia locale corretta, ma una build precedente. La cartella locale di lavoro non è il repository GitHub collegato a Vercel; quindi i file corretti devono essere copiati e pushati nel repository GitHub effettivamente connesso al progetto Vercel.

## Correzioni incluse nel pacchetto aggiornato

| File incluso | Funzione |
|---|---|
| `app/demo/page.tsx` | Demo aggiornata con distinzione **VoiceDesk 100** e **LCR/NetFree 2914**, NetFree, LCR 6x6 e flussi manuali |
| `app/auth/login/page.tsx` | Login con fallback locale e redirect a `/demo` quando Supabase non è configurato |
| `app/dashboard/layout.tsx` | Layout dashboard senza redirect bloccante in assenza di Supabase |
| `lib/supabase-browser.ts` | Client browser con fallback locale, senza errore bloccante “login cloud non configurato” |
| `lib/supabase-config.ts` | Rilevamento placeholder Supabase e scelta cloud/fallback |
| `lib/supabase.ts` | Supporto Supabase lato server/cloud |
| `public/data/netfree-unified-contacts.json` | Archivio LCR/NetFree da 2914 record |
| `docs/DIAGNOSI_SUPABASE_NON_COLLEGATO.md` | Diagnosi tecnica su Supabase e variabili necessarie |
| `ISTRUZIONI_DEPLOY_GITHUB_VERCEL.md` | Istruzioni operative definitive |
| `MANIFEST_FILE_INCLUSI.txt` | Manifest del pacchetto |

## Dimensione del file NetFree e GitHub

Il file JSON LCR/NetFree pesa circa **13,3 MB**, quindi è sotto il limite bloccante GitHub di **100 MiB** per i file tracciati in un repository Git. È anche sotto la soglia di warning Git da **50 MiB** indicata dalla documentazione GitHub. Non è quindi necessario usare Git LFS per questo file, a meno che il file cresca molto oltre la dimensione attuale.[1]

| File | Dimensione locale | Valutazione GitHub |
|---|---:|---|
| `public/data/netfree-unified-contacts.json` | 13.299.344 byte | OK, sotto 50 MiB e 100 MiB |

## Istruzioni definitive per aggiornare il deploy pubblico

Estrai lo ZIP nella root del repository GitHub collegato a Vercel, cioè nella cartella che contiene `package.json`, `app/`, `lib/` e `public/`. Devi accettare la sovrascrittura dei file esistenti.

```bash
cd /percorso/al/tuo/repository/crm-ai-relazionale
rm -rf .next
unzip /percorso/al/file/crm_patch_finale_deploy_voicedesk_lcr_paralleli.zip -d /tmp/crm_patch_finale
cp -R /tmp/crm_patch_finale/crm_patch_finale_deploy_voicedesk_lcr_paralleli/. .
```

Poi verifica che i due flussi risultino nel codice:

```bash
grep -F "CRM privato · VoiceDesk 100 + LCR/NetFree 2914" app/demo/page.tsx
grep -F "label: 'VoiceDesk 100'" app/demo/page.tsx
test -f public/data/netfree-unified-contacts.json && echo "OK JSON LCR/NetFree"
node -e "const fs=require('fs'); const j=JSON.parse(fs.readFileSync('public/data/netfree-unified-contacts.json','utf8')); console.log(Array.isArray(j)?j.length:(j.contacts||j.data||[]).length)"
```

Infine fai commit e push sul ramo collegato a Vercel, normalmente `main`:

```bash
git status
git add app/demo/page.tsx app/auth/login/page.tsx app/dashboard/layout.tsx lib/supabase-browser.ts lib/supabase-config.ts lib/supabase.ts public/data/netfree-unified-contacts.json docs/DIAGNOSI_SUPABASE_NON_COLLEGATO.md
git commit -m "Separa VoiceDesk 100 da LCR NetFree 2914 e aggiorna demo CRM"
git push origin main
```

## Variabili Supabase da ricollegare in Vercel

Il codice aggiornato funziona anche senza Supabase reale grazie al fallback locale; tuttavia, per ripristinare il cloud occorre inserire in Vercel le variabili reali, non placeholder. Vercel applica le modifiche alle variabili ambiente solo ai nuovi deployment, quindi dopo averle modificate devi redeployare o pushare un nuovo commit.[3]

| Variabile Vercel | Valore atteso | Dove trovarla |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL progetto Supabase, ad esempio `https://xxxxx.supabase.co` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave pubblica anon/publishable | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key privata | Supabase Dashboard → Project Settings → API, solo server |

La guida Supabase per Next.js conferma l’uso di variabili pubbliche Supabase lato browser per inizializzare il client, mentre le chiavi sensibili devono restare lato server e in variabili ambiente.[4]

## Verifica post-deploy

Dopo che Vercel avrà completato il nuovo deployment, apri `https://crm-ai-relazionale-privato.vercel.app/demo` in una finestra anonima o dopo hard refresh. La pagina dovrà mostrare sia la lavorazione **VoiceDesk 100** sia la lavorazione parallela **LCR/NetFree 2914**.

| Verifica | Risultato atteso |
|---|---|
| Titolo pagina | `CRM privato · VoiceDesk 100 + LCR/NetFree 2914` |
| Navigazione | `VoiceDesk 100`, `NetFree`, `LCR 6x6` |
| Pulsante VoiceDesk | `Carica VoiceDesk 100` |
| Pulsante LCR/NetFree | `Carica archivio NetFree 2914` |
| Archivio JSON pubblico | `/data/netfree-unified-contacts.json` restituisce HTTP 200 |
| Import NetFree/LCR | Aggiunge lead al flusso parallelo e non sostituisce VoiceDesk 100 |
| Login | Nessun messaggio bloccante “login cloud non configurato” |

## Conclusione

La versione aggiornata ora rispetta la distinzione richiesta: **VoiceDesk 100** resta la prima lavorazione aziendale, mentre **LCR/NetFree 2914** resta una lavorazione parallela e indipendente. Il prossimo passo non è tecnico sul codice locale, ma operativo: applicare lo ZIP nel repository GitHub collegato a Vercel, fare commit/push e verificare il nuovo deployment.

## References

[1]: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github "GitHub Docs — About large files on GitHub"  
[2]: https://vercel.com/docs/deployments/git "Vercel Docs — Deploying Git Repositories with Vercel"  
[3]: https://vercel.com/docs/environment-variables "Vercel Docs — Environment variables"  
[4]: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs "Supabase Docs — Build a User Management App with Next.js"
