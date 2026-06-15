import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware di emergenza anti-crash per Vercel.
 *
 * Motivo: il deploy pubblico sta restituendo MIDDLEWARE_INVOCATION_FAILED
 * anche su /auth/login. Per sbloccare immediatamente login e demo,
 * il middleware non importa Supabase e non esegue logiche asincrone.
 *
 * La protezione cloud potrà essere riattivata lato pagina/API dopo aver
 * verificato che le variabili Supabase siano correttamente presenti su Vercel.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/demo/:path*', '/auth/:path*'],
}
