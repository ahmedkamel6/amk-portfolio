'use client'

import React, { useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { Project } from '@/lib/portfolio/default-content'
import { ProjectCard } from './ProjectCard'

export function InfiniteCarousel({ projects, toolLogos }: { projects: Project[], toolLogos?: any[] }) {
  if (!projects || projects.length === 0) return null;

  // Limit the multiplier to 18 to avoid React mounting too many Framer Motion elements on initial load
  let multipliedProjects: Project[] = [...projects];
  while (multipliedProjects.length < 18) {
    multipliedProjects = [...multipliedProjects, ...projects];
  }

  // Embla setup. Start in the middle. No auto-scroll plugins.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, startIndex: Math.floor(multipliedProjects.length / 2) }
  )

  const onScroll = useCallback(() => {
    if (!emblaApi) return

    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const nodes = emblaApi.slideNodes()

    emblaApi.scrollSnapList().forEach((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target()
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target)
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
          }
        })
      }

      const tweenValue = Math.max(0, 1 - Math.abs(diffToTarget * 2))
      const curvedValue = Math.pow(tweenValue, 2)
      const scale = 0.55 + (curvedValue * 0.50)
      const zIndex = Math.round(curvedValue * 10)
      const opacity = 0.2 + (curvedValue * 0.8)

      const node = nodes[index] as HTMLElement
      if (node) {
        node.style.transform = `scale(${scale})`
        node.style.zIndex = zIndex.toString()
        node.style.opacity = opacity.toString()

        // Exact center item glow effect
        const glowElement = node.querySelector('.center-glow-border') as HTMLElement
        if (glowElement) {
          glowElement.style.opacity = tweenValue > 0.99 ? '1' : '0'
        }
      }
    })
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onScroll()
    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', onScroll)

    const handleWheel = (e: WheelEvent) => {
      // Always prevent default to block parent page scroll while hovering over the carousel
      e.preventDefault();
      
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 0) emblaApi.scrollNext()
        else emblaApi.scrollPrev()
      } else {
        if (e.deltaX > 0) emblaApi.scrollNext()
        else emblaApi.scrollPrev()
      }
    }

    // Attach to the entire container rather than just the embla root node
    // to ensure the user doesn't accidentally scroll the page when their mouse is in the padding area
    const node = emblaApi?.rootNode()?.parentElement
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      emblaApi.off('scroll', onScroll)
      emblaApi.off('reInit', onScroll)
      if (node) {
        node.removeEventListener('wheel', handleWheel)
      }
    }
  }, [emblaApi, onScroll])

  return (
    <div className="relative w-full overflow-hidden py-10" style={{ perspective: '1200px' }}>
      {/* Edge Fading Shadows for Cinematic Effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 md:w-64 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 md:w-64 bg-gradient-to-l from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />

      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
          {multipliedProjects.map((p, index) => {
            return (
              <div
                key={`${p.id}-${index}`}
                className="w-[200px] sm:w-[240px] md:w-[280px] flex-shrink-0 flex-grow-0 min-w-0 transition-none"
                onClickCapture={(e) => {
                  // Prevent click if the user was dragging the carousel
                  if (emblaApi && !(emblaApi as any).clickAllowed()) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                style={{
                  // The initial styles will be overwritten instantly by onScroll on mount
                  transform: `scale(0.55)`,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              >
                <div className="p-3 w-full h-full relative">
                  <div 
                    className="center-glow-border absolute inset-1.5 rounded-[1.2rem] transition-opacity duration-300 pointer-events-none z-50 border-[2px] border-[#6a7c9a] shadow-[0_0_30px_5px_rgba(106,124,154,0.3)]"
                    style={{ opacity: 0 }}
                  />
                  <ProjectCard project={p} toolLogos={toolLogos} index={index} inCarousel={true} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// A simple helper to determine rotation if we wanted to. We are keeping it simple with scale.
function diffToRotation(tweenValue: number, index: number, emblaApi: any) {
  return 0; // Disable rotation for now to match exactly what is requested (scale only)
}
