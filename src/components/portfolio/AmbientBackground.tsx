'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import type { ThemeSettings } from '@/lib/portfolio/default-content'

/**
 * Fixed full-viewport ambient background with parallax orbs.
 * Receives theme props from the server component parent.
 */
export function AmbientBackground({ theme }: { theme: ThemeSettings }) {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 150])

  const { background, accent, accentSoft, mode, gridOpacity } = theme

  const orbOpacity1 = mode === 'dark' ? 0.25 : 0.15
  const orbOpacity2 = mode === 'dark' ? 0.15 : 0.10
  const orbOpacity3 = mode === 'dark' ? 0.20 : 0.12
  const vignetteColor = mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)'

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: background }} />
      <div className="absolute inset-0 bg-grid" style={{ opacity: gridOpacity * 0.5 }} />

      <motion.div
        className="absolute -left-32 top-[10%] h-[40vh] w-[40vh] rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, y: y1, opacity: orbOpacity1 }}
        animate={{ scale: [1, 1.15, 1], opacity: [orbOpacity1 * 0.8, orbOpacity1, orbOpacity1 * 0.8] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-10%] top-[40%] h-[50vh] w-[50vh] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${accentSoft}, transparent 70%)`, y: y2, opacity: orbOpacity2 }}
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [orbOpacity2 * 0.8, orbOpacity2, orbOpacity2 * 0.8] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[30%] bottom-[5%] h-[35vh] w-[35vh] rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, y: y3, opacity: orbOpacity3 }}
        animate={{ scale: [1, 1.2, 1], opacity: [orbOpacity3 * 0.8, orbOpacity3, orbOpacity3 * 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, transparent 30%, ${vignetteColor} 100%)` }}
      />
    </div>
  )
}
