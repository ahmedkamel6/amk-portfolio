import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/portfolio/password'

// Simple rate limit in-memory for setup to prevent spam
const setupRateLimit = new Map<string, number>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
  const now = Date.now()
  const lastReq = setupRateLimit.get(ip)
  if (lastReq && now - lastReq < 1000 * 60) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  setupRateLimit.set(ip, now)

  const adminCount = await db.adminUser.count()
  if (adminCount > 0) {
    return NextResponse.json({ error: 'Setup already completed' }, { status: 403 })
  }

  const { username, email, password } = await req.json()
  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Username, email, and password required' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const passwordHash = await hashPassword(password)
  
  await db.adminUser.create({
    data: {
      username,
      email,
      passwordHash,
    }
  })

  return NextResponse.json({ ok: true, message: 'Admin account created successfully' })
}
