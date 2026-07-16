import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import LoginForm from './LoginForm'

export default async function AdminLoginPage() {
  const count = await db.adminUser.count()
  if (count === 0) {
    redirect('/admin/setup')
  }

  return <LoginForm />
}
