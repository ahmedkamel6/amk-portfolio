"use client"
import React, { useState } from 'react'
import { Settings, ChevronLeft, Check, Repeat, PictureInPicture } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVideoPlayer, VideoQuality } from './VideoPlayerContext'

type MenuPage = 'main' | 'speed' | 'quality'

export default function SettingsMenu() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    playbackRate, 
    setPlaybackRate,
    isHls,
    quality,
    setQuality,
    availableQualities,
    isLoop,
    setIsLoop,
    togglePiP
  } = useVideoPlayer()

  const [page, setPage] = useState<MenuPage>('main')

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  const formatQuality = (q: string) => {
    if (q === 'auto') return 'Auto'
    return q
  }

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsSettingsOpen(!isSettingsOpen)
          setPage('main')
        }}
        className={`text-white transition-transform duration-500 hover:text-emerald-400 focus:outline-none ${isSettingsOpen ? 'rotate-90' : ''}`}
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-10 right-0 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden origin-bottom-right z-50 text-sm font-medium text-white/90"
          >
            {page === 'main' && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col py-2"
              >
                {/* Speed Menu Item */}
                <button 
                  onClick={() => setPage('speed')}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors w-full"
                >
                  <span>Speed</span>
                  <span className="text-white/50">{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                </button>
                
                {/* Quality Menu Item (only if HLS) */}
                {isHls && (
                  <button 
                    onClick={() => setPage('quality')}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors w-full"
                  >
                    <span>Quality</span>
                    <span className="text-white/50">{formatQuality(quality)}</span>
                  </button>
                )}

                <div className="h-[1px] bg-white/10 my-1 mx-4" />

                {/* Loop Toggle */}
                <button 
                  onClick={() => setIsLoop(!isLoop)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors w-full"
                >
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4" />
                    <span>Loop</span>
                  </div>
                  {isLoop && <Check className="w-4 h-4 text-emerald-400" />}
                </button>

                {/* PiP Toggle */}
                {document.pictureInPictureEnabled && (
                  <button 
                    onClick={() => { togglePiP(); setIsSettingsOpen(false) }}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors w-full"
                  >
                    <div className="flex items-center gap-2">
                      <PictureInPicture className="w-4 h-4" />
                      <span>Picture in Picture</span>
                    </div>
                  </button>
                )}
              </motion.div>
            )}

            {page === 'speed' && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col py-2"
              >
                <button 
                  onClick={() => setPage('main')}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors border-b border-white/10 mb-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="font-semibold">Playback Speed</span>
                </button>
                
                {speeds.map(s => (
                  <button
                    key={s}
                    onClick={() => { setPlaybackRate(s); setIsSettingsOpen(false) }}
                    className="flex items-center justify-between px-4 py-2 hover:bg-white/10 transition-colors"
                  >
                    <span>{s === 1 ? 'Normal' : `${s}x`}</span>
                    {playbackRate === s && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </motion.div>
            )}

            {page === 'quality' && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col py-2 max-h-[300px] overflow-y-auto"
              >
                <button 
                  onClick={() => setPage('main')}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors border-b border-white/10 mb-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="font-semibold">Quality</span>
                </button>
                
                {availableQualities.map(q => (
                  <button
                    key={q}
                    onClick={() => { setQuality(q); setIsSettingsOpen(false) }}
                    className="flex items-center justify-between px-4 py-2 hover:bg-white/10 transition-colors"
                  >
                    <span>{formatQuality(q)}</span>
                    {quality === q && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
