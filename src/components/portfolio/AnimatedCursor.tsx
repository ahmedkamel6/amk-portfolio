'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMounted } from '@/hooks/use-mounted'
import { useSyncExternalStore } from 'react'

/**
 * Premium custom cursor.
 * - Outer ring lags slightly (spring) for that high-end feel
 * - Inner dot tracks 1:1
 * - Grows + tint emerald when hovering interactive elements
 * - Label text support (data-cursor="View")
 * - Hidden on touch devices
 *
 * SSR-safe: renders null on server AND on client first render (hydration),
 * then activates after mount. Uses `useSyncExternalStore` for capability
 * detection so no setState-in-effect is needed.
 */
export function AnimatedCursor() {
  const mounted = useMounted()

  // Detect fine pointer (mouse) vs coarse pointer (touch) — SSR-safe.
  // Server snapshot returns false; client snapshot reads matchMedia once.
  const hasFinePointer = useSyncExternalStore(
    () => () => {},
    () =>
      !window.matchMedia('(hover: none), (pointer: coarse)').matches,
    () => false
  )

  // Runtime flag: if a touch event fires on a hybrid device, disable cursor.
  // Only mutated from an event handler, never directly in an effect body.
  const [touchDetected, setTouchDetected] = useState(false)

  const [variant, setVariant] = useState<'default' | 'hover' | 'view' | 'drag'>('default')
  const [label, setLabel] = useState<string>('')

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const ringX = useSpring(mouseX, { stiffness: 350, damping: 30, mass: 0.4 })
  const ringY = useSpring(mouseY, { stiffness: 350, damping: 30, mass: 0.4 })

  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 50 })
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 50 })

  const isMobileSize = typeof window !== 'undefined' && window.innerWidth < 768
  const enabled = mounted && hasFinePointer && !touchDetected && !isMobileSize

  useEffect(() => {
    if (!enabled) return

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      const target = e.target as HTMLElement | null
      if (!target) {
        setVariant('default')
        setLabel('')
        return
      }
      const interactive = target.closest(
        'a, button, [role="button"], [data-cursor], input, textarea, select, [data-cursor-interactive]'
      ) as HTMLElement | null

      if (interactive) {
        const c = interactive.getAttribute('data-cursor')
        if (c === 'view') {
          setVariant('view')
          setLabel(interactive.getAttribute('data-cursor-label') || 'View')
        } else if (c === 'drag') {
          setVariant('drag')
          setLabel(interactive.getAttribute('data-cursor-label') || 'Drag')
        } else {
          setVariant('hover')
          setLabel('')
        }
      } else {
        setVariant('default')
        setLabel('')
      }
    }

    const leave = () => {
      mouseX.set(-100)
      mouseY.set(-100)
    }

    // Touch handler — only called from event, not in effect body
    const handleTouch = () => setTouchDetected(true)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    window.addEventListener('touchstart', handleTouch, { once: true })
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [enabled, mouseX, mouseY])

  // Render null until mounted + enabled — guarantees SSR/client match
  if (!enabled) return null

  const ringSize =
    variant === 'view' ? 80 : variant === 'hover' ? 56 : variant === 'drag' ? 90 : 36
  const dotSize = variant === 'view' ? 0 : variant === 'drag' ? 0 : 6

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden
    >
      {/* Outer ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          borderColor:
            variant === 'view' || variant === 'drag'
              ? 'rgba(0, 208, 132, 0.9)'
              : variant === 'hover'
                ? 'rgba(0, 208, 132, 0.6)'
                : 'rgba(255, 255, 255, 0.4)',
          backgroundColor:
            variant === 'view' || variant === 'drag'
              ? 'rgba(0, 208, 132, 0.1)'
              : 'rgba(0, 0, 0, 0)',
          backdropFilter: variant === 'view' || variant === 'drag' ? 'blur(2px)' : 'blur(0px)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <span className="absolute inset-0 rounded-full border" style={{ borderColor: 'inherit' }} />
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] font-medium text-emerald-glow"
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-emerald-glow"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: '0 0 12px rgba(0, 208, 132, 0.9)',
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  )
}
