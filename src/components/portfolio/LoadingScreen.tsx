'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function LoadingScreen() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true)
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505] bg-noise"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
          {/* SVG Filter to match the Header Logo Color EXACTLY */}
          <svg width="0" height="0" className="absolute">
            <filter id="iceBlueColorize">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.415
                        0 0 0 0 0.486
                        0 0 0 0 0.603
                        0 0 0 1 0"
              />
            </filter>
          </svg>

          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-radial-spotlight opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

          {/* Logo Container */}
          <motion.div 
            className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ 
              opacity: { duration: 0.5, ease: 'easeOut' }, // Fast fade in to prevent black screen
              scale: { duration: 2.5, ease: 'easeOut' }    // Slow cinematic zoom
            }}
          >
            {/* Glowing Backdrop for Premium Feel (Hardware Accelerated) */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[#6A7C9A] blur-3xl opacity-0"
              animate={{ opacity: [0, 0.15, 0.05] }}
              transition={{ duration: 2.2, ease: 'easeInOut', times: [0, 0.5, 1] }}
            />

            {/* Exact Header Logo */}
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              style={{ filter: 'url(#iceBlueColorize)' }}
              className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              priority
            />
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
