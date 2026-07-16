'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionHeading } from '../SectionHeading'
import type { AboutContent } from '@/lib/portfolio/default-content'
import { Play } from 'lucide-react'

// Helper to convert Google Drive share links to preview links
function getDriveIframeUrl(url: string) {
  if (!url) return ''
  const fileIdMatch = url.match(/[-\w]{25,}/)
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview?autoplay=1&mute=0`
  }
  return url
}

export function About({ about, index = '03' }: { about: AboutContent, index?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, amount: 0.1 })
  const [isPlaying, setIsPlaying] = useState(false)

  if (!about) return null

  const toolsArray = about.tools ? about.tools.split(',').map((t) => t.trim()).filter(Boolean) : []
  const descriptionText = about.description || ''

  return (
    <section id="about" className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48 contain-paint" style={{ contentVisibility: 'auto' }} ref={containerRef}>
      <div className="pointer-events-none absolute inset-0">
      </div>
      
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section Title */}
        <SectionHeading 
          index={index} 
          eyebrow="About Me" 
          title={<>{about.title || 'The Journey'} <span className="text-gradient-emerald">{about.titleHighlight || 'So Far'}</span></>} 
          description=""
        />

        {/* Profile Details Split Layout */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16 items-start">
          
          {/* Left Column - Profile Image */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] shadow-xl aspect-[4/5]"
          >
            <img 
              src={about.imageUrl || '/default-avatar.png'} 
              alt="Ahmed Kamel Profile"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-50" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-2xl" />
          </motion.div>

          {/* Right Column - Text & Tools */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="prose prose-invert max-w-none text-lg text-[var(--text-secondary)] leading-relaxed">
              {descriptionText ? descriptionText.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 last:mb-0">
                  {paragraph}
                </p>
              )) : (
                <p className="italic opacity-50">No description provided.</p>
              )}
            </div>

            {/* Tools Array */}
            {toolsArray.length > 0 && (
              <div className="mt-12">
                <h4 className="mb-6 text-sm font-mono-display uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-4">
                  <span className="h-px flex-1 bg-[var(--border)]" />
                  Software & Tools
                  <span className="h-px flex-1 bg-[var(--border)]" />
                </h4>
                <div className="flex flex-wrap gap-3">
                  {toolsArray.map((tool) => (
                    <div 
                      key={tool} 
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-emerald-glow/50 hover:bg-emerald-glow/5"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
        </div>

        {/* Cinematic Widescreen Video Player */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="group relative mt-20 mx-auto w-full max-w-5xl aspect-video overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] shadow-2xl"
        >
          {isPlaying && about.videoUrl ? (
            <iframe
              src={getDriveIframeUrl(about.videoUrl)}
              allow="autoplay; fullscreen"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <>
              {/* Thumbnail - Green Logo */}
              <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center">
                <img 
                  src="/icon.png" 
                  alt="Video Thumbnail"
                  loading="lazy"
                  decoding="async"
                  className="h-32 md:h-48 w-auto object-contain opacity-50 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-70"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
              
              {/* Play Button */}
              {about.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="group/btn relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-emerald-glow/50"
                  >
                    <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-emerald-glow" />
                    <Play className="h-8 w-8 text-white ml-1 transition-transform group-hover/btn:scale-110 group-hover/btn:text-emerald-glow" fill="currentColor" />
                  </button>
                </div>
              )}
            </>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-3xl" />
        </motion.div>

      </div>
    </section>
  )
}
