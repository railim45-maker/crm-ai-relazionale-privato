import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient, createServerClient } from '@/lib/supabase'
import { hasUsableAdminSupabaseConfig, hasUsablePublicSupabaseConfig } from '@/lib/supabase-config'

export const runtime = 'nodejs'

function googleConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID?.trim() || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI?.trim() || '',
  }
}

function baseUrl(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  return request.nextUrl.origin
}

function redirectToDemo(request: NextRequest, params: Record<string, string>) {
  const url = new URL('/demo', request.url)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  if (!hasUsablePublicSupabaseConfig() || !hasUsableAdminSupabaseConfig()) {
    return redirectToDemo(request, { google: 'error', reason: 'supabase_non_configurato' })
  }

  const { clientId, clientSecret, redirectUri } = googleConfig()
  if (!clientId || !clientSecret) {
    return redirectToDemo(request, { google: 'error', reason: 'google_env_mancanti' })
  }

  const code = request.nextUrl.searchParams.get('code') || ''
  const state = request.nextUrl.searchParams.get('state') || ''
  const error = request.nextUrl.searchParams.get('error') || ''
  if (error) return redirectToDemo(request, { google: 'error', reason: error })
  if (!code || !state) return redirectToDemo(request, { google: 'error', reason: 'callback_incompleta' })

  const cookieStore = await cookies()
  const expectedState = cookieStore.get('google_oauth_state')?.value || ''
  cookieStore.delete('google_oauth_state')
  if (!expectedState || expectedState !== state) {
    return redirectToDemo(request, { google: 'error', reason: 'state_non_valido' })
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirectToDemo(request, { google: 'error', reason: 'utente_non_autenticato' })

  const callbackUrl = redirectUri || `${baseUrl(request)}/api/google/callback`
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: callbackUrl,
    }),
  })
  const tokenPayload = await tokenResponse.json().catch(() => ({} as any))
  if (!tokenResponse.ok || !tokenPayload?.access_token) {
    return redirectToDemo(request, { google: 'error', reason: 'token_non_creato' })
  }

  const userInfoResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
  })
  const userInfo = await userInfoResponse.json().catch(() => ({} as any))
  const email = String(userInfo?.email || user.email || 'primary').trim()
  const displayName = String(userInfo?.name || email || 'Google Calendar').trim()
  const expiresAt = new Date(Date.now() + Number(tokenPayload.expires_in || 3600) * 1000).toISOString()

  const admin = createAdminClient()
  const { error: upsertError } = await admin.from('channel_accounts').upsert({
    user_id: user.id,
    provider: 'meet',
    external_account_id: email,
    display_name: displayName,
    status: 'active',
    last_sync_at: new Date().toISOString(),
    config: {
      email,
      display_name: displayName,
      access_token: tokenPayload.access_token,
      refresh_token: tokenPayload.refresh_token,
      expires_at: expiresAt,
      scope: tokenPayload.scope,
      token_type: tokenPayload.token_type,
      calendar_id: process.env.GOOGLE_CALENDAR_ID?.trim() || 'primary',
      connected_at: new Date().toISOString(),
    },
  }, { onConflict: 'user_id,provider,external_account_id' })

  if (upsertError) {
    return redirectToDemo(request, { google: 'error', reason: 'salvataggio_account_fallito' })
  }

  return redirectToDemo(request, { google: 'connected' })
}
