'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'

interface ToolLogo {
  id: string
  name: string
  imageUrl: string
}

export default function AdminToolLogosPage() {
  const { data: tools, update } = useApi<ToolLogo[]>('/api/tool-logos')
  if (!tools) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addNew = () => {
    update({ name: 'New Tool', imageUrl: '' }, 'POST')
  }

  return (
    <>
      <AdminPageHeader
        title="Tool Logos"
        description="أيقونات البرامج. أضف أسماء البرامج وصورها لتظهر كأيقونات بدلاً من نصوص في المشاريع."
        actions={<button onClick={addNew} className="admin-btn admin-btn-primary shadow-[0_0_20px_rgba(0,208,132,0.3)]"><Plus className="h-4 w-4" /> Add Tool Logo</button>}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <AdminCard key={tool.id} className="relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-[var(--background)] flex items-center justify-center border border-[var(--border)] overflow-hidden shrink-0">
                {tool.imageUrl ? (
                  <img src={tool.imageUrl} alt={tool.name} className="h-full w-full object-contain p-2" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-[var(--text-muted)]" />
                )}
              </div>
              <div className="flex-1">
                <input
                  className="bg-transparent text-lg font-bold text-[var(--text-primary)] focus:outline-none focus:border-b border-emerald-glow w-full"
                  defaultValue={tool.name}
                  onChange={(e) => update({ ...tool, name: e.target.value })}
                  placeholder="Tool Name"
                />
              </div>
              <button
                onClick={() => update({ id: tool.id }, 'DELETE')}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <Field label="Logo Image URL">
              <input
                className="admin-input text-sm"
                defaultValue={tool.imageUrl}
                onChange={(e) => update({ ...tool, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </Field>
          </AdminCard>
        ))}
      </div>
    </>
  )
}
