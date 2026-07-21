'use client'

import { type ReactNode } from 'react'
import { m as motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  index?: string
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/**
 * Premium section heading with index number, eyebrow, title and description.
 * Animates on scroll into view.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
        className
      )}
    >
      {/* Top row: index + eyebrow */}
      {(index || eyebrow) && (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {index && (
            <span className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-emerald-glow/70">
              {index}
            </span>
          )}
          {index && eyebrow && (
            <span className="h-px w-8 bg-emerald-glow/40" />
          )}
          {eyebrow && (
            <span className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)]">
              {eyebrow}
            </span>
          )}
        </motion.div>
      )}

      {/* Title */}
      <motion.h2
        className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-[var(--text-primary)] md:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {title}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          className={cn(
            'max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg',
            align === 'center' && 'mx-auto'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
