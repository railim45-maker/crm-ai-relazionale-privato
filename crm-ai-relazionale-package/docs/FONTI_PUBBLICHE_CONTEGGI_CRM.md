# Fonti pubbliche e conteggi verificabili per CRM

Autore: Manus AI
Data: 2026-06-14

## Sintesi operativa

Le fonti pubbliche consultate permettono di integrare nel CRM alcuni **dati numerici di contesto** e alcune **regole di prudenza**, ma non consentono di calcolare automaticamente risparmi certi per un singolo lead senza dati contrattuali, bollette, consumi e condizioni aggiornate. Per questo l’implementazione deve usare campi modificabili dall’operatore e testi che parlano di **stima indicativa**, non di promessa economica.

## Dati verificati

| Fonte | Dati pubblici rilevati | Uso consigliato nel CRM | Limite operativo |
| --- | --- | --- | --- |
| uBroker, sito ufficiale | uBroker dichiara oltre 6,34 milioni di fatture emesse, oltre 380.000 contratti attivati, oltre 64,9 milioni di euro di sconti in bolletta e oltre 113.000 bollette azzerate. Il sito indica anche offerta dinamica luce/gas, sconti visibili in fattura, sede operativa a Torino e numero verde 800 950 005. | Inserire questi numeri come **riferimento pubblico** e non come garanzia per il singolo lead. Il calcolo nel CRM deve restare: costo energia annuo × percentuale stimata impostata dall’operatore. | Non risulta una percentuale pubblica unica di risparmio valida per ogni cliente; serve analisi bollette. |
| ScelgoZero / uBroker | ScelgoZero dichiara, dal 2015, oltre 96.900 bollette azzerate e oltre 58,4 milioni di euro di sconti, con sconti gruppo d’acquisto, sconto volume, invito amici e compensazione valore energia, subordinati a condizioni/regolamenti. | Usare come contesto storico del programma sconti e come promemoria per verificare regolamento e requisiti prima di presentare numeri al cliente. | Le condizioni sono subordinate al regolamento; non trasformare in promessa di azzeramento. |
| PEF Power, sito ufficiale | PEF Power si presenta come fornitore luce/gas collegato a ENEGAN, con approccio consulenziale, offerte dedicate anche corporate, vocazione green, attenzione a risparmio energetico ed efficientamento, servizio clienti diretto. | Inserire PEF Power come percorso energetico alternativo/consulenziale. Il CRM deve permettere di scegliere “PEF Power” e inserire manualmente la percentuale stimata dopo analisi bollette. | La pagina pubblica non fornisce una percentuale standard di risparmio o tariffa unica. |
| Blotix, sito ufficiale | Blotix dichiara oltre 25.000 asset tokenizzati e oltre 5 miliardi di dollari in tokenizzazioni. Descrive protocollo decentralizzato per custodia di real asset tokenizzati, blockchain proprietaria privata, tokenizzazione di asset reali e generazione di reddito tramite asset tokenization. Nelle FAQ compare anche staking con 24% APY. | Usare i numeri pubblici solo come contesto e introdurre nel CRM un campo “rendimento tokenizzazione stimato” modificabile, con default prudenziale separato dal valore 2,5% scelto nel modello interno. | Le affermazioni su rendimenti/garanzie richiedono verifica legale/finanziaria. Non presentare come promessa al lead. |

## Riferimenti

[1]: https://ubroker.it/ "uBroker - sito ufficiale"
[2]: https://scelgozero.it/ "ScelgoZero - sito ufficiale"
[3]: https://www.pefpower.it/it/about-us "PEF Power - Chi siamo"
[4]: https://www.blotix.com/home "Blotix - Home"

## Integrazioni di verifica

| Fonte aggiuntiva | Informazioni utili | Implicazione per l’implementazione |
| --- | --- | --- |
| PEF Power, assistenza e FAQ | Il numero verde indicato è 800 613 500; il servizio clienti è dichiarato operativo dal lunedì al venerdì 08:30-18:00. Il passaggio al mercato libero richiede normalmente da uno a due mesi per utenze domestiche e non richiede interventi su impianti o contatori. | Nel CRM è utile generare un messaggio closer che riduca la frizione: “non serve cambiare contatore, serve solo analisi bolletta e sottoscrizione corretta”. |
| PEF Power, guida alla bolletta | PEF Power pubblica guide di lettura bolletta per energia elettrica e gas, conformi alla Delibera ARERA 501/2014/R/com. | Il CRM può richiedere caricamento o lettura delle bollette prima di calcolare il vantaggio. |
| Blotix, asset tokenization | La pagina asset tokenization dichiara percorsi “Maximum Liquidity” e “Passive Income”, token BLX legati agli asset, KYC/AML/CFT, whitepaper, audit e contract Ethereum. | Il CRM deve trattare Blotix come percorso ad alto rischio informativo/regolatorio: simulazione solo indicativa e da validare con documentazione ufficiale. |
| AGCM, provvedimento PS11889 Ubroker | Nel 2022 AGCM ha descritto criticità istruttorie relative a trasparenza delle condizioni economiche e rappresentazione degli sconti. | Il CRM deve evitare claim assoluti come “risparmio garantito” o “bolletta azzerata garantita”; deve usare disclaimer e richiesta analisi bolletta. |

[5]: https://www.pefpower.it/it/support/assistenza-faq "PEF Power - Servizio clienti e FAQ"
[6]: https://www.pefpower.it/it/informatives/guida-alla-bolletta "PEF Power - Guida alla bolletta"
[7]: https://www.blotix.com/asset-tokenization "Blotix - Asset tokenization"
[8]: https://www.agcm.it/dotcmsdoc/allegati-news/PS11889%20Ubroker%20chiusura.pdf "AGCM - Provvedimento PS11889 Ubroker"
