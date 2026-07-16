import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/portfolio/auth'
import { AdminSidebarClient } from '@/components/admin/AdminSidebarClient'

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated()
  if (!authed) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <AdminSidebarClient />
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
