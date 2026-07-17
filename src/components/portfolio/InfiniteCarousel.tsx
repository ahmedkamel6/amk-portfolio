'use client'

import React from 'react'
import type { Project } from '@/lib/portfolio/default-content'
import { ProjectCard } from './ProjectCard'

export function InfiniteCarousel({ projects, toolLogos }: { projects: Project[], toolLogos?: any[] }) {
  if (!projects || projects.length === 0) return null;

  // We need enough items to fill the screen twice so that -50% translate seamlessly loops.
  // If we only have 5 projects, we duplicate them many times to make a long track.
  const multipliedProjects = [...projects, ...projects, ...projects, ...projects];

  return (
    <div className="relative w-full overflow-hidden py-10" style={{ perspective: '1200px' }}>
      {/* Edge Fading Shadows for Cinematic Effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 md:w-64 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 md:w-64 bg-gradient-to-l from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />

      {/* Marquee Track Container */}
      {/* width max allows the inner content to dictate width. 
          We use two identical blocks. Each block takes up 50% of the total width.
          Translating the parent by -50% moves exactly one block's width.
      */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* Block 1 */}
        <div className="flex items-center">
          {multipliedProjects.map((p, i) => (
            <div 
              key={`block1-${p.id}-${i}`} 
              className="w-[260px] sm:w-[300px] md:w-[340px] px-2 sm:px-3 flex-shrink-0 transition-all duration-500 hover:scale-[1.05] hover:z-30 hover:brightness-110"
              style={{
                // Optional: slight 3D rotate to simulate cylinder
                // transform: 'rotateY(-5deg) scale(0.95)',
              }}
            >
              <ProjectCard project={p} toolLogos={toolLogos} index={0} />
            </div>
          ))}
        </div>
        {/* Block 2 (Exact Clone for seamless looping) */}
        <div className="flex items-center">
          {multipliedProjects.map((p, i) => (
            <div 
              key={`block2-${p.id}-${i}`} 
              className="w-[260px] sm:w-[300px] md:w-[340px] px-2 sm:px-3 flex-shrink-0 transition-all duration-500 hover:scale-[1.05] hover:z-30 hover:brightness-110"
            >
              <ProjectCard project={p} toolLogos={toolLogos} index={0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
