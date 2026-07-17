'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/**
 * Premium, minimalist loading screen.
 * Timeline:
 * 0 - 1800ms: Logo fades in and slightly scales up (cinematic reveal)
 * 500ms - 2000ms: Elegant light sweep passes over the logo
 * 2500ms: Screen fades out
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Total animation timeline before starting unmount sequence
    // Increased to 2.5 seconds as requested
    const timer = setTimeout(() => {
      setDone(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#000000] bg-noise"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          {/* Ambient glow matching the website's dark theme */}
          <div className="pointer-events-none absolute inset-0 bg-radial-spotlight opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

          {/* Logo Container - Made larger as requested */}
          <motion.div 
            className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72"
            initial={{ opacity: 0, scale: 0.85, filter: 'drop-shadow(0px 0px 0px rgba(255,255,255,0))' }}
            animate={{ opacity: 1, scale: 1, filter: 'drop-shadow(0px 0px 25px rgba(255,255,255,0.15))' }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          >
            
            {/* Logo Image */}
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              className="object-contain"
              priority
            />

            {/* Premium Cinematic Light Sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="w-[200%] h-[150%] absolute -top-[25%] -left-[50%]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.0) 60%, transparent 100%)',
                  mixBlendMode: 'overlay',
                  transform: 'skewX(-25deg)'
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 0.5, duration: 1.8, ease: 'easeInOut' }}
              />
            </motion.div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
