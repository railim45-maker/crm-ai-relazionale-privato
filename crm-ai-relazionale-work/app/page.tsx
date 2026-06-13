import Link from 'next/link'
import { ArrowRight, Bot, CheckCircle2, Database, Download, Lock, MessageSquareText, ShieldCheck, Users } from 'lucide-react'

const capabilities = [
  'Aggiunta e modifica di contatti reali personali',
  'Task e follow-up salvati localmente nel browser',
  'Storico conversazioni con analisi e prossima azione',
  'Agente operativo che legge i dati inseriti e suggerisce priorità',
  'Backup JSON scaricabile dei tuoi dati',
  'Percorso pronto per collegare Supabase quando servirà il multi-dispositivo',
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f6f1] text-stone-950">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <nav className="flex items-center justify-between rounded-full border border-stone-200 bg-white px-5 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">RelazioneCRM</p>
                <p className="text-xs text-stone-500">postazione CRM personale</p>
              </div>
            </div>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800">
              Apri il CRM <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-900">
            <Lock className="h-4 w-4" /> Uso personale, non SaaS, non vetrina
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Il tuo CRM AI relazionale per lavorare sui tuoi contatti reali.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-650">
            Questa versione è pensata per essere usata da te: inserisci contatti, note, conversazioni e follow-up reali. I dati vengono salvati nel browser tramite localStorage, quindi puoi iniziare subito senza configurare Supabase, Claude o n8n.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-4 font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800">
              Entra nella postazione personale <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/auth/login" className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-4 font-bold text-stone-900 hover:bg-stone-50">
              Ambiente Supabase quando attivo
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-300/30">
          <div className="rounded-[1.5rem] bg-stone-950 p-5 text-white">
            <p className="text-sm text-stone-300">Suggerimento operativo</p>
            <h2 className="mt-1 text-2xl font-bold">Parti dai contatti reali</h2>
            <p className="mt-4 leading-7 text-stone-300">
              Aggiungi i tuoi primi contatti, incolla una conversazione o una nota, genera un task e lascia che l’agente ti mostri le priorità della giornata.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-blue-50 p-4">
              <Users className="mb-3 h-5 w-5 text-blue-700" />
              <p className="text-sm text-stone-500">Contatti</p>
              <p className="text-2xl font-black">CRUD reale</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4">
              <Database className="mb-3 h-5 w-5 text-green-700" />
              <p className="text-sm text-stone-500">Persistenza</p>
              <p className="text-2xl font-black">locale</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <MessageSquareText className="mb-3 h-5 w-5 text-amber-700" />
              <p className="text-sm text-stone-500">Conversazioni</p>
              <p className="text-2xl font-black">storico</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4">
              <Download className="mb-3 h-5 w-5 text-purple-700" />
              <p className="text-sm text-stone-500">Backup</p>
              <p className="text-2xl font-black">JSON</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">Cosa puoi fare ora</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Uno strumento operativo, non una pagina commerciale.</h2>
            <p className="mt-4 leading-7 text-stone-600">
              L’app personale funziona anche senza credenziali esterne. Quando vorrai renderla permanente su più dispositivi, la base Supabase già presente nel progetto potrà sostituire la persistenza locale.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {capabilities.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-stone-200 bg-[#fbfaf6] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                <span className="leading-7 text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-[2rem] bg-stone-950 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
              <ShieldCheck className="h-8 w-8 text-green-300" />
            </div>
            <div>
              <h2 className="text-3xl font-black">I dati personali restano sotto il tuo controllo.</h2>
              <p className="mt-4 leading-8 text-stone-300">
                In modalità locale i dati rimangono nel browser che stai usando. Puoi scaricare un backup JSON prima di cambiare dispositivo o cancellare il browser. Per uso stabile multi-dispositivo, usa Supabase con il tuo progetto e le tue credenziali.
              </p>
              <Link href="/demo" className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-stone-950 hover:bg-stone-100">
                Apri CRM personale <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 px-6 py-8 text-center text-sm text-stone-500">
        <p><strong className="text-stone-800">RelazioneCRM</strong> · CRM AI Relazionale per uso personale.</p>
      </footer>
    </main>
  )
}
