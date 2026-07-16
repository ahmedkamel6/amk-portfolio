'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useSingleton } from '@/lib/portfolio/use-api'
import type { BeforeAfterContent } from '@/lib/portfolio/default-content'

export default function AdminBeforeAfterPage() {
  const { data: ba, update, loading } = useSingleton<BeforeAfterContent>('/api/before-after')
  if (loading || !ba) return <div className="text-[var(--text-muted)]">Loading...</div>

  return (
    <>
      <AdminPageHeader title="Before / After" description="The interactive comparison slider section." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="space-y-5">
            <Field label="Title" hint="The non-highlighted portion">
              <input className="admin-input" defaultValue={ba.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Title Highlight" hint="The emerald gradient portion">
              <input className="admin-input" defaultValue={ba.titleHighlight} onChange={(e) => update({ titleHighlight: e.target.value })} />
            </Field>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="space-y-5">
            <Field label="Description">
              <textarea className="admin-input admin-textarea" defaultValue={ba.description} onChange={(e) => update({ description: e.target.value })} />
            </Field>
            <Field label="Before Label">
              <input className="admin-input" defaultValue={ba.beforeLabel} onChange={(e) => update({ beforeLabel: e.target.value })} />
            </Field>
            <Field label="After Label">
              <input className="admin-input" defaultValue={ba.afterLabel} onChange={(e) => update({ afterLabel: e.target.value })} />
            </Field>
          </div>
        </AdminCard>
      </div>
    </>
  )
}
