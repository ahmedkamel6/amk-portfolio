'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeading } from '../SectionHeading'
import type { Testimonial } from '@/lib/portfolio/default-content'

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] p-8 backdrop-blur-md md:backdrop-blur-xl md:p-10">
      <div className="pointer-events-none absolute right-6 top-6 opacity-[0.06]">
        <Quote className="h-32 w-32 text-emerald-glow" />
      </div>
      <div className="relative flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span key={i} initial={{ opacity: 0, scale: 0, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 300 }}>
            <Star className="h-4 w-4 fill-emerald-glow text-emerald-glow" />
          </motion.span>
        ))}
      </div>
      <p className="relative mt-6 font-display text-xl leading-relaxed text-[var(--text-primary)] md:text-2xl">&ldquo;{t.quote}&rdquo;</p>
      <div className="relative mt-8 flex items-center gap-4 border-t border-[var(--border)] pt-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold" style={{ background: `linear-gradient(135deg, ${t.color}30, ${t.color}10)`, border: `1px solid ${t.color}40`, color: t.color }}>
          {t.initials}
        </div>
        <div>
          <div className="font-medium text-[var(--text-primary)]">{t.name}</div>
          <div className="text-xs text-[var(--text-secondary)]">{t.role} · {t.company}</div>
        </div>
      </div>
    </div>
  )
}

export function Testimonials({ testimonials, index = '08' }: { testimonials: Testimonial[], index?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, amount: 0.2 })
  // local state renamed to avoid collision with prop
  const [currentIndex, setCurrentIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const safeIndex = testimonials.length ? currentIndex % testimonials.length : 0

  useEffect(() => {
    if (paused || testimonials.length <= 1) return
    const timer = setInterval(() => setCurrentIndex((i) => (i + 1) % testimonials.length), 5500)
    return () => clearInterval(timer)
  }, [paused, testimonials.length])

  const go = (dir: 1 | -1) => setCurrentIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  const current = testimonials[safeIndex]

  return (
    <section id="testimonials" ref={containerRef} className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[60px] md:blur-[120px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 20%, transparent), transparent 70%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionHeading index={index} eyebrow="Testimonials" title={<>Kind Words from <span className="text-gradient-emerald">Collaborators</span></>} description="The work speaks for itself — but sometimes it helps to hear it from the people who commissioned it." />
        <motion.div className="relative mt-16 min-h-[420px] md:min-h-[360px]" initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {} } transition={{ duration: 0.8, delay: 0.2 }}>
          {current && (
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <TestimonialCard t={current} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} aria-label={`Go to testimonial ${i + 1}`} className="group relative h-2 transition-all duration-300" style={{ width: i === safeIndex ? 32 : 8 }}>
                <span className={`block h-full rounded-full transition-all duration-300 ${i === safeIndex ? 'bg-emerald-glow glow-emerald' : 'bg-[var(--border)] group-hover:bg-[var(--text-muted)]'}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-emerald-glow/30 hover:text-emerald-glow">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-emerald-glow/30 hover:text-emerald-glow">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
