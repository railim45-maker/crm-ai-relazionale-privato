import { NextRequest, NextResponse } from 'next/server'
import { buildCloserMessage, buildConsultingStudy, buildGuidedResearch, PUBLIC_REFERENCES, type ConsultingContact } from '@/lib/consulting-intelligence'

type Action = 'references' | 'research' | 'study' | 'message'

export async function GET() {
  return NextResponse.json({ references: PUBLIC_REFERENCES })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { action?: Action; contact?: ConsultingContact; step?: 'opener' | 'diagnose' | 'tailored' | 'close' }
  const contact = body.contact || {}
  const action = body.action || 'research'

  if (action === 'references') return NextResponse.json({ references: PUBLIC_REFERENCES })
  if (action === 'study') return NextResponse.json({ study: buildConsultingStudy(contact), snapshot: buildGuidedResearch(contact), references: PUBLIC_REFERENCES })
  if (action === 'message') return NextResponse.json({ message: buildCloserMessage(contact, body.step || 'opener'), step: body.step || 'opener' })

  return NextResponse.json({ research: buildGuidedResearch(contact), references: PUBLIC_REFERENCES })
}
