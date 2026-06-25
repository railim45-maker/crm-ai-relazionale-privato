# Istruzioni rapide per pubblicare la versione corretta del CRM

Questo pacchetto corregge l’allineamento del CRM distinguendo due lavorazioni **parallele e non sostitutive**: **VoiceDesk 100** per le aziende che possono ottimizzare la gestione chiamate con AI, e **LCR/NetFree 2914** per le persone che possono aderire indipendentemente da VoiceDesk e avviare un percorso legato ai propri asset.

## 1. Dove estrarre lo ZIP

Estrai lo ZIP nella **root del repository GitHub collegato a Vercel**, cioè nella cartella che contiene `package.json`, `app/`, `lib/` e `public/`. Devi sovrascrivere i file esistenti.

## 2. Comandi consigliati

```bash
cd /percorso/al/tuo/repository/crm-ai-relazionale
rm -rf .next
unzip /percorso/al/file/crm_patch_finale_deploy_voicedesk_lcr_paralleli.zip -d /tmp/crm_patch_finale
cp -R /tmp/crm_patch_finale/crm_patch_finale_deploy_voicedesk_lcr_paralleli/. .

grep -F "CRM privato · VoiceDesk 100 + LCR/NetFree 2914" app/demo/page.tsx
grep -F "label: 'VoiceDesk 100'" app/demo/page.tsx
test -f public/data/netfree-unified-contacts.json && echo "OK JSON LCR/NetFree"

git status
git add app/demo/page.tsx app/auth/login/page.tsx app/dashboard/layout.tsx lib/supabase-browser.ts lib/supabase-config.ts lib/supabase.ts public/data/netfree-unified-contacts.json docs/DIAGNOSI_SUPABASE_NON_COLLEGATO.md
git commit -m "Separa VoiceDesk 100 da LCR NetFree 2914 e aggiorna demo CRM"
git push origin main
```

Se Vercel usa un ramo diverso da `main`, sostituisci `main` con il ramo configurato in **Vercel → Project Settings → Git → Production Branch**.

## 3. Variabili Supabase da inserire in Vercel

In **Vercel → Project Settings → Environment Variables** inserisci i valori reali del tuo progetto Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Dopo aver salvato le variabili, fai un nuovo deploy. Il codice funziona anche in modalità locale se queste variabili non sono configurate, ma per il cloud devono essere reali e non placeholder.

## 4. Verifica dopo il deploy

Apri `https://crm-ai-relazionale-privato.vercel.app/demo` e verifica che compaiano:

| Elemento | Risultato atteso |
|---|---|
| Titolo | `CRM privato · VoiceDesk 100 + LCR/NetFree 2914` |
| Navigazione | `VoiceDesk 100`, `NetFree`, `LCR 6x6` |
| Pulsante VoiceDesk | `Carica VoiceDesk 100` |
| Pulsante LCR/NetFree | `Carica archivio NetFree 2914` |
| JSON LCR/NetFree | `/data/netfree-unified-contacts.json` deve rispondere HTTP 200 |
| Import NetFree/LCR | Deve aggiungere i lead LCR/NetFree senza sostituire i 100 VoiceDesk |
| Login | Nessun messaggio bloccante “login cloud non configurato” |

Se dopo il push il sito mostra ancora la vecchia versione, controlla in Vercel quale repository e quale branch sono collegati al progetto.
