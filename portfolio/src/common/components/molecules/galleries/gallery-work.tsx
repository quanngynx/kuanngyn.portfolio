'use client'

import { useState, useRef } from 'react'
import { VideoCard, VideoCardProject } from '../cards/card-video'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export type GalleryStoryItem = {
  id: string
  title: string
  categories: string[]
  timeline: string
  thumbnail?: string
  video?: string
  descriptions: string[]
}

interface GalleryWorkProps {
  stories?: GalleryStoryItem[]
  selectedId?: string
  onSelectStory?: (story: GalleryStoryItem) => void
}

const DEFAULT_PROJECTS: GalleryStoryItem[] = [
  {
    id: 'fashion-studio',
    title: 'FASHION STUDIO',
    categories: ['BRANDING'],
    timeline: '2024',
    thumbnail: '/stories/fashion-model-black-and-white.jpg',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    descriptions: ['Creative branding and digital media campaign for luxury fashion.']
  },
  {
    id: 'architecture-firm',
    title: 'ARCHITECTURE FIRM',
    categories: ['DESIGN'],
    timeline: '2024',
    thumbnail: '/stories/modern-architecture-black-and-white.jpg',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    descriptions: ['Architectural showcase and interactive space design.']
  },
  {
    id: 'product-launch',
    title: 'PRODUCT LAUNCH',
    categories: ['CREATIVE'],
    timeline: '2024',
    thumbnail: '/stories/product-design-minimalist-black-and-white.jpg',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    descriptions: ['Minimalist product presentation and digital launch experience.']
  },
  {
    id: 'studio-vale',
    title: 'STUDIO VALE',
    categories: ['MARKETING'],
    timeline: '2024',
    thumbnail: '/stories/red-lips-artistic-closeup.jpg',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    descriptions: ['Artistic portraiture and high-impact digital marketing.']
  },
  {
    id: 'automotive',
    title: 'AUTOMOTIVE',
    categories: ['COMMERCIAL'],
    timeline: '2024',
    thumbnail: '/stories/luxury-car-black-and-white.jpg',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    descriptions: ['High performance commercial video and media showcase.']
  }
]

export function WorksGallery(props: GalleryWorkProps) {
  return <GalleryWork {...props} />
}

export function GalleryWork({
  stories = DEFAULT_PROJECTS,
  selectedId,
  onSelectStory
}: GalleryWorkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return
      gsap.from('.gallery-work-card', {
        opacity: 0,
        y: 25,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out'
      })
    },
    { scope: containerRef, dependencies: [stories] }
  )

  const cardItems = stories.length > 0 ? stories : DEFAULT_PROJECTS

  return (
    <div ref={containerRef} className="w-full px-2 sm:px-6">
      <div className="flex gap-3 sm:gap-4 items-stretch overflow-x-auto pb-4 scrollbar-none snap-x">
        {cardItems.map((story) => {
          const project: VideoCardProject = {
            id: story.id,
            title: story.title,
            category: story.categories[0] || 'STORY',
            year: story.timeline || '2026',
            thumbnail: story.thumbnail,
            video: story.video
          }
          const isSelected = selectedId === story.id

          return (
            <div
              key={story.id}
              className="gallery-work-card shrink-0 snap-start flex-1 min-w-[13rem] sm:min-w-[15rem]"
            >
              <VideoCard
                project={project}
                isHovered={hoveredId === story.id}
                isSelected={isSelected}
                onHoverChange={(hovered) => setHoveredId(hovered ? story.id : null)}
                onClick={() => onSelectStory?.(story)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

