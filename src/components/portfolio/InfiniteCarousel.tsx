'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import type { Project } from '@/lib/portfolio/default-content'
import { ProjectCard } from './ProjectCard'

export function InfiniteCarousel({ projects, toolLogos }: { projects: Project[], toolLogos?: any[] }) {
  if (!projects || projects.length === 0) return null;

  // Multiply to ensure enough items for a flawless infinite marquee
  let multipliedProjects: Project[] = [];
  for (let i = 0; i < 20; i++) {
    multipliedProjects = [...multipliedProjects, ...projects];
  }

  // Embla setup with AutoScroll plugin. Start in the middle to avoid left-side gap on load.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, startIndex: Math.floor(multipliedProjects.length / 2) },
    [AutoScroll({ playOnInit: true, stopOnInteraction: false, stopOnMouseEnter: false, speed: 1.5 })]
  )

  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tweenValues, setTweenValues] = useState<number[]>([])

  const onScroll = useCallback(() => {
    if (!emblaApi) return

    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
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

      const tweenValue = 1 - Math.abs(diffToTarget * 2)
      return Math.max(0, tweenValue)
    })

    setTweenValues(styles)
  }, [emblaApi, setTweenValues])

  useEffect(() => {
    if (!emblaApi) return

    onScroll()
    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', onScroll)

    const handleWheel = (e: WheelEvent) => {
      // Allow horizontal scrolling or vertical scrolling to flip between videos
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 0) emblaApi.scrollNext()
        else emblaApi.scrollPrev()
      } else {
        if (e.deltaX > 0) emblaApi.scrollNext()
        else emblaApi.scrollPrev()
      }
    }

    const node = emblaApi.rootNode()
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: true })
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
            const tweenValue = tweenValues.length ? tweenValues[index] : 1
            // Center item is scale 1.05. Edge items drop sharply to 0.55 to give depth
            const curvedValue = Math.pow(tweenValue, 2)
            const scale = 0.55 + (curvedValue * 0.50)
            const zIndex = Math.round(curvedValue * 10)
            const opacity = 0.2 + (curvedValue * 0.8)
            const rotateY = diffToRotation(tweenValue, index, emblaApi)

            return (
              <div
                key={`${p.id}-${index}`}
                className="w-[200px] sm:w-[240px] md:w-[280px] flex-shrink-0 flex-grow-0 min-w-0"
                style={{
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
                <div className="p-3 w-full h-full">
                  <ProjectCard project={p} toolLogos={toolLogos} index={index} />
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
