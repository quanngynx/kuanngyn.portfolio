'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { StoryItem } from '../modals/story-modal'
import { RoadmapItem } from '../../organisms/roadmap/roadmap'

interface RoadmapBottomNavProps {
  isVisible: boolean
  milestoneItems: RoadmapItem[]
  activeMilestoneId: string | null
  onSelectMilestone: (id: string) => void
  onSelectStory: (story: StoryItem, item: RoadmapItem) => void
  getFallbackStory: (item: RoadmapItem) => StoryItem
}

export function RoadmapBottomNav({
  isVisible,
  milestoneItems,
  activeMilestoneId,
  onSelectMilestone,
  onSelectStory,
  getFallbackStory
}: RoadmapBottomNavProps) {
  const shouldReduceMotion = useReducedMotion()

  const currentItem = milestoneItems.find((item) => item.id === activeMilestoneId) || milestoneItems[0]

  const currentStories: StoryItem[] =
    currentItem?.stories?.items && currentItem.stories.items.length > 0
      ? currentItem.stories.items
      : currentItem
        ? [getFallbackStory(currentItem)]
        : []

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.95,
      transition: {
        duration: 0.25,
        ease: 'easeInOut' as const
      }
    }
  }

  const storiesGroupVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
        staggerChildren: 0.08
      }
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -12,
      transition: {
        duration: 0.2,
        ease: 'easeIn' as const
      }
    }
  }

  const storyItemVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : 10 }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-xl pointer-events-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-background/90 dark:bg-card/90 p-3.5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {/* Top Bar: Milestone tabs & indicator */}
            <div className="flex items-center justify-between gap-2 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-primary uppercase">
                <span>Roadmap Stories</span>
              </div>

              {/* Milestone Switcher Pills */}
              <div className="flex items-center gap-1 bg-secondary/50 rounded-full p-1 border border-border/30">
                {milestoneItems.map((item) => {
                  const isActive = activeMilestoneId !== null && item.id === activeMilestoneId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectMilestone(item.id)}
                      className={`relative px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium transition-colors ${isActive
                        ? 'text-primary-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {isActive && (
                        <m.span
                          layoutId="activeMilestonePill"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Milestone Stories Content */}
            <AnimatePresence mode="wait">
              <m.div
                key={activeMilestoneId || 'default'}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={storiesGroupVariants}
                className="flex flex-col gap-2"
              >
                {currentStories.map((story) => (
                  <m.button
                    key={story.id}
                    variants={storyItemVariants}
                    onClick={() => onSelectStory(story, currentItem)}
                    className="group relative flex items-center justify-between gap-3 w-full p-2.5 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/50 hover:border-primary/40 text-left transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          <span>{story.categories?.[0] || 'Milestone'}</span>
                          {story.timeline && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span>{story.timeline}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
                      <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-medium">
                        View Details
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </m.button>
                ))}
              </m.div>
            </AnimatePresence>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
