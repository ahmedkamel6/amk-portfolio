import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import SetupForm from './SetupForm'

export default async function AdminSetupPage() {
  const count = await db.adminUser.count()
  if (count > 0) {
    redirect('/admin/login')
  }

  return <SetupForm />
}
