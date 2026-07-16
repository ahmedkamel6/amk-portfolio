import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and new password required' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const resetToken = await db.passwordResetToken.findUnique({
    where: { tokenHash }
  })

  if (!resetToken || resetToken.used) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }

  if (resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
  }

  const passwordHash = bcrypt.hashSync(password, 10)

  // Use a transaction to ensure atomic updates
  await db.$transaction(async (tx) => {
    // Mark token as used
    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    })

    // Update user password
    await tx.adminUser.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    })

    // Invalidate all existing sessions
    await tx.adminSession.deleteMany({
      where: { userId: resetToken.userId }
    })
  })

  return NextResponse.json({ ok: true, message: 'Password has been reset successfully' })
}
