"use client"
import React, { useRef, useState, useEffect } from 'react'
import { useVideoPlayer } from './VideoPlayerContext'

export default function ProgressBar() {
  const { 
    currentTime, 
    duration, 
    buffered, 
    seek, 
    videoRef 
  } = useVideoPlayer()
  
  const progressRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState(0)

  // Calculate percentages
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  
  let bufferedPercent = 0
  if (buffered && buffered.length > 0 && duration > 0) {
    // Get the highest buffered end time
    let maxBuffered = 0
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.end(i) > maxBuffered) {
        maxBuffered = buffered.end(i)
      }
    }
    bufferedPercent = (maxBuffered / duration) * 100
  }

  // Handle Scrubbing
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handlePointerMove(e)
    if (progressRef.current) progressRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percent = x / rect.width
    const newTime = percent * duration
    
    // Hover logic
    setHoverPosition(x)
    setHoverTime(newTime)

    // Drag logic
    if (isDragging) {
      seek(newTime)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    if (progressRef.current) progressRef.current.releasePointerCapture(e.pointerId)
  }

  const handlePointerLeave = () => {
    if (!isDragging) {
      setHoverTime(null)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const m = Math.floor(time / 60)
    const s = Math.floor(time % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div 
      className="relative w-full h-8 flex items-center group cursor-pointer touch-none"
      ref={progressRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* Background Track */}
      <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden transition-all duration-300 group-hover:h-2">
        {/* Buffered Track */}
        <div 
          className="absolute top-0 bottom-0 left-0 bg-white/40 transition-all duration-200"
          style={{ width: `${bufferedPercent}%` }}
        />
        {/* Progress Track */}
        <div 
          className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Playhead Scrubber */}
      <div 
        className={`absolute h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] -ml-1.5 transition-transform duration-200 ${isDragging || hoverTime !== null ? 'scale-150' : 'scale-0 group-hover:scale-100'}`}
        style={{ left: `${progressPercent}%` }}
      />

      {/* Hover Preview Tooltip */}
      {hoverTime !== null && !isDragging && (
        <div 
          className="absolute bottom-6 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-opacity"
          style={{ left: hoverPosition }}
        >
          <div className="px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-white text-xs font-medium shadow-xl">
            {formatTime(hoverTime)}
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/80 -mt-[1px]" />
        </div>
      )}
    </div>
  )
}
