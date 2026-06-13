# Test browser — profili locali separati

Data test: 2026-06-09

## Obiettivo

Verificare che la versione gratuita e privata del CRM permetta di usare più profili locali, ad esempio proprietario e soci, senza mostrare i contatti di un profilo dentro l’altro.

## Esito osservato

| Verifica | Risultato |
|---|---|
| Apertura pagina `/demo` | Riuscita |
| Profilo iniziale `Io` | Presente con i dati locali già salvati dal test precedente |
| Creazione profilo `Socio A` | Riuscita |
| Passaggio automatico al profilo `Socio A` | Riuscito |
| Separazione contatti | Riuscita: `Socio A` mostra 0 contatti mentre `Io` aveva 1 contatto |
| Separazione task | Riuscita: `Socio A` mostra 0 task mentre `Io` aveva 1 task |
| Messaggio privacy in UI | Presente: i dati del profilo attivo sono salvati separatamente nel browser e non vengono mostrati agli altri profili |

## Nota operativa

La separazione attuale è **local-first gratuita**. Sullo stesso browser i profili sono separati logicamente, ma non sono account con password. Se ogni socio usa il proprio dispositivo, ognuno avrà il proprio archivio locale. Per account con login, isolamento server-side e sincronizzazione multi-dispositivo servirà in futuro Supabase o un database equivalente.

## Verifica di ritorno al profilo principale

Dopo aver selezionato nuovamente il profilo `Io`, il CRM ha mostrato di nuovo il contatto e il task del profilo principale. Questo conferma che il profilo `Socio A` non ha sovrascritto i dati del profilo `Io` e che il cambio profilo carica archivi locali distinti.

| Passaggio | Esito |
|---|---|
| Cambio da `Socio A` a `Io` | Riuscito |
| Ricomparsa contatti del profilo `Io` | Riuscita |
| Ricomparsa task del profilo `Io` | Riuscita |
| Dati di `Socio A` mescolati con `Io` | No |
