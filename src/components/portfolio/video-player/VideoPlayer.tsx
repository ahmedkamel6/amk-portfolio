"use client"
import React, { useEffect, useRef, useCallback } from 'react'
import { VideoPlayerProvider, useVideoPlayer } from './VideoPlayerContext'
import Controls from './Controls'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

interface VideoPlayerProps {
  src: string
  poster?: string
  aspectRatio?: 'video' | '9/16'
  className?: string
  autoPlay?: boolean
}

const VideoElement = ({ src, poster, aspectRatio = 'video', className, autoPlay }: VideoPlayerProps) => {
  const { 
    videoRef, 
    containerRef,
    setIsPlaying, 
    setCurrentTime, 
    setDuration, 
    setBuffered, 
    isLoading,
    setIsLoading,
    isBuffering,
    setIsBuffering,
    isControlsVisible,
    setControlsVisible,
    finalSrc,
    togglePlay,
    seekRelative,
    isSettingsOpen,
    setIsMuted,
    isLoop,
    originalSrc
  } = useVideoPlayer()

  const idleTimeout = useRef<NodeJS.Timeout | null>(null)
  const hasAutoPlayed = useRef(false)

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
      
      const container = containerRef.current
      if (container && container.matches(':hover')) {
        switch (e.key) {
          case ' ':
          case 'k':
            e.preventDefault()
            togglePlay()
            break
          case 'ArrowLeft':
            e.preventDefault()
            seekRelative(-10)
            break
          case 'ArrowRight':
            e.preventDefault()
            seekRelative(10)
            break
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, seekRelative])

  // Mouse inactivity hide — wrapped in useCallback to avoid re-renders
  const handleMouseMove = useCallback(() => {
    setControlsVisible(true)
    if (idleTimeout.current) clearTimeout(idleTimeout.current)
    if (!isSettingsOpen) {
      idleTimeout.current = setTimeout(() => {
        setControlsVisible(false)
      }, 2500)
    }
  }, [isSettingsOpen, setControlsVisible])

  const handleMouseLeave = useCallback(() => {
    if (!isSettingsOpen) setControlsVisible(false)
  }, [isSettingsOpen, setControlsVisible])

  const isMobile = useIsMobile()

  // Intersection Observer for auto-pause when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [])

  // Check if it's a Google Drive link to use the iframe fallback for Desktop
  let driveId = null;
  if (originalSrc && (originalSrc.includes('drive.google.com') || originalSrc.includes('drive.usercontent.google.com'))) {
    const match = originalSrc.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || originalSrc.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      driveId = match[1];
    }
  }

  // Use Google Drive iframe strictly on Desktop to avoid buffering. 
  // Keep custom player on Mobile where it works well.
  const useIframeFallback = driveId && !isMobile;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${aspectRatio === '9/16' ? 'aspect-[9/16] max-w-[430px]' : 'aspect-video'} mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl group ring-1 ring-white/10 ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setControlsVisible(true)}
    >
      {useIframeFallback ? (
        <iframe
          src={`https://drive.google.com/file/d/${driveId}/preview?autoplay=${autoPlay ? 1 : 0}`}
          className="w-full h-full border-0 absolute inset-0 z-10"
          allow="autoplay; fullscreen"
          onLoad={() => {
            setIsLoading(false);
            setIsBuffering(false);
          }}
        />
      ) : (
        <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        preload="auto"
        playsInline
        loop={isLoop}
        // fetchPriority tells the browser this is the most important resource
        fetchPriority="high"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
          }
        }}
        onDurationChange={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration)
          }
        }}
        onProgress={() => {
          if (videoRef.current) {
            setBuffered(videoRef.current.buffered)
          }
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false)
          setIsLoading(false)
        }}
        onCanPlay={(e) => {
          setIsLoading(false)
          if (autoPlay && !hasAutoPlayed.current && videoRef.current) {
            hasAutoPlayed.current = true
            videoRef.current.muted = true
            setIsMuted(true)
            videoRef.current.play().catch((e) => {
              if (e.name !== 'AbortError') console.error(e)
            })
          }
        }}
        src={finalSrc || undefined}
      />
      )}

      {/* Loading Skeleton / Shimmer */}
      <AnimatePresence>
        {/* Loading Spinner for Buffering */}
        {isBuffering && !isLoading && !useIframeFallback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-20"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <span className="text-white/80 text-sm font-medium">Buffering...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!useIframeFallback && <Controls />}
    </div>
  )
}

export default function VideoPlayer(props: VideoPlayerProps) {
  return (
    <VideoPlayerProvider src={props.src}>
      <VideoElement {...props} />
    </VideoPlayerProvider>
  )
}
