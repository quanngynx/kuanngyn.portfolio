'use client'

import { cn } from '@/common/utils/ui'
import { useState, useRef, useEffect } from 'react'

export interface VideoCardProject {
  id: string | number
  title: string
  category: string
  year: string
  thumbnail?: string
  video?: string
}

interface VideoCardProps {
  project: VideoCardProject
  isHovered: boolean
  isSelected?: boolean
  onHoverChange: (hovered: boolean) => void
  onClick?: () => void
}

export function VideoCard({
  project,
  isHovered,
  isSelected = false,
  onHoverChange,
  onClick
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (isHovered && videoRef.current && project.video) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovered, project.video])

  const isActive = isHovered || isSelected

  return (
    <div
      className={cn(
        'group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out h-80 sm:h-96 min-w-56 sm:min-w-[16rem]',
        isActive
          ? 'flex-2 shadow-2xl ring-2 ring-primary/60'
          : 'flex-1 opacity-80 hover:opacity-100'
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={onClick}
    >
      {/* Thumbnail Image */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          isActive && project.video ? 'opacity-0' : 'opacity-100'
        )}
      >
        <img
          src={project.thumbnail || '/stories/modern-architecture-black-and-white.jpg'}
          alt={project.title}
          className={cn(
            'w-full h-full object-cover transition-all duration-700',
            !isActive && 'grayscale brightness-75'
          )}
        />
      </div>

      {/* Video */}
      {project.video && (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            isActive ? 'opacity-100' : 'opacity-0'
          )}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={project.video} type="video/mp4" />
          </video>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 p-4 sm:p-6 transition-all duration-500',
          isActive ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-2'
        )}
      >
        <div className="relative backdrop-blur-xl bg-black/40 rounded-xl p-4 border border-white/10 shadow-xl space-y-1">
          <h3 className="text-white font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold line-clamp-1">
            {project.title}
          </h3>
          <p className="text-white/80 font-mono text-[10px] sm:text-xs tracking-wider uppercase">
            {project.category}
          </p>
          <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center text-white/60 font-mono text-[10px]">
            <span>{project.year}</span>
            {isSelected && (
              <span className="px-2 py-0.5 rounded-full bg-primary/30 text-primary-foreground text-[9px] font-sans">
                Active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

