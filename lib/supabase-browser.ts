import { createBrowserClient } from '@supabase/ssr'
import { hasUsablePublicSupabaseConfig } from './supabase-config'

function missingSupabaseConfig() {
  return !hasUsablePublicSupabaseConfig()
}

function createDisabledBrowserClient() {
  return {
    auth: {
      async signInWithPassword(credentials?: { email?: string }) {
        const email = credentials?.email || 'demo@locale.crm'
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('crm_demo_auth_email', email)
          window.localStorage.setItem('crm_demo_login_mode', 'local')
        }
        return {
          data: { user: { id: 'local-demo-user', email } },
          error: null,
        }
      },
      async signOut() {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('crm_demo_auth_email')
          window.localStorage.removeItem('crm_demo_login_mode')
        }
        return { error: null }
      },
      async getUser() {
        const email = typeof window !== 'undefined' ? window.localStorage.getItem('crm_demo_auth_email') : ''
        return { data: { user: email ? { id: 'local-demo-user', email } : null }, error: null }
      },
    },
  } as any
}

export function createClient() {
  if (missingSupabaseConfig()) {
    return createDisabledBrowserClient()
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
