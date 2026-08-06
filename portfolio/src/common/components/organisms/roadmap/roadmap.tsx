"use client";

import { useRef, useState } from "react";
import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";
import { BlurReveal } from "@/common/components/effects/blur-reveal";
import {
  StoryModal,
  StoryItem,
} from "@/common/components/molecules/modals/story-modal";
import { TimelineNode } from "@/common/components/molecules/timelines/timeline-node";
import { RoadmapBottomNav } from "@/common/components/molecules/navigation/roadmap-bottom-nav";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type RoadmapItem = {
  id: string;
  year: string;
  description: string;
  stack: string[];
  stories?: {
    items?: StoryItem[];
  };
};

const STORY_MOCK_MAP: Record<string, Partial<StoryItem>> = {
  "01": {
    title: "Foundation & Software Engineering Journey",
    categories: ["Academic", "Foundation"],
    thumbnail: "/stories/fashion-model-black-and-white.jpg",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
  "02": {
    title: "Modern Web Engineering & Enterprise UI",
    categories: ["Enterprise System", "Web Engineering"],
    thumbnail: "/stories/modern-architecture-black-and-white.jpg",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
  "03": {
    title: "Full-Stack Ecosystems & AI Platforms",
    categories: ["Enterprise System", "EdTech"],
    thumbnail: "/stories/product-design-minimalist-black-and-white.jpg",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
  "04": {
    title: "Architecture & Agentic AI Systems",
    categories: ["Agentic AI", "Hackathon"],
    thumbnail: "/stories/luxury-car-black-and-white.jpg",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
};

const getStoryItemFromRoadmapNode = (item: RoadmapItem): StoryItem => {
  const mock = STORY_MOCK_MAP[item.id] || {};
  return {
    id: item.id,
    title: mock.title || `Year ${item.year} - Milestone ${item.id}`,
    categories: mock.categories || [`Milestone ${item.year}`],
    timeline: item.year,
    descriptions: [item.description],
    thumbnail: mock.thumbnail || "/main_logo.png",
    video: mock.video,
    demo: mock.demo,
    repo: mock.repo,
    stack: item.stack,
  };
};

export default function Roadmap() {
  const t = useTranslations("Roadmap");
  const messages = useMessages() as unknown as {
    Roadmap?: { items?: RoadmapItem[] };
  };
  const roadmapItems: RoadmapItem[] = messages.Roadmap?.items || [];

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<RoadmapItem | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(
    null,
  );
  const [isRoadmapInView, setIsRoadmapInView] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenStory = (item: RoadmapItem, customStory?: StoryItem) => {
    setActiveItem(item);
    if (customStory) {
      setSelectedStory(customStory);
    } else {
      setSelectedStory(null);
    }
    setIsModalOpen(true);
  };

  const handleSelectMilestone = (id: string) => {
    setActiveMilestoneId(id);
    const targetEl = containerRef.current?.querySelector(
      `[data-milestone-id="${id}"]`,
    );
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Observe when Roadmap section enters/leaves viewport
      const sectionTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => setIsRoadmapInView(true),
        onEnterBack: () => setIsRoadmapInView(true),
        onLeave: () => setIsRoadmapInView(false),
        onLeaveBack: () => setIsRoadmapInView(false),
      });

      // Observe each milestone node wrapper for scroll progress
      const nodeElements = containerRef.current.querySelectorAll(
        ".roadmap-node-wrapper",
      );
      const nodeTriggers: ScrollTrigger[] = [];

      nodeElements.forEach((el, index) => {
        const milestoneId = el.getAttribute("data-milestone-id");
        if (!milestoneId) return;

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => setActiveMilestoneId(milestoneId),
          onEnterBack: () => setActiveMilestoneId(milestoneId),
          onLeaveBack: () => {
            if (index === 0) {
              setActiveMilestoneId(null);
            }
          },
        });
        nodeTriggers.push(st);
      });

      return () => {
        sectionTrigger.kill();
        nodeTriggers.forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [roadmapItems] },
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      ref={containerRef}
      id="roadmap"
      className="container-void relative overflow-hidden border-t border-border/50 py-32 xl:py-48"
    >
      <div className="pointer-events-none absolute top-1/4 left-0 h-125 w-full max-w-lg -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-125 w-full max-w-lg translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <m.div
        style={{ y: yBackground }}
        className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.02]"
      >
        <div className="text-[20vw] font-black tracking-tighter whitespace-nowrap uppercase">
          {t("title")}
        </div>
      </m.div>

      <div className="relative z-10 container mx-auto max-w-6xl px-container">
        <div className="mb-24 flex flex-col gap-4 text-center md:mb-40 md:items-center">
          <BlurReveal>
            <span className="title-counter">[004]</span>
          </BlurReveal>

          <BlurReveal>
            <h2 className="title">{t("title")}</h2>
          </BlurReveal>

          <BlurReveal>
            <p className="mt-3 max-w-xl text-lg font-medium tracking-tight text-foreground/60 italic">
              {t("description")}
            </p>
          </BlurReveal>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-6 w-px -translate-x-1/2 bg-border/40 md:left-1/2" />

          <m.div
            style={{ scaleY, originY: 0 }}
            className="absolute top-0 bottom-0 left-6 z-10 w-0.5 -translate-x-1/2 bg-linear-to-b from-primary via-primary to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)] md:left-1/2"
          />

          <div className="relative z-20 flex w-full flex-col gap-8 md:gap-24">
            {roadmapItems.map((item: RoadmapItem, index: number) => (
              <div
                key={item.id}
                data-milestone-id={item.id}
                className="roadmap-node-wrapper w-full"
              >
                <TimelineNode
                  item={item}
                  isEven={index % 2 === 0}
                  isSelected={activeMilestoneId === item.id}
                  onSelect={(selected) => handleSelectMilestone(selected.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <RoadmapBottomNav
        isVisible={isRoadmapInView}
        milestoneItems={roadmapItems}
        activeMilestoneId={activeMilestoneId}
        onSelectMilestone={handleSelectMilestone}
        onSelectStory={(story, milestoneItem) =>
          handleOpenStory(milestoneItem, story)
        }
        getFallbackStory={getStoryItemFromRoadmapNode}
      />

      <StoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        story={selectedStory}
        milestoneTitle={activeItem ? `Milestone ${activeItem.year}` : undefined}
      />
    </section>
  );
}
