'use client'

import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { m as motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'outline'

interface MagneticButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  children: ReactNode
  variant?: Variant
  strength?: number
  as?: 'button' | 'a'
  href?: string
}

/**
 * Magnetic button.
 * - The whole element translates toward the cursor
 * - Inner content counter-translates for parallax
 * - Variants: primary (emerald glass), outline, ghost
 */
export const MagneticButton = forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(function MagneticButton(
  { children, className, variant = 'primary', strength = 0.4, as = 'button', href, ...rest },
  _ref
) {
  const ref = useRef<HTMLElement | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const innerX = useMotionValue(0)
  const innerY = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 })
  const springInnerX = useSpring(innerX, { stiffness: 400, damping: 25 })
  const springInnerY = useSpring(innerY, { stiffness: 400, damping: 25 })

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
    innerX.set(relX * strength * 0.3)
    innerY.set(relY * strength * 0.3)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
    innerX.set(0)
    innerY.set(0)
  }

  const baseClass = cn(
    'group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-300 will-change-transform magnetic-button',
    variant === 'primary' &&
      'glass-emerald text-emerald-glow hover:text-white',
    variant === 'outline' &&
      'border border-emerald-glow/30 text-white hover:text-emerald-glow',
    variant === 'ghost' && 'text-white/70 hover:text-white',
    className
  )

  const inner = (
    <>
      {/* Glow sheen on hover */}
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-glow/0 via-emerald-glow/20 to-emerald-glow/0" />
      </span>
      {/* Animated underline ring */}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-emerald-glow/0 transition-all duration-500 group-hover:ring-emerald-glow/40" />
      <motion.span
        className="relative z-10 inline-flex items-center gap-2"
        style={{ x: springInnerX, y: springInnerY }}
      >
        {children}
      </motion.span>
    </>
  )

  if (as === 'a') {
    return (
      <motion.a
        ref={ref as any}
        href={href}
        className={baseClass}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        data-cursor="hover"
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as any}
      className={baseClass}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      {...(rest as any)}
    >
      {inner}
    </motion.button>
  )
})
