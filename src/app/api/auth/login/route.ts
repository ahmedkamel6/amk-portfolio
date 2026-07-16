import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/portfolio/auth'

const loginRateLimit = new Map<string, { count: number, resetTime: number }>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
  const now = Date.now()
  const rl = loginRateLimit.get(ip)

  if (rl) {
    if (now > rl.resetTime) {
      loginRateLimit.set(ip, { count: 1, resetTime: now + 1000 * 60 }) // 1 min window
    } else {
      if (rl.count >= 5) {
        return NextResponse.json({ error: 'Too many login attempts. Try again in a minute.' }, { status: 429 })
      }
      rl.count++
    }
  } else {
    loginRateLimit.set(ip, { count: 1, resetTime: now + 1000 * 60 })
  }

  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }
  const userAgent = req.headers.get('user-agent') || 'Unknown'
  const ok = await createSession(username, password, userAgent)
  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
