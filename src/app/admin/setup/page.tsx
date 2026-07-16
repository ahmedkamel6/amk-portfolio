import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import SetupForm from './SetupForm'

export const dynamic = 'force-dynamic'

export default async function AdminSetupPage() {
  let count = 0;
  
  try {
    count = await db.adminUser.count()
  } catch (error) {
    console.error("Failed to fetch admin users count:", error)
    // If there's a DB error (e.g. during build), we just render the form
  }

  if (count > 0) {
    redirect('/admin/login')
  }

  return <SetupForm />
}
