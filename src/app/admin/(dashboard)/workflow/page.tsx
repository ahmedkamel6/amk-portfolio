'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { ICON_NAMES } from '@/lib/portfolio/icons'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface WorkflowItem {
  id: string
  number: string
  title: string
  description: string
  iconName: string
  duration: string
  order: number
}

export default function AdminWorkflowPage() {
  const { data: workflow, update } = useApi<WorkflowItem[]>('/api/workflow')
  if (!workflow) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addNew = () => {
    update({
      number: String(workflow.length + 1).padStart(2, '0'),
      title: 'New Step', description: 'Describe this step.',
      iconName: 'Sparkles', duration: '1 day',
    }, 'POST')
  }

  const move = async (index: number, dir: -1 | 1) => {
    const newIndex = index + dir
    if (newIndex < 0 || newIndex >= workflow.length) return
    const reordered = [...workflow]
    ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]
    await update(reordered.map((w, i) => ({ id: w.id, order: i, number: String(i + 1).padStart(2, '0') })), 'PUT')
  }

  return (
    <>
      <AdminPageHeader
        title="Workflow"
        description="The animated timeline. Steps appear in order on the live site."
        actions={<button onClick={addNew} className="admin-btn admin-btn-primary"><Plus className="h-4 w-4" /> Add Step</button>}
      />
      <div className="space-y-6">
        {workflow.map((step, index) => (
          <AdminCard key={step.id}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-[var(--text-muted)]">{step.number}</span>
                <span className="font-display text-lg font-bold text-[var(--text-primary)]">{step.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => move(index, -1)} disabled={index === 0} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-emerald-glow disabled:opacity-30">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === workflow.length - 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-emerald-glow disabled:opacity-30">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button onClick={() => update({ id: step.id }, 'DELETE')} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Number">
                <input className="admin-input" defaultValue={step.number} onChange={(e) => update({ ...step, number: e.target.value })} />
              </Field>
              <Field label="Title">
                <input className="admin-input" defaultValue={step.title} onChange={(e) => update({ ...step, title: e.target.value })} />
              </Field>
              <Field label="Duration">
                <input className="admin-input" defaultValue={step.duration} onChange={(e) => update({ ...step, duration: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Icon">
                <select className="admin-input" defaultValue={step.iconName} onChange={(e) => update({ ...step, iconName: e.target.value })}>
                  {ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea className="admin-input admin-textarea" defaultValue={step.description} onChange={(e) => update({ ...step, description: e.target.value })} />
                </Field>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  )
}
