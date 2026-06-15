from pathlib import Path

path = Path('/home/ubuntu/crm-ai-relazionale-work/app/demo/page.tsx')
text = path.read_text()

text = text.replace("type ResearchEntryMode = 'Azienda' | 'Persona fisica'\n", "type ResearchEntryMode = 'Azienda' | 'Persona fisica'\ntype CloudPersistenceStatus = 'verifica' | 'cloud' | 'locale' | 'errore' | 'salvataggio'\n")

text = text.replace("  id: string\n  name: string\n", "  id: string\n  dbId?: string\n  name: string\n")

text = text.replace("  const [quickPasteText, setQuickPasteText] = useState('')\n  const [quickPasteFeedback, setQuickPasteFeedback] = useState('')\n", "  const [quickPasteText, setQuickPasteText] = useState('')\n  const [quickPasteFeedback, setQuickPasteFeedback] = useState('')\n  const [cloudStatus, setCloudStatus] = useState<CloudPersistenceStatus>('verifica')\n  const [cloudMessage, setCloudMessage] = useState('Verifico se il CRM può salvare sul database persistente.')\n  const [cloudReady, setCloudReady] = useState(false)\n")

insert_after = "  } catch { window.localStorage.removeItem(profileStorageKey(profileId)) }\n    setContacts([]); setTasks([]); setConversations([]); setSelectedContactId(''); setAnalysis(null)\n  }\n\n"
cloud_functions = """  async function loadCloudContacts(localSnapshot: Contact[] = []) {
    setCloudStatus('verifica')
    setCloudMessage('Controllo collegamento al database persistente...')
    try {
      const response = await fetch('/api/contacts?format=demo', { cache: 'no-store' })
      if (response.status === 401) {
        setCloudStatus('locale')
        setCloudReady(false)
        setCloudMessage('Accesso non effettuato: i dati restano solo nel browser. Per ritrovarli ogni giorno, accedi al CRM e collega il database.')
        return
      }
      if (!response.ok) throw new Error('Database non disponibile')
      const payload = await response.json()
      const cloudContacts = Array.isArray(payload.contacts) ? payload.contacts.map(normalizeContact) : []
      setCloudStatus('cloud')
      setCloudReady(true)
      setCloudMessage(`Database persistente attivo: ${cloudContacts.length} contatti caricati dal cloud.`)
      if (cloudContacts.length > 0) {
        setContacts(cloudContacts)
        setSelectedContactId(cloudContacts[0]?.id || '')
      } else if (localSnapshot.length > 0) {
        await syncCloudContacts(localSnapshot, 'Ho trovato dati locali: li sto copiando nel database persistente.')
      }
    } catch {
      setCloudStatus('errore')
      setCloudReady(false)
      setCloudMessage('Database non raggiungibile: continuo in modalità locale. Usa Backup/Importa finché il deploy non ha Supabase configurato.')
    }
  }

  async function syncCloudContacts(snapshot: Contact[] = contacts, customMessage?: string) {
    if (!snapshot.length) return
    setCloudStatus('salvataggio')
    setCloudMessage(customMessage || 'Salvataggio automatico dei contatti sul database persistente...')
    try {
      const response = await fetch('/api/contacts/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: snapshot }),
      })
      if (response.status === 401) {
        setCloudStatus('locale')
        setCloudReady(false)
        setCloudMessage('Non sei autenticato: modifiche salvate solo nel browser. Accedi per renderle persistenti.')
        return
      }
      if (!response.ok && response.status !== 207) throw new Error('Sincronizzazione fallita')
      const payload = await response.json()
      const saved = Array.isArray(payload.saved) ? payload.saved.map(normalizeContact) : []
      if (saved.length > 0) setContacts(saved)
      setCloudStatus(response.status === 207 ? 'errore' : 'cloud')
      setCloudReady(response.status !== 207)
      setCloudMessage(response.status === 207 ? 'Sincronizzazione parziale: alcuni contatti non sono stati salvati. Esegui Backup prima di chiudere.' : `Salvato sul database persistente: ${saved.length || snapshot.length} contatti.`)
    } catch {
      setCloudStatus('errore')
      setCloudReady(false)
      setCloudMessage('Errore di salvataggio cloud: dati mantenuti localmente. Esporta un backup prima di chiudere.')
    }
  }

"""
text = text.replace(insert_after, insert_after + cloud_functions)

text = text.replace("      loadProfileData(nextActive, nextActive === parsedProfiles[0].id)\n", "      loadProfileData(nextActive, nextActive === parsedProfiles[0].id)\n      const localSnapshot = (() => { try { const stored = window.localStorage.getItem(profileStorageKey(nextActive)); const parsed = stored ? JSON.parse(stored) as StoredCrmData : null; return Array.isArray(parsed?.contacts) ? parsed.contacts.map(normalizeContact) : [] } catch { return [] } })()\n      void loadCloudContacts(localSnapshot)\n")
text = text.replace("      setProfiles(fallback); setActiveProfileId(fallback[0].id); loadProfileData(fallback[0].id, true)\n", "      setProfiles(fallback); setActiveProfileId(fallback[0].id); loadProfileData(fallback[0].id, true); void loadCloudContacts([])\n")

text = text.replace("  useEffect(() => { if (hydrated && activeProfileId) window.localStorage.setItem(profileStorageKey(activeProfileId), JSON.stringify({ contacts, tasks, conversations })) }, [contacts, tasks, conversations, hydrated, activeProfileId])\n", "  useEffect(() => { if (hydrated && activeProfileId) window.localStorage.setItem(profileStorageKey(activeProfileId), JSON.stringify({ contacts, tasks, conversations })) }, [contacts, tasks, conversations, hydrated, activeProfileId])\n  useEffect(() => {\n    if (!hydrated || !cloudReady || cloudStatus === 'salvataggio') return\n    const timer = window.setTimeout(() => { void syncCloudContacts(contacts) }, 1200)\n    return () => window.clearTimeout(timer)\n  }, [contacts, hydrated, cloudReady])\n")

text = text.replace("function switchProfile(profileId: string) { setActiveProfileId(profileId); window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId); loadProfileData(profileId); resetDraft(); setAnalysis(null); setAnswer('Profilo cambiato. Sto usando solo i dati locali di questo profilo.') }", "function switchProfile(profileId: string) { setActiveProfileId(profileId); window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId); loadProfileData(profileId); resetDraft(); setAnalysis(null); setAnswer('Profilo cambiato. Ricarico eventuali dati persistenti dal cloud.'); void loadCloudContacts([]) }")

old_header = "<p className=\"text-gray-500 mt-1\">Gestisci lead premium, comunicazioni, follow-up e backup in modalità gratuita local-first.</p>"
new_header = "<p className=\"text-gray-500 mt-1\">Gestisci lead premium, comunicazioni, follow-up e backup. Se il database è collegato, i contatti restano persistenti dopo ogni riapertura.</p><div className={`mt-3 inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold ${cloudStatus === 'cloud' ? 'bg-green-50 border-green-200 text-green-800' : cloudStatus === 'salvataggio' ? 'bg-blue-50 border-blue-200 text-blue-800' : cloudStatus === 'locale' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'}`}><Database className=\"w-4 h-4\" />{cloudMessage}</div>"
text = text.replace(old_header, new_header)

text = text.replace("<div className=\"mt-auto rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-900\"><strong className=\"block mb-1\">Uso privato gratuito</strong>Database locale per i primi 100 contatti qualificati. Ogni profilo resta separato.</div>", "<div className=\"mt-auto rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-900\"><strong className=\"block mb-1\">Uso privato operativo</strong>Database cloud se autenticato; fallback locale con backup se il collegamento non è disponibile.</div>")

text = text.replace("<p className=\"text-gray-600 mt-1\">Profilo attivo: <strong>{activeProfile?.name || 'Profilo locale'}</strong>. I dati restano nel browser di questo profilo e non vengono mostrati agli altri profili locali.</p>", "<p className=\"text-gray-600 mt-1\">Profilo attivo: <strong>{activeProfile?.name || 'Profilo locale'}</strong>. Con database attivo i contatti vengono ricaricati dal cloud; in modalità locale usa Backup/Importa per non perdere dati.</p>")

path.write_text(text)
