import { NextRequest, NextResponse } from 'next/server'
import { buildCloserMessage, buildConsultingStudy, buildGuidedResearch, buildProfessionalCloserPlaybook, PUBLIC_REFERENCES, type ConsultingContact, type ProfessionalCloserStep } from '@/lib/consulting-intelligence'

type Action = 'references' | 'research' | 'study' | 'message' | 'playbook'

export async function GET() {
  return NextResponse.json({ references: PUBLIC_REFERENCES })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { action?: Action; contact?: ConsultingContact; step?: ProfessionalCloserStep | 'auto'; tone?: string; intent?: string; objection?: string; lastReply?: string }
  const contact = body.contact || {}
  const action = body.action || 'research'

  if (action === 'references') return NextResponse.json({ references: PUBLIC_REFERENCES })
  if (action === 'study') return NextResponse.json({ study: buildConsultingStudy(contact), snapshot: buildGuidedResearch(contact), references: PUBLIC_REFERENCES })
  if (action === 'message') return NextResponse.json({ message: buildCloserMessage(contact, body.step && body.step !== 'auto' ? body.step : 'opener'), step: body.step || 'opener' })
  if (action === 'playbook') return NextResponse.json({ playbook: buildProfessionalCloserPlaybook(contact, { step: body.step || 'auto', tone: body.tone, intent: body.intent, objection: body.objection, lastReply: body.lastReply }) })

  return NextResponse.json({ research: buildGuidedResearch(contact), references: PUBLIC_REFERENCES })
}
