'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Play, Pause, Clock, Clapperboard, Maximize2, Volume2, Settings } from 'lucide-react'
import { SectionHeading } from '../SectionHeading'
import type { ShowreelContent } from '@/lib/portfolio/default-content'
import { useIsMobile } from '@/hooks/use-mobile'

const PLAY_PULSE_ANIM = { scale: [1, 1.4], opacity: [0.4, 0] }

export function Showreel({ showreel, index = '01' }: { showreel: ShowreelContent, index?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const isMobile = useIsMobile()
  const [playing, setPlaying] = useState(false)
  const [timecode, setTimecode] = useState(0)

  // Animated timecode counter (simulated)
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setTimecode((t) => (t + 1) % 168) // 2:48 = 168 seconds
    }, 1000)
    return () => clearInterval(interval)
  }, [playing])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.97])

  const sr = showreel

  const meta = [
    { icon: Clock, label: 'Duration', value: sr.duration },
    { icon: Clapperboard, label: 'Year', value: sr.year },
    { icon: Maximize2, label: 'Software', value: sr.software },
  ]

  return (
    <section
      id="showreel"
      className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48"
      ref={ref}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[60px] md:blur-[120px]"
          style={{
            background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--emerald-glow) 18%, transparent), transparent 70%)`,
          }}
        />
        <div
          className="absolute left-1/4 top-1/2 h-[60vh] w-[40vw] -translate-y-1/2 rounded-full opacity-30 blur-[50px] md:blur-[100px]"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-soft) 15%, transparent), transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          index={index}
          eyebrow="Showreel"
          title={<>{sr.title} <span className="text-gradient-emerald">{sr.titleHighlight}</span></>}
          description={sr.description}
        />

        {/* Player frame */}
        <motion.div
          className="relative mt-16 aspect-video w-full overflow-hidden rounded-3xl border border-[var(--border)]"
          style={{ y, scale }}
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Base background */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--background), var(--background), color-mix(in srgb, var(--emerald-glow) 8%, var(--background)))' }} />
          <div className="absolute inset-0 bg-grid-emerald opacity-20" />

          {/* Scan lines effect — subtle */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
            }}
          />

          {/* Letterbox bars */}
          <div className="absolute inset-x-0 top-0 h-[6%] bg-black/80" />
          <div className="absolute inset-x-0 bottom-0 h-[6%] bg-black/80" />

          {/* Video (if URL provided) */}
          {sr.videoUrl ? (
            <video
              src={sr.videoUrl}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay={playing}
              loop
              muted
              playsInline
            />
          ) : null}

          {/* Cinematic corner brackets on the player */}
          <div className="pointer-events-none absolute inset-4 z-20">
            <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-emerald-glow/40" />
            <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-emerald-glow/40" />
            <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-emerald-glow/40" />
            <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-emerald-glow/40" />
          </div>

          {/* Center play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="group relative flex h-24 w-24 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 md:h-32 md:w-32"
              aria-label={playing ? 'Pause showreel' : 'Play showreel'}
            >
              {/* Pulsing rings */}
              <motion.span
                className="absolute inset-0 rounded-full bg-emerald-glow/20"
                animate={PLAY_PULSE_ANIM}
                transition={{ duration: isMobile ? 6 : 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <span className="absolute inset-0 rounded-full border border-emerald-glow/40" />
              <span className="absolute inset-2 rounded-full border border-emerald-glow/30" />
              <span className="absolute inset-4 rounded-full border border-emerald-glow/20" />
              {/* Main button */}
              <span className="relative flex h-full w-full items-center justify-center rounded-full glass-emerald glow-emerald-strong transition-transform group-hover:scale-105">
                {playing ? (
                  <Pause className="h-8 w-8 text-emerald-glow md:h-10 md:w-10" />
                ) : (
                  <Play className="ml-1 h-8 w-8 fill-emerald-glow text-emerald-glow md:h-10 md:w-10" />
                )}
              </span>
            </button>
          </div>

          {/* Top-left: REC indicator */}
          <div className="absolute left-6 top-[10%] flex items-center gap-2 z-20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              {sr.timecode}
            </span>
          </div>

          {/* Top-right: player controls (decorative) */}
          <div className="absolute right-6 top-[10%] flex items-center gap-3 z-20">
            <button className="text-[var(--text-muted)] transition-colors hover:text-emerald-glow" aria-label="Volume">
              <Volume2 className="h-4 w-4" />
            </button>
            <button className="text-[var(--text-muted)] transition-colors hover:text-emerald-glow" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </button>
            <button className="text-[var(--text-muted)] transition-colors hover:text-emerald-glow" aria-label="Fullscreen">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom-left: title */}
          <div className="absolute bottom-[12%] left-6 right-6 z-20">
            <motion.p
              className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-emerald-glow/70"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Featured Showreel
            </motion.p>
            <motion.h3
              className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)] md:text-4xl"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {sr.videoTitle}
            </motion.h3>
          </div>

          {/* Bottom: scrubber with animated timecode */}
          <div className="absolute inset-x-6 bottom-[6%] z-20 flex items-center gap-3">
            <span className="font-mono-display text-[10px] text-emerald-glow">
              {playing ? formatTime(timecode) : '00:00'}
            </span>
            <div className="relative h-px flex-1 bg-[var(--border)]">
              <motion.div
                className="absolute inset-y-0 left-0 bg-emerald-glow"
                initial={{ width: '0%' }}
                animate={inView ? { width: playing ? `${(timecode / 168) * 100}%` : '32%' } : {}}
                transition={{ duration: playing ? 0 : 2, delay: playing ? 0 : 0.6, ease: 'easeOut' }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-emerald-glow glow-emerald transition-all"
                style={{ left: playing ? `${(timecode / 168) * 100}%` : '32%' }}
              />
            </div>
            <span className="font-mono-display text-[10px] text-[var(--text-muted)]">{sr.duration}</span>
          </div>
        </motion.div>

        {/* Meta cards */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {meta.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] p-5 backdrop-blur-md md:backdrop-blur-xl transition-all hover:border-emerald-glow/30 hover:bg-emerald-glow/[0.03]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-glow/10 text-emerald-glow transition-transform group-hover:scale-110 group-hover:rotate-6">
                <m.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono-display text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">{m.label}</span>
                <span className="mt-1 text-sm font-medium text-[var(--text-primary)]">{m.value}</span>
              </div>
              <span className="ml-auto font-mono-display text-[10px] text-[var(--text-muted)]">0{i + 1}</span>
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-emerald-glow to-transparent transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
