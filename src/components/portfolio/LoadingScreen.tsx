'use client'

import { useEffect, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Memoized SVG brackets to avoid any re-renders
const StrokeBrackets = memo(() => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 pointer-events-none"
      initial="hidden"
      animate="visible"
    >
      {/* Top Left Bracket */}
      <motion.path
        d="M 25 0 L 0 0 L 0 25"
        fill="transparent"
        stroke="#ffffff"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 0.8, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
        }}
      />
      {/* Top Right Bracket */}
      <motion.path
        d="M 75 0 L 100 0 L 100 25"
        fill="transparent"
        stroke="#ffffff"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 0.8, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
        }}
      />
      {/* Bottom Left Bracket */}
      <motion.path
        d="M 25 100 L 0 100 L 0 75"
        fill="transparent"
        stroke="#ffffff"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 0.8, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
        }}
      />
      {/* Bottom Right Bracket */}
      <motion.path
        d="M 75 100 L 100 100 L 100 75"
        fill="transparent"
        stroke="#ffffff"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 0.8, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
        }}
      />
    </motion.svg>
  )
})
StrokeBrackets.displayName = 'StrokeBrackets'

/**
 * Highly optimized, minimalist loading screen.
 * Strict timeline:
 * 0 - 800ms: Draw brackets
 * 800 - 950ms: Pause
 * 950 - 1200ms: Light sweep & Logo fade in
 * 1200 - 1500ms: Hold
 * 1500ms: Fade out wrapper
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Total animation timeline before starting unmount sequence
    const timer = setTimeout(() => {
      setDone(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }} // 1500ms to 1800ms
        >
          {/* Logo Container */}
          <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
            
            {/* 1. SVG Bounding Box Draw */}
            <StrokeBrackets />

            {/* 2. Logo Fade In (Fades in slightly after stroke finishes: at 950ms) */}
            <motion.div
              className="absolute inset-0 p-6 md:p-8"
              initial={{ opacity: 0, filter: 'drop-shadow(0px 0px 0px rgba(0,255,100,0))' }}
              animate={{ opacity: 1, filter: 'drop-shadow(0px 0px 8px rgba(0,255,100,0.15))' }}
              transition={{ delay: 0.95, duration: 0.2, ease: 'easeOut' }}
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill 
                className="object-contain drop-shadow-md"
                priority
              />
            </motion.div>

            {/* 3. Subtle Neon Light Sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.01 }}
            >
              <motion.div
                className="w-[150%] h-full absolute top-0 -left-[50%]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.0) 30%, rgba(0,255,100,0.3) 50%, rgba(255,255,255,0.0) 70%, transparent 100%)',
                  mixBlendMode: 'plus-lighter',
                  transform: 'skewX(-20deg)'
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 0.95, duration: 0.25, ease: 'linear' }}
              />
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
