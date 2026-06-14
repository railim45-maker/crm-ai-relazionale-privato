# Schema tecnico: Ricerca lead a doppio percorso

Autore: **Manus AI**

## Scopo tecnico

Questo schema traduce la specifica della **Ricerca intelligente lead** in una struttura implementabile nel CRM. La funzione deve supportare due ingressi principali: **azienda/attività commerciale** e **persona fisica**. Il sistema deve mantenere separate le identità e collegarle solo quando esistono segnali pubblici coerenti.

## Modello dati consigliato

| Entità | Campi principali | Funzione |
|---|---|---|
| **Persona** | nome, cognome, città, telefono, email, ruolo presunto, note | Identifica il contatto umano e il modo corretto di dialogare. |
| **Azienda** | ragione sociale, nome commerciale, insegna, brand, dominio, sito, città, settore | Identifica l’attività reale e le sue varianti pubbliche. |
| **Fonte pubblica** | url, tipo, titolo, estratto, identità collegata, confidenza, motivazione | Conserva solo fonti utili e verificabili. |
| **Candidato social** | piattaforma, url, nome pagina, punteggio, segnali positivi, segnali negativi | Propone pagine Facebook/social da confermare. |
| **Sintesi consulenziale** | attività compresa, bisogni probabili, domande consigliate, percorso suggerito | Alimenta closer, studio su misura e comunicazioni assistite. |

## Flusso logico

| Step | Input | Elaborazione | Output |
|---|---|---|---|
| **1. Scelta modalità** | `company`, `person`, `mixed` | Decide quali query e campi pesare di più. | Modalità attiva. |
| **2. Normalizzazione** | Nome, cognome, telefono, email, città, sito, ragione sociale, nome commerciale | Pulisce varianti, domini, prefissi societari, alias e città. | Identità normalizzate. |
| **3. Generazione query** | Identità normalizzate | Crea ricerche leggere e mirate. | Lista query suggerite. |
| **4. Raccolta fonti** | Risultati pubblici | Salva solo URL e dati pertinenti. | Fonti candidate. |
| **5. Matching** | Fonti + identità | Calcola punteggio e motivazione. | Confidenza alta/media/bassa/scartata. |
| **6. Conferma umana** | Candidate ordinate | L’utente conferma o scarta. | Fonti ufficiali del lead. |
| **7. Sintesi** | Fonti confermate | Produce bisogni, domande e percorso. | Output closer. |

## Query suggerite

| Partenza | Query prioritarie |
|---|---|
| **Azienda** | `nome commerciale + città`, `insegna + città`, `dominio`, `telefono + nome commerciale`, `ragione sociale + città`, `brand + Facebook`, `nome commerciale + recensioni`. |
| **Persona fisica** | `nome cognome + città + attività`, `email dominio`, `telefono + attività`, `nome cognome + azienda nota`, `nome cognome + LinkedIn`, `nome cognome + nome commerciale`. |
| **Mista** | Combina persona e azienda, ma assegna confidenza alta solo se almeno un segnale forte coincide: telefono, dominio, email o indirizzo. |

## Punteggio di confidenza

| Segnale | Punti |
|---|---:|
| Telefono pubblico identico | +30 |
| Dominio sito identico | +30 |
| Email o dominio email coerente | +20 |
| Città o indirizzo coerente | +15 |
| Nome commerciale/insegna coerente | +20 |
| Ragione sociale coerente | +15 |
| Categoria attività coerente | +10 |
| Descrizione/post coerenti | +10 |
| Persona indicata come referente pubblico | +10 |
| Città diversa | -25 |
| Settore incompatibile | -25 |
| Solo nome simile senza altri segnali | -20 |

| Fascia | Confidenza | Azione |
|---:|---|---|
| 80-100 | Alta | Proporre come fonte affidabile, con conferma rapida. |
| 55-79 | Media | Mostrare come candidata da verificare. |
| 30-54 | Bassa | Non usare per proposta automatica. |
| 0-29 | Scartata | Non collegare salvo conferma manuale. |

## Integrazione con CRM

La funzione deve comparire nella scheda lead come pulsante **Ricerca intelligente**. Prima dell’avvio, il CRM deve chiedere se si parte da **azienda/attività** o da **persona fisica**. Dopo la ricerca, il risultato deve essere salvabile nella scheda del lead e riutilizzabile nello **Studio su misura** e nelle **Comunicazioni assistite**.

## Regola di sicurezza operativa

Il sistema deve sempre presentare i risultati come **ipotesi da verificare**. Nessuna pagina Facebook, profilo personale o attività deve essere considerata collegata al lead se non esiste almeno un segnale forte o una conferma manuale dell’utente.
