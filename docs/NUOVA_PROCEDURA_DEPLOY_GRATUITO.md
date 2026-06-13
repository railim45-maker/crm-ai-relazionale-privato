# Nuova procedura semplice per pubblicare il CRM come sito permanente gratuito

Questa procedura evita il login tecnico tramite terminale che ha creato problemi. L’obiettivo è pubblicare il CRM privato gratuito come sito stabile, usando un sottodominio gratuito `vercel.app` e mantenendo i dati in locale nel browser.

## Scelta consigliata

La procedura più semplice è questa: **GitHub + Vercel da interfaccia web**. Non serve usare comandi tecnici sul computer dell’utente. Il progetto viene caricato in un repository GitHub privato o pubblico e poi importato su Vercel dal pannello web.

| Passaggio | Chi lo fa | Difficoltà | Note |
|---|---|---:|---|
| Preparare il progetto pronto al deploy | Manus | Bassa | Già fatto. La build passa correttamente. |
| Creare o usare un account GitHub | Utente | Bassa | Può essere gratuito. |
| Caricare il progetto su GitHub | Utente con guida Manus, oppure Manus se autorizzato | Media | Serve accesso GitHub o token. |
| Importare il progetto su Vercel | Utente con guida Manus | Bassa | Si fa da dashboard web, non da terminale. |
| Ottenere URL permanente | Vercel | Bassa | Esempio: `crm-ai-relazionale.vercel.app`. |

## Procedura A: consigliata, con GitHub

1. Accedere a [GitHub](https://github.com/).
2. Creare un nuovo repository, ad esempio `crm-ai-relazionale-privato`.
3. Caricare i file del progetto aggiornato.
4. Accedere a [Vercel](https://vercel.com/) direttamente dal sito, non dal link tecnico della CLI.
5. Selezionare **Add New Project**.
6. Collegare GitHub se richiesto.
7. Selezionare il repository `crm-ai-relazionale-privato`.
8. Lasciare le impostazioni standard di Next.js.
9. Premere **Deploy**.

Al termine, Vercel genera un URL permanente gratuito del tipo `https://nome-progetto.vercel.app`.

## Procedura B: con token Vercel

Se l’utente preferisce evitare i passaggi guidati nel browser, può creare un token personale da Vercel e fornirlo temporaneamente a Manus. In quel caso Manus può eseguire il deploy tecnico dal terminale senza richiedere l’accesso interattivo.

Questa opzione è rapida, ma è più delicata perché il token è una credenziale. Dopo il deploy, il token andrebbe revocato dalla dashboard Vercel.

## Procedura C: archivio pronto da conservare

È disponibile anche un archivio `.zip` aggiornato del progetto. Questo archivio può essere scaricato, conservato e caricato in un repository GitHub in un secondo momento.

## Stato tecnico attuale

Il progetto è già stato preparato per uso gratuito e privato. La build di produzione è stata verificata con successo.

| Elemento | Stato |
|---|---|
| CRM personale | Pronto |
| Profili locali separati per soci | Pronto |
| Salvataggio nel browser | Pronto |
| Backup JSON | Pronto |
| Login obbligatorio | Disattivato per ora |
| Database cloud | Non necessario per ora |
| AI esterna a pagamento | Non necessaria per ora |
| Build Next.js produzione | Superata |

## Nota sui dati

Nella versione gratuita attuale, ogni profilo salva i dati nel browser del dispositivo usato. Questo permette di evitare costi e database cloud. Per usare gli stessi dati da più dispositivi sarà necessario, in futuro, collegare un database come Supabase o un sistema equivalente.
