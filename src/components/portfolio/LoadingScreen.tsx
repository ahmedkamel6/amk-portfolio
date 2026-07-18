'use client'

import { useEffect, useState } from 'react'

/**
 * Lightweight loading screen — shows the original logo immediately
 * with a subtle fade-in + scale, then fades out to reveal the Hero.
 *
 * Zero Framer Motion. Pure CSS animations.
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 2400)
    return () => clearTimeout(timer)
  }, [])

  if (done) return null

  return (
    <div className="ls-root" aria-hidden="true">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-radial-spotlight opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />

      {/* Logo container */}
      <div className="ls-container">
        {/* Subtle glow behind logo */}
        <div className="ls-glow" />

        {/* Original logo — appears immediately with fade-in */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          className="ls-logo"
        />
      </div>

      <style>{`
        .ls-root {
          position: fixed; inset: 0; z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          background: #050505;
          animation: ls-fadeout 0.8s ease-in-out 2.0s forwards;
        }
        .ls-container {
          position: relative;
          width: clamp(160px, 35vw, 280px);
          height: clamp(160px, 35vw, 280px);
          animation: ls-enter 0.6s ease-out forwards;
        }
        .ls-glow {
          position: absolute; inset: -30%; border-radius: 50%;
          background: radial-gradient(circle, rgba(106,124,154,0.15), transparent 70%);
          animation: ls-glow-in 1.5s ease-in-out 0.3s forwards;
          opacity: 0;
          pointer-events: none;
        }
        .ls-logo {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: contain;
          filter: brightness(0) saturate(100%) invert(52%) sepia(11%) saturate(871%) hue-rotate(170deg) brightness(91%) contrast(87%);
          drop-shadow: 0 0 15px rgba(255,255,255,0.1);
        }

        @keyframes ls-enter {
          from { opacity: 0; transform: scale(0.92) }
          to   { opacity: 1; transform: scale(1) }
        }
        @keyframes ls-glow-in {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes ls-fadeout {
          to { opacity: 0; pointer-events: none }
        }
      `}</style>
    </div>
  )
}
