from pathlib import Path
path = Path('app/demo/page.tsx')
text = path.read_text()
text = text.replace(
"  const nav = [{ id: 'dashboard', label: 'Dashboard', icon: TrendingUp }, { id: 'contacts', label: 'Database 100', icon: Users }, { id: 'pipeline', label: 'Flusso', icon: ChevronRight }, { id: 'conversations', label: 'Comunicazioni', icon: Upload }, { id: 'agent', label: 'Agente', icon: Bot }] as const\n",
"  const stageGroups = outreachStages.map((stage) => ({\n    stage,\n    items: contacts.filter((contact) => (contact.outreachStage || 'Da qualificare') === stage),\n  }))\n\n  const nav = [{ id: 'dashboard', label: 'Dashboard', icon: TrendingUp }, { id: 'contacts', label: 'Database 100', icon: Users }, { id: 'pipeline', label: 'Flusso', icon: ChevronRight }, { id: 'conversations', label: 'Comunicazioni', icon: Upload }, { id: 'agent', label: 'Agente', icon: Bot }] as const\n"
)
lines = text.splitlines()
for idx, line in enumerate(lines):
    if line.strip().startswith("{section === 'pipeline'"):
        lines[idx] = """  {section === 'pipeline' && <div className=\"space-y-5\"><div className=\"rounded-3xl bg-white border p-5\"><h2 className=\"font-bold text-lg\">Flusso comunicazioni</h2><p className=\"text-gray-600 mt-1\">Sposta ogni contatto nello stadio reale. Per ora l’invio resta manuale: il CRM ti aiuta a non perdere prossima azione e storico.</p></div><div className=\"grid md:grid-cols-2 xl:grid-cols-4 gap-4\">{stageGroups.map(({ stage, items }) => <div key={stage} className=\"rounded-3xl bg-white border p-4\"><div className=\"flex justify-between items-center mb-3\"><h3 className=\"font-semibold\">{stage}</h3><span className=\"text-xs rounded-full bg-stone-100 px-2 py-1\">{items.length}</span></div><div className=\"space-y-3\">{items.map((contact) => <button key={contact.id} onClick={() => { setSelectedContactId(contact.id); setSection('contacts') }} className=\"w-full text-left rounded-2xl border p-3 hover:bg-stone-50\"><div className=\"font-semibold text-sm\">{contact.name}</div><div className=\"text-xs text-gray-500\">Priorità {contact.priorityLevel || 'B'} · {contact.category || 'Categoria n/d'}</div><div className=\"text-xs text-gray-600 mt-2 line-clamp-2\">{contact.nextAction || contact.messageAngle || 'Prossima azione da definire'}</div></button>)}{items.length === 0 && <p className=\"text-sm text-gray-400\">Nessun contatto.</p>}</div></div>)}</div></div>}"""
        break
else:
    raise SystemExit('pipeline line not found')
path.write_text('\n'.join(lines) + '\n')
