import { NextResponse } from 'next/server'
import { getSession, destroyAllSessions } from '@/lib/portfolio/auth'

export async function POST() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await destroyAllSessions(session.userId)

  return NextResponse.json({ ok: true, message: 'Logged out of all devices' })
}
