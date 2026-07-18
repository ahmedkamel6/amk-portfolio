'use client'

import { useState, useRef } from 'react'
import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useApi } from '@/lib/portfolio/use-api'
import { Plus, Trash2, Wand2, Image as ImageIcon, Video, AlignLeft, LayoutDashboard, Crop } from 'lucide-react'

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

const COMMON_TOOLS = [
  'Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Photoshop',
  'Illustrator',
  'Blender',
  'Cinema 4D',
  'Figma',
  'CapCut'
]

// Helper specifically for Google Drive image thumbnails (high quality) or YouTube
export function getDriveThumbnailUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // YouTube check
  const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://img.youtube.com/vi/${ytMatch[2]}/maxresdefault.jpg`;
  }
  // Drive check
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1920-h1080`;
  }
  return url;
}

// Helper to get direct video download link for Google Drive (allows proxy streaming)
function getDirectDriveUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}&confirm=t`;
  }
  return url;
}

function VideoScrubberModal({ videoLink, onClose, onCapture }: { videoLink: string, onClose: () => void, onCapture: (base64: string) => void }) {
  const reactVideoRef = useRef<HTMLVideoElement>(null);
  
  const directUrl = getDirectDriveUrl(videoLink) || videoLink;
  // Proxy URL to bypass CORS and allow canvas extraction
  const proxyUrl = `/api/proxy-video?url=${encodeURIComponent(directUrl)}`;

  const handleCapture = () => {
    const video = reactVideoRef.current;
    if (!video) return alert("Video not ready");

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return alert("Video metadata not loaded yet. Please play the video for a second.");
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    } catch (error) {
      console.error("Capture failed:", error);
      alert("تعذر التقاط الصورة بسبب قيود الأمان في رابط الفيديو. يرجى التأكد من أن الرابط مباشر أو استخدام زر السحب التلقائي.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[90%] max-w-2xl rounded-2xl border border-[var(--border)] bg-[#0d0f14] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Capture Video Frame</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white">✕</button>
        </div>
        
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black mb-4">
          <video 
            ref={reactVideoRef}
            src={proxyUrl} 
            controls 
            crossOrigin="anonymous" 
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="admin-btn border border-[var(--border)] hover:bg-white/5">Cancel</button>
          <button onClick={handleCapture} className="admin-btn admin-btn-primary flex items-center gap-2">
            <Crop className="h-4 w-4" /> Capture & Use Frame
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminProjectCard({ project, update }: { project: ProjectItem, update: any }) {
  const [activeTab, setActiveTab] = useState<'basics' | 'details' | 'media'>('basics')
  const [showScrubber, setShowScrubber] = useState(false)

  // Derive thumbnail for preview
  const rawPoster = project.thumbnailUrl || project.coverImage || undefined;
  const previewThumb = getDriveThumbnailUrl(rawPoster) || rawPoster || getDriveThumbnailUrl(project.videoUrl) || getDriveThumbnailUrl(project.driveUrl);

  const extractThumbnail = () => {
    const videoLink = project.videoUrl || project.driveUrl;
    if (!videoLink) return alert('Please enter a video link first!');
    const thumbUrl = getDriveThumbnailUrl(videoLink);
    if (thumbUrl && thumbUrl !== videoLink) {
       update({ ...project, thumbnailUrl: thumbUrl });
    } else {
       alert('Could not extract a thumbnail automatically from the provided link.');
    }
  }

  const toggleTool = (tool: string) => {
    const tools = new Set(project.toolsUsed);
    if (tools.has(tool)) {
      tools.delete(tool);
    } else {
      tools.add(tool);
    }
    update({ ...project, toolsUsed: Array.from(tools) });
  }

  return (
    <AdminCard>
      {/* Header with visual preview */}
      <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-xl border border-[var(--border)] bg-black/40 flex-shrink-0 relative">
            {previewThumb ? (
              <img src={previewThumb} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50`} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-xl font-bold text-[var(--text-primary)]">{project.title}</span>
              <a href={`/projects/${project.slug}`} target="_blank" className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-emerald-glow hover:bg-emerald-glow/10">
                /{project.slug}
              </a>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{project.year}</span>
              <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{project.category}</span>
              {project.featured && <span className="rounded-full border border-emerald-glow/30 bg-emerald-glow/10 px-2 py-0.5 text-[10px] text-emerald-glow">Featured</span>}
            </div>
          </div>
        </div>
        <button onClick={() => update({ id: project.id }, 'DELETE')} className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-[var(--border)] pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('basics')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'basics' ? 'bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-strong)] border border-transparent'}`}
        >
          <LayoutDashboard className="h-4 w-4" /> الأساسيات (Basics)
        </button>
        <button 
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'details' ? 'bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-strong)] border border-transparent'}`}
        >
          <AlignLeft className="h-4 w-4" /> التفاصيل (Details)
        </button>
        <button 
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'media' ? 'bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-strong)] border border-transparent'}`}
        >
          <ImageIcon className="h-4 w-4" /> الميديا والمظهر (Media)
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'basics' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Title (العنوان)">
              <input className="admin-input font-bold" defaultValue={project.title} onChange={(e) => update({ ...project, title: e.target.value })} />
            </Field>
            <Field label="Slug (الرابط)" hint="يُولد تلقائياً لو تم تركه فارغاً">
              <input className="admin-input text-emerald-glow/80" defaultValue={project.slug} onChange={(e) => update({ ...project, slug: e.target.value })} />
            </Field>
            <Field label="Category (القسم)" hint="مثال: Commercial, Color Grading">
              <input className="admin-input" defaultValue={project.category} onChange={(e) => update({ ...project, category: e.target.value })} />
            </Field>
            <Field label="REEL VIDEO LINK (لينك فيديو بالطول 9:16)" hint="لينك يوتيوب أو جوجل درايف. ضروري للرئيسية">
              <div className="relative">
                <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input className="admin-input pl-9" defaultValue={project.driveUrl ?? ''} onChange={(e) => update({ ...project, driveUrl: e.target.value || null })} />
              </div>
            </Field>
          </div>
          <Field label="Short Description (وصف قصير)" hint="يظهر على كارت المشروع من الخارج">
            <textarea className="admin-input admin-textarea" style={{ minHeight: 80 }} defaultValue={project.shortDescription} onChange={(e) => update({ ...project, shortDescription: e.target.value })} />
          </Field>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Year (السنة)">
              <input className="admin-input" defaultValue={project.year} onChange={(e) => update({ ...project, year: e.target.value })} />
            </Field>
            <Field label="Client (العميل)">
              <input className="admin-input" defaultValue={project.client ?? ''} onChange={(e) => update({ ...project, client: e.target.value || null })} />
            </Field>
            <Field label="Duration (المدة)">
              <input className="admin-input" defaultValue={project.duration ?? ''} onChange={(e) => update({ ...project, duration: e.target.value || null })} />
            </Field>
          </div>
          
          <Field label="Tools Used (البرامج المستخدمة)" hint="اختر من القائمة أو أضف أدواتك مفصولة بفاصلة">
            <div className="mb-3 flex flex-wrap gap-2">
              {COMMON_TOOLS.map(tool => {
                const isActive = project.toolsUsed.includes(tool);
                return (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                      isActive 
                        ? 'bg-emerald-glow border-emerald-glow text-black' 
                        : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-emerald-glow/50'
                    }`}
                  >
                    {tool}
                  </button>
                )
              })}
            </div>
            <input 
              className="admin-input text-sm" 
              placeholder="أدوات أخرى مفصولة بفاصلة..."
              value={project.toolsUsed.join(', ')} 
              onChange={(e) => update({ ...project, toolsUsed: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} 
            />
          </Field>

          <Field label="Full Description (وصف كامل)" hint="يظهر داخل صفحة المشروع فقط.">
            <textarea className="admin-input admin-textarea" style={{ minHeight: 120 }} defaultValue={project.fullDescription} onChange={(e) => update({ ...project, fullDescription: e.target.value })} />
          </Field>

          <Field label="Featured (مشروع مميز)">
            <label className="flex items-center gap-3 pt-2 cursor-pointer bg-[var(--surface-strong)] p-4 rounded-xl border border-[var(--border)] hover:border-emerald-glow/30 transition-colors">
              <input type="checkbox" defaultChecked={project.featured} onChange={(e) => update({ ...project, featured: e.target.checked })} className="h-5 w-5 rounded border-[var(--border)] accent-emerald-glow" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--text-primary)]">إظهار في المشاريع المميزة</span>
                <span className="text-xs text-[var(--text-muted)]">سيظهر في الصفحة الرئيسية بجانب صفحة المشاريع</span>
              </div>
            </label>
          </Field>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Cover/Thumbnail Link (صورة الغلاف)">
              <div className="flex gap-2">
                <input className="admin-input flex-1" placeholder="أو اتركها فارغة لسحبها من الفيديو" value={project.thumbnailUrl ?? project.coverImage ?? ''} onChange={(e) => update({ ...project, thumbnailUrl: e.target.value || null })} />
                <button 
                  onClick={() => setShowScrubber(true)}
                  title="استخراج إطار من الفيديو يدوياً"
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-glow/10 border border-emerald-glow/30 px-3 text-sm text-emerald-glow hover:bg-emerald-glow/20 transition-colors whitespace-nowrap"
                >
                  <Crop className="h-4 w-4" /> استخراج إطار
                </button>
                <button 
                  onClick={extractThumbnail}
                  title="سحب الغلاف تلقائياً من فيديو جوجل درايف"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[var(--surface-strong)] border border-[var(--border)] px-3 text-sm text-[var(--text-secondary)] hover:text-white transition-colors whitespace-nowrap"
                >
                  <Wand2 className="h-4 w-4" /> Auto
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1 ml-1">استخدم الزر لفتح مشغل الفيديو واختيار الإطار المناسب كصورة غلاف.</p>
            </Field>

            {showScrubber && (project.driveUrl || project.videoUrl) && (
              <VideoScrubberModal 
                videoLink={project.driveUrl || project.videoUrl || ''}
                onClose={() => setShowScrubber(false)}
                onCapture={(base64) => {
                  update({ ...project, thumbnailUrl: base64 });
                  setShowScrubber(false);
                }}
              />
            )}

            <Field label="LONG-FORM VIDEO LINK (فيديو بالعرض 16:9)" hint="لينك يوتيوب أو جوجل درايف اختياري. يظهر داخل الصفحة الخاصة للمشروع.">
              <div className="relative">
                <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input className="admin-input pl-9" defaultValue={project.videoUrl ?? ''} onChange={(e) => update({ ...project, videoUrl: e.target.value || null })} />
              </div>
            </Field>
            
            <Field label="Gallery Image URLs (صور إضافية)" hint="يفصل بينها بفاصلة. تظهر داخل صفحة المشروع.">
              <input className="admin-input" defaultValue={project.gallery.join(', ')} onChange={(e) => update({ ...project, gallery: e.target.value.split(',').map((g) => g.trim()).filter(Boolean) })} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Cover Pattern">
                <select className="admin-input" defaultValue={project.pattern} onChange={(e) => update({ ...project, pattern: e.target.value })}>
                  {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Gradient">
                <input className="admin-input font-mono-display text-xs" defaultValue={project.gradient} onChange={(e) => update({ ...project, gradient: e.target.value })} />
              </Field>
            </div>
          </div>
        </div>
      )}
    </AdminCard>
  )
}

export default function AdminProjectsPage() {
  const { data: projects, update } = useApi<ProjectItem[]>('/api/projects')
  if (!projects) return <div className="text-[var(--text-muted)]">Loading...</div>

  const addNew = () => {
    update({
      title: 'New Project', slug: '', category: 'Category',
      shortDescription: 'Short description.', fullDescription: 'Full description.',
      gradient: 'from-[#003B2A] via-[#00D084]/40 to-[#0B0B0B]', pattern: 'cinema',
      toolsUsed: ['Premiere Pro'], tech: ['Premiere Pro'], year: new Date().getFullYear().toString(),
      duration: null, client: null, videoUrl: null, coverImage: null,
      driveUrl: null, thumbnailUrl: null,
      gallery: [], beforeAfter: {}, featured: true,
    }, 'POST')
  }

  return (
    <>
      <AdminPageHeader
        title="Projects & Reels"
        description="إدارة المشاريع والفيديوهات. مقسمة بشكل نظيف ليسهل عليك التعديل."
        actions={<button onClick={addNew} className="admin-btn admin-btn-primary shadow-[0_0_20px_rgba(0,208,132,0.3)]"><Plus className="h-4 w-4" /> Add Project</button>}
      />
      <div className="space-y-6">
        {projects.map((project) => (
          <AdminProjectCard key={project.id} project={project} update={update} />
        ))}
      </div>
    </>
  )
}
