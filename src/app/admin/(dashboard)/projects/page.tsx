'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { Plus, Trash2 } from 'lucide-react'

interface ProjectItem {
  id: string
  slug: string
  title: string
  category: string
  shortDescription: string
  fullDescription: string
  gradient: string
  pattern: string
  toolsUsed: string[]
  tech: string[]
  year: string
  duration: string | null
  client: string | null
  videoUrl: string | null
  coverImage: string | null
  driveUrl: string | null
  thumbnailUrl: string | null
  gallery: string[]
  beforeAfter: Record<string, string>
  featured: boolean
}

const PATTERNS = ['cinema', 'product', 'brand', 'motion']

export default function AdminProjectsPage() {
  const { data: projects, update } = useApi<ProjectItem[]>('/api/projects')
  if (!projects) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addNew = () => {
    update({
      title: 'New Project', slug: '', category: 'Category',
      shortDescription: 'Short description.', fullDescription: 'Full description.',
      gradient: 'from-[#003B2A] via-[#00D084]/40 to-[#0B0B0B]', pattern: 'cinema',
      toolsUsed: ['Tool 1'], tech: ['Tool 1'], year: '2026',
      duration: null, client: null, videoUrl: null, coverImage: null,
      driveUrl: null, thumbnailUrl: null,
      gallery: [], beforeAfter: {}, featured: true,
    }, 'POST')
  }

  return (
    <>
      <AdminPageHeader
        title="Featured Projects"
        description="Large project cards with animated covers. Each project has its own detail page at /projects/[slug]."
        actions={<button onClick={addNew} className="admin-btn admin-btn-primary"><Plus className="h-4 w-4" /> Add Project</button>}
      />
      <div className="space-y-6">
        {projects.map((project) => (
          <AdminCard key={project.id}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-[var(--text-primary)]">{project.title}</span>
                <a href={`/projects/${project.slug}`} target="_blank" className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-emerald-glow hover:bg-emerald-glow/10">
                  /{project.slug}
                </a>
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{project.year}</span>
              </div>
              <button onClick={() => update({ id: project.id }, 'DELETE')} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Title">
                <input className="admin-input" defaultValue={project.title} onChange={(e) => update({ ...project, title: e.target.value })} />
              </Field>
              <Field label="Slug" hint="Auto-generated from title if left empty">
                <input className="admin-input" defaultValue={project.slug} onChange={(e) => update({ ...project, slug: e.target.value })} />
              </Field>
              <Field label="Category">
                <input className="admin-input" defaultValue={project.category} onChange={(e) => update({ ...project, category: e.target.value })} />
              </Field>
              <Field label="Year">
                <input className="admin-input" defaultValue={project.year} onChange={(e) => update({ ...project, year: e.target.value })} />
              </Field>
              <Field label="Client">
                <input className="admin-input" defaultValue={project.client ?? ''} onChange={(e) => update({ ...project, client: e.target.value || null })} />
              </Field>
              <Field label="Duration">
                <input className="admin-input" defaultValue={project.duration ?? ''} onChange={(e) => update({ ...project, duration: e.target.value || null })} />
              </Field>
              <Field label="Cover Pattern">
                <select className="admin-input" defaultValue={project.pattern} onChange={(e) => update({ ...project, pattern: e.target.value })}>
                  {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Featured">
                <label className="flex items-center gap-3 pt-7 cursor-pointer">
                  <input type="checkbox" defaultChecked={project.featured} onChange={(e) => update({ ...project, featured: e.target.checked })} className="h-4 w-4 rounded border-[var(--border)] accent-emerald-glow" />
                  <span className="text-sm text-[var(--text-secondary)]">Show in Featured Projects section</span>
                </label>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Short Description" hint="Shown on the project card">
                <textarea className="admin-input admin-textarea" defaultValue={project.shortDescription} onChange={(e) => update({ ...project, shortDescription: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Full Description" hint="Shown on the project detail page. Use double newlines for paragraphs.">
                <textarea className="admin-input admin-textarea" style={{ minHeight: 120 }} defaultValue={project.fullDescription} onChange={(e) => update({ ...project, fullDescription: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tools Used" hint="Comma-separated">
                <input className="admin-input" defaultValue={project.toolsUsed.join(', ')} onChange={(e) => update({ ...project, toolsUsed: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
              </Field>
              <Field label="Gradient (Tailwind classes)">
                <input className="admin-input font-mono-display text-xs" defaultValue={project.gradient} onChange={(e) => update({ ...project, gradient: e.target.value })} />
              </Field>
              <Field label="REEL VIDEO LINK (Google Drive - 9:16)" hint="e.g. https://drive.google.com/file/d/ID/view">
                <input className="admin-input" defaultValue={project.driveUrl ?? ''} onChange={(e) => update({ ...project, driveUrl: e.target.value || null })} />
              </Field>
              <Field label="Cover/Thumbnail Link" hint="Image URL to show before playing">
                <input className="admin-input" defaultValue={project.thumbnailUrl ?? ''} onChange={(e) => update({ ...project, thumbnailUrl: e.target.value || null })} />
              </Field>
              <Field label="LONG-FORM VIDEO LINK (Google Drive - 16:9)" hint="Optional. Loaded in the project page player.">
                <input className="admin-input" defaultValue={project.videoUrl ?? ''} onChange={(e) => update({ ...project, videoUrl: e.target.value || null })} />
              </Field>
              <Field label="Legacy Cover Image URL" hint="Optional. Falls back to gradient cover.">
                <input className="admin-input" defaultValue={project.coverImage ?? ''} onChange={(e) => update({ ...project, coverImage: e.target.value || null })} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Gallery Image URLs" hint="Comma-separated. Shown on the project detail page.">
                <input className="admin-input" defaultValue={project.gallery.join(', ')} onChange={(e) => update({ ...project, gallery: e.target.value.split(',').map((g) => g.trim()).filter(Boolean) })} />
              </Field>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  )
}

