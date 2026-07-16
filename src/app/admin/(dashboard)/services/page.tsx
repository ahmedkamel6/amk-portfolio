'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { ICON_NAMES } from '@/lib/portfolio/icons'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface ServiceItem {
  id: string
  emoji: string
  iconName: string
  title: string
  description: string
  features: string[]
  order: number
}

export default function AdminServicesPage() {
  const { data: services, update } = useApi<ServiceItem[]>('/api/services')

  if (!services) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addNew = () => {
    update({
      emoji: '✨', iconName: 'Sparkles', title: 'New Service',
      description: 'Describe this service.', features: ['Feature 1', 'Feature 2'],
    }, 'POST')
  }

  const move = async (index: number, dir: -1 | 1) => {
    const newIndex = index + dir
    if (newIndex < 0 || newIndex >= services.length) return
    const reordered = [...services]
    ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]
    await update(reordered.map((s, i) => ({ id: s.id, order: i })), 'PUT')
  }

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Four premium glass cards. Add, edit, reorder, or delete services."
        actions={<button onClick={addNew} className="admin-btn admin-btn-primary"><Plus className="h-4 w-4" /> Add Service</button>}
      />
      <div className="space-y-6">
        {services.map((service, index) => (
          <AdminCard key={service.id}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">0{index + 1}</span>
                <span className="text-2xl">{service.emoji}</span>
                <span className="font-display text-lg font-bold text-[var(--text-primary)]">{service.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => move(index, -1)} disabled={index === 0} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-emerald-glow disabled:opacity-30">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === services.length - 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-emerald-glow disabled:opacity-30">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button onClick={() => update({ id: service.id }, 'DELETE')} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Emoji">
                <input className="admin-input" defaultValue={service.emoji} onChange={(e) => update({ ...service, emoji: e.target.value })} />
              </Field>
              <Field label="Icon (on hover)">
                <select className="admin-input" defaultValue={service.iconName} onChange={(e) => update({ ...service, iconName: e.target.value })}>
                  {ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </Field>
              <Field label="Title">
                <input className="admin-input" defaultValue={service.title} onChange={(e) => update({ ...service, title: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description">
                <textarea className="admin-input admin-textarea" defaultValue={service.description} onChange={(e) => update({ ...service, description: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Features" hint="Comma-separated">
                <input className="admin-input" defaultValue={service.features.join(', ')} onChange={(e) => update({ ...service, features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean) })} />
              </Field>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  )
}
