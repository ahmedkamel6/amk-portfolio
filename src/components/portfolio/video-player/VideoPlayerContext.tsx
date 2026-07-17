"use client"
import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'

export type VideoQuality = 'auto' | '1080p' | '720p' | '480p' | '360p'

export interface VideoPlayerContextProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isPlaying: boolean
  setIsPlaying: (val: boolean) => void
  isMuted: boolean
  setIsMuted: (val: boolean) => void
  volume: number
  setVolume: (val: number) => void
  currentTime: number
  setCurrentTime: (val: number) => void
  duration: number
  setDuration: (val: number) => void
  buffered: TimeRanges | null
  setBuffered: (val: TimeRanges | null) => void
  isFullscreen: boolean
  setIsFullscreen: (val: boolean) => void
  isPiP: boolean
  setIsPiP: (val: boolean) => void
  playbackRate: number
  setPlaybackRate: (val: number) => void
  quality: VideoQuality
  setQuality: (val: VideoQuality) => void
  availableQualities: VideoQuality[]
  isHls: boolean
  isControlsVisible: boolean
  setControlsVisible: (val: boolean) => void
  isSettingsOpen: boolean
  setIsSettingsOpen: (val: boolean) => void
  isLoop: boolean
  setIsLoop: (val: boolean) => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void
  isBuffering: boolean
  setIsBuffering: (val: boolean) => void
  finalSrc: string | null
  originalSrc: string
  togglePlay: () => void
  toggleMute: () => void
  toggleFullscreen: () => void
  togglePiP: () => void
  seek: (time: number) => void
  seekRelative: (delta: number) => void
}

const VideoPlayerContext = createContext<VideoPlayerContextProps | null>(null)

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext)
  if (!context) throw new Error('useVideoPlayer must be used within VideoPlayerProvider')
  return context
}

/**
 * Helper: Convert a Google Drive share URL to a proxy-redirect URL.
 * The proxy resolves the real download link and 302-redirects the browser to it,
 * avoiding the 100MB virus scan HTML warning which causes NotSupportedError.
 */
function resolveDriveUrl(src: string): string {
  if (!src || !src.includes('drive.google.com')) return src;
  const match = src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const directUrl = `https://drive.google.com/uc?export=download&id=${match[1]}&confirm=t`;
    return `/api/stream?url=${encodeURIComponent(directUrl)}`;
  }
  return src;
}

export const VideoPlayerProvider = ({ children, src }: { children: React.ReactNode, src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hlsRef = useRef<any>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState<TimeRanges | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPiP, setIsPiP] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [quality, setQuality] = useState<VideoQuality>('auto')
  const [availableQualities, setAvailableQualities] = useState<VideoQuality[]>(['auto'])
  const [isHls, setIsHls] = useState(false)
  const [isControlsVisible, setControlsVisible] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoop, setIsLoop] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [finalSrc, setFinalSrc] = useState<string | null>(null)

  // Initialize video source — lazy-load HLS only if .m3u8 is detected
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const resolvedSrc = resolveDriveUrl(src);

    if (resolvedSrc.includes('.m3u8')) {
      // Lazy-load hls.js only when actually needed (saves ~250KB from default bundle)
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported()) {
          // Safari has native HLS support
          setIsHls(false)
          setFinalSrc(resolvedSrc)
          return
        }
        setIsHls(true)
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        hlsRef.current = hls
        hls.loadSource(resolvedSrc)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, (_event: any, data: any) => {
          const levels: VideoQuality[] = ['auto']
          data.levels.forEach((l: any) => {
            if (l.height >= 1080) levels.push('1080p')
            else if (l.height >= 720) levels.push('720p')
            else if (l.height >= 480) levels.push('480p')
            else if (l.height >= 360) levels.push('360p')
          })
          setAvailableQualities(Array.from(new Set(levels)))
        })
      }).catch(() => {
        // If dynamic import fails, fall back to native playback
        setIsHls(false)
        setFinalSrc(resolvedSrc)
      })
    } else {
      setIsHls(false)
      setFinalSrc(resolvedSrc)
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy()
    }
  }, [src])

  // Change HLS Quality
  useEffect(() => {
    if (!hlsRef.current || !isHls) return
    const hls = hlsRef.current
    if (quality === 'auto') {
      hls.currentLevel = -1
    } else {
      const height = parseInt(quality.replace('p', ''))
      const levelIndex = hls.levels.findIndex((l: any) => l.height === height)
      if (levelIndex !== -1) {
        hls.currentLevel = levelIndex
      }
    }
  }, [quality, isHls])

  // Sync Volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume
      videoRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  // Sync Playback Rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  // Sync Loop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLoop
    }
  }, [isLoop])

  // Actions — wrapped in useCallback to prevent child re-renders
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play()
      else videoRef.current.pause()
    }
  }, [])

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current || !videoRef.current) return

    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(err => console.error(err))
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen()
      } else if ((videoRef.current as any).webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      }
    }
  }, [])

  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else if (document.pictureInPictureEnabled) {
      await videoRef.current.requestPictureInPicture()
    }
  }, [])

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const seekRelative = useCallback((delta: number) => {
    if (videoRef.current) {
      const d = videoRef.current.duration || 0
      const newTime = Math.max(0, Math.min(videoRef.current.currentTime + delta, d))
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [])

  return (
    <VideoPlayerContext.Provider
      value={{
        videoRef, containerRef,
        isPlaying, setIsPlaying,
        isMuted, setIsMuted,
        volume, setVolume,
        currentTime, setCurrentTime,
        duration, setDuration,
        buffered, setBuffered,
        isFullscreen, setIsFullscreen,
        isPiP, setIsPiP,
        playbackRate, setPlaybackRate,
        quality, setQuality,
        availableQualities,
        isHls,
        isControlsVisible, setControlsVisible,
        isSettingsOpen, setIsSettingsOpen,
        isLoop, setIsLoop,
        isLoading, setIsLoading,
        isBuffering, setIsBuffering,
        finalSrc,
        originalSrc: src,
        togglePlay, toggleMute, toggleFullscreen, togglePiP, seek, seekRelative
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  )
}
