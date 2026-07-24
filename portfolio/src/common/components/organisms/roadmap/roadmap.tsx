"use client";

import { useRef, useState } from "react";
import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";
import { cn } from "@/common/utils/ui";
import { BlurReveal } from "@/common/components/effects/blur-reveal";
import {
  StoryModal,
  StoryItem,
} from "@/common/components/molecules/modals/story-modal";

export type RoadmapItem = {
  id: string;
  year: string;
  description: string;
  stack: string[];
};

const STORY_MOCK_MAP: Record<string, Partial<StoryItem>> = {
  "01": {
    title: "Foundation & Computer Science Journey",
    category: "Milestone 2023",
    image: "/hero-slider/amncu2ytwgk1u3entffj.webp",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
  "02": {
    title: "Modern Frontend & UI Engineering",
    category: "Milestone 2024",
    image: "/hero-slider/cosirjjoqyzvjq7v0lf5.webp",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
  "03": {
    title: "Full-Stack Web & Ecosystem Scalability",
    category: "Milestone 2025",
    image: "/hero-slider/mjcsiedxyrnajenusw2t.webp",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
  "04": {
    title: "Architecture, i18n & Agentic AI Systems",
    category: "Milestone 2026",
    image: "/main_logo.png",
    repo: "https://github.com/quanngynx",
    demo: "https://github.com/quanngynx",
  },
};

const getStoryItemFromRoadmapNode = (item: RoadmapItem): StoryItem => {
  const mock = STORY_MOCK_MAP[item.id] || {};
  return {
    id: item.id,
    title: mock.title || `Year ${item.year} - Milestone ${item.id}`,
    category: mock.category || `Milestone ${item.year}`,
    year: item.year,
    description: item.description,
    image: mock.image || "/main_logo.png",
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
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenStory = (item: RoadmapItem) => {
    setSelectedStory(getStoryItemFromRoadmapNode(item));
    setIsModalOpen(true);
  };

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
      className="container-void relative overflow-hidden border-t border-border/50 py-32 xl:py-48"
    >
      <div className="pointer-events-none absolute top-1/4 left-0 h-[500px] w-full max-w-lg -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-[500px] w-full max-w-lg translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

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
            className="absolute top-0 bottom-0 left-6 z-10 w-[2px] -translate-x-1/2 bg-linear-to-b from-primary via-primary to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)] md:left-1/2"
          />

          <div className="relative z-20 flex w-full flex-col gap-8 md:gap-24">
            {roadmapItems.map((item: RoadmapItem, index: number) => (
              <TimelineNode
                key={item.id}
                item={item}
                isEven={index % 2 === 0}
                onSelect={handleOpenStory}
              />
            ))}
          </div>
        </div>
      </div>

      <StoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        project={selectedStory}
      />
    </section>
  );
}

const TimelineNode = ({
  item,
  isEven,
  onSelect,
}: {
  item: RoadmapItem;
  isEven: boolean;
  onSelect: (item: RoadmapItem) => void;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between",
        isEven ? "flex-row" : "flex-row-reverse",
      )}
    >
      <div className="hidden w-[calc(50%-3rem)] md:block" />

      <div className="absolute left-6 z-20 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border/50 bg-background shadow-lg transition-colors duration-500 group-hover:border-primary/50 md:left-1/2 md:h-10 md:w-10">
        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] md:h-3 md:w-3" />
      </div>

      <div
        className={cn(
          "group relative w-full pl-16 md:w-[calc(50%-3rem)] md:pl-0",
        )}
      >
        <BlurReveal>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "relative w-full cursor-pointer overflow-hidden border border-border/50 bg-secondary/5 p-8 text-left backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-700 ease-out md:p-10",
              "hover:-translate-y-1 hover:border-border hover:bg-secondary/20 hover:shadow-2xl",
              isEven ? "md:text-right" : "md:text-left",
            )}
          >
            <span
              className={cn(
                "mb-4 flex font-mono text-xs tracking-widest text-muted-foreground uppercase max-sm:hidden",
                isEven ? "md:justify-end" : "md:justify-start",
              )}
            >
              {item.id}
            </span>

            <div className="relative z-10 flex flex-col gap-3">
              <h3 className="mt-2 font-serif text-4xl font-semibold tracking-tighter text-foreground uppercase italic transition-colors duration-500 group-hover:text-primary md:text-5xl lg:text-6xl">
                {item.year}
              </h3>

              <p
                className="mt-2 ml-0 max-w-sm text-sm leading-relaxed text-muted-foreground md:max-w-md md:text-base"
                style={{ marginLeft: isEven ? "auto" : "0" }}
              >
                {item.description}
              </p>

              <div
                className={cn(
                  "mt-6 flex flex-wrap gap-2",
                  isEven ? "md:justify-end" : "justify-start",
                )}
              >
                {item.stack.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/40 bg-background/50 px-3 py-1 text-xs font-medium tracking-wider text-muted-foreground uppercase shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 text-[10rem] font-black text-foreground/3 italic transition-transform duration-700 select-none",
                isEven ? "-left-12" : "-right-12 text-right",
              )}
            >
              {item.year.slice(2)}
            </div>
          </button>
        </BlurReveal>
      </div>
    </div>
  );
};
