"use client"
import React, { useRef, useState } from 'react'
import { Play, Pause, Maximize, Minimize } from 'lucide-react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import { useVideoPlayer } from './VideoPlayerContext'
import ProgressBar from './ProgressBar'
import VolumeControl from './VolumeControl'
import SettingsMenu from './SettingsMenu'

export default function Controls() {
  const { 
    isPlaying, 
    togglePlay, 
    isFullscreen, 
    toggleFullscreen,
    currentTime,
    duration,
    isControlsVisible,
    setControlsVisible,
    isSettingsOpen,
    seekRelative,
    setVolume,
    volume,
    seek
  } = useVideoPlayer()

  const [doubleTapAnimation, setDoubleTapAnimation] = useState<'left' | 'right' | null>(null)
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const m = Math.floor(time / 60)
    const s = Math.floor(time % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Mobile Gestures
  const lastTapTime = useRef(0)
  
  const bindGestures = useGesture({
    onPointerDown: ({ event }) => {
      // Ignore if clicking on buttons or controls
      if ((event.target as HTMLElement).closest('button') || (event.target as HTMLElement).closest('.touch-none')) {
        return
      }

      const x = event.clientX;
      const now = Date.now()
      const timeDiff = now - lastTapTime.current
      
      if (timeDiff < 300) {
        // Double Tap
        event.preventDefault()
        const width = window.innerWidth
        if (x < width / 2) {
          seekRelative(-10)
          setDoubleTapAnimation('left')
          setTimeout(() => setDoubleTapAnimation(null), 500)
        } else {
          seekRelative(10)
          setDoubleTapAnimation('right')
          setTimeout(() => setDoubleTapAnimation(null), 500)
        }
        lastTapTime.current = 0
      } else {
        // Single Tap - toggle controls
        lastTapTime.current = now
        if (!isSettingsOpen) {
          setControlsVisible(!isControlsVisible)
        }
      }
    },
    onDrag: ({ direction: [dx, dy], distance: [distX, distY], initial: [ix, iy], memo }) => {
      // Ignore if starting drag on controls
      if (iy > window.innerHeight - 100) return memo

      if (!memo) {
        // Determine primary axis
        const isHorizontal = distX > distY
        memo = { isHorizontal, startVolume: volume, startTime: currentTime }
      }

      if (memo.isHorizontal) {
        // Scrubbing (left/right)
        const seekAmount = dx * 0.1 // 10% of pixels to seconds
        seek(memo.startTime + seekAmount)
      } else {
        // Volume (up/down)
        const volChange = dy * -0.01 // invert so up increases volume
        setVolume(Math.max(0, Math.min(1, memo.startVolume + volChange)))
      }

      return memo
    }
  }, { drag: { filterTaps: true, threshold: 10 } })

  return (
    <div 
      {...bindGestures()}
      className="absolute inset-0 z-10 touch-pan-y flex flex-col justify-end overflow-hidden"
    >
      {/* Double Tap Ripple Animations */}
      <AnimatePresence>
        {doubleTapAnimation === 'left' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, x: '-50%' }}
            animate={{ opacity: 1, scale: 1.5, x: '-50%' }}
            exit={{ opacity: 0, scale: 2, x: '-50%' }}
            className="absolute left-1/4 top-1/2 -translate-y-1/2 bg-white/20 w-32 h-32 rounded-full pointer-events-none flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-white font-bold text-xl drop-shadow-md">-10s</span>
          </motion.div>
        )}
        {doubleTapAnimation === 'right' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, x: '50%' }}
            animate={{ opacity: 1, scale: 1.5, x: '50%' }}
            exit={{ opacity: 0, scale: 2, x: '50%' }}
            className="absolute right-1/4 top-1/2 -translate-y-1/2 bg-white/20 w-32 h-32 rounded-full pointer-events-none flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-white font-bold text-xl drop-shadow-md">+10s</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Big Play Button (Only when paused and controls visible) */}
      <AnimatePresence>
        {!isPlaying && isControlsVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-emerald-500/80 hover:scale-110 transition-all shadow-2xl focus:outline-none"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Controls Bar */}
      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full px-4 pt-16 pb-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 pointer-events-auto"
            onClick={e => e.stopPropagation()} // Prevent touches on controls from triggering gestures
          >
            <ProgressBar />

            <div className="flex items-center justify-between w-full pt-1">
              {/* Left Side */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="text-white hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
                </button>
                <div className="text-white text-xs font-medium font-mono tabular-nums opacity-90 tracking-wide">
                  {formatTime(currentTime)} <span className="opacity-50 mx-1">/</span> {formatTime(duration)}
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                <VolumeControl />
                <SettingsMenu />
                <button 
                  onClick={toggleFullscreen}
                  className="text-white hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
