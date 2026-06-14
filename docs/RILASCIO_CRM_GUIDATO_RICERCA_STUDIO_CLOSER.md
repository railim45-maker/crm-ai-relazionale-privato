# Rilascio CRM guidato · Ricerca lead, Studio su misura e closer consulenziale

Questo rilascio integra nel CRM un percorso operativo più semplice, guidato e consulenziale, pensato per accompagnare il closer dalla prima informazione disponibile fino alla preparazione di messaggi professionali e coerenti con la situazione reale del lead.

## Funzioni integrate

| Area | Integrazione |
|---|---|
| **Ricerca guidata lead** | Nuova sezione nel menu principale per partire da azienda/attività oppure da persona fisica. |
| **Disambiguazione aziendale** | Gestione separata di nome commerciale, insegna, brand, alias e ragione sociale. |
| **Persona fisica** | Gestione di nome, cognome, città, email, telefono e collegamenti aziendali con prudenza. |
| **Fonti pubbliche** | Campi per siti, directory, Google Business, LinkedIn, recensioni, pagine Facebook candidate e pagina confermata. |
| **Confidenza** | Punteggio e livello di affidabilità per distinguere dati forti, dati medi e ipotesi da verificare. |
| **Diagnosi consulenziale** | Sintesi problemi probabili, lamentele pubbliche, bisogni, domande consigliate e percorso più coerente. |
| **Collegamento al closer** | Il salvataggio della ricerca crea una nota interna, una nuova analisi conversazionale e un task operativo. |
| **Messaggi professionali** | Template email e WhatsApp aggiornati con tono da closer consulenziale, italiano corretto e obiettivo di diagnosi. |
| **Studio su misura** | Collegamento con valore aziendale, capitale sociale, immobili, magazzino, energia, plafond, 2,5% annuo e copertura servizi. |
| **Deploy** | Build verificata con `npm run build` e ZIP pulito rigenerato. |

## Logica operativa

Il CRM ora permette di lavorare in modo più ordinato: prima si seleziona il lead, poi si decide se partire dall’attività o dalla persona fisica. Il sistema non presume che il nome commerciale coincida con la società formale, ma conserva le due informazioni separatamente. Le pagine Facebook e i social candidate vengono trattati come ipotesi fino a quando non sono confermati da segnali coerenti come dominio, telefono, città, descrizione attività o collegamento dal sito ufficiale.

La generazione dei messaggi è stata orientata a un approccio consulenziale. Il messaggio non deve vendere a tutti i costi, ma far emergere il problema corretto, verificare se la soluzione ha senso e, solo dopo, collegare il percorso più utile. Quando esistono dati economici sufficienti, il CRM considera anche il fatto che i costi dei servizi possono essere compensati in tutto o in parte da tokenizzazione, plafond, risparmi operativi o efficientamento energetico.

## Verifica tecnica

La build di produzione è stata eseguita con successo tramite:

```bash
npm run build
```

L’esito è stato positivo: compilazione, controllo tipi, raccolta dati pagina e generazione statica della pagina `/demo` completati correttamente.
