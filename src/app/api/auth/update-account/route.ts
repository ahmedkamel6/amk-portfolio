import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/portfolio/auth'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email, currentPassword, newPassword } = await req.json()

  const user = await db.adminUser.findUnique({ where: { id: session.userId } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const dataToUpdate: any = {}

  if (email && email !== user.email) {
    // Check if email already exists
    const existing = await db.adminUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }
    dataToUpdate.email = email
  }

  if (currentPassword && newPassword) {
    const valid = bcrypt.compareSync(currentPassword, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }
    dataToUpdate.passwordHash = bcrypt.hashSync(newPassword, 10)
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return NextResponse.json({ error: 'No changes provided' }, { status: 400 })
  }

  await db.adminUser.update({
    where: { id: user.id },
    data: dataToUpdate
  })

  // If password was changed, we might want to invalidate other sessions, but we'll leave that to the logout-all endpoint for manual control.

  return NextResponse.json({ ok: true, message: 'Account updated successfully' })
}
