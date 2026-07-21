'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

/**
 * Smooth scrolling provider using Lenis.
 * - Dynamically imports Lenis to keep it out of the initial bundle
 * - Adds inertia to all scrolling
 * - Hooks into requestAnimationFrame
 * - Respects reduced motion preference
 * - Disabled on mobile for native scroll performance
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return // Disable Lenis completely on mobile
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    let lenis: any = null
    let frame = 0

    // Dynamic import — Lenis is ~15KB, no need to load it upfront
    import('lenis').then((mod) => {
      const Lenis = mod.default

      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        infinite: false,
      })

      function raf(time: number) {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    })

    // Anchor smooth scroll for in-page navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.5 })
      }
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      cancelAnimationFrame(frame)
      if (lenis) lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
