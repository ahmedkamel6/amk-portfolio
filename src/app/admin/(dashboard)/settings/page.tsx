import { db } from '@/lib/db'
import { getSession } from '@/lib/portfolio/auth'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const session = await getSession()
  let userEmail = ''
  if (session) {
    const user = await db.adminUser.findUnique({ where: { id: session.userId } })
    if (user) userEmail = user.email
  }

  return <SettingsForm currentEmail={userEmail} />
}
