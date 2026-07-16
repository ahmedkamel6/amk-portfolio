'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { Plus, Trash2 } from 'lucide-react'

interface TestimonialItem {
  id: string
  name: string
  role: string
  company: string
  quote: string
  initials: string
  color: string
}

export default function AdminTestimonialsPage() {
  const { data: testimonials, update } = useApi<TestimonialItem[]>('/api/testimonials')
  if (!testimonials) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addNew = () => {
    update({ name: 'New Client', role: 'Role', company: 'Company', quote: 'Their quote here.', initials: 'NC', color: '#00D084' }, 'POST')
  }

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Auto-sliding glass cards with 5-star ratings."
        actions={<button onClick={addNew} className="admin-btn admin-btn-primary"><Plus className="h-4 w-4" /> Add Testimonial</button>}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <AdminCard key={t.id}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold" style={{ background: `linear-gradient(135deg, ${t.color}30, ${t.color}10)`, border: `1px solid ${t.color}40`, color: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-display text-base font-bold text-[var(--text-primary)]">{t.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{t.role} · {t.company}</div>
                </div>
              </div>
              <button onClick={() => update({ id: t.id }, 'DELETE')} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <Field label="Quote">
                <textarea className="admin-input admin-textarea" defaultValue={t.quote} onChange={(e) => update({ ...t, quote: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name">
                  <input className="admin-input" defaultValue={t.name} onChange={(e) => update({ ...t, name: e.target.value })} />
                </Field>
                <Field label="Initials">
                  <input className="admin-input" defaultValue={t.initials} maxLength={3} onChange={(e) => update({ ...t, initials: e.target.value })} />
                </Field>
                <Field label="Role">
                  <input className="admin-input" defaultValue={t.role} onChange={(e) => update({ ...t, role: e.target.value })} />
                </Field>
                <Field label="Company">
                  <input className="admin-input" defaultValue={t.company} onChange={(e) => update({ ...t, company: e.target.value })} />
                </Field>
              </div>
              <Field label="Avatar Color">
                <div className="flex items-center gap-2">
                  <input type="color" className="h-10 w-12" defaultValue={t.color} onChange={(e) => update({ ...t, color: e.target.value })} />
                  <input className="admin-input font-mono-display text-xs" defaultValue={t.color} onChange={(e) => update({ ...t, color: e.target.value })} />
                </div>
              </Field>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  )
}
