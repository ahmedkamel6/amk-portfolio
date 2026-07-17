'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PremiumVideoPlayerProps {
  src: string
  poster?: string
  aspectRatio?: 'video' | '9/16'
  className?: string
  autoPlay?: boolean
}

export function PremiumVideoPlayer({ src, poster, aspectRatio = 'video', className, autoPlay = false }: PremiumVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (autoPlay && videoRef.current && !videoError) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }, [autoPlay, videoError])

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!videoRef.current || videoError) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => setVideoError(true))
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current || videoError) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current || videoError) return
    const current = videoRef.current.currentTime
    const total = videoRef.current.duration || 1
    setProgress((current / total) * 100)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!videoRef.current || videoError) return
    const bounds = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const MathClamped = Math.max(0, Math.min(1, x / bounds.width))
    videoRef.current.currentTime = MathClamped * (videoRef.current.duration || 0)
    setProgress(MathClamped * 100)
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-black",
        aspectRatio === '9/16' ? "aspect-[9/16] max-w-[280px] sm:max-w-sm md:max-w-md mx-auto" : "aspect-video",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => togglePlay()}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onError={() => setVideoError(true)}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {videoError && (
        <div className="absolute inset-0 z-10 bg-black">
          {src.includes('google.com') && (src.match(/id=([a-zA-Z0-9_-]+)/) || src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)) ? (
            <iframe
              src={`https://drive.google.com/file/d/${(src.match(/id=([a-zA-Z0-9_-]+)/) || src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/))![1]}/preview?autoplay=1&muted=1&vq=hd1080`}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen"
              title="Google Drive Video Player"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center backdrop-blur-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
                <VolumeX className="h-8 w-8" />
              </div>
              <p className="font-display text-lg font-bold text-white">Video failed to load</p>
              <p className="mt-2 text-sm text-white/70 max-w-sm">
                The video stream could not be loaded. Please ensure the link is correct.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overlay Gradient (darkens the video slightly when paused or hovered to make controls pop) */}
      {!videoError && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-500 pointer-events-none",
          isPlaying && !isHovering ? "opacity-0" : "opacity-100"
        )} />
      )}

      {/* Center Play/Pause Button */}
      <AnimatePresence>
        {!videoError && (!isPlaying || isHovering) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className={cn(
              "flex items-center justify-center rounded-full glass-emerald transition-transform duration-300 hover:scale-110",
              isPlaying ? "h-16 w-16 bg-black/40 border border-white/10" : "h-24 w-24 glow-emerald-strong cursor-pointer pointer-events-auto"
            )} onClick={(e) => {
              if (!isPlaying) togglePlay(e)
            }}>
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white/90 fill-white/90" />
              ) : (
                <Play className="ml-1 h-10 w-10 text-emerald-glow fill-emerald-glow drop-shadow-md" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls Bar */}
      {!videoError && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 ease-out",
            isPlaying && !isHovering ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          )}
          onClick={(e) => e.stopPropagation()} // Prevent playing when clicking controls bar background
        >
          <div className="flex items-center gap-4 rounded-xl glass-emerald bg-black/50 p-3 backdrop-blur-md border border-white/10 shadow-2xl">
            <button 
              onClick={togglePlay}
              className="text-white hover:text-emerald-glow transition-colors focus:outline-none"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            </button>

            {/* Progress Bar */}
            <div 
              className="relative h-2 flex-1 cursor-pointer rounded-full bg-white/20 overflow-hidden hover:h-2.5 transition-all"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 bg-emerald-glow transition-all duration-100 ease-linear shadow-[0_0_10px_var(--emerald-glow)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button 
              onClick={toggleMute}
              className="text-white hover:text-emerald-glow transition-colors focus:outline-none"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-emerald-glow transition-colors focus:outline-none hidden sm:block"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
