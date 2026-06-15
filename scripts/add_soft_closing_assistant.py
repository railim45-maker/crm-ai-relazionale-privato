from pathlib import Path

path = Path('/home/ubuntu/crm-ai-relazionale-work/app/demo/page.tsx')
text = path.read_text()

# 1) Estendi i tipi e le opzioni di strategia.
text = text.replace(
"type CommunicationTemplate = 'opener' | 'diagnose' | 'qualify' | 'tailored' | 'position' | 'close'\ntype ResearchEntryMode = 'Azienda' | 'Persona fisica'",
"type CommunicationTemplate = 'opener' | 'diagnose' | 'qualify' | 'tailored' | 'position' | 'close'\ntype SalesTone = 'Cordiale' | 'Soft' | 'Consulenziale' | 'Diretto gentile'\ntype StrategicIntent = 'Aprire relazione' | 'Capire bisogno' | 'Gestire obiezione' | 'Proporre mini-demo' | 'Chiudere appuntamento'\ntype ResearchEntryMode = 'Azienda' | 'Persona fisica'"
)
text = text.replace(
"const channels: Channel[] = ['Email', 'Telefono', 'WhatsApp', 'LinkedIn', 'Video', 'Nota interna']",
"const channels: Channel[] = ['Email', 'Telefono', 'WhatsApp', 'LinkedIn', 'Video', 'Nota interna']\nconst salesTones: SalesTone[] = ['Cordiale', 'Soft', 'Consulenziale', 'Diretto gentile']\nconst strategicIntents: StrategicIntent[] = ['Aprire relazione', 'Capire bisogno', 'Gestire obiezione', 'Proporre mini-demo', 'Chiudere appuntamento']"
)

# 2) Aggiungi stato per tono e intenzione.
text = text.replace(
"  const [assistedTemplate, setAssistedTemplate] = useState<CommunicationTemplate>('opener')\n  const [assistedFeedback, setAssistedFeedback] = useState('')",
"  const [assistedTemplate, setAssistedTemplate] = useState<CommunicationTemplate>('opener')\n  const [salesTone, setSalesTone] = useState<SalesTone>('Soft')\n  const [strategicIntent, setStrategicIntent] = useState<StrategicIntent>('Capire bisogno')\n  const [assistedFeedback, setAssistedFeedback] = useState('')"
)

# 3) Aggiungi helper strategici dopo conversationObjective.
insert_after = "  function conversationObjective(step: CommunicationTemplate) {\n    return ({\n      opener: 'Aprire la conversazione senza vendere subito, usando un dettaglio specifico del lead.',\n      diagnose: 'Far emergere problemi, colli di bottiglia e richieste ripetitive tramite domande mirate.',\n      qualify: 'Capire frequenza, urgenza, valore economico e disponibilità a migliorare il processo.',\n      tailored: 'Costruire un vestito su misura: valore aziendale, plafond servizi, energia e priorità personali prima del preventivo.',\n      position: 'Collegare il problema emerso a Voice Desk o alla soluzione del progetto attivo in modo naturale.',\n      close: 'Portare il lead a una call, demo o prova breve con un passo semplice e non pressante.',\n    })[step]\n  }\n"
strategic_helpers = insert_after + "\n  function toneInstruction(tone: SalesTone) {\n    return ({\n      Cordiale: 'tono caldo, umano e rispettoso, con frasi semplici e zero pressione',\n      Soft: 'tono leggero, non invasivo, orientato a una domanda utile prima della proposta',\n      Consulenziale: 'tono professionale: diagnosi, contesto operativo e proposta solo se emerge valore',\n      'Diretto gentile': 'tono sintetico e chiaro, ma sempre educato e senza urgenze artificiali',\n    })[tone]\n  }\n\n  function intentInstruction(intent: StrategicIntent) {\n    return ({\n      'Aprire relazione': 'obiettivo: aprire una conversazione naturale, senza vendere subito',\n      'Capire bisogno': 'obiettivo: far emergere il problema reale con una domanda concreta',\n      'Gestire obiezione': 'obiettivo: abbassare la pressione, riconoscere il dubbio e proporre un passo piccolo',\n      'Proporre mini-demo': 'obiettivo: offrire un esempio pratico e reversibile, non un impegno',\n      'Chiudere appuntamento': 'obiettivo: portare a una call breve o a un esempio scritto con scelta semplice',\n    })[intent]\n  }\n\n  function softClosingGuidance(contact: Contact) {\n    const business = contactBusinessName(contact)\n    const hook = contact.personalizationHook || `il primo contatto dei clienti con ${business}`\n    const likelyNeed = compactLines(contact.probableNeeds)[0] || contact.messageAngle || 'capire se richieste, tempi di risposta o follow-up assorbono tempo utile'\n    const nextStep = strategicIntent === 'Chiudere appuntamento' ? 'proporre 10 minuti oppure un esempio scritto' : strategicIntent === 'Proporre mini-demo' ? 'preparare una mini-demo basata su 2-3 richieste tipiche' : strategicIntent === 'Gestire obiezione' ? 'chiedere qual è il dubbio principale e offrire un passo senza impegno' : 'fare una sola domanda diagnostica e ascoltare la risposta'\n    return { business, hook, likelyNeed, nextStep, tone: toneInstruction(salesTone), intent: intentInstruction(strategicIntent) }\n  }\n\n  function strategicCoachNote(contact?: Contact) {\n    if (!contact) return 'Seleziona un lead: l’assistente ti suggerirà tono, obiettivo, messaggio e prossima mossa senza trasformare il CRM in lavoro amministrativo.'\n    const guide = softClosingGuidance(contact)\n    return `Strategia per ${guide.business}: ${guide.intent}. Usa ${guide.tone}. Gancio utile: ${guide.hook}. Bisogno da verificare: ${guide.likelyNeed}. Prossima mossa: ${guide.nextStep}. Evita riferimenti alla ricerca interna, conteggi, fonti o strumenti non necessari: al lead deve arrivare solo valore pratico.`\n  }\n"
if insert_after not in text:
    raise SystemExit('Blocco conversationObjective non trovato')
text = text.replace(insert_after, strategic_helpers)

# 4) Sostituisci buildEmailTemplate con versione strategica pulita.
start = text.index("  function buildEmailTemplate(contact: Contact): { subject: string; body: string } {")
end = text.index("\n  function buildWhatsAppTemplate(contact: Contact): string {", start)
new_email = """  function buildEmailTemplate(contact: Contact): { subject: string; body: string } {
    const person = contactDisplayName(contact)
    const business = contactBusinessName(contact)
    const city = contact.city || 'la sua zona'
    const guide = softClosingGuidance(contact)
    const category = (contact.category || contact.role || 'attività').toLowerCase()
    const questions = strategicQuestions(contact)
    const valueLine = `L’idea non è aggiungere complessità, ma capire se si può alleggerire un passaggio concreto: ${guide.likelyNeed}.`
    const gentleClose = strategicIntent === 'Chiudere appuntamento'
      ? 'Le andrebbe bene sentirci 10 minuti, oppure preferisce che le mandi prima un esempio scritto?'
      : strategicIntent === 'Proporre mini-demo'
        ? `Se vuole, posso prepararle una mini-demo testuale su un caso tipico di ${business}, così valuta subito se ha senso.`
        : strategicIntent === 'Gestire obiezione'
          ? 'Se in questo momento non è una priorità, nessun problema: mi basta capire quale aspetto avrebbe senso eventualmente approfondire più avanti.'
          : 'Se mi risponde anche solo con due righe, capisco se ha senso prepararle un esempio utile oppure se non è il momento.'

    if (assistedTemplate === 'diagnose') return {
      subject: `Una domanda pratica su ${business}`,
      body: `Buongiorno ${person},\n\nle scrivo in modo molto diretto ma leggero: prima di parlare di soluzioni, vorrei capire se questo tema è reale anche per voi.\n\nHo notato ${guide.hook}. In una ${category} come ${business}, capita spesso che richieste, informazioni, disponibilità, prenotazioni o primi contatti assorbano tempo nei momenti meno comodi.\n\nLa domanda è questa: ${questions[0]}\n\n${gentleClose}\n\nResto a disposizione,\nVoice Desk`
    }

    if (assistedTemplate === 'qualify') return {
      subject: `Capire se può essere utile per ${business}`,
      body: `Buongiorno ${person},\n\nper capire se posso esserle davvero utile, le chiederei solo tre cose rapide.\n\n1. Da quale canale arrivano più richieste: telefono, email, WhatsApp o sito?\n2. Quali richieste richiedono spesso le stesse risposte?\n3. Se potesse migliorare un solo punto del primo contatto con il cliente, quale sceglierebbe?\n\n${valueLine}\n\nSulla base delle sue risposte posso prepararle un esempio pratico, senza impegno e senza proposta preconfezionata.\n\nResto a disposizione,\nVoice Desk`
    }

    if (assistedTemplate === 'tailored') return {
      subject: `Un esempio ragionato per ${business}`,
      body: `Buongiorno ${person},\n\nsecondo me per ${business} ha più senso partire da un piccolo ragionamento pratico, non da un preventivo standard.\n\n${valueLine}\n\nIl primo passo potrebbe essere molto semplice: capire quali richieste si ripetono, quali fanno perdere tempo e quali invece devono restare gestite in modo personale. Da lì si può valutare se una piccola automazione o una migliore organizzazione del primo contatto può portare beneficio reale.\n\n${gentleClose}\n\nResto a disposizione,\nVoice Desk`
    }

    if (assistedTemplate === 'position') return {
      subject: `Esempio concreto per ${business}`,
      body: `Buongiorno ${person},\n\nper una ${category}${city ? ` a ${city}` : ''}, il punto non è “mettere un robot” davanti ai clienti. Il punto è ordinare il primo contatto, filtrare le richieste ripetitive e lasciare allo staff ciò che richiede attenzione umana.\n\nIn pratica: meno dispersione, più continuità e controllo sempre vostro.\n\n${gentleClose}\n\nResto a disposizione,\nVoice Desk`
    }

    if (assistedTemplate === 'close') return {
      subject: `Passo semplice per ${business}`,
      body: `Buongiorno ${person},\n\nse per lei ha senso, farei un passo molto semplice: preparo un esempio concreto su ${business}, basato su 2 o 3 richieste tipiche che ricevete spesso.\n\nCosì può valutare subito se l’idea è utile. Se non vede valore, ci fermiamo lì senza impegno.\n\nLe andrebbe bene una call breve di 10 minuti oppure preferisce ricevere prima un esempio scritto?\n\nResto a disposizione,\nVoice Desk`
    }

    return {
      subject: `Idea pratica per ${business}`,
      body: `Buongiorno ${person},\n\nle scrivo perché ho notato ${guide.hook}.\n\nPer una ${category} come ${business}${city ? ` a ${city}` : ''}, spesso il primo contatto con clienti e potenziali clienti si disperde tra telefonate, messaggi, email e richieste ripetitive.\n\n${valueLine}\n\nPrima di proporle qualcosa, le farei solo una domanda: qual è oggi la richiesta che vi fa perdere più tempo o che rischia di restare senza risposta nel momento giusto?\n\n${gentleClose}\n\nResto a disposizione,\nVoice Desk`
    }
  }
"""
text = text[:start] + new_email + text[end:]

# 5) Sostituisci buildWhatsAppTemplate con versione coerente.
start = text.index("  function buildWhatsAppTemplate(contact: Contact): string {")
end = text.index("\n  function setTemporaryAssistedFeedback", start)
new_whatsapp = """  function buildWhatsAppTemplate(contact: Contact): string {
    const person = contactDisplayName(contact)
    const business = contactBusinessName(contact)
    const guide = softClosingGuidance(contact)
    const questions = strategicQuestions(contact)

    if (assistedTemplate === 'diagnose') return `Buongiorno ${person}, sono di Voice Desk. Le faccio una domanda pratica, senza proposta preconfezionata: ${questions[0]} Se ha senso, le preparo un esempio breve su ${business}.`
    if (assistedTemplate === 'qualify') return `Buongiorno ${person}, per capire se posso esserle utile su ${business}: da quale canale arrivano più richieste, telefono, email, WhatsApp o sito? E quali portano via più tempo?`
    if (assistedTemplate === 'tailored') return `Buongiorno ${person}, prima di parlare di soluzioni preferirei capire la situazione reale di ${business}. L’obiettivo sarebbe alleggerire un passaggio concreto: ${guide.likelyNeed}. Vuole che le prepari un esempio molto breve?`
    if (assistedTemplate === 'position') return `Buongiorno ${person}, l’idea per ${business} non è sostituire lo staff, ma ordinare il primo contatto e filtrare le richieste ripetitive mantenendo controllo umano. Vuole un esempio concreto?`
    if (assistedTemplate === 'close') return `Buongiorno ${person}, se ha senso facciamo un passo semplice: mini-demo di 10 minuti o esempio scritto su ${business}. Così valuta subito se è utile, senza impegno. Cosa preferisce?`
    return `Buongiorno ${person}, sono di Voice Desk. Ho notato ${guide.hook}. Le faccio solo una domanda: per ${business}, quale richiesta dei clienti vi fa perdere più tempo o rischia di non ricevere risposta nel momento giusto?`
  }
"""
text = text[:start] + new_whatsapp + text[end:]

# 6) Rendi l'agente capace di generare messaggi strategici e non solo report.
text = text.replace(
"  if (lower.includes('studio') || lower.includes('token') || lower.includes('plafond') || lower.includes('bollette') || lower.includes('energia')) { const target = hot[0]; const snap = valuationSnapshot(target); return `${tailoredStudyPrompt(target)} Prossima mossa: raccogli i dati mancanti e non vendere subito; costruisci un vestito su misura legato a problemi reali, copertura economica e priorità della persona.` }",
"  if (lower.includes('messaggio') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('closing') || lower.includes('chiud') || lower.includes('soft')) { const target = hot[0]; return `${strategicCoachNote(target)}\\n\\nEmail suggerita:\\n${buildEmailTemplate(target).body}\\n\\nWhatsApp suggerito:\\n${buildWhatsAppTemplate(target)}` }\n  if (lower.includes('studio') || lower.includes('token') || lower.includes('plafond') || lower.includes('bollette') || lower.includes('energia')) { const target = hot[0]; const snap = valuationSnapshot(target); return `${tailoredStudyPrompt(target)} Prossima mossa: raccogli i dati mancanti e non vendere subito; costruisci un vestito su misura legato a problemi reali, copertura economica e priorità della persona.` }"
)

# 7) Inserisci mini pannello strategico nella sezione agente.
old_agent_intro = "{section === 'agent' && <div className=\"rounded-3xl bg-white border p-5 max-w-4xl\"><div className=\"flex items-center gap-3 mb-5\"><Bot className=\"w-6 h-6\" /><h2 className=\"font-bold text-xl\">Agente operativo sui tuoi dati</h2></div><div className=\"rounded-2xl bg-stone-50 p-5 mb-4\"><p>{answer}</p></div>"
new_agent_intro = "{section === 'agent' && <div className=\"rounded-3xl bg-white border p-5 max-w-4xl\"><div className=\"flex items-center gap-3 mb-5\"><Bot className=\"w-6 h-6\" /><h2 className=\"font-bold text-xl\">Agente operativo sui tuoi dati</h2></div><div className=\"grid md:grid-cols-3 gap-3 mb-4\"><div><label className=\"text-xs font-semibold text-gray-500\">Tono vendita</label><select value={salesTone} onChange={(e) => setSalesTone(e.target.value as SalesTone)} className=\"mt-1 w-full rounded-2xl border px-4 py-3 bg-white\">{salesTones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}</select></div><div><label className=\"text-xs font-semibold text-gray-500\">Obiettivo</label><select value={strategicIntent} onChange={(e) => setStrategicIntent(e.target.value as StrategicIntent)} className=\"mt-1 w-full rounded-2xl border px-4 py-3 bg-white\">{strategicIntents.map((intent) => <option key={intent} value={intent}>{intent}</option>)}</select></div><div><label className=\"text-xs font-semibold text-gray-500\">Template</label><select value={assistedTemplate} onChange={(e) => setAssistedTemplate(e.target.value as CommunicationTemplate)} className=\"mt-1 w-full rounded-2xl border px-4 py-3 bg-white\"><option value=\"opener\">Opener soft</option><option value=\"diagnose\">Diagnosi</option><option value=\"qualify\">Qualifica</option><option value=\"tailored\">Su misura</option><option value=\"position\">Posizionamento</option><option value=\"close\">Closing morbido</option></select></div></div><div className=\"rounded-2xl border border-blue-100 bg-blue-50 p-4 mb-4 text-sm text-blue-900\"><strong>Coach strategico:</strong> {strategicCoachNote(selectedContact || undefined)}</div><div className=\"rounded-2xl bg-stone-50 p-5 mb-4 whitespace-pre-wrap\"><p>{answer}</p></div>"
if old_agent_intro not in text:
    raise SystemExit('Intro sezione agente non trovata')
text = text.replace(old_agent_intro, new_agent_intro)

# 8) Aggiungi quick prompt specifici.
text = text.replace(
"'Prepara studio tokenizzazione e plafond', 'Valuta energia e bollette'",
"'Genera messaggio soft closing', 'Prepara WhatsApp cordiale', 'Gestisci obiezione senza pressione', 'Prepara studio tokenizzazione e plafond', 'Valuta energia e bollette'"
)

path.write_text(text)
print('Soft-closing assistant aggiunto')
