'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useSingleton } from '@/lib/portfolio/use-api'
import { ICON_NAMES } from '@/lib/portfolio/icons'
import { Plus, Trash2 } from 'lucide-react'
import type { ContactContent } from '@/lib/portfolio/default-content'

export default function AdminContactPage() {
  const { data: contact, update, loading } = useSingleton<ContactContent>('/api/contact')
  if (loading || !contact) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addChannel = () => {
    const newChannel = {
      id: `c${Date.now()}`,
      iconName: 'Mail',
      label: 'New Channel',
      handle: '@handle',
      href: 'https://',
    }
    update({ channels: [...contact.channels, newChannel] })
  }

  const removeChannel = (id: string) => {
    update({ channels: contact.channels.filter((c) => c.id !== id) })
  }

  const updateChannel = (id: string, patch: Partial<typeof contact.channels[number]>) => {
    update({ channels: contact.channels.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
  }

  return (
    <>
      <AdminPageHeader title="Contact" description="The closing CTA section. Edits save instantly." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="space-y-5">
            <Field label="Title" hint="Non-highlighted portion">
              <input className="admin-input" defaultValue={contact.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Title Highlight" hint="Emerald gradient portion">
              <input className="admin-input" defaultValue={contact.titleHighlight} onChange={(e) => update({ titleHighlight: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className="admin-input admin-textarea" defaultValue={contact.description} onChange={(e) => update({ description: e.target.value })} />
            </Field>
            <Field label="CTA Label">
              <input className="admin-input" defaultValue={contact.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} />
            </Field>
            <Field label="CTA Link">
              <input className="admin-input" defaultValue={contact.ctaHref} onChange={(e) => update({ ctaHref: e.target.value })} />
            </Field>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="space-y-5">
            <Field label="Footer Name">
              <input className="admin-input" defaultValue={contact.footerName} onChange={(e) => update({ footerName: e.target.value })} />
            </Field>
            <Field label="Footer Tagline">
              <input className="admin-input" defaultValue={contact.footerTagline} onChange={(e) => update({ footerTagline: e.target.value })} />
            </Field>
            <Field label="Footer Copyright">
              <input className="admin-input" defaultValue={contact.footerCopyright} onChange={(e) => update({ footerCopyright: e.target.value })} />
            </Field>
          </div>
        </AdminCard>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Contact Channels</h2>
          <button onClick={addChannel} className="admin-btn admin-btn-primary">
            <Plus className="h-4 w-4" /> Add Channel
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {contact.channels.map((ch, i) => (
            <AdminCard key={ch.id || i}>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-[var(--text-primary)]">{ch.label}</span>
                <button onClick={() => removeChannel(ch.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Label">
                    <input className="admin-input" defaultValue={ch.label} onChange={(e) => updateChannel(ch.id, { label: e.target.value })} />
                  </Field>
                  <Field label="Icon">
                    <select className="admin-input" defaultValue={ch.iconName} onChange={(e) => updateChannel(ch.id, { iconName: e.target.value })}>
                      {ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Handle / Display Text">
                  <input className="admin-input" defaultValue={ch.handle} onChange={(e) => updateChannel(ch.id, { handle: e.target.value })} />
                </Field>
                <Field label="Link (URL or mailto:)">
                  <input className="admin-input" defaultValue={ch.href} onChange={(e) => updateChannel(ch.id, { href: e.target.value })} />
                </Field>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    </>
  )
}
