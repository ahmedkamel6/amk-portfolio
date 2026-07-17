'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Cinematic loading screen with name reveal.
 * - Letter-by-letter name animation
 * - Progress bar
 * - Smooth fade-out
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 2200

    let raf = 0
    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(1, elapsed / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(eased)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 250)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [])

  const name = 'AHMED KAMEL'
  const letters = name.split('')

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#000000] bg-noise"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-radial-spotlight opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

          {/* Name */}
          <div className="relative flex flex-nowrap whitespace-nowrap items-center justify-center gap-x-2 md:gap-x-3 px-4 max-w-[100vw] overflow-hidden text-center">
            {letters.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                className="font-display text-lg sm:text-2xl md:text-4xl font-bold tracking-tight text-white whitespace-nowrap drop-shadow-[0_0_15px_#6a7c9a]"
                initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: 'blur(0px)',
                }}
                transition={{
                  delay: 0.1 + i * 0.04,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="relative mt-12 h-[1px] w-64 overflow-visible bg-white/5 md:w-96">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#6a7c9a]"
              style={{ width: `${progress * 100}%`, boxShadow: '0 0 15px 1px #6a7c9a, 0 0 5px 1px #6a7c9a' }}
              transition={{ ease: 'linear' }}
            />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer" />
          </div>

          <motion.p
            className="mt-6 font-mono-display text-[10px] uppercase tracking-[0.4em] text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Experience · {Math.round(progress * 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
