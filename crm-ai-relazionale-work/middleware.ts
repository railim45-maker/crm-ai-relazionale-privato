import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware minimale di emergenza per Vercel.
 *
 * Questo file serve a risolvere l'errore:
 * 500: INTERNAL_SERVER_ERROR
 * Code: MIDDLEWARE_INVOCATION_FAILED
 *
 * Non importa Supabase, non legge variabili ambiente, non legge cookie
 * e non esegue logiche asincrone. In questo modo il middleware non può
 * bloccare /auth/login prima che la pagina venga servita.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/demo/:path*', '/auth/:path*'],
}
