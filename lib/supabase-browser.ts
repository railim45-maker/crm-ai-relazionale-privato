import { createBrowserClient } from '@supabase/ssr'
import { hasUsablePublicSupabaseConfig } from './supabase-config'

function missingSupabaseConfig() {
  return !hasUsablePublicSupabaseConfig()
}

function createDisabledBrowserClient() {
  return {
    auth: {
      async signInWithPassword() {
        return {
          data: null,
          error: {
            message:
              'Cloud non configurato: il CRM viene aperto in modalità demo locale.',
          },
        }
      },
      async signOut() {
        return { error: null }
      },
      async getUser() {
        return { data: { user: null }, error: null }
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
