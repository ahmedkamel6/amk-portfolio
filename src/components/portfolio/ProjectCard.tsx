'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { Project } from '@/lib/portfolio/default-content'
import { useIsMobile } from '@/hooks/use-mobile'

// Helper to convert Google Drive share links to direct stream/download links
export function getDirectDriveUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    // We MUST use export=download. export=view returns an HTML page.
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

// Helper specifically for Google Drive image thumbnails (high quality)
export function getDriveThumbnailUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    // Drive's internal thumbnail API, w1920-h1080 ensures max quality
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1920-h1080`;
  }
  return url;
}

export function ProjectCard({ project, index, toolLogos }: { project: Project; index: number; toolLogos?: any[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -50px 0px" })
  const [hovered, setHovered] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const isMobile = useIsMobile()

  // Use the new driveUrl or fallback to old videoUrl
  const p = project as any
  const directVideoUrl = getDirectDriveUrl(p.driveUrl) || p.videoUrl;
  const rawPoster = p.thumbnailUrl || p.coverImage || undefined;
  const posterUrl = getDriveThumbnailUrl(rawPoster) || rawPoster;

  const handleMouseEnter = () => {
    setHovered(true)
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: isMobile ? (index % 2) * 0.05 : (index % 5) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full w-full"
      style={{ willChange: "transform, opacity" }}
    >
      <Link href={`/projects/${p.slug}`} className="block h-full w-full">
        {/* Reels-style vertical aspect ratio 9:16 */}
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black/50 border border-white/5 transition-colors group-hover:border-emerald-glow/40">
          
          {/* Static Cover/Gradient */}
          <div className={`absolute inset-0 h-full w-full bg-gradient-to-br ${project.gradient}`}>
            {posterUrl && (
              <img src={posterUrl} alt={project.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />
            )}
          </div>

          {/* Hover Video Preview */}
          {hovered && !isMobile && directVideoUrl && (
            <div className="absolute inset-0 h-full w-full overflow-hidden z-0 pointer-events-none bg-black/20">
              <video
                src={directVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
                onCanPlay={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              />
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 transition-opacity duration-500" />
          
          {/* Play Icon (center, fades out on hover if playing) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Play className="h-5 w-5 text-white/80 translate-x-0.5" />
            </div>
          </motion.div>

          {/* Top Badges */}
          <div className="absolute left-3 top-3 z-10 flex gap-2">
            <span className="rounded-full bg-black/50 px-2 py-1 font-mono-display text-[9px] uppercase tracking-wider text-white/90 backdrop-blur-md border border-white/10">
              {project.category}
            </span>
          </div>

          {/* Bottom Content */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-4">
            <h3 className="font-display text-lg font-bold leading-tight text-white line-clamp-2 shadow-black drop-shadow-md">
              {project.title}
            </h3>
            
            <motion.div 
              className="mt-2 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={hovered ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-white/70 line-clamp-2 mb-3">
                {project.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-2">
                {project.toolsUsed.slice(0, 4).map((t) => {
                  const logoInfo = toolLogos?.find((tl) => tl.name.toLowerCase() === t.toLowerCase())
                  if (logoInfo?.imageUrl) {
                    return (
                      <div key={t} title={t} className="h-6 w-6 rounded border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center overflow-hidden shrink-0">
                        <img src={logoInfo.imageUrl} alt={t} className="h-4 w-4 object-contain" />
                      </div>
                    )
                  }
                  return (
                    <span key={t} className="rounded border border-white/10 bg-black/50 px-1.5 py-0.5 text-[9px] text-white/90 flex items-center backdrop-blur-md h-6">
                      {t}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
