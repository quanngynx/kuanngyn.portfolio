import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/common/components/atoms/dialog";

import { useTranslations } from "next-intl";
import { useLenisModal } from "@/common/hooks/use-lenis-modal";
import { GitBranch, ExternalLink } from "lucide-react";
import Image from "next/image";
import { ShineButton } from "@/common/components/atoms/button/button.shine";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export type StoryItem = {
  id: string;
  title: string;
  descriptions: string[];
  categories: string[];
  timeline: string;
  thumbnail?: string;
  video?: string;
  images?: string[];
  stack?: string[];
  demo?: string;
  repo?: string;
};

interface StoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story?: StoryItem | null;
  selectedStory?: StoryItem | null;
  milestoneTitle?: string;
}

export function StoryModal({
  open,
  onOpenChange,
  story = null,
  selectedStory = null,
  milestoneTitle,
}: StoryModalProps) {
  useLenisModal(open);
  const tModals = useTranslations("Modals");
  const detailsRef = useRef<HTMLDivElement>(null);

  const activeStory = story || selectedStory;

  useGSAP(
    () => {
      if (!detailsRef.current || !activeStory) return;
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    },
    { scope: detailsRef, dependencies: [activeStory?.id, open] },
  );

  if (!activeStory) return null;

  const displayTitle = activeStory.title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="flex max-h-[90vh] w-[95vw] shrink-0 flex-col gap-0 border-border/50 bg-background/95 p-0 backdrop-blur-xl sm:max-w-200"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{displayTitle}</DialogTitle>
          <DialogDescription>
            {tModals("projectDetails")} {displayTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="absolute top-0 right-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div
          className="h-full w-full flex-1 overflow-y-auto"
          data-lenis-prevent="true"
        >
          {/* Media Header Banner if thumbnail or video is present */}
          {activeStory.thumbnail && (
            <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-72">
              {activeStory.video ? (
                <video
                  src={activeStory.video}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={activeStory.thumbnail}
                  alt={activeStory.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 800px"
                  className="rounded-lg object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            </div>
          )}

          <div ref={detailsRef} className="space-y-6 p-6 sm:p-10">
            {/* Header section */}
            <div className="flex flex-col gap-2 border-b border-border/40 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-primary uppercase">
                <span>{milestoneTitle || "Roadmap Story Highlight"}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {activeStory.title}
              </h2>

              {/* Category & Timeline badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {activeStory.timeline && (
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-primary uppercase">
                    {activeStory.timeline}
                  </span>
                )}
                {activeStory.categories?.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-border/50 bg-secondary/40 px-3 py-1 font-mono text-xs tracking-wider text-muted-foreground uppercase"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Descriptions bullet list */}
            {activeStory.descriptions &&
              activeStory.descriptions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    {tModals("aboutProject")}
                  </h3>
                  <ul className="space-y-2.5 text-sm leading-relaxed font-light text-foreground/85 sm:text-base">
                    {activeStory.descriptions.map((desc) => (
                      <li key={desc} className="flex items-start gap-2.5">
                        <span className="mt-1 text-primary">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Stack tags if present */}
            {activeStory.stack && activeStory.stack.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {tModals("technologies")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeStory.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(activeStory.demo || activeStory.repo) && (
              <div className="flex flex-wrap gap-4 border-t border-border/40 pt-4">
                {activeStory.demo && (
                  <ShineButton
                    href={activeStory.demo}
                    className="h-11 bg-foreground px-6 text-background shadow-md hover:-translate-y-0.5 hover:bg-background hover:text-foreground"
                    shineClassName="w-6 bg-background/20 dark:bg-foreground/10"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
                      {tModals("liveDemo")}
                      <ExternalLink className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </ShineButton>
                )}

                {activeStory.repo && (
                  <ShineButton
                    href={activeStory.repo}
                    className="h-11 bg-secondary/20 px-6 text-foreground shadow-sm backdrop-blur-md hover:-translate-y-0.5 hover:bg-foreground hover:text-background"
                    shineClassName="w-6 bg-foreground/10 dark:bg-background/20"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
                      {tModals("sourceCode")}
                      <GitBranch className="h-3.5 w-3.5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                    </span>
                  </ShineButton>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </DialogContent>
    </Dialog>
  );
}
