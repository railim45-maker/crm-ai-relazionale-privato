import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { hasUsablePublicSupabaseConfig } from '@/lib/supabase-config'
import Sidebar from '@/components/layout/Sidebar'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!hasUsablePublicSupabaseConfig()) redirect('/demo')

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
