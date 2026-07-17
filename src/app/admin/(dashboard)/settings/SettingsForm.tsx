'use client'

import { useState } from 'react'
import { getCsrfToken } from '@/lib/portfolio/use-api'
import { useRouter } from 'next/navigation'
import { AdminPageHeader, AdminCard, Field } from '@/components/admin/ui'
import { Save, LogOut, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SettingsForm({ currentEmail }: { currentEmail: string }) {
  const router = useRouter()
  
  const [email, setEmail] = useState(currentEmail)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const payload: any = {}
      if (email !== currentEmail) payload.email = email
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const res = await fetch('/api/auth/update-account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (res.ok) {
        setSuccess('Account updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        router.refresh()
      } else {
        setError(data.error || 'Failed to update account')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to log out from all devices? You will be signed out immediately.')) return

    try {
      const res = await fetch('/api/auth/logout-all', { 
        method: 'POST',
        headers: {
          'x-csrf-token': getCsrfToken()
        }
      })
      if (res.ok) {
        router.push('/admin/login')
      } else {
        alert('Failed to logout from all devices')
      }
    } catch {
      alert('Network error')
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Account Settings"
        description="Manage your admin account credentials and active sessions."
        backTo="/admin"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <form onSubmit={handleUpdateAccount}>
            <AdminCard className="space-y-6">
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Update Credentials</h2>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

              <Field label="Email Address" hint="Used for password resets and important notifications.">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="admin-input"
                  required
                />
              </Field>

              <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">Change Password</h3>
                <p className="text-xs text-[var(--text-muted)]">Leave blank if you don't want to change your password.</p>
                
                <Field label="Current Password">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="admin-input"
                  />
                </Field>
                
                <Field label="New Password">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="admin-input"
                    minLength={8}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn-primary w-full justify-center"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </AdminCard>
          </form>
        </div>

        <div className="space-y-8">
          <AdminCard className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Session Management</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                If you noticed suspicious activity or lost a device, you can log out from all devices.
              </p>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <h3 className="mb-2 text-sm font-medium text-red-400">Danger Zone</h3>
              <button
                onClick={handleLogoutAll}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" />
                Logout from all devices
              </button>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  )
}
