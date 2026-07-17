'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Clock, Calendar, User, Wrench, Play, Mail } from 'lucide-react'
import type { ProjectDetail } from '@/lib/portfolio/db'
import { getDirectDriveUrl, getDriveThumbnailUrl } from './ProjectCard'
import { PremiumVideoPlayer } from './PremiumVideoPlayer'

export function ProjectDetailPage({
  project,
  related,
  toolLogos,
}: {
  project: ProjectDetail
  related: ProjectDetail[]
  toolLogos?: any[]
}) {
  const router = useRouter()

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/projects')
    }
  }

  const details = [
    { icon: Calendar, label: 'Year', value: project.year },
    { icon: Clock, label: 'Duration', value: project.duration || '—' },
    { icon: User, label: 'Client', value: project.client || '—' },
  ]

  const reelUrl = project.driveUrl;
  const longFormUrl = project.videoUrl;
  
  const rawPoster = project.thumbnailUrl || project.coverImage || undefined;
  const posterUrl = getDriveThumbnailUrl(rawPoster) || rawPoster;

  // Decide what primary video to show
  const primaryVideoUrl = longFormUrl || reelUrl;
  const primaryAspect = longFormUrl ? 'video' : '9/16';

  const isReelPage = primaryAspect === '9/16' && !longFormUrl;

  const toolsUsedSection = (
    <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] p-6">
      <h3 className="flex items-center gap-2 font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
        <Wrench className="h-3.5 w-3.5" />
        Tools Used
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.toolsUsed.map((tool) => {
          const logoInfo = toolLogos?.find((tl) => tl.name.toLowerCase() === tool.toLowerCase())
          if (logoInfo?.imageUrl) {
            return (
              <div key={tool} className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1">
                <img src={logoInfo.imageUrl} alt={tool} className="h-4 w-4 object-contain" />
                <span className="text-xs text-[var(--text-secondary)]">{tool}</span>
              </div>
            )
          }
          return (
            <span key={tool} className="rounded-md border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
              {tool}
            </span>
          )
        })}
      </div>
    </div>
  )

  const projectDetailsSection = (
    <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] p-6">
      <h3 className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
        Project Details
      </h3>
      <dl className="mt-4 space-y-4">
        {details.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <d.icon className="h-4 w-4 text-emerald-glow" />
            <div>
              <dt className="font-mono-display text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{d.label}</dt>
              <dd className="text-sm font-medium text-[var(--text-primary)]">{d.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )

  return (
    <main className="relative min-h-screen pt-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div
          className="absolute left-1/2 top-0 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 20%, transparent), transparent 70%)' }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-emerald-glow focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all projects
          </button>
        </motion.div>

        {isReelPage ? (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-start">
            {/* Left: Title */}
            <div className="lg:sticky lg:top-32 lg:col-span-1">
              <header>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-emerald-glow/30 bg-emerald-glow/10 px-3 py-1 font-mono-display text-[10px] uppercase tracking-[0.3em] text-emerald-glow">
                    {project.category}
                  </span>
                  <span className="font-mono-display text-[10px] text-[var(--text-muted)]">{project.year}</span>
                </div>
                <h1 className="mt-6 font-display text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] md:text-6xl overflow-hidden" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                  {project.title}
                </h1>
              </header>
            </div>

            {/* Center: Video */}
            <div className="flex justify-center lg:col-span-1">
              <div className="w-full max-w-[400px]">
                <PremiumVideoPlayer 
                  src={primaryVideoUrl || ''} 
                  poster={posterUrl || ''}
                  aspectRatio="9/16"
                  autoPlay={true}
                />
              </div>
            </div>

            {/* Right: Details & Description */}
            <div className="space-y-8 lg:col-span-1">
              {project.shortDescription && (
                <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                  {project.shortDescription}
                </p>
              )}
              {project.fullDescription && (
                <div>
                  <h2 className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-emerald-glow/70">Overview</h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {project.fullDescription.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {projectDetailsSection}
                {toolsUsedSection}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero */}
            <header className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="rounded-full border border-emerald-glow/30 bg-emerald-glow/10 px-3 py-1 font-mono-display text-[10px] uppercase tracking-[0.3em] text-emerald-glow">
                  {project.category}
                </span>
                <span className="font-mono-display text-[10px] text-[var(--text-muted)]">{project.year}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 font-display text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] md:text-7xl overflow-hidden"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              >
                {project.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]"
              >
                {project.shortDescription}
              </motion.p>
            </header>

            {/* Cover / Video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-12 w-full"
            >
              {primaryVideoUrl ? (
                <PremiumVideoPlayer 
                  src={primaryVideoUrl || ''} 
                  poster={posterUrl || ''}
                  aspectRatio={primaryAspect}
                  autoPlay={true}
                />
              ) : posterUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-3xl border border-[var(--border)] bg-black" style={{ height: 'min(80vh, 800px)' }}>
                  <img src={posterUrl} alt={project.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                </div>
              ) : (
                <div className="relative aspect-video overflow-hidden rounded-3xl border border-[var(--border)]" style={{ height: 'min(80vh, 800px)' }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <div className="absolute inset-x-0 top-0 h-[8%] bg-black/80" />
                  <div className="absolute inset-x-0 bottom-0 h-[8%] bg-black/80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full glass-emerald glow-emerald-strong">
                      <Play className="ml-1 h-8 w-8 fill-emerald-glow text-emerald-glow" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Details grid */}
            <section className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <h2 className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-emerald-glow/70">
                  Overview
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
                  {project.fullDescription.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <aside className="space-y-4">
                {projectDetailsSection}
                {toolsUsedSection}
              </aside>
            </section>
          </>
        )}

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <section className="mt-16">
            <h2 className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-emerald-glow/70">
              Gallery
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="aspect-video overflow-hidden rounded-2xl border border-[var(--border)]"
                >
                  <img src={src} alt={`${project.title} ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Related projects */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                Related <span className="text-gradient-emerald">Projects</span>
              </h2>
              <Link href="/#projects" className="link-underline font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-emerald-glow">
                View All →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((rel, i) => {
                const isRelReel = !rel.videoUrl && !!rel.driveUrl;
                const aspectClass = isRelReel ? 'aspect-[9/16]' : 'aspect-[16/10]';
                const relRawPoster = rel.thumbnailUrl || rel.coverImage || undefined;
                const relPosterUrl = getDriveThumbnailUrl(relRawPoster) || relRawPoster;
                return (
                  <motion.div
                    key={rel.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                  >
                    <Link
                      href={`/projects/${rel.slug}`}
                      className="group block overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] transition-colors hover:border-emerald-glow/30"
                    >
                      <div className={`relative ${aspectClass} overflow-hidden bg-gradient-to-br ${rel.gradient}`}>
                        {relPosterUrl ? (
                          <img 
                            src={relPosterUrl} 
                            alt={rel.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-grid opacity-20" />
                        )}
                        <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/80 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute right-4 top-4">
                          <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 font-mono-display text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                            {rel.year}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{rel.title}</h3>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{rel.category}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-glow opacity-0 transition-opacity group-hover:opacity-100">
                          View Project <ArrowUpRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-24 overflow-hidden rounded-3xl border border-emerald-glow/20 bg-emerald-glow/[0.04] p-10 text-center md:p-16">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] md:text-5xl">
            Like what you see?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--text-secondary)]">
            Let&apos;s create something amazing together. I read every message and reply within 24 hours.
          </p>
          <Link
            href="/#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full glass-emerald px-8 py-4 text-sm font-medium text-emerald-glow glow-emerald transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4" />
            Start a Conversation
          </Link>
        </section>
      </div>
    </main>
  )
}

