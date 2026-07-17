"use client"
import React, { createContext, useContext, useRef, useState, useEffect } from 'react'
import Hls from 'hls.js'

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
  isGoogleDrive: boolean
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

export const VideoPlayerProvider = ({ children, src }: { children: React.ReactNode, src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)

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
  
  const isGoogleDrive = src ? src.includes('drive.google.com') : false;

  // Initialize HLS or Native
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const initHls = () => {
      let finalSrc = src;
      if (src && src.includes('drive.google.com')) {
        finalSrc = `/api/proxy-video?url=${encodeURIComponent(src)}`;
      }

      if (Hls.isSupported() && finalSrc.includes('.m3u8')) {
        setIsHls(true)
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        hlsRef.current = hls
        hls.loadSource(finalSrc)
        hls.attachMedia(video)
        
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          const levels: VideoQuality[] = ['auto']
          data.levels.forEach((l) => {
            if (l.height >= 1080) levels.push('1080p')
            else if (l.height >= 720) levels.push('720p')
            else if (l.height >= 480) levels.push('480p')
            else if (l.height >= 360) levels.push('360p')
          })
          setAvailableQualities(Array.from(new Set(levels)))
        })
      } else {
        setIsHls(false)
        setFinalSrc(finalSrc)
      }
    }

    initHls()

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
      const levelIndex = hls.levels.findIndex(l => l.height === height)
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

  // Actions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause()
      else videoRef.current.play()
    }
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const toggleFullscreen = () => {
    if (!containerRef.current || !videoRef.current) return

    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(err => console.error(err))
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen()
      } else if ((videoRef.current as any).webkitEnterFullscreen) {
        // iOS Safari only allows fullscreen on the video element itself
        (videoRef.current as any).webkitEnterFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      }
    }
  }

  const togglePiP = async () => {
    if (!videoRef.current) return
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else if (document.pictureInPictureEnabled) {
      await videoRef.current.requestPictureInPicture()
    }
  }

  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const seekRelative = (delta: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoRef.current.currentTime + delta, duration))
      seek(newTime)
    }
  }

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
        isGoogleDrive,
        originalSrc: src,
        togglePlay, toggleMute, toggleFullscreen, togglePiP, seek, seekRelative
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  )
}
