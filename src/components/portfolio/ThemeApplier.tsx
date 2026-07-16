'use client'

import { useEffect } from 'react'
import type { ThemeSettings } from '@/lib/portfolio/default-content'

/**
 * Theme applier — bridges AppearanceSettings (DB state) with CSS root variables.
 * Renders nothing visible — it is a headless component.
 */
export function ThemeApplier({ theme }: { theme: ThemeSettings }) {
  useEffect(() => {
    const root = document.documentElement
    
    // Always force dark mode
    const bg = theme.background || '#0B0B0B'
    const accent = theme.accent || '#00D084'
    const accentSoft = theme.accentSoft || '#00FF9D'

    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-soft', accentSoft)
    root.style.setProperty('--bg', bg)
    document.body.style.backgroundColor = bg
    document.body.style.color = '#F5F5F5'

    root.style.setProperty('--glow-intensity', String(theme.glowIntensity || 1))
  }, [theme])

  return null
}
