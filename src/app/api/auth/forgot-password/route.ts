import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

const forgotPasswordRateLimit = new Map<string, number>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
  const now = Date.now()
  const lastReq = forgotPasswordRateLimit.get(ip)
  
  // Rate limit: 1 request per minute per IP
  if (lastReq && now - lastReq < 1000 * 60) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }
  forgotPasswordRateLimit.set(ip, now)

  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const user = await db.adminUser.findUnique({ where: { email } })
  if (!user) {
    // For security, we do not reveal if the email exists or not
    return NextResponse.json({ ok: true, message: 'If an account with that email exists, a reset link has been sent.' })
  }

  // Invalidate any existing unused tokens for this user
  await db.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true }
  })

  // Generate secure random token
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  
  // Token expires in 30 minutes
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30)

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    }
  })

  // Build reset URL
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const resetUrl = `${origin}/admin/reset-password?token=${rawToken}`

  await sendPasswordResetEmail(user.email, resetUrl)

  return NextResponse.json({ ok: true, message: 'If an account with that email exists, a reset link has been sent.' })
}
