"use client"
import React, { useRef, useState } from 'react'
import { Volume2, VolumeX, Volume1 } from 'lucide-react'
import { useVideoPlayer } from './VideoPlayerContext'

export default function VolumeControl() {
  const { volume, setVolume, isMuted, toggleMute } = useVideoPlayer()
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handlePointerMove(e)
    if (sliderRef.current) sliderRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !isDragging) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percent = x / rect.width
    setVolume(percent)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    if (sliderRef.current) sliderRef.current.releasePointerCapture(e.pointerId)
  }

  // Choose icon based on volume level
  let VolumeIcon = Volume2
  if (isMuted || volume === 0) VolumeIcon = VolumeX
  else if (volume < 0.5) VolumeIcon = Volume1

  return (
    <div 
      className="flex items-center gap-2 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button 
        onClick={toggleMute}
        className="text-white hover:text-emerald-400 transition-colors focus:outline-none"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>

      {/* Expandable Slider Container */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isHovering || isDragging ? 'w-16 opacity-100' : 'w-0 opacity-0'} flex items-center h-8`}
      >
        {/* Slider Track */}
        <div 
          className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer touch-none"
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Fill */}
          <div 
            className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          />
          {/* Thumb */}
          <div 
            className="absolute w-3 h-3 bg-white rounded-full -ml-1.5 -mt-[3px] shadow transition-transform scale-0 group-hover:scale-100"
            style={{ left: `${isMuted ? 0 : volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
