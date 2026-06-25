'use client'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { hasUsablePublicSupabaseConfig } from '@/lib/supabase-config'
import { useRouter } from 'next/navigation'
import { Brain } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const redirectTo = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/demo' : '/demo'
  const canUseCloudLogin = useMemo(() => hasUsablePublicSupabaseConfig(), [])

  function enterLocalDemo() {
    const cleanEmail = (email || 'demo@locale.crm').trim()
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('crm_demo_auth_email', cleanEmail)
      window.localStorage.setItem('crm_demo_login_mode', 'local')
    }
    toast.success('Accesso locale attivato: apro il CRM demo.')
    router.push('/demo')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!canUseCloudLogin) {
      enterLocalDemo()
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message || 'Accesso non riuscito. Verifica email e password.')
      } else {
        router.push(redirectTo)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-100 p-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CRM AI</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Accesso CRM</h1>
        <p className="text-sm text-gray-500 mb-3">Inserisci email e password. Se il cloud non è configurato, l’accesso funziona in modalità locale e apre subito la demo.</p>
        {!canUseCloudLogin && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Modalità locale attiva: puoi entrare senza Supabase. I dati restano nel browser; usa Backup/Importa per conservarli.</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full" placeholder="mario@esempio.it" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Accesso...' : canUseCloudLogin ? 'Accedi' : 'Entra nel CRM demo'}
          </button>
          <button type="button" onClick={enterLocalDemo} className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50">Apri CRM demo locale</button>
        </form>
      </div>
    </div>
  )
}
