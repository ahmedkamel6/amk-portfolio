'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { m as motion, useInView } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { SectionHeading } from '../SectionHeading'
import type { BeforeAfterContent } from '@/lib/portfolio/default-content'

export function BeforeAfter({ beforeAfter, index = '04' }: { beforeAfter: BeforeAfterContent, index?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const ba = beforeAfter
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rel = (clientX - rect.left) / rect.width
    setPosition(Math.max(0, Math.min(100, rel * 100)))
  }, [])

  useEffect(() => {
    if (!dragging) return
    const move = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX
      if (clientX === undefined) return
      updateFromClientX(clientX)
    }
    const stop = () => setDragging(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', stop)
    }
  }, [dragging, updateFromClientX])

  const start = () => setDragging(true)

  return (
    <section id="before-after" ref={sectionRef} className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/2 h-[60vh] w-[40vw] -translate-y-1/2 rounded-full opacity-15 blur-[120px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 30%, transparent), transparent 70%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading index={index} eyebrow="Before / After" title={<>The <span className="text-gradient-emerald">{ba.titleHighlight}</span></>} description={ba.description} />
        <motion.div
          ref={containerRef}
          className="relative mx-auto mt-16 aspect-[16/9] w-full max-w-5xl cursor-ew-resize select-none overflow-hidden rounded-3xl border border-[var(--border)]"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          onMouseDown={(e) => { start(); updateFromClientX(e.clientX) }}
          onTouchStart={(e) => { start(); updateFromClientX(e.touches[0].clientX) }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--emerald-glow) 8%, var(--background)), color-mix(in srgb, var(--emerald-glow) 18%, var(--background)), color-mix(in srgb, var(--emerald-glow) 35%, var(--background)))' }} />
            <div className="absolute inset-0 bg-grid-emerald opacity-30" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-glow/30 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-glow/60" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            <div className="absolute inset-x-0 top-0 h-[8%] bg-black/80" />
            <div className="absolute inset-x-0 bottom-0 h-[8%] bg-black/80" />
            <div className="absolute inset-0 bg-radial-spotlight opacity-40" />
          </div>
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
            <div className="absolute inset-0 h-full" style={{ width: `${100 / (position / 100)}%` }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a)' }} />
              <div className="absolute inset-0 bg-grid opacity-10" />
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
              <div className="absolute inset-x-0 top-0 h-[8%] bg-black/80" />
              <div className="absolute inset-x-0 bottom-0 h-[8%] bg-black/80" />
              <div className="absolute inset-0 bg-white/[0.03]" />
            </div>
          </div>
          <div className="pointer-events-none absolute left-5 top-5 z-20">
            <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono-display text-[9px] uppercase tracking-[0.3em] text-white/60 backdrop-blur-md">{ba.beforeLabel}</span>
          </div>
          <div className="pointer-events-none absolute right-5 top-5 z-20">
            <span className="rounded-full border border-emerald-glow/30 bg-emerald-glow/10 px-3 py-1 font-mono-display text-[9px] uppercase tracking-[0.3em] text-emerald-glow backdrop-blur-md">{ba.afterLabel}</span>
          </div>
          <div className="absolute inset-y-0 z-30 w-px bg-emerald-glow" style={{ left: `${position}%`, boxShadow: '0 0 16px color-mix(in srgb, var(--emerald-glow) 80%, transparent)' }}>
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glass-emerald glow-emerald-strong">
              <MoveHorizontal className="h-5 w-5 text-emerald-glow" />
            </div>
            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-emerald-glow/20" />
          </div>
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--border)] bg-black/40 px-3 py-1 backdrop-blur-md">
            <span className="font-mono-display text-[10px] text-white/70">{Math.round(position)}%</span>
            <span className="font-mono-display text-[10px] text-white/30">·</span>
            <span className="font-mono-display text-[10px] text-white/50">Drag to compare</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
