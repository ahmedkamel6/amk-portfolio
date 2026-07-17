'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import { getCsrfToken } from '@/lib/portfolio/use-api'

export default function SetupForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify({ username, email, password }),
      })
      if (res.ok) {
        // After setup, automatically log them in or redirect to login
        router.push('/admin/login')
      } else {
        const data = await res.json()
        setError(data.error || 'Setup failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]" style={{ background: 'radial-gradient(circle, var(--emerald-glow), transparent 70%)' }} />
        <div className="absolute inset-0 bg-grid opacity-15" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl glass-emerald glow-emerald">
            <span className="font-display text-xl font-bold text-emerald-glow">S</span>
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Admin Setup</h1>
            <p className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Create your master account</p>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 backdrop-blur-xl">
          <div>
            <label className="admin-label">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input pl-10"
                placeholder="admin"
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input pl-10"
                placeholder="hello@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input pl-10"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">Must be at least 8 characters long.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary w-full justify-center"
          >
            {loading ? 'Creating...' : 'Create Admin Account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}
