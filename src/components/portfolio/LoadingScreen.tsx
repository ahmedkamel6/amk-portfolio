'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/**
 * Premium, minimalist loading screen.
 * - Exact site background color (bg-background)
 * - Logo appears immediately (no black screen delay)
 * - Premium slow scale (Cinematic zoom)
 * - Drop-shadow pulse that conforms exactly to the logo's shape (no square sweeps)
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Total animation timeline before starting unmount sequence
    const timer = setTimeout(() => {
      setDone(true)
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background bg-noise"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
          {/* Ambient glow matching the website's dark theme */}
          <div className="pointer-events-none absolute inset-0 bg-radial-spotlight opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

          {/* Logo Container */}
          <motion.div 
            className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
            initial={{ opacity: 0.01, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
          >
            
            {/* Logo Image with shape-conforming drop shadow pulse */}
            <motion.div
              className="relative w-full h-full"
              animate={{ 
                filter: [
                  'drop-shadow(0px 0px 0px rgba(255,255,255,0))',
                  'drop-shadow(0px 0px 15px rgba(255,255,255,0.4))',
                  'drop-shadow(0px 0px 5px rgba(255,255,255,0.1))'
                ]
              }}
              transition={{ 
                duration: 2.2, 
                ease: 'easeInOut',
                times: [0, 0.5, 1]
              }}
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill 
                className="object-contain"
                priority
              />
            </motion.div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
