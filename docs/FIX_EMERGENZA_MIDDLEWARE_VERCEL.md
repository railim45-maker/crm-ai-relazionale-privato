# Fix emergenza per `MIDDLEWARE_INVOCATION_FAILED` su Vercel

Il deploy pubblico continua a rispondere con errore `MIDDLEWARE_INVOCATION_FAILED` su `/auth/login`. Questo significa che Vercel sta fallendo **prima** di servire la pagina di login, quindi la causa è nel middleware eseguito a livello edge/runtime.

## Patch applicata

È stata applicata una patch radicale al file `middleware.ts`. La versione di emergenza non importa Supabase, non legge cookie, non esegue logiche asincrone e non reindirizza. Serve a sbloccare immediatamente `/auth/login` e `/demo`.

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/demo/:path*', '/auth/:path*'],
}
```

Questa patch è intenzionalmente semplice. Dopo il deploy, Vercel non deve più poter generare `MIDDLEWARE_INVOCATION_FAILED` dalla logica Supabase del middleware.

## Verifiche locali superate

| Controllo | Esito |
|---|---:|
| `npm run type-check` | Superato |
| `npm run build` | Superato |
| `GET /auth/login` in produzione locale | `200 OK` |
| `GET /demo` in produzione locale | `200 OK` |

## Cosa fare su Vercel

Carica il nuovo pacchetto di emergenza oppure sostituisci manualmente `middleware.ts` nel repository collegato a Vercel con la versione indicata sopra. Poi forza un nuovo deploy completo.

Dopo il deploy, apri direttamente:

```text
https://crm-ai-relazionale-privato-dvur4iq68-railims-projects.vercel.app/auth/login
https://crm-ai-relazionale-privato-dvur4iq68-railims-projects.vercel.app/demo
```

L’esito corretto è una pagina HTML, non il testo `A server error has occurred`.

## Nota importante

Questa patch disattiva temporaneamente la protezione middleware per sbloccare l’accesso. È una scelta corretta in emergenza perché il CRM deve prima tornare visibile. Una volta confermato che `/auth/login` e `/demo` funzionano sul dominio pubblico, la protezione potrà essere riattivata in modo più sicuro, preferibilmente evitando che il middleware blocchi anche la pagina di login.
