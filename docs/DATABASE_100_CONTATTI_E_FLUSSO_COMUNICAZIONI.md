# Database primi 100 contatti qualificati e flusso comunicazioni

L’obiettivo operativo è trasformare il CRM privato in uno strumento di lavoro per gestire una lista iniziale di **100 contatti altamente qualificati**, non una lista generica. La strategia indicata nei materiali ricevuti è corretta: partire da una zona pilota, costruire un database commerciale curato e lavorare in batch da 25 contatti, con una prima fascia **A-list** da contattare con video realmente personalizzati.

## Scelta architetturale gratuita

Per mantenere il sistema gratuito nella fase iniziale, il database viene gestito in modalità **local-first** dentro il browser, separato per profilo. Questa scelta è coerente con l’uso privato attuale: tu e gli eventuali soci potete usare profili distinti, ognuno con i propri contatti, senza sincronizzazione o condivisione tra profili.

| Approccio | Vantaggi | Limiti | Costo | Quando usarlo |
|---|---|---|---:|---|
| Database locale nel CRM, con backup/import JSON | Subito utilizzabile, gratuito, privato, nessun account tecnico aggiuntivo | I dati restano nel browser; serve backup manuale | Gratis | Fase iniziale, primi 100 contatti, test messaggi e processo |
| Database cloud con login separato per ogni socio | Dati sincronizzati tra dispositivi, accesso con account, controllo più robusto | Richiede configurazione Supabase o servizio simile | Può partire gratis, ma non è necessario ora | Fase successiva, quando il processo è validato |
| Automazioni reali email/WhatsApp/video | Riduce lavoro manuale e traccia aperture/click | Richiede servizi esterni, consenso, API e possibile costo | Variabile | Solo dopo aver validato messaggio, target e conversione |

Per ora la soluzione più prudente è implementare un **database CRM locale arricchito**, con campi specifici per hotel, ristoranti e strutture premium, più un flusso manuale guidato di comunicazioni.

## Campi da aggiungere al database contatti

I materiali allegati indicano chiaramente che il valore non sta solo nel nome della struttura, ma nella qualità della personalizzazione. Il CRM deve quindi distinguere i dati anagrafici dai dati di qualificazione e dai dati di outreach.

| Area | Campi operativi |
|---|---|
| Identificazione | Nome struttura, categoria, sottocategoria, città, indirizzo, sito web |
| Contatto | Telefono, email generale, nome decision maker, ruolo, email decision maker |
| Qualificazione | Fascia prezzo, camere/coperti stimati, valutazione, numero recensioni, servizi, prenotazione telefonica visibile, sistema prenotazione online |
| Priorità | Priorità A/B/C, valore stimato, interesse, fiducia, stato CRM |
| Personalizzazione | Gancio personale, angolo del messaggio video, note personalizzazione |
| Comunicazioni | Stadio outreach, ultimo contatto, prossima azione, storico conversazioni, task collegati |

## Flusso comunicazioni consigliato

Il flusso non deve ancora inviare automaticamente email o WhatsApp. In questa fase deve aiutarti a sapere **chi contattare, con quale messaggio, quando fare follow-up e cosa è già stato detto**.

| Fase | Obiettivo | Azione nel CRM |
|---|---|---|
| 1. Da qualificare | Verificare sito, telefono, email e gancio personale | Completare campi mancanti e assegnare priorità A/B/C |
| 2. Video da preparare | Preparare video personalizzato per A-list | Usare gancio e angolo messaggio salvati nel contatto |
| 3. Primo invio | Inviare email o messaggio manuale con video | Registrare comunicazione e creare follow-up |
| 4. Follow-up 1 | Richiamare o riscrivere dopo pochi giorni | Aggiornare note, stato e task |
| 5. Risposta ricevuta | Valutare interesse reale | Registrare conversazione e creare task successivo |
| 6. Demo richiesta | Portare il contatto a call/demo | Alzare priorità e preparare proposta |
| 7. Non interessato / sospeso | Non perdere storico ma non insistere | Archiviare o pianificare ricontatto futuro |

## Primo batch disponibile dai materiali ricevuti

Il secondo file allegato contiene già 8 lead premium su Milano. Verranno caricati come **batch pilota** con priorità alta o media, categoria, telefono, valutazione e gancio di personalizzazione. I campi non ancora presenti, come sito web, email o decision maker, resteranno da completare nel CRM durante la qualificazione.

| Priorità | Struttura | Categoria | Telefono | Gancio |
|---|---|---|---|---|
| A | Casa Brera, a Luxury Collection Hotel, Milan | Hotel luxury | +39 02 305430 | Accoglienza ed esperienza dell’ospite |
| A | Palazzo Parigi Hotel & Grand Spa Milano | Luxury hotel | +39 02 625625 | Gestione impeccabile del primo contatto |
| A | Four Seasons Hotel Milano | Hotel luxury | +39 02 77088 | La chiamata come parte dell’esperienza |
| A | Château Monfort | Boutique hotel 5★ | +39 02 776761 | Esperienza curata e telefonata nel momento sbagliato |
| A | Seta by Antonio Guida | Fine dining | +39 02 87318897 | Attenzione al dettaglio nel fine dining |
| A | Ristorante Berton | Fine dining | +39 02 67075801 | Paradosso ospitalità: personale e telefono |
| B | Sadler Restaurant | Ristorante gourmet | +39 02 58104451 | Esperienza gastronomica e attenzione continua |
| B | Excelsior Hotel Gallia | Grande hotel luxury | +39 02 67851 | Reception con molti flussi e ospiti presenti |

## Prossima implementazione

Implemento nel CRM tre elementi pratici: un pulsante per caricare il **batch Milano 1**, campi estesi per la qualificazione dei lead premium e una gestione dello **stadio comunicazione** direttamente nella scheda contatto. In questo modo possiamo iniziare subito a lavorare sui primi lead e poi completare progressivamente i 100 contatti in batch da 25.
