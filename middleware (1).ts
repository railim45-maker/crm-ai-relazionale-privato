import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware neutralizzato per Vercel.
 *
 * Questo file deve SOSTITUIRE il vecchio `middleware.ts` nella root del progetto.
 *
 * Importante:
 * - non importa Supabase;
 * - non legge cookie;
 * - non legge variabili ambiente;
 * - non intercetta /auth/login;
 * - non intercetta /dashboard;
 * - non intercetta /demo.
 *
 * Il matcher sotto usa una route fittizia che non verrà mai visitata.
 * In questo modo Vercel può compilare il progetto, ma il middleware non viene
 * eseguito sulle pagine reali e non può più causare MIDDLEWARE_INVOCATION_FAILED.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/__middleware_disabled_never_match__/:path*'],
}
