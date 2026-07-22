'use client'

import { ReactNode } from 'react'
import { LazyMotion } from 'framer-motion'

const loadFeatures = () => import('framer-motion').then(res => res.domAnimation)

export function GlobalAnimationProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
