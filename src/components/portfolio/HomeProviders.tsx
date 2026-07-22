'use client'

import { ReactNode } from 'react'
import { LazyMotion } from 'framer-motion'
import dynamic from 'next/dynamic'

const loadFeatures = () => import('framer-motion').then(res => res.domAnimation)

const SmoothScroll = dynamic(
  () => import('@/components/portfolio/SmoothScroll').then(m => ({ default: m.SmoothScroll })),
  { ssr: false }
)

export function HomeProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      {children}
    </SmoothScroll>
  )
}
