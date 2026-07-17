'use client'

import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [isLowEnd, setIsLowEnd] = useState(false)

  useEffect(() => {
    // Detect if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Estimate device performance
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;
    
    // If it's a mobile device and has limited cores/RAM, consider it low-end.
    if (isMobile && (cores <= 4 || memory <= 3)) {
      setIsLowEnd(true);
      // Optional: Add a class to body so we can disable heavy CSS animations if needed
      document.body.classList.add('low-end-device');
    }
  }, [])

  return (
    <MotionConfig reducedMotion={isLowEnd ? "always" : "user"}>
      {children}
    </MotionConfig>
  )
}
