import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { hasUsablePublicSupabaseConfig } from '@/lib/supabase-config'

export const runtime = 'nodejs'

function googleConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID?.trim() || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI?.trim() || '',
  }
}

function baseUrl(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  return request.nextUrl.origin
}

export async function GET(request: NextRequest) {
  if (!hasUsablePublicSupabaseConfig()) {
    return NextResponse.json({ error: 'Supabase non configurato: collega prima il database cloud per salvare l’account Google.' }, { status: 503 })
  }

  const { clientId, redirectUri } = googleConfig()
  if (!clientId) {
    return NextResponse.json({ error: 'Google Calendar non configurato: manca GOOGLE_CLIENT_ID.' }, { status: 503 })
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login?next=/demo', request.url))
  }

  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('google_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    maxAge: 10 * 60,
    path: '/',
  })

  const callbackUrl = redirectUri || `${baseUrl(request)}/api/google/callback`
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', callbackUrl)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')
  authUrl.searchParams.set('include_granted_scopes', 'true')
  authUrl.searchParams.set('scope', [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.events',
  ].join(' '))
  authUrl.searchParams.set('state', state)

  return NextResponse.redirect(authUrl)
}
