'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { Plus, Trash2 } from 'lucide-react'

interface SkillItem {
  id: string
  name: string
  short: string
  level: number
  color: string
  category: string
}

export default function AdminSkillsPage() {
  const { data: skills, update } = useApi<SkillItem[]>('/api/skills')
  if (!skills) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addNew = () => {
    update({ name: 'New Skill', short: 'NS', level: 80, color: '#00D084', category: 'Category' }, 'POST')
  }

  return (
    <>
      <AdminPageHeader
        title="Skills"
        description="Floating animated skill badges. Each badge shows a proficiency ring."
        actions={<button onClick={addNew} className="admin-btn admin-btn-primary"><Plus className="h-4 w-4" /> Add Skill</button>}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <AdminCard key={skill.id}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold" style={{ background: `linear-gradient(135deg, ${skill.color}30, ${skill.color}10)`, border: `1px solid ${skill.color}40`, color: skill.color }}>
                  {skill.short}
                </div>
                <span className="font-display text-lg font-bold text-[var(--text-primary)]">{skill.name}</span>
              </div>
              <button onClick={() => update({ id: skill.id }, 'DELETE')} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name">
                <input className="admin-input" defaultValue={skill.name} onChange={(e) => update({ ...skill, name: e.target.value })} />
              </Field>
              <Field label="Short Code">
                <input className="admin-input" defaultValue={skill.short} maxLength={3} onChange={(e) => update({ ...skill, short: e.target.value })} />
              </Field>
              <Field label="Category">
                <input className="admin-input" defaultValue={skill.category} onChange={(e) => update({ ...skill, category: e.target.value })} />
              </Field>
              <Field label="Color">
                <div className="flex items-center gap-2">
                  <input type="color" className="h-10 w-12" defaultValue={skill.color} onChange={(e) => update({ ...skill, color: e.target.value })} />
                  <input className="admin-input font-mono-display text-xs" defaultValue={skill.color} onChange={(e) => update({ ...skill, color: e.target.value })} />
                </div>
              </Field>
            </div>
            <div className="mt-3">
              <Field label={`Proficiency: ${skill.level}%`}>
                <input type="range" min={0} max={100} defaultValue={skill.level} onChange={(e) => update({ ...skill, level: Number(e.target.value) })} />
              </Field>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  )
}
