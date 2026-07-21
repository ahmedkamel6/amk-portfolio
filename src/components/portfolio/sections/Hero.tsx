'use client'

import { memo, Suspense, useEffect, useState, useRef } from 'react'
import { m as motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import { MagneticButton } from '../MagneticButton'
import { TextReveal } from '../TextReveal'
import type { HeroContent, ThemeSettings } from '@/lib/portfolio/default-content'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(
  () => import('../three/ParticleBackground').then((m) => ({ default: m.ParticleBackground })),
  { ssr: false }
)

const ORB_1_ANIM = { y: [0, -30, 0], x: [0, 20, 0] }
const ORB_2_ANIM = { y: [0, 40, 0], x: [0, -25, 0] }
const SHIMMER_ANIM = { backgroundPosition: ['-200% 0', '200% 0'] }
const SCROLL_CUE_ANIM = { y: ['-50%', '150%'] }

export const Hero = memo(function Hero({ hero, theme }: { hero: HeroContent; theme: Pick<ThemeSettings, 'background' | 'accent' | 'accentSoft' | 'particleCount' | 'mode'> }) {
  const ref = useRef<HTMLElement>(null)
  const [loadParticles, setLoadParticles] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(max-width: 767px)').matches) {
      return;
    }
    
    let idleId: number;
    let timeoutId: NodeJS.Timeout;
    
    const initParticles = () => setLoadParticles(true)
    
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(initParticles, { timeout: 2000 })
    } else {
      timeoutId = setTimeout(initParticles, 1500)
    }
    
    return () => {
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const cornerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const bg = theme.background

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden contain-paint"
      style={{ contentVisibility: 'auto' }}
      id="home"
    >
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        {loadParticles && (
          <Suspense fallback={null}>
            <ParticleBackground
              particleCount={theme.particleCount}
              accent={theme.accent}
              background={theme.background}
              mode={theme.mode}
            />
          </Suspense>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, ${bg} 100%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-radial-spotlight" />
        {/* Film grain overlay */}
        <div className="pointer-events-none absolute inset-0 hidden md:block bg-noise opacity-30" />
      </div>

      {/* Floating ambient orbs */}
      <motion.div
        className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full opacity-15 blur-md md:opacity-30 md:blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--emerald-glow), transparent 70%)', willChange: 'transform' }}
        animate={ORB_1_ANIM}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full hidden md:block opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)', willChange: 'transform' }}
        animate={ORB_2_ANIM}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cinematic corner brackets — viewfinder feel */}
      <motion.div style={{ opacity: cornerOpacity }} className="pointer-events-none absolute inset-6 z-20 hidden md:block">
        {/* Top-left */}
        <div className="absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-emerald-glow/30" />
        {/* Top-right */}
        <div className="absolute right-0 top-0 h-12 w-12 border-r-2 border-t-2 border-emerald-glow/30" />
        {/* Bottom-left */}
        <div className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-emerald-glow/30" />
        {/* Bottom-right */}
        <div className="absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-emerald-glow/30" />
      </motion.div>

      {/* Top HUD strip — cinematic timecode */}
      <motion.div
        style={{ opacity: cornerOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="pointer-events-none absolute left-6 top-24 z-20 hidden md:block"
      >
        <div className="flex items-center gap-2 font-mono-display text-[10px] uppercase tracking-[0.3em] text-emerald-glow/40">
          <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-glow" />
          <span>REC · 4K · 24FPS</span>
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: cornerOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="pointer-events-none absolute right-6 top-24 z-20 hidden md:block"
      >
        <div className="flex flex-col items-end gap-1 font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          <span>F · 2.8</span>
          <span>ISO 800</span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center pt-[calc(env(safe-area-inset-top)+80px)] md:pt-0"
        style={{ y, opacity, scale, willChange: 'transform' }}
      >
        {/* Available badge */}
        <motion.div
          className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-emerald-glow/20 bg-emerald-glow/5 px-4 py-1.5 backdrop-blur-md md:backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-glow" />
          </span>
          <span className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            {hero.badge}
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          className="mb-4 font-mono-display text-[11px] uppercase tracking-[0.5em] text-emerald-glow/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {hero.eyebrow}
        </motion.p>

        {/* Headline — name with shimmer overlay */}
        <h1 className="relative font-display text-5xl font-bold leading-[0.9] tracking-tight text-[var(--text-primary)] sm:text-7xl md:text-8xl lg:text-[9rem]">
          <TextReveal as="span" delay={0.6} className="block" ssrVisible>
            {hero.name}
          </TextReveal>
          {/* Highlight line with glow + shimmer */}
          <span className="relative block">
            <TextReveal as="span" delay={1.0} className="text-gradient-emerald block" ssrVisible>
              {hero.nameHighlight}
            </TextReveal>
          </span>
        </h1>

        {/* Subtitle — roles with animated separators */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)] md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {hero.roles.map((role, i) => (
            <span key={role} className="flex items-center gap-3">
              <motion.span
                className="font-medium tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              >
                {role}
              </motion.span>
              {i < hero.roles.length - 1 && (
                <motion.span
                  className="h-1 w-1 rounded-full bg-emerald-glow/60"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                />
              )}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-6 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <MagneticButton
            as="a"
            href={hero.primaryCta.href}
            className="glow-emerald"
            strength={0.5}
          >
            <Sparkles className="h-4 w-4" />
            {hero.primaryCta.label}
          </MagneticButton>

          <MagneticButton as="a" href={hero.secondaryCta.href} variant="ghost" strength={0.3}>
            {hero.secondaryCta.label}
            <ArrowDown className="h-3.5 w-3.5 rotate-[-45deg]" />
          </MagneticButton>
        </motion.div>

        {/* Stats strip — with dividers */}
        <motion.div
          className="mt-20 flex items-center divide-x divide-[var(--border)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {hero.stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-6 first:pl-0 last:pr-0 md:px-10"
            >
              <motion.span
                className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
              >
                {stat.value}
              </motion.span>
              <span className="font-mono-display text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue — enhanced */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ opacity, willChange: 'transform' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono-display text-[9px] uppercase tracking-[0.4em] text-[var(--text-muted)]">
            Scroll to explore
          </span>
          <div className="relative h-10 w-px overflow-hidden bg-[var(--border)]">
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-emerald-glow"
              animate={SCROLL_CUE_ANIM}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ willChange: 'transform' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
})
