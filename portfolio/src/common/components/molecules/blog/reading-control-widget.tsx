'use client'

import { useState, useEffect, type RefObject } from 'react'
import { ArrowUp, Clock, FileText, Layers } from 'lucide-react'
import type { ReadingStats } from '@/common/blog/content-schema'
import { useLenis } from '@/common/providers/smooth-scroll-provider'

interface Props {
  stats: ReadingStats
  targetRef: RefObject<HTMLElement | null>
}

export function ReadingControlWidget({ stats, targetRef }: Props) {
  const lenis = useLenis()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = targetRef.current
      if (!el) return
      const start = el.offsetTop
      const height = el.offsetHeight
      const total = height - window.innerHeight
      if (total <= 0) return
      const current = window.scrollY - start
      const p = Math.min(Math.max(current / total, 0), 1)
      setProgress(p)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  const remainingMin = Math.max(0, Math.ceil((1 - progress) * stats.readingMinutes))
  const percent = Math.round(progress * 100)

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <div className="group relative flex items-center gap-3 rounded-full border border-border bg-card/90 px-3.5 py-2 text-xs text-muted-foreground shadow-xl backdrop-blur-xl transition-colors hover:text-foreground">
        <span className="font-semibold text-primary">{percent}%</span>
        <span className="h-3 w-px bg-border" />
        <span>{progress >= 0.98 ? 'Finished' : `${remainingMin} min left`}</span>

        {/* Hover Popover Stats */}
        <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 rounded-xl border border-border bg-popover/95 p-3 text-xs opacity-0 shadow-2xl backdrop-blur-2xl transition-opacity group-hover:opacity-100">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground"><FileText className="h-3.5 w-3.5" /> Words</span>
              <span className="font-medium text-foreground">{stats.wordCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Layers className="h-3.5 w-3.5" /> Sections</span>
              <span className="font-medium text-foreground">{stats.sectionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Total Time</span>
              <span className="font-medium text-foreground">{stats.readingMinutes} min</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-xl backdrop-blur-xl transition-all hover:border-foreground/40 hover:text-foreground active:scale-95"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  )
}
