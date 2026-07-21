'use client'

import { type ReactNode } from 'react'
import { m as motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  stagger?: number
  ssrVisible?: boolean
}

/**
 * Word-by-word text reveal — used for hero headlines and impactful statements.
 */
export function TextReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'p',
  stagger = 0.08,
  ssrVisible = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  const words = children.split(' ')

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={ssrVisible ? false : { y: '110%' }}
            animate={inView ? { y: 0 } : (ssrVisible ? { y: 0 } : {})}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
