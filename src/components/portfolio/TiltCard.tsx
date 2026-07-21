'use client'

import { type ReactNode, useRef } from 'react'
import { m as motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  max?: number
  scale?: number
  glow?: boolean
}

/**
 * 3D tilt card — premium hover effect.
 * - Subtle perspective rotation tracking cursor
 * - Optional glow follow
 */
export function TiltCard({
  children,
  className,
  max = 8,
  scale = 1.02,
  glow = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), {
    stiffness: 200,
    damping: 18,
  })
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), {
    stiffness: 200,
    damping: 18,
  })

  // Compute glow position from x and y. We always call useTransform unconditionally.
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])
  // Combine into a single background string
  const glowBg = useTransform(
    [glowX, glowY],
    (vals) => {
      const [gx, gy] = vals as [string, string]
      return `radial-gradient(circle at ${gx} ${gy}, rgba(0, 208, 132, 0.25), transparent 50%)`
    }
  )

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn('relative [transform-style:preserve-3d]', className)}
      style={{ rotateX: rotX, rotateY: rotY, transition: 'transform 0.3s ease-out' }}
    >
      {/* Glow follow */}
      {glow && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBg }}
        />
      )}
      <motion.div style={{ transform: `translateZ(0) scale(${scale})`, transition: 'transform 0.3s ease-out' }}>
        {children}
      </motion.div>
    </motion.div>
  )
}
