'use client'

import { m as motion, useScroll, useSpring } from 'framer-motion'

/**
 * Slim emerald scroll progress bar at top of viewport.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    mass: 0.3,
  })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[9998] h-[3px] origin-left bg-[#6a7c9a]"
      style={{ scaleX, boxShadow: '0 0 12px rgba(106, 124, 154, 0.6)' }}
      aria-hidden
    />
  )
}
