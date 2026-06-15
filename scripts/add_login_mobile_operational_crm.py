from pathlib import Path

root = Path('/home/ubuntu/crm-ai-relazionale-work')
demo = root / 'app/demo/page.tsx'
middleware = root / 'middleware.ts'
login = root / 'app/auth/login/page.tsx'
layout = root / 'app/layout.tsx'

text = demo.read_text()
text = text.replace("import { ChangeEvent, useEffect, useMemo, useState } from 'react'", "import { ChangeEvent, useEffect, useMemo, useState } from 'react'\nimport { createClient } from '@/lib/supabase-browser'")
text = text.replace("import { Bot, Building2, Calculator, CheckSquare, ChevronRight, ClipboardList, Copy, Database, Download, Mail, MessageSquareText, Pencil, Phone, Plus, Save, Search, Send, ShieldCheck, Star, Trash2, TrendingUp, Upload, UserPlus, Users, Zap } from 'lucide-react'", "import { Bot, Building2, Calculator, CheckSquare, ChevronRight, ClipboardList, Copy, Database, Download, LogIn, LogOut, Mail, MessageSquareText, Pencil, Phone, Plus, Save, Search, Send, ShieldCheck, Star, Trash2, TrendingUp, Upload, UserPlus, Users, Zap } from 'lucide-react'")
text = text.replace("  const [cloudStatus, setCloudStatus] = useState<CloudPersistenceStatus>('verifica')\n  const [cloudMessage, setCloudMessage] = useState('Verifico se il CRM può salvare sul database persistente.')\n  const [cloudReady, setCloudReady] = useState(false)", "  const [cloudStatus, setCloudStatus] = useState<CloudPersistenceStatus>('verifica')\n  const [cloudMessage, setCloudMessage] = useState('Verifico se il CRM può salvare sul database persistente.')\n  const [cloudReady, setCloudReady] = useState(false)\n  const [authEmail, setAuthEmail] = useState('')")
text = text.replace("  function loadProfileData(profileId: string, useLegacyFallback = false) {", "  async function checkAuthUser() {\n    try {\n      const supabase = createClient()\n      const { data } = await supabase.auth.getUser()\n      setAuthEmail(data.user?.email || '')\n    } catch {\n      setAuthEmail('')\n    }\n  }\n\n  async function signOutFromDemo() {\n    try {\n      const supabase = createClient()\n      await supabase.auth.signOut()\n    } finally {\n      window.location.href = '/auth/login?redirect=/demo'\n    }\n  }\n\n  function goToLogin() {\n    window.location.href = '/auth/login?redirect=/demo'\n  }\n\n  function loadProfileData(profileId: string, useLegacyFallback = false) {")
text = text.replace("  useEffect(() => {\n    try {", "  useEffect(() => {\n    void checkAuthUser()\n    try {", 1)
text = text.replace("<main className=\"flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full\">", "<main className=\"flex-1 p-3 pb-28 md:p-8 md:pb-8 max-w-7xl mx-auto w-full\">")
old_mobile_nav = "{nav.map((item) => <button key={item.id} onClick={() => setSection(item.id)} className=\"md:hidden px-3 py-2 rounded-xl border bg-white text-sm\">{item.label}</button>)}"
new_mobile_nav = "<select value={section} onChange={(e) => setSection(e.target.value as Section)} className=\"md:hidden col-span-2 sm:col-span-1 rounded-xl border bg-white px-3 py-3 text-sm font-semibold\" aria-label=\"Sezione CRM\">{nav.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>"
text = text.replace(old_mobile_nav, new_mobile_nav)
text = text.replace("<div className=\"flex flex-wrap gap-2\">", "<div className=\"grid grid-cols-2 sm:flex sm:flex-wrap gap-2\">", 1)
login_box_old = "<button onClick={clearAllData} className=\"px-4 py-2 rounded-xl border bg-white hover:bg-red-50 text-sm text-red-700 inline-flex items-center gap-2\"><Trash2 className=\"w-4 h-4\" />Reset</button></div></header>"
login_box_new = "<button onClick={clearAllData} className=\"px-4 py-2 rounded-xl border bg-white hover:bg-red-50 text-sm text-red-700 inline-flex items-center gap-2 justify-center\"><Trash2 className=\"w-4 h-4\" />Reset</button>{authEmail ? <button onClick={signOutFromDemo} className=\"col-span-2 sm:col-span-1 px-4 py-2 rounded-xl border bg-white hover:bg-stone-50 text-sm inline-flex items-center gap-2 justify-center\"><LogOut className=\"w-4 h-4\" />Esci</button> : <button onClick={goToLogin} className=\"col-span-2 sm:col-span-1 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black text-sm inline-flex items-center gap-2 justify-center\"><LogIn className=\"w-4 h-4\" />Accedi</button>}</div></header>"
text = text.replace(login_box_old, login_box_new)
status_old = "<div className={`mt-3 inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold ${cloudStatus === 'cloud' ? 'bg-green-50 border-green-200 text-green-800' : cloudStatus === 'salvataggio' ? 'bg-blue-50 border-blue-200 text-blue-800' : cloudStatus === 'locale' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'}`}><Database className=\"w-4 h-4\" />{cloudMessage}</div>"
status_new = "<div className=\"mt-3 flex flex-col sm:flex-row gap-2\"><div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold ${cloudStatus === 'cloud' ? 'bg-green-50 border-green-200 text-green-800' : cloudStatus === 'salvataggio' ? 'bg-blue-50 border-blue-200 text-blue-800' : cloudStatus === 'locale' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'}`}><Database className=\"w-4 h-4 shrink-0\" /><span>{cloudMessage}</span></div><div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold ${authEmail ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}><ShieldCheck className=\"w-4 h-4 shrink-0\" />{authEmail ? `Accesso: ${authEmail}` : 'Accesso non rilevato: usa login per lavorare in cloud'}</div></div>"
text = text.replace(status_old, status_new)
# Add fixed mobile bottom navigation before closing main/div at the very end. Use the first occurrence of final closing sequence.
old_end = "</main></div></div>"
new_end = "<nav className=\"md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-white/95 backdrop-blur px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] grid grid-cols-4 gap-1\">{[{ id: 'dashboard', label: 'Home', icon: TrendingUp }, { id: 'contacts', label: 'Lead', icon: Users }, { id: 'conversations', label: 'Messaggi', icon: MessageSquareText }, { id: 'agent', label: 'Agente', icon: Bot }].map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setSection(item.id as Section)} className={`rounded-2xl px-2 py-2 text-[11px] font-semibold flex flex-col items-center gap-1 ${section === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}><Icon className=\"w-4 h-4\" />{item.label}</button> })}</nav></main></div></div>"
if old_end in text:
    text = text.replace(old_end, new_end, 1)
else:
    raise SystemExit('Final main closing marker not found')
demo.write_text(text)

# Middleware: protect /demo too and keep redirect target.
mw = middleware.read_text()
mw = mw.replace("  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {\n    return NextResponse.redirect(new URL('/auth/login', request.url))\n  }", "  const requiresAuth = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/demo')\n  if (!user && requiresAuth) {\n    const loginUrl = new URL('/auth/login', request.url)\n    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)\n    return NextResponse.redirect(loginUrl)\n  }")
mw = mw.replace("export const config = { matcher: ['/dashboard/:path*', '/auth/:path*'] }", "export const config = { matcher: ['/dashboard/:path*', '/demo/:path*', '/auth/:path*'] }")
middleware.write_text(mw)

# Login page: redirect back to /demo when requested and improve copy.
lg = login.read_text()
lg = lg.replace("import { useRouter } from 'next/navigation'", "import { useRouter, useSearchParams } from 'next/navigation'")
lg = lg.replace("  const router = useRouter()\n  const supabase = createClient()", "  const router = useRouter()\n  const searchParams = useSearchParams()\n  const supabase = createClient()\n  const redirectTo = searchParams.get('redirect') || '/demo'")
lg = lg.replace("      router.push('/dashboard')", "      router.push(redirectTo)")
lg = lg.replace("<p className=\"text-sm text-gray-500 mb-6\">Accedi al tuo CRM relazionale</p>", "<p className=\"text-sm text-gray-500 mb-6\">Accedi per usare il CRM operativo con salvataggio persistente dei lead.</p>")
login.write_text(lg)

# Layout mobile metadata: add viewport export if not present.
ly = layout.read_text()
if "export const viewport" not in ly:
    ly = ly.replace("import type { Metadata } from 'next'", "import type { Metadata, Viewport } from 'next'")
    ly = ly.replace("export const metadata: Metadata = {", "export const viewport: Viewport = {\n  width: 'device-width',\n  initialScale: 1,\n  maximumScale: 1,\n  themeColor: '#f7f6f1',\n}\n\nexport const metadata: Metadata = {")
layout.write_text(ly)
