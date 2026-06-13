import { createBrowserClient } from '@supabase/ssr'

function missingSupabaseConfig() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

function createDisabledBrowserClient() {
  return {
    auth: {
      async signInWithPassword() {
        return {
          data: null,
          error: {
            message:
              'Login cloud non configurato. Questa versione del CRM è attiva in modalità privata local-first: usa la pagina /demo.',
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
