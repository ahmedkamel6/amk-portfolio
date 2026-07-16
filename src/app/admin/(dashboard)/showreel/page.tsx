'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useSingleton } from '@/lib/portfolio/use-api'
import type { ShowreelContent } from '@/lib/portfolio/default-content'

export default function AdminShowreelPage() {
  const { data: sr, update, loading } = useSingleton<ShowreelContent>('/api/showreel')
  if (loading || !sr) return <div className="text-[var(--text-muted)]">Loading...</div>

  return (
    <>
      <AdminPageHeader title="Showreel" description="The cinematic player section. Changes save instantly." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="space-y-5">
            <Field label="Title">
              <input className="admin-input" defaultValue={sr.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Title Highlight" hint="The emerald gradient portion">
              <input className="admin-input" defaultValue={sr.titleHighlight} onChange={(e) => update({ titleHighlight: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className="admin-input admin-textarea" defaultValue={sr.description} onChange={(e) => update({ description: e.target.value })} />
            </Field>
            <Field label="Video Title" hint="Shown at the bottom of the player">
              <input className="admin-input" defaultValue={sr.videoTitle} onChange={(e) => update({ videoTitle: e.target.value })} />
            </Field>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="space-y-5">
            <Field label="Duration" hint="e.g. 02:48">
              <input className="admin-input" defaultValue={sr.duration} onChange={(e) => update({ duration: e.target.value })} />
            </Field>
            <Field label="Year">
              <input className="admin-input" defaultValue={sr.year} onChange={(e) => update({ year: e.target.value })} />
            </Field>
            <Field label="Software Used">
              <input className="admin-input" defaultValue={sr.software} onChange={(e) => update({ software: e.target.value })} />
            </Field>
            <Field label="Timecode Label" hint="Top-left recording indicator">
              <input className="admin-input" defaultValue={sr.timecode} onChange={(e) => update({ timecode: e.target.value })} />
            </Field>
            <Field label="Video URL" hint="Optional. If set, the player will load this video.">
              <input className="admin-input" defaultValue={sr.videoUrl ?? ''} onChange={(e) => update({ videoUrl: e.target.value || null })} />
            </Field>
          </div>
        </AdminCard>
      </div>
    </>
  )
}
