import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'
import { MessageSquare, Upload, FileText, Mic, Mail, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

const channelIcons: Record<string, any> = {
  whatsapp: MessageSquare,
  telegram: MessageSquare,
  email: Mail,
  zoom: Video,
  meet: Video,
  teams: Video,
  telefono: Mic,
  nota_vocale: Mic,
  manual: FileText,
}

export default async function ConversationsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, contact_id, channel, raw_content, transcription, duration_seconds, occurred_at, created_at, contacts(id, first_name, last_name, status), ai_summaries(id, summary, confidence, suggested_actions)')
    .eq('user_id', user!.id)
    .order('occurred_at', { ascending: false })
    .limit(50)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversazioni</h1>
          <p className="text-sm text-gray-500 mt-1">Storico degli input relazionali analizzati dall'AI e collegati ai contatti.</p>
        </div>
        <Link href="/dashboard/conversations/upload" className="btn-primary">
          <Upload className="w-4 h-4" /> Carica input
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Conversazioni</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{conversations?.length ?? 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Con AI summary</div>
          <div className="text-3xl font-bold text-brand-600 mt-1">{conversations?.filter((c: any) => c.ai_summaries?.length > 0).length ?? 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Canali usati</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{new Set((conversations ?? []).map((c: any) => c.channel)).size}</div>
        </div>
      </div>

      <div className="space-y-3">
        {(conversations ?? []).map((conversation: any) => {
          const Icon = channelIcons[conversation.channel] ?? FileText
          const content = conversation.transcription || conversation.raw_content || 'Nessun contenuto testuale disponibile.'
          const summary = conversation.ai_summaries?.[0]?.summary
          return (
            <div key={conversation.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/dashboard/contacts/${conversation.contact_id}`} className="font-semibold text-gray-900 hover:text-brand-600">
                        {conversation.contacts?.first_name} {conversation.contacts?.last_name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="badge bg-gray-100 text-gray-600 capitalize">{conversation.channel}</span>
                        {conversation.contacts?.status && <span className="badge bg-brand-50 text-brand-700">{conversation.contacts.status}</span>}
                        {summary && <span className="badge bg-green-50 text-green-700">AI analizzata</span>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(conversation.occurred_at).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{content}</p>
                  {summary && (
                    <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <div className="text-xs font-medium text-amber-700 mb-1">Sintesi AI</div>
                      <p className="text-sm text-gray-700">{summary}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {(!conversations || conversations.length === 0) && (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>Nessuna conversazione ancora caricata.</p>
          <Link href="/dashboard/conversations/upload" className="btn-primary mt-4 inline-flex">Carica la prima conversazione</Link>
        </div>
      )}
    </div>
  )
}
