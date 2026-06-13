'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, LayoutDashboard, Users, MessageSquare, TrendingUp, Calendar, CheckSquare, Video, Bot, Upload, Lightbulb, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const nav = [
  { section: 'CRM', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/contacts', label: 'Contatti', icon: Users },
    { href: '/dashboard/conversations', label: 'Conversazioni', icon: MessageSquare },
    { href: '/dashboard/pipeline', label: 'Pipeline', icon: TrendingUp },
    { href: '/dashboard/calendar', label: 'Agenda', icon: Calendar },
    { href: '/dashboard/tasks', label: 'Task', icon: CheckSquare },
    { href: '/dashboard/webinars', label: 'Webinar', icon: Video },
  ]},
  { section: 'AI', items: [
    { href: '/dashboard/ai/chat', label: 'Agente AI', icon: Bot },
    { href: '/dashboard/conversations/upload', label: 'Carica Input', icon: Upload },
    { href: '/dashboard/ai/insights', label: 'Insight', icon: Lightbulb },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="w-56 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-gray-900">CRM AI</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {nav.map(group => (
          <div key={group.section}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-1.5">{group.section}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href}
                    className={cn('flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors',
                      active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button onClick={logout} className="btn-ghost w-full justify-start text-gray-500">
          <LogOut className="w-4 h-4" /> Esci
        </button>
      </div>
    </aside>
  )
}
