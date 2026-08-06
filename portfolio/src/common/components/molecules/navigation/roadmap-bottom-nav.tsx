"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { StoryItem } from "../modals/story-modal";
import { RoadmapItem } from "../../organisms/roadmap/roadmap";

interface RoadmapBottomNavProps {
  isVisible: boolean;
  milestoneItems: RoadmapItem[];
  activeMilestoneId: string | null;
  onSelectMilestone: (id: string) => void;
  onSelectStory: (story: StoryItem, item: RoadmapItem) => void;
  getFallbackStory: (item: RoadmapItem) => StoryItem;
}

export function RoadmapBottomNav({
  isVisible,
  milestoneItems,
  activeMilestoneId,
  onSelectMilestone,
  onSelectStory,
  getFallbackStory,
}: RoadmapBottomNavProps) {
  const shouldReduceMotion = useReducedMotion();

  const currentItem =
    milestoneItems.find((item) => item.id === activeMilestoneId) ||
    milestoneItems[0];

  const currentStories: StoryItem[] =
    currentItem?.stories?.items && currentItem.stories.items.length > 0
      ? currentItem.stories.items
      : currentItem
        ? [getFallbackStory(currentItem)]
        : [];

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.95,
      transition: {
        duration: 0.25,
        ease: "easeInOut" as const,
      },
    },
  };

  const storiesGroupVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -12,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  const storyItemVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : 10 },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          className="pointer-events-auto fixed bottom-6 left-1/2 z-40 w-[92vw] max-w-xl -translate-x-1/2"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-background/90 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:bg-card/90 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {/* Top Bar: Milestone tabs & indicator */}
            <div className="flex items-center justify-between gap-2 pb-2.5">
              <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-primary uppercase">
                <span>Roadmap Stories</span>
              </div>

              {/* Milestone Switcher Pills */}
              <div className="flex items-center gap-1 rounded-full border border-border/30 bg-secondary/50 p-1">
                {milestoneItems.map((item) => {
                  const isActive =
                    activeMilestoneId !== null && item.id === activeMilestoneId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectMilestone(item.id)}
                      className={`relative rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium transition-colors ${
                        isActive
                          ? "font-semibold text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <m.span
                          layoutId="activeMilestonePill"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Milestone Stories Content */}
            <AnimatePresence mode="wait">
              <m.div
                key={activeMilestoneId || "default"}
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
                    className="group relative flex w-full items-center justify-between gap-3 rounded-xl border border-border/50 bg-secondary/20 p-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                          <span>{story.categories?.[0] || "Milestone"}</span>
                          {story.timeline && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-border" />
                              <span>{story.timeline}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-primary transition-transform group-hover:translate-x-0.5">
                      <span className="hidden text-[10px] font-medium tracking-wider uppercase sm:inline">
                        View Details
                      </span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </m.button>
                ))}
              </m.div>
            </AnimatePresence>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
