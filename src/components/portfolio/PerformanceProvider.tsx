'use client'

import { useEffect } from 'react'

/**
 * Lightweight performance detection.
 * Replaced the previous MotionConfig wrapper (which pulled framer-motion into the layout bundle)
 * with a simple useEffect that adds a CSS class for low-end devices.
 * Animations are controlled via CSS media queries + the body class.
 */
export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Detect if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Estimate device performance
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;
    
    // If it's a mobile device and has limited cores/RAM, consider it low-end.
    if (isMobile && (cores <= 4 || memory <= 3)) {
      document.body.classList.add('low-end-device');
    }
  }, [])

  return <>{children}</>
}
