'use client'

import Link from 'next/link'
import {
  User, Film, Briefcase, FolderKanban, Workflow, Award, Quote,
  Palette, Sun, Moon, ExternalLink, RotateCcw, Download, Upload,
  Sparkles, Database, ArrowRight,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AdminPageHeader, AdminCard } from '@/components/admin/ui'
import { getCsrfToken } from '@/lib/portfolio/use-api'
import { defaultContent } from '@/lib/portfolio/default-content'

const STATS = [
  { key: 'services', label: 'Services', icon: Briefcase, href: '/admin/services' },
  { key: 'projects', label: 'Projects', icon: FolderKanban, href: '/admin/projects' },
  { key: 'skills', label: 'Skills', icon: Award, href: '/admin/skills' },
  { key: 'about', label: 'Milestones', icon: User, href: '/admin/about' },
  { key: 'workflow', label: 'Workflow Steps', icon: Workflow, href: '/admin/workflow' },
  { key: 'testimonials', label: 'Testimonials', icon: Quote, href: '/admin/testimonials' },
] as const

const QUICK_LINKS = [
  { label: 'Edit Hero', href: '/admin/hero', icon: User, desc: 'Name, badge, roles, CTAs, stats' },
  { label: 'Edit Showreel', href: '/admin/showreel', icon: Film, desc: 'Title, duration, software, video title' },
  { label: 'Edit Services', href: '/admin/services', icon: Briefcase, desc: 'Add, edit, reorder, delete services' },
  { label: 'Edit Projects', href: '/admin/projects', icon: FolderKanban, desc: 'Manage featured projects' },
  { label: 'Edit Contact', href: '/admin/contact', icon: Film, desc: 'Channels, CTAs, footer text' },
  { label: 'Appearance', href: '/admin/appearance', icon: Palette, desc: 'Theme, accent, particles, glow' },
]

interface Counts {
  services: number
  projects: number
  skills: number
  about: number
  workflow: number
  testimonials: number
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [migrating, setMigrating] = useState(false)
  const [migrateResult, setMigrateResult] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Fetch counts
  useEffect(() => {
    Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/skills').then((r) => r.json()),
      fetch('/api/workflow').then((r) => r.json()),
      fetch('/api/testimonials').then((r) => r.json()),
      fetch('/api/appearance').then((r) => r.json()),
    ]).then(([s, p, sk, w, t, ap]) => {
      setCounts({
        services: s.length || 0,
        projects: p.length || 0,
        skills: sk.length || 0,
        about: 1, // About is a singleton now
        workflow: w.length || 0,
        testimonials: t.length || 0,
      })
      setTheme(ap.mode)
    }).catch(() => {})
  }, [])

  const toggleTheme = async () => {
    const newMode = theme === 'dark' ? 'light' : 'dark'
    setTheme(newMode)
    // Update via API
    const ap = await fetch('/api/appearance').then((r) => r.json())
    let patch = { ...ap, mode: newMode }
    if (newMode === 'light' && ap.background === '#0B0B0B') {
      patch.background = '#F7F7F5'
      patch.accent = '#00A86A'
      patch.accentSoft = '#00C781'
    } else if (newMode === 'dark' && ap.background === '#F7F7F5') {
      patch.background = '#0B0B0B'
      patch.accent = '#00D084'
      patch.accentSoft = '#00FF9D'
    }
    await fetch('/api/appearance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    // Reload to apply theme globally
    window.location.reload()
  }

  const handleExport = async () => {
    const [hero, showreel, services, projects, beforeAfter, workflow, skills, about, testimonials, contact, appearance] = await Promise.all([
      fetch('/api/hero').then((r) => r.json()),
      fetch('/api/showreel').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/before-after').then((r) => r.json()),
      fetch('/api/workflow').then((r) => r.json()),
      fetch('/api/skills').then((r) => r.json()),
      fetch('/api/about-content').then((r) => r.json()),
      fetch('/api/testimonials').then((r) => r.json()),
      fetch('/api/contact').then((r) => r.json()),
      fetch('/api/appearance').then((r) => r.json()),
    ])
    const data = { hero, showreel, services, projects, beforeAfter, workflow, skills, about, testimonials, contact, theme: appearance }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `amk-portfolio-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleMigrate = async () => {
    // Read from localStorage (legacy Zustand store shape)
    try {
      const raw = localStorage.getItem('amk-portfolio-content')
      if (!raw) {
        setMigrateResult('No localStorage data found to migrate.')
        return
      }
      const parsed = JSON.parse(raw)
      const content = parsed.state || parsed
      setMigrating(true)
      const res = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify(content),
      })
      const result = await res.json()
      if (res.ok) {
        setMigrateResult(`Migrated: ${JSON.stringify(result.migrated)}`)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMigrateResult(`Error: ${result.error}`)
      }
    } catch (e: any) {
      setMigrateResult(`Error: ${e.message}`)
    } finally {
      setMigrating(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset all content to defaults? This cannot be undone.')) return
    // Re-seed by calling migrate with default content
    setMigrating(true)
    try {
      const res = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify(defaultContent),
      })
      if (res.ok) {
        setMigrateResult('Reset to defaults. Reloading...')
        setTimeout(() => window.location.reload(), 1500)
      }
    } finally {
      setMigrating(false)
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Every change you make here is saved to the database and applied to the live site instantly via on-demand revalidation."
        actions={
          <>
            <button onClick={toggleTheme} className="admin-btn admin-btn-ghost">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button onClick={handleExport} className="admin-btn admin-btn-ghost">
              <Download className="h-4 w-4" /> Export
            </button>
            <button onClick={handleMigrate} disabled={migrating} className="admin-btn admin-btn-ghost">
              <Database className="h-4 w-4" /> {migrating ? 'Migrating...' : 'Migrate from localStorage'}
            </button>
            <button onClick={handleReset} disabled={migrating} className="admin-btn admin-btn-danger">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <Link href="/" target="_blank" className="admin-btn admin-btn-primary">
              <ExternalLink className="h-4 w-4" /> View Site
            </Link>
          </>
        }
        backTo={null}
      />

      {migrateResult && (
        <div className="mb-6 rounded-xl border border-emerald-glow/30 bg-emerald-glow/5 p-4 text-sm text-emerald-glow">
          {migrateResult}
        </div>
      )}

      {/* Stats grid */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {STATS.map((stat) => {
          const count = counts ? (counts as any)[stat.key] ?? 0 : '—'
          return (
            <Link
              key={stat.key}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-emerald-glow/40 hover:bg-emerald-glow/[0.03]"
            >
              <stat.icon className="h-5 w-5 text-emerald-glow" />
              <div className="mt-4 font-display text-3xl font-bold text-[var(--text-primary)]">{count}</div>
              <div className="mt-1 font-mono-display text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {stat.label}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-emerald-glow to-transparent transition-all duration-500 group-hover:w-full" />
            </Link>
          )
        })}
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 font-display text-xl font-bold text-[var(--text-primary)]">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-emerald-glow/40 hover:bg-emerald-glow/[0.03]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-glow/10 text-emerald-glow transition-transform group-hover:scale-110">
              <link.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-[var(--text-primary)]">{link.label}</div>
              <div className="text-xs text-[var(--text-muted)]">{link.desc}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-colors group-hover:text-emerald-glow" />
          </Link>
        ))}
      </div>

      {/* DB info callout */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-emerald-glow/20 bg-emerald-glow/[0.04] p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-glow/10 text-emerald-glow">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">Database-backed · Server-rendered</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              All content is stored in a real database (SQLite/Prisma) and rendered server-side.
              Edits trigger on-demand revalidation so the live site updates instantly without a full rebuild.
              The public site is fully SSR — no <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs">localStorage</code> reads for display.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/admin/appearance" className="admin-btn admin-btn-primary">
                <Palette className="h-4 w-4" /> Theme settings
              </Link>
              <Link href="/admin/projects" className="admin-btn admin-btn-ghost">
                <FolderKanban className="h-4 w-4" /> Manage projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
