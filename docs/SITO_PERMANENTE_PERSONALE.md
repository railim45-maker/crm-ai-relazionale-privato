# Sito permanente personale — CRM AI Relazionale

Questa guida descrive la pubblicazione del progetto come **sito web permanente privato e gratuito**. L’obiettivo non è creare una SaaS da vendere, ma rendere stabile l’accesso alla tua postazione CRM personale. Puoi usarlo tu e, se vuoi, farlo usare anche ai tuoi soci, mantenendo **profili locali separati**: ogni profilo gestisce i propri contatti, conversazioni e task senza vedere quelli degli altri.

## Stato del progetto

Il progetto è già pronto per essere pubblicato su hosting Next.js, in particolare su Vercel. La homepage apre direttamente lo strumento personale e la pagina `/demo` contiene il CRM operativo con contatti, task, conversazioni, pipeline, backup JSON e agente locale basato sui dati inseriti.

| Elemento | Stato | Note operative |
|---|---:|---|
| Homepage | Pronta | Presenta il CRM come postazione personale, non come SaaS commerciale. |
| Pagina `/demo` | Pronta | È la web app privata effettivamente utilizzabile. |
| Profili separati | Pronto | Puoi creare un profilo per te e profili distinti per i soci. |
| Persistenza | Locale | I dati sono salvati nel browser tramite `localStorage`, separati per profilo. |
| Backup e import | Pronto | È disponibile esportazione e importazione JSON del profilo attivo. |
| Build produzione | Verificata | `npm run type-check` e `npm run build` sono passati. |
| Hosting permanente | Pronto al deploy | Serve accesso a Vercel, GitHub o altro hosting Next.js. |

## Pubblicazione consigliata su Vercel

La strada più semplice è Vercel, perché il progetto è basato su Next.js e contiene già `vercel.json`. Per pubblicarlo in modo permanente servono un account Vercel e, preferibilmente, un repository GitHub collegato.

### Variabili ambiente minime

Per la modalità personale non servono Supabase, Claude, OpenAI o n8n. Le uniche variabili consigliate sono queste.

| Variabile | Valore consigliato |
|---|---|
| `NEXT_PUBLIC_APP_MODE` | `personal` |
| `NEXT_PUBLIC_APP_URL` | URL pubblico Vercel o dominio personalizzato |

## Comandi di controllo locale

Prima del deploy, il progetto è stato controllato con questi comandi.

```bash
npm run type-check
npm run build
```

Entrambi i comandi sono stati eseguiti con esito positivo dopo la trasformazione in CRM personale.

## Cosa resta locale e cosa diventa permanente

Il sito permanente rende stabile l’accesso alla web app, ma in modalità gratuita i dati restano comunque nel browser del dispositivo usato. Questo è intenzionale, perché consente di partire senza costi e senza servizi esterni. I profili locali separano i dati tra te e i soci sullo stesso browser, ma non sono account cloud con password. Se ogni socio usa il proprio dispositivo, ciascuno avrà il proprio archivio locale. Se vuoi vedere gli stessi dati da più dispositivi o avere login protetti, il passo successivo sarà collegare Supabase.

| Scenario | Dati salvati dove | Quando usarlo |
|---|---|---|
| Sito permanente personale | Browser locale | Uso personale immediato da un dispositivo principale. |
| Sito permanente + backup JSON | Browser locale + file esportato | Uso personale con sicurezza minima e possibilità di archiviazione manuale. |
| Sito permanente + Supabase | Database cloud | Uso multi-dispositivo, login, dati sempre sincronizzati. |

## Passo successivo operativo

Per completare il deploy permanente, occorre autorizzare l’accesso a un account hosting. Le opzioni sono tre.

| Opzione | Cosa devi fare tu | Cosa posso fare io |
|---|---|---|
| Vercel con login nel browser | Accedere al tuo account Vercel quando richiesto | Completare configurazione e deploy dal progetto pronto. |
| GitHub + Vercel | Fornire o creare un repository GitHub | Preparare push del codice e guidare l’import in Vercel. |
| Solo pacchetto ZIP | Scaricare il pacchetto del progetto | Consegnare progetto deployabile e istruzioni manuali. |

## Nota sui dati personali

In modalità locale, i dati restano nel browser e non vengono inviati a un database esterno. Prima di cancellare cache, cambiare dispositivo o browser, usa il pulsante **Backup** nella web app per scaricare il file JSON dei tuoi dati.
