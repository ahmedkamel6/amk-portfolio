'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function AdminPageHeader({
  title,
  description,
  actions,
  backTo = '/admin',
}: {
  title: string
  description?: string
  actions?: ReactNode
  backTo?: string | null
}) {
  return (
    <div className="mb-8">
      {backTo && (
        <Link
          href={backTo}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-emerald-glow"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] md:text-4xl">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}

export function AdminCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`admin-card ${className}`}>{children}</div>
}

export function SaveBadge({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-glow/10 px-2.5 py-1 text-[10px] font-medium text-emerald-glow">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-glow animate-pulse" />
      Auto-saved
    </span>
  )
}
