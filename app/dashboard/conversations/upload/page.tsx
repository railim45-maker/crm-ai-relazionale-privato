'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase-browser'
import { Upload, Mic, FileText, CheckCircle, AlertCircle, Brain, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type AnalysisResult = {
  summary: string
  opportunities_found: number
  tasks_created: number
  suggested_tasks: Array<{ title: string; type: string; priority: string; due_days: number }>
  interests_updated: Array<{ area: string; level: number }>
  sentiment: { overall: string; temperature: string; suggested_status: string }
}

export default function UploadConversationPage() {
  const [contactId, setContactId] = useState('')
  const [contacts, setContacts] = useState<Array<{ id: string; first_name: string; last_name: string }>>([])
  const [channel, setChannel] = useState('whatsapp')
  const [textContent, setTextContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const supabase = createClient()

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3','.wav','.ogg','.webm','.m4a'], 'text/plain': ['.txt'] },
    maxFiles: 1,
  })

  async function searchContacts(q: string) {
    if (q.length < 2) return
    const { data } = await supabase.from('contacts')
      .select('id, first_name, last_name')
      .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
      .limit(8)
    setContacts(data ?? [])
  }

  async function handleAnalyze() {
    if (!contactId) { toast.error('Seleziona un contatto'); return }
    if (!file && !textContent) { toast.error('Inserisci testo o carica un file'); return }

    setAnalyzing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('contact_id', contactId)
      formData.append('channel', channel)
      if (file) formData.append('file', file)
      else formData.append('text', textContent)

      const res = await fetch('/api/conversations/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      setResult(data)
      toast.success('Conversazione analizzata con successo!')
    } catch (err: any) {
      toast.error('Errore: ' + err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const channels = ['whatsapp','telegram','email','zoom','meet','teams','telefono','manual']
  const tempColors: Record<string, string> = { freddo: 'bg-blue-100 text-blue-700', tiepido: 'bg-yellow-100 text-yellow-700', caldo: 'bg-orange-100 text-orange-700', bollente: 'bg-red-100 text-red-700' }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Carica conversazione</h1>
        <p className="text-sm text-gray-500 mt-1">L'AI analizzerà automaticamente il contenuto e aggiornerà il profilo del contatto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contatto */}
        <div className="card p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contatto *</label>
          <input placeholder="Cerca per nome..."
            onChange={e => searchContacts(e.target.value)}
            className="w-full mb-2" />
          {contacts.length > 0 && (
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              {contacts.map(c => (
                <button key={c.id} onClick={() => { setContactId(c.id); setContacts([]) }}
                  className={cn('w-full text-left px-3 py-2 text-sm hover:bg-brand-50 transition-colors',
                    contactId === c.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-700')}>
                  {c.first_name} {c.last_name}
                </button>
              ))}
            </div>
          )}
          {contactId && <p className="text-xs text-green-600 mt-1">✓ Contatto selezionato</p>}
        </div>

        {/* Canale */}
        <div className="card p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Canale</label>
          <div className="grid grid-cols-4 gap-2">
            {channels.map(ch => (
              <button key={ch} onClick={() => setChannel(ch)}
                className={cn('px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                  channel === ch ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Contenuto conversazione</h2>

        <div {...getRootProps()} className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-4',
          isDragActive ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
        )}>
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-3 text-green-600">
              {file.type.startsWith('audio/') ? <Mic className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              <span className="font-medium">{file.name}</span>
              <button onClick={e => { e.stopPropagation(); setFile(null) }} className="text-red-400 hover:text-red-600 ml-2">✕</button>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Trascina qui un file audio o .txt</p>
              <p className="text-xs text-gray-400 mt-1">Supportati: MP3, WAV, OGG, WEBM, M4A, TXT</p>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-400 mb-4">oppure</div>

        <textarea value={textContent} onChange={e => setTextContent(e.target.value)}
          placeholder="Incolla qui il testo della conversazione (chat WhatsApp, email, trascrizione, note...)"
          className="w-full h-40 resize-none p-3" />
      </div>

      <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary w-full justify-center py-3">
        {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analisi in corso...</> : <><Brain className="w-4 h-4" /> Analizza con AI</>}
      </button>

      {/* Risultato */}
      {result && (
        <div className="card p-6 border-green-200 bg-green-50 space-y-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <h2 className="font-semibold">Analisi completata</h2>
          </div>
          <p className="text-sm text-gray-700">{result.summary}</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-brand-600">{result.opportunities_found}</div>
              <div className="text-xs text-gray-500">Opportunità</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-orange-600">{result.tasks_created}</div>
              <div className="text-xs text-gray-500">Task creati</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <span className={`badge ${tempColors[result.sentiment.temperature] ?? 'bg-gray-100 text-gray-600'}`}>
                {result.sentiment.temperature}
              </span>
              <div className="text-xs text-gray-500 mt-1">Lead temp.</div>
            </div>
          </div>

          {result.interests_updated.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Interessi aggiornati:</p>
              <div className="flex flex-wrap gap-2">
                {result.interests_updated.map(i => (
                  <span key={i.area} className="badge bg-brand-100 text-brand-700">{i.area}: {i.level}/10</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
