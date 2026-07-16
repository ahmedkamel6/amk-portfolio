'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Film,
  Briefcase,
  FolderKanban,
  GitCompare,
  Workflow,
  Award,
  Quote,
  Mail,
  Palette,
  Home,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { section: 'Overview', items: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  ]},
  { section: 'Content', items: [
    { label: 'Hero', href: '/admin/hero', icon: User },
    { label: 'Showreel', href: '/admin/showreel', icon: Film },
    { label: 'Services', href: '/admin/services', icon: Briefcase },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Before / After', href: '/admin/before-after', icon: GitCompare },
    { label: 'Workflow', href: '/admin/workflow', icon: Workflow },
    { label: 'Skills', href: '/admin/skills', icon: Award },
    { label: 'About', href: '/admin/about', icon: User },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { label: 'Contact', href: '/admin/contact', icon: Mail },
  ]},
  { section: 'System', items: [
    { label: 'Appearance', href: '/admin/appearance', icon: Palette },
    { label: 'Settings', href: '/admin/settings', icon: User },
  ]},
]

export function AdminSidebarClient() {
  const pathname = usePathname()
  const [mode, setMode] = useState<'dark' | 'light'>('dark')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Fetch current theme from API
  useEffect(() => {
    fetch('/api/appearance').then((r) => r.json()).then((d) => setMode(d.mode)).catch(() => {})
  }, [])



  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl glass-emerald">
          <span className="font-display text-sm font-bold text-emerald-glow">A</span>
        </div>
        <div>
          <div className="font-display text-sm font-bold text-[var(--text-primary)]">AMK Admin</div>
          <div className="font-mono-display text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Control Panel</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.section} className="mb-6">
            <div className="px-3 py-2 font-mono-display text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-emerald-glow/10 text-emerald-glow'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', active && 'text-emerald-glow')} />
                    <span className="font-medium">{item.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-glow" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] p-3">

        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
        >
          <Home className="h-4 w-4" />
          <span className="font-medium">View Live Site</span>
        </Link>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' })
            window.location.href = '/admin/login'
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--background)] md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[var(--background)]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
