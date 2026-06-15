type DemoContact = {
  id?: string
  name?: string
  company?: string
  role?: string
  email?: string
  phone?: string
  status?: string
  interest?: number
  trust?: number
  value?: number
  lastContact?: string
  topics?: string[]
  nextAction?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

const allowedStatuses = new Set(['Lead', 'Prospect', 'Interessato', 'Cliente', 'Partner', 'Collaboratore', 'Ambassador', 'Inattivo', 'Archiviato'])

function nowIso() {
  return new Date().toISOString()
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function splitName(contact: DemoContact) {
  const firstFromPerson = clean(contact.personFirstName)
  const lastFromPerson = clean(contact.personLastName)
  if (firstFromPerson || lastFromPerson) {
    return { firstName: firstFromPerson || clean(contact.name) || 'Lead', lastName: lastFromPerson || '-' }
  }

  const fullName = clean(contact.name) || clean(contact.decisionMakerName) || clean(contact.company) || clean(contact.commercialName) || 'Lead senza nome'
  const parts = fullName.split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return { firstName: parts[0] || 'Lead', lastName: '-' }
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts.slice(-1).join('') }
}

function metadataFromDemo(contact: DemoContact) {
  const excluded = new Set([
    'id', 'name', 'company', 'role', 'email', 'phone', 'status', 'interest', 'trust', 'value',
    'lastContact', 'topics', 'nextAction', 'notes', 'createdAt', 'updatedAt'
  ])
  const metadata: Record<string, unknown> = {
    demo_local_id: contact.id || '',
    demo_name: contact.name || '',
    company: contact.company || contact.commercialName || '',
    topics: Array.isArray(contact.topics) ? contact.topics : [],
    nextAction: contact.nextAction || '',
    source: 'demo-crm-operativo',
  }
  for (const [key, value] of Object.entries(contact)) {
    if (!excluded.has(key) && value !== undefined) metadata[key] = value
  }
  return metadata
}

export function demoContactToDb(contact: DemoContact) {
  const { firstName, lastName } = splitName(contact)
  const metadata = metadataFromDemo(contact)
  return {
    first_name: firstName,
    last_name: lastName,
    role: clean(contact.role) || clean(contact.decisionMakerRole) || null,
    email: clean(contact.email) || clean(contact.generalEmail) || clean(contact.decisionMakerEmail) || null,
    phone: clean(contact.phone) || null,
    whatsapp: clean(contact.whatsapp) || null,
    website: clean(contact.website) || null,
    address: clean(contact.address) || null,
    city: clean(contact.city) || clean(contact.personCity) || null,
    province: clean(contact.province) || null,
    status: allowedStatuses.has(clean(contact.status)) ? clean(contact.status) : 'Lead',
    trust_level: Number.isFinite(Number(contact.trust)) ? Math.max(1, Math.min(10, Number(contact.trust))) : 5,
    interest_level: Number.isFinite(Number(contact.interest)) ? Math.max(0, Math.min(10, Number(contact.interest))) : 5,
    potential_value: Number.isFinite(Number(contact.value)) ? Number(contact.value) : 0,
    last_contact_at: contact.lastContact || nowIso(),
    notes: clean(contact.notes) || null,
    tags: Array.isArray(contact.topics) ? contact.topics : [],
    metadata,
  }
}

export function dbContactToDemo(row: any) {
  const metadata = row?.metadata && typeof row.metadata === 'object' ? row.metadata : {}
  const localId = clean(metadata.demo_local_id) || row.id
  const name = clean(metadata.demo_name) || `${clean(row.first_name)} ${clean(row.last_name)}`.replace(/\s+-$/, '').trim() || clean(metadata.company) || 'Lead senza nome'
  return {
    id: localId,
    dbId: row.id,
    name,
    company: clean(metadata.company) || clean(row.companies?.name) || name,
    role: clean(row.role),
    email: clean(row.email),
    phone: clean(row.phone),
    status: allowedStatuses.has(clean(row.status)) ? row.status : 'Lead',
    interest: Number(row.interest_level ?? 5),
    trust: Number(row.trust_level ?? 5),
    value: Number(row.potential_value ?? 0),
    lastContact: row.last_contact_at ? String(row.last_contact_at).slice(0, 10) : '',
    topics: Array.isArray(row.tags) ? row.tags : Array.isArray(metadata.topics) ? metadata.topics : [],
    nextAction: clean(metadata.nextAction),
    notes: clean(row.notes),
    createdAt: row.created_at || nowIso(),
    updatedAt: row.updated_at || nowIso(),
    ...metadata,
  }
}
