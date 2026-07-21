'use client'

import { m as motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { SectionHeading } from '../SectionHeading'
import type { Project } from '@/lib/portfolio/default-content'
import { InfiniteCarousel } from '../InfiniteCarousel'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProjectCard } from '../ProjectCard'

export function FeaturedProjects({ projects, toolLogos, index = '03' }: { projects: Project[], toolLogos?: any[], index?: string }) {
  // We want to show all featured projects in the carousel
  const featuredProjects = projects.filter(p => p.featured);
  const isMobile = useIsMobile();

  return (
    <section id="projects" className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[60vh] w-[40vw] rounded-full opacity-20 blur-[120px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 20%, transparent), transparent 70%)' }} />
      </div>
      
      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <SectionHeading 
            index={index} 
            eyebrow="Featured Work" 
            title={<>Selected <span className="text-gradient-emerald">Reels</span></>} 
            description="A curated selection of cinematic cuts and motion design — optimized for the feed." 
          />
        </div>
        
        {/* Infinite 3D Carousel (Desktop Only) or Grid (Mobile Only) */}
        {!isMobile ? (
          <div className="mt-12 w-full">
            <InfiniteCarousel projects={featuredProjects} toolLogos={toolLogos} />
          </div>
        ) : (
          <div className="mt-8 px-2 mx-auto max-w-[1400px] grid grid-cols-2 gap-3 sm:gap-6">
            {featuredProjects.slice(0, 4).map((p, i) => (
              <div key={p.id} className="w-full">
                <ProjectCard project={p} toolLogos={toolLogos} index={i} />
              </div>
            ))}
          </div>
        )}
        
        <motion.div 
          className="mt-12 flex justify-center" 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/projects" 
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[var(--surface)] px-8 py-4 font-display text-sm font-bold tracking-wide text-[var(--text-primary)] transition-all hover:bg-emerald-glow/10 hover:text-emerald-glow border border-[var(--border)] hover:border-emerald-glow/30 shadow-lg"
          >
            <span className="relative z-10">View Full Projects Archive</span>
            <ExternalLink className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-glow/0 via-emerald-glow/5 to-emerald-glow/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
