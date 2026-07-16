'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { AboutContent } from '@/lib/portfolio/default-content'

export default function AdminAboutPage() {
  const { data: about, update } = useApi<AboutContent>('/api/about-content')
  if (!about) return <div className="text-[var(--text-muted)]">Loading...</div>

  return (
    <>
      <AdminPageHeader
        title="About Me"
        description="Profile details, avatar, and video intro."
      />
      <div className="space-y-6">
        <AdminCard>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Title">
              <input 
                className="admin-input" 
                defaultValue={about.title} 
                onBlur={(e) => update({ title: e.target.value }, 'PUT')} 
              />
            </Field>
            <Field label="Title Highlight">
              <input 
                className="admin-input" 
                defaultValue={about.titleHighlight} 
                onBlur={(e) => update({ titleHighlight: e.target.value }, 'PUT')} 
              />
            </Field>
          </div>
          
          <div className="mt-4">
            <Field label="Description (Who I am)">
              <textarea 
                className="admin-input admin-textarea" 
                rows={5}
                defaultValue={about.description} 
                onBlur={(e) => update({ description: e.target.value }, 'PUT')} 
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Profile Image URL" hint="Local path (e.g. /my-avatar.png) or full URL">
              <input 
                className="admin-input" 
                defaultValue={about.imageUrl || ''} 
                onBlur={(e) => update({ imageUrl: e.target.value }, 'PUT')} 
              />
            </Field>
            <Field label="Video Intro URL" hint="Google Drive share link">
              <input 
                className="admin-input" 
                defaultValue={about.videoUrl || ''} 
                onBlur={(e) => update({ videoUrl: e.target.value }, 'PUT')} 
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Tools & Software" hint="Comma separated (e.g. Premiere Pro, After Effects, Photoshop)">
              <input 
                className="admin-input" 
                defaultValue={about.tools} 
                onBlur={(e) => update({ tools: e.target.value }, 'PUT')} 
              />
            </Field>
          </div>
        </AdminCard>
      </div>
    </>
  )
}
