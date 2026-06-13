# Flusso Conversazionale Assistito Email/WhatsApp

Il modulo Comunicazioni del CRM deve evolvere da semplice generatore di bozze a **assistente di conversazione commerciale**. L'obiettivo non è inviare automaticamente messaggi, ma aiutare l'utente a scegliere il messaggio giusto nel momento giusto, mantenendo controllo manuale su email, WhatsApp e follow-up.

## Principio operativo

Il CRM deve lavorare come un closer assistito: prima apre una conversazione leggera, poi fa emergere il problema tramite domande strategiche, quindi qualifica urgenza, impatto e disponibilità al cambiamento. Solo quando il lead ha esplicitato un bisogno, il messaggio introduce la soluzione in modo naturale.

| Fase | Obiettivo | Tipo messaggio | Azione CRM |
|---|---|---|---|
| Apertura | Avviare contatto senza pressione | Messaggio breve e contestuale | Email o WhatsApp precompilato |
| Diagnosi | Far emergere problemi reali | Domande strategiche | Copia/apri canale e salva storico |
| Approfondimento | Capire impatto e priorità | Domande su tempi, costi, blocchi | Aggiorna stadio e crea task |
| Posizionamento | Collegare problema a soluzione | Proposta soft e concreta | Prepara risposta soluzione |
| Chiusura morbida | Portare a call/demo/prova | Invito semplice | Programma follow-up |

## Modalità nel CRM

La UI deve permettere di selezionare una **fase conversazionale** e ottenere messaggi AI già pronti per email o WhatsApp. Ogni messaggio deve usare i dati del contatto: nome attività, categoria, città, gancio di personalizzazione e angolo del messaggio.

Il CRM deve includere pulsanti separati per aprire mailto, aprire WhatsApp, copiare il testo, segnare il contatto come contattato e programmare follow-up. Il sistema resta local-first: nessun invio automatico, nessun backend obbligatorio e nessun costo.

## Fasi messaggio da implementare

| Codice | Etichetta UI | Scopo |
|---|---|---|
| opener | Apertura delicata | Primo contatto non invasivo |
| diagnose | Domande strategiche | Far emergere difficoltà operative |
| qualify | Qualificazione | Capire urgenza, frequenza, valore |
| position | Soluzione soft | Collegare Voice Desk al problema emerso |
| close | Call/demo | Invitare a un passo successivo semplice |

## Nota su WhatsApp

WhatsApp può essere collegato direttamente tramite link `wa.me` quando il contatto ha un numero di telefono. Se manca il numero, il CRM deve copiare il testo negli appunti. Per email si usa `mailto:` con oggetto e corpo precompilati. Entrambi sono canali assistiti, non automatici.
