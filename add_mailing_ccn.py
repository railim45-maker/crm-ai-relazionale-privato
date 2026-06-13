from pathlib import Path

path = Path('/home/ubuntu/crm-ai-relazionale-work/app/demo/page.tsx')
text = path.read_text()

replacements = [
    ("import { Bot, Building2, CheckSquare, ChevronRight, ClipboardList, Database, Download, Mail, MessageSquareText, Pencil, Phone, Plus, Save, Search, Send, ShieldCheck, Star, Trash2, TrendingUp, Upload, UserPlus, Users } from 'lucide-react'",
     "import { Bot, Building2, CheckSquare, ChevronRight, ClipboardList, Copy, Database, Download, Mail, MessageSquareText, Pencil, Phone, Plus, Save, Search, Send, ShieldCheck, Star, Trash2, TrendingUp, Upload, UserPlus, Users } from 'lucide-react'"),
    ("type Section = 'dashboard' | 'contacts' | 'pipeline' | 'conversations' | 'agent'",
     "type Section = 'dashboard' | 'contacts' | 'pipeline' | 'conversations' | 'mailing' | 'agent'"),
    ("type Channel = 'Email' | 'Telefono' | 'WhatsApp' | 'LinkedIn' | 'Video' | 'Nota interna'",
     "type Channel = 'Email' | 'Telefono' | 'WhatsApp' | 'LinkedIn' | 'Video' | 'Nota interna'\ntype MailingPriorityFilter = 'Tutte' | PriorityLevel\ntype MailingStageFilter = 'Tutti' | OutreachStage\ntype MailingSeparator = 'virgola' | 'punto e virgola'"),
    ("  const [search, setSearch] = useState('')",
     "  const [search, setSearch] = useState('')\n  const [mailingPriority, setMailingPriority] = useState<MailingPriorityFilter>('A')\n  const [mailingStage, setMailingStage] = useState<MailingStageFilter>('Tutti')\n  const [mailingSeparator, setMailingSeparator] = useState<MailingSeparator>('punto e virgola')\n  const [mailingCopied, setMailingCopied] = useState(false)"),
]
for old, new in replacements:
    if old not in text:
        raise SystemExit(f'Marker non trovato: {old[:80]}')
    text = text.replace(old, new, 1)

marker = "  const suggestion = useMemo(() => agentAnswer('Chi devo contattare oggi?', contacts, tasks, conversations), [contacts, tasks, conversations])\n"
insert = """  const suggestion = useMemo(() => agentAnswer('Chi devo contattare oggi?', contacts, tasks, conversations), [contacts, tasks, conversations])\n  const contactEmail = (contact: Contact) => (contact.decisionMakerEmail || contact.generalEmail || contact.email || '').trim()\n  const isValidEmail = (email: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)\n  const mailingContacts = useMemo(() => contacts.filter((contact) => {\n    const email = contactEmail(contact)\n    if (!isValidEmail(email)) return false\n    if (mailingPriority !== 'Tutte' && (contact.priorityLevel || 'B') !== mailingPriority) return false\n    if (mailingStage !== 'Tutti' && (contact.outreachStage || 'Da qualificare') !== mailingStage) return false\n    return true\n  }), [contacts, mailingPriority, mailingStage])\n  const mailingEmails = useMemo(() => Array.from(new Set(mailingContacts.map(contactEmail).filter(isValidEmail))), [mailingContacts])\n  const mailingText = mailingEmails.join(mailingSeparator === 'virgola' ? ', ' : '; ')\n  const excludedEmailCount = contacts.filter((contact) => !isValidEmail(contactEmail(contact))).length\n\n"""
if marker not in text:
    raise SystemExit('Marker suggestion non trovato')
text = text.replace(marker, insert, 1)

marker = "  function askAgent(prompt?: string) { const q = prompt || question; setQuestion(q); setAnswer(agentAnswer(q, contacts, tasks, conversations)) }\n"
insert = """  function copyMailingList() {\n    if (!mailingText) return\n    navigator.clipboard.writeText(mailingText).then(() => {\n      setMailingCopied(true)\n      setTimeout(() => setMailingCopied(false), 2200)\n    }).catch(() => window.alert('Non sono riuscito a copiare automaticamente. Seleziona il testo e copialo manualmente.'))\n  }\n\n  function askAgent(prompt?: string) { const q = prompt || question; setQuestion(q); setAnswer(agentAnswer(q, contacts, tasks, conversations)) }\n"""
if marker not in text:
    raise SystemExit('Marker askAgent non trovato')
text = text.replace(marker, insert, 1)

old_nav = "  const nav = [{ id: 'dashboard', label: 'Dashboard', icon: TrendingUp }, { id: 'contacts', label: 'Database 100', icon: Users }, { id: 'pipeline', label: 'Flusso', icon: ChevronRight }, { id: 'conversations', label: 'Comunicazioni', icon: Upload }, { id: 'agent', label: 'Agente', icon: Bot }] as const"
new_nav = "  const nav = [{ id: 'dashboard', label: 'Dashboard', icon: TrendingUp }, { id: 'contacts', label: 'Database 100', icon: Users }, { id: 'pipeline', label: 'Flusso', icon: ChevronRight }, { id: 'conversations', label: 'Comunicazioni', icon: Upload }, { id: 'mailing', label: 'Mailing CCN', icon: Mail }, { id: 'agent', label: 'Agente', icon: Bot }] as const"
if old_nav not in text:
    raise SystemExit('Marker nav non trovato')
text = text.replace(old_nav, new_nav, 1)

mailing_section = """  {section === 'mailing' && <div className=\"space-y-5\"><div className=\"rounded-3xl bg-white border p-5\"><div className=\"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5\"><div><div className=\"flex items-center gap-3\"><Mail className=\"w-6 h-6\" /><h2 className=\"font-bold text-xl\">Mailing list per CCN/BCC</h2></div><p className=\"text-sm text-gray-500 mt-2\">Genera un elenco email pronto da copiare nel campo <strong>CCN</strong>. Il CRM non invia email: l’invio resta manuale e sotto il tuo controllo.</p></div><button onClick={copyMailingList} disabled={mailingEmails.length === 0} className=\"rounded-2xl bg-gray-900 text-white px-5 py-3 font-semibold disabled:opacity-40\"><Copy className=\"w-4 h-4 inline mr-2\" />{mailingCopied ? 'Copiato' : 'Copia elenco CCN'}</button></div><div className=\"grid md:grid-cols-4 gap-3 mb-5\"><div><label className=\"text-xs font-semibold text-gray-500\">Priorità</label><select value={mailingPriority} onChange={(e) => setMailingPriority(e.target.value as MailingPriorityFilter)} className=\"mt-1 w-full rounded-2xl border px-4 py-3 bg-white\"><option value=\"Tutte\">Tutte</option>{priorityLevels.map((p) => <option key={p} value={p}>Priorità {p}</option>)}</select></div><div><label className=\"text-xs font-semibold text-gray-500\">Stadio comunicazione</label><select value={mailingStage} onChange={(e) => setMailingStage(e.target.value as MailingStageFilter)} className=\"mt-1 w-full rounded-2xl border px-4 py-3 bg-white\"><option value=\"Tutti\">Tutti</option>{outreachStages.map((s) => <option key={s} value={s}>{s}</option>)}</select></div><div><label className=\"text-xs font-semibold text-gray-500\">Separatore</label><select value={mailingSeparator} onChange={(e) => setMailingSeparator(e.target.value as MailingSeparator)} className=\"mt-1 w-full rounded-2xl border px-4 py-3 bg-white\"><option value=\"punto e virgola\">Punto e virgola</option><option value=\"virgola\">Virgola</option></select></div><div className=\"rounded-2xl bg-stone-50 p-4\"><div className=\"text-xs text-gray-500\">Email selezionate</div><div className=\"text-2xl font-bold\">{mailingEmails.length}</div><div className=\"text-xs text-gray-500\">Escluse senza email valida: {excludedEmailCount}</div></div></div><textarea readOnly value={mailingText || 'Nessuna email valida con i filtri attuali.'} className=\"w-full min-h-36 rounded-2xl border p-4 bg-stone-50 text-sm\" /><div className=\"mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900\"><strong>Uso consigliato:</strong> incolla questo elenco nel campo CCN/BCC, non nel campo A. Per ridurre spam e blocchi, invia piccoli gruppi, personalizza il testo e registra poi la comunicazione nella sezione Comunicazioni.</div></div><div className=\"grid md:grid-cols-2 xl:grid-cols-3 gap-3\">{mailingContacts.map((contact) => <div key={contact.id} className=\"rounded-2xl bg-white border p-4\"><div className=\"flex items-start justify-between gap-3\"><div><div className=\"font-semibold\">{contact.name}</div><div className=\"text-sm text-gray-500\">{contact.category || contact.role || 'Categoria non indicata'} · Priorità {contact.priorityLevel || 'B'}</div></div><span className=\"text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-1\">{contact.outreachStage || 'Da qualificare'}</span></div><div className=\"mt-3 text-sm font-medium text-gray-800 break-all\">{contactEmail(contact)}</div><div className=\"mt-2 text-xs text-gray-500\">{contact.personalizationHook || contact.messageAngle || 'Completa gancio e angolo prima dell’invio se vuoi una mail più efficace.'}</div></div>)}</div>{mailingContacts.length === 0 && <div className=\"rounded-3xl bg-white border p-6 text-gray-500\">Nessun contatto con email valida nei filtri selezionati. Completa i campi email nel Database 100 oppure allarga i filtri.</div>}</div>}\n"""
marker = "  {section === 'agent' &&"
if marker not in text:
    raise SystemExit('Marker section agent non trovato')
text = text.replace(marker, mailing_section + marker, 1)

path.write_text(text)
print('Mailing CCN integrata in app/demo/page.tsx')
