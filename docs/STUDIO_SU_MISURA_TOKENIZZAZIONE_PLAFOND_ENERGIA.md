# Studio su misura: tokenizzazione, plafond servizi ed energia

Autore: **Manus AI**

## Obiettivo della nuova sezione

La nuova sezione **Studio su misura** trasforma il CRM da semplice archivio commerciale a strumento consulenziale preliminare. Il principio operativo è evitare la vendita standardizzata e costruire invece un percorso personalizzato sulla situazione reale del cliente, includendo bisogni, problemi, costi attuali, valore aziendale indicativo, possibile tokenizzazione, plafond servizi e valutazione energetica.

> Il CRM non deve promettere rendimenti e non sostituisce una perizia, un parere legale, fiscale o finanziario. La sezione serve a costruire una simulazione commerciale preliminare e un preventivo più coerente con i dati raccolti.

## Dati raccolti nel lead

La stima parte da dati inseriti manualmente sul singolo lead. Tutto resta **local-first** nel browser/profilo attivo e viene incluso nel backup JSON del CRM.

| Area | Campi principali |
|---|---|
| **Patrimonio** | Capitale sociale interamente versato, valore beni immobili, magazzino, impianti/arredi/attrezzature, crediti, liquidità, avviamento/brand. |
| **Economia aziendale** | Fatturato annuo, EBITDA o margine operativo annuo. |
| **Servizi** | Costo annuo dei servizi proposti e note sul plafond: Voice Desk, CRM, automazioni, consulenza, marketing, formazione, energia. |
| **Energia** | Costo annuo bollette, percentuale di risparmio stimato, percorso preferito tra `Da valutare`, `uBroker`, `PEF Power` o `Altro`. |
| **Consulenza** | Note libere su problemi, obiezioni, priorità personali e situazione attuale. |

## Logica di calcolo implementata

Il modulo calcola una stima prudenziale e indicativa, pensata per orientare una conversazione commerciale e non per produrre una valutazione ufficiale.

| Indicatore | Formula nel CRM |
|---|---|
| **Base patrimoniale** | Somma di capitale versato, immobili, magazzino, attrezzature, crediti, liquidità e brand/avviamento. |
| **Componente redditività** | EBITDA annuo × 3. |
| **Valore aziendale indicativo** | Base patrimoniale + componente redditività. |
| **Potenziale 2,5% annuo** | Valore aziendale indicativo × 2,5%. |
| **Risparmio energia stimato** | Costo energia annuo × percentuale di risparmio stimata. |
| **Copertura totale** | Potenziale 2,5% annuo + risparmio energia stimato. |
| **Margine o gap** | Copertura totale − costo annuo servizi proposti. |

## Integrazione nel flusso closer

La sezione è collegata anche alle **Comunicazioni assistite**. È stata aggiunta la fase **Studio su misura**, da usare dopo le prime domande strategiche e prima della proposta finale.

| Fase closer | Uso corretto |
|---|---|
| **Apertura delicata** | Non vendere. Aprire con una domanda semplice sul problema reale. |
| **Domande strategiche** | Far emergere criticità su richieste, tempo, personale, costi o energia. |
| **Qualificazione bisogno** | Capire frequenza, urgenza, valore economico e priorità della persona. |
| **Studio su misura** | Raccogliere dati patrimoniali, costi, energia e costruire un percorso personalizzato. |
| **Soluzione soft** | Collegare solo dopo i bisogni emersi: Voice Desk, CRM, energia, consulenza o combinazione. |
| **Call o demo** | Proporre una call breve o un esempio concreto basato sul caso specifico. |

## Avvertenza commerciale da mantenere

Il messaggio chiave è: **non vendiamo un pacchetto standard, costruiamo un vestito su misura**. Il CRM aiuta a mostrare al cliente che il preventivo può essere pensato come un plafond di servizi che si sostiene attraverso valorizzazione, risparmio e riduzione inefficienze, ma sempre dopo aver verificato dati e contesto.

## Stato tecnico

La build locale `npm run build` è stata verificata con successo dopo l’integrazione. Il pacchetto deploy aggiornato può essere pubblicato su Vercel o usato per aggiornare il repository collegato.
