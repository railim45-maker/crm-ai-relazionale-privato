import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as _createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function missingPublicSupabaseConfig() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

function createDisabledClient(): SupabaseClient<any, any, any> {
  const emptyQuery = {
    select: () => emptyQuery,
    insert: () => emptyQuery,
    update: () => emptyQuery,
    upsert: () => emptyQuery,
    delete: () => emptyQuery,
    eq: () => emptyQuery,
    order: () => emptyQuery,
    limit: () => emptyQuery,
    single: async () => ({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  } as any

  return {
    auth: {
      async getUser() {
        return { data: { user: null }, error: null }
      },
      async signOut() {
        return { error: null }
      },
    },
    from: () => emptyQuery,
    rpc: async () => ({ data: [], error: null }),
  } as unknown as SupabaseClient<any, any, any>
}

export function createClient(): SupabaseClient<any, any, any> {
  if (missingPublicSupabaseConfig()) {
    return createDisabledClient()
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function createServerClient(): Promise<SupabaseClient<any, any, any>> {
  if (missingPublicSupabaseConfig()) {
    return createDisabledClient()
  }

  const cookieStore = await cookies()
  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: any }[]) => {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
}

export function createAdminClient(): SupabaseClient<any, any, any> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createDisabledClient()
  }

  const { createClient: _create } = require('@supabase/supabase-js')
  return _create(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
