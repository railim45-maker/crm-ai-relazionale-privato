# LEGGIMI PRIMA — Ripristino completo CRM

Questo pacchetto serve a ripristinare insieme:

| Funzione | Dove si trova |
|---|---|
| Pagina CRM completa con NetFree, lead, profili e Google Meet | `app/demo/page.tsx` |
| Collegamento Google OAuth | `app/api/google/connect/route.ts` |
| Callback Google OAuth | `app/api/google/callback/route.ts` |
| Stato account Google collegato | `app/api/google/status/route.ts` |
| Conferma appuntamento e creazione link Meet | `app/api/appointments/confirm-meet/route.ts` |
| Sync contatti Supabase a blocchi per NetFree | `app/api/contacts/sync/route.ts` |
| Lettura contatti Supabase paginata | `app/api/contacts/route.ts` |
| Migrazione Supabase NetFree | `supabase/migrations/007_demo_contacts_supabase_netfree.sql` |
| File dati NetFree pubblici/import | `public/data/*.json` e `data/netfree_contacts_import_slim.json` |

## Cosa devi fare

Devi copiare il contenuto della cartella `PACCHETTO_RIPRISTINO_COMPLETO` dentro la radice del tuo progetto `crm-ai-relazionale-privato`, mantenendo esattamente la struttura delle cartelle.

La cosa importante è questa: **non devi copiare tutti i file `route.ts` nella stessa cartella**. Se carichi lo ZIP o copi la cartella preservando i percorsi, ogni `route.ts` finisce automaticamente nel posto giusto.

## Punto critico

La schermata che mostrava `app/api/google/callback/route.ts` non può contenere NetFree. È solo una rotta tecnica per Google. La sezione NetFree e i 2900 lead vengono gestiti principalmente da:

```text
app/demo/page.tsx
public/data/netfree-unified-contacts.json
public/data/netfree-social-candidates.json
app/api/contacts/sync/route.ts
app/api/contacts/route.ts
```

## Dopo la copia, cosa devi vedere

Nella pagina CRM devi vedere:

| Controllo | Risultato atteso |
|---|---|
| Menu laterale | Voce `NetFree` presente |
| Barra alta | Pulsante `Import NetFree dati` presente |
| Sezione NetFree | `Lista contatti importati` presente |
| Calendario | Pannello `Automazione appuntamenti Google Meet` presente |
| Calendario | Pulsanti `Conferma appuntamento Meet` e `Collega Google` presenti |

## Nota sui messaggi vocali personalizzati

Questo pacchetto ripristina la base CRM, NetFree, import massivo, Supabase e Google Meet. L'invio automatico di **messaggi vocali personalizzati** richiede un canale di invio reale, ad esempio WhatsApp Business API, Twilio, email con allegato audio, oppure un’integrazione TTS più canale di consegna. Senza scegliere e configurare quel canale, il sistema può preparare il testo/brief personalizzato ma non può inviare realmente audio vocali ai lead.
