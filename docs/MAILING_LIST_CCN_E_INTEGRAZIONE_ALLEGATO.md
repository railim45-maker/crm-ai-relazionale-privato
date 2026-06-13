# Mailing list CCN e integrazione nuovo allegato

Il nuovo allegato conferma la struttura corretta del database commerciale: i primi contatti devono essere gestiti come **prospecting list qualificata**, non come elenco casuale. Il materiale ribadisce la divisione in batch da 25 contatti, la priorità alla **Top 30 A-list** e la necessità di completare, prima dell’invio, campi come sito web, email generale, decision maker, email diretta, fascia, servizi, note di personalizzazione e angolo del messaggio.

La funzione richiesta per la mailing list deve restare gratuita e sicura. Per questo non viene previsto l’invio automatico delle email: il CRM genererà soltanto una lista di indirizzi da copiare nel campo **CCN/BCC** del client email dell’utente. In questo modo l’utente mantiene controllo manuale su destinatari, contenuto, timing e consenso operativo.

| Elemento verificato | Decisione di integrazione |
|---|---|
| Batch Milano 1 | Già coerente con l’allegato: 8 lead premium iniziali, hotel luxury e fine dining. |
| Campi database | Già presenti nel CRM: nome, categoria, telefono, sito, email, decision maker, priorità, gancio, servizi e stadio. |
| Strategia Top 30 A-list | Integrata operativamente tramite filtro priorità A nella mailing list. |
| Mailing in CCN | Nuova sezione dedicata: generazione elenco solo per contatti con email disponibile. |
| Invio automatico | Non implementato per mantenere controllo, gratuità e sicurezza. |
| Profili soci | La mailing list userà solo i dati del profilo locale attivo. |

## Specifica funzione Mailing CCN

La nuova sezione dovrà permettere di filtrare i contatti per **priorità** e **stadio del flusso**, includendo soltanto i record con almeno un indirizzo email disponibile. La priorità dell’indirizzo sarà: email decision maker, email generale, email principale. Il risultato sarà un blocco testo pronto da copiare nel campo CCN.

| Filtro | Valori previsti |
|---|---|
| Priorità | Tutte, A, B, C |
| Stadio | Tutti, Da qualificare, Video da preparare, Primo invio, Follow-up 1, Risposta ricevuta, Demo richiesta, Non interessato, Sospeso |
| Separatore | Punto e virgola oppure virgola |
| Output | Lista email unica e deduplicata, pronta per CCN/BCC |

## Regola operativa consigliata

Per evitare invii troppo larghi e poco personalizzati, il CRM dovrà ricordare che la mailing list serve soprattutto per contatti B/C o comunicazioni leggere. Per i contatti **A-list**, la raccomandazione resta preparare un messaggio o video personalizzato prima dell’invio.


## Verifica allegato `pasted_content_3.txt`

L’allegato contiene la strategia di costruzione del database e il **Batch Milano 1** con strutture, categoria, telefono, valutazione e gancio di personalizzazione. Non contiene indirizzi email generali né email di decision maker. Per questo motivo la nuova sezione **Mailing CCN** è stata impostata per mostrare solo contatti con email valida e per evidenziare quanti contatti vengono esclusi perché ancora senza indirizzo email.

La scelta operativa è prudente: non vengono generate email fittizie e non vengono attivati invii automatici. Il CRM permette di completare manualmente `Email generale` o `Email decision maker`; appena questi campi vengono valorizzati, il contatto entra automaticamente nella mailing list filtrabile per priorità e stadio.
