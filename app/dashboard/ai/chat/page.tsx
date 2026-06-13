'use client'
import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, Loader2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
  'Chi devo contattare oggi?',
  'Quali lead sono più caldi?',
  'Chi non sento da oltre 30 giorni?',
  'Qual è lo stato della pipeline?',
  'Chi ha partecipato all\'ultimo webinar?',
  'Quali opportunità sono ferme?',
]

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Ciao! Sono il tuo Agente AI CRM. Posso aiutarti a trovare chi contattare oggi, analizzare la pipeline, identificare opportunità e molto altro. Come posso aiutarti?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendMessage(text?: string) {
    const content = text ?? input.trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.slice(-10)
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: content, history })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Errore nella comunicazione con l\'AI. Riprova.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agente AI Centrale</h1>
          <p className="text-xs text-gray-500">Accesso a tutti i tuoi dati relazionali in linguaggio naturale</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              msg.role === 'assistant' ? 'bg-brand-100' : 'bg-gray-100')}>
              {msg.role === 'assistant' ? <Sparkles className="w-4 h-4 text-brand-600" /> : <User className="w-4 h-4 text-gray-600" />}
            </div>
            <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'assistant' ? 'bg-white border border-gray-100 text-gray-800' : 'bg-brand-600 text-white')}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-brand-600" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => sendMessage(p)}
              className="text-left text-xs p-3 bg-white border border-gray-100 rounded-xl hover:border-brand-200 hover:bg-brand-50 text-gray-600 hover:text-brand-700 transition-colors">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Chiedi all'AI..." className="flex-1" disabled={loading} />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
          className="btn-primary px-4">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
