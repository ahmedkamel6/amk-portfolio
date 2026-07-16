import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const SESSION_COOKIE = 'amk_admin_session'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export async function createSession(username: string, password: string, userAgent?: string | null): Promise<boolean> {
  const user = await db.adminUser.findUnique({ where: { username } })
  if (!user) return false
  const valid = bcrypt.compareSync(password, user.passwordHash)
  if (!valid) return false

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  await db.adminSession.create({
    data: { token, userId: user.id, userAgent, expiresAt },
  })

  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
  return true
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await db.adminSession.deleteMany({ where: { token } })
  }
  store.delete(SESSION_COOKIE)
}

export async function destroyAllSessions(userId: string): Promise<void> {
  await db.adminSession.deleteMany({ where: { userId } })
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const session = await db.adminSession.findUnique({ where: { token } })
  if (!session) return null
  if (session.expiresAt < new Date()) {
    await db.adminSession.delete({ where: { id: session.id } })
    return null
  }
  return session
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null
}

export async function requireAuth(): Promise<boolean> {
  return await isAuthenticated()
}

