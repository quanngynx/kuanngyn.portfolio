"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AlignLeft, X } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/common/components/atoms/hover-card";
import type { ArticleOutlineItem } from "@/common/components/organisms/blog/article-outline";
import { useLenis } from "@/common/providers/smooth-scroll-provider";
import { cn } from "@/common/utils/ui";

interface ArticleNavigatorProps {
  items: ArticleOutlineItem[];
  label: string;
}

function currentHeadingId(items: ArticleOutlineItem[]): string {
  if (typeof window === "undefined") return items[0]?.id ?? "";
  const threshold = window.innerHeight * 0.3;
  let currentId = items[0]?.id ?? "";

  for (const { id } of items) {
    const heading = document.getElementById(id);
    if (!heading || heading.getBoundingClientRect().top > threshold) break;
    currentId = id;
  }

  return currentId;
}

export function ArticleNavigator({ items, label }: ArticleNavigatorProps) {
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsPanelOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPanelOpen(false);
    }, 200);
  };

  const scrollToHeading = useCallback(
    (id: string) => {
      const heading = document.getElementById(id);
      if (!heading) return;

      setActiveId(id);

      if (lenis) {
        lenis.scrollTo(heading, {
          immediate: Boolean(shouldReduceMotion),
        });
        return;
      }

      heading.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [lenis, shouldReduceMotion],
  );

  useEffect(() => {
    const hashId = window.location.hash.slice(1);
    const frameId = window.requestAnimationFrame(() => {
      setActiveId(
        items.some(({ id }) => id === hashId)
          ? hashId
          : currentHeadingId(items),
      );
    });

    const observer = new IntersectionObserver(
      () => {
        setActiveId(currentHeadingId(items));
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const { id } of items) {
      const heading = document.getElementById(id);
      if (heading) observer.observe(heading);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    let frameId: number | undefined;
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handlePopState = () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const hashId = window.location.hash.slice(1);

        if (items.some(({ id }) => id === hashId)) {
          scrollToHeading(hashId);
        } else {
          setActiveId(currentHeadingId(items));
        }
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [items, scrollToHeading]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const navigateToSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();

      const hash = `#${id}`;
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }

      scrollToHeading(id);
      setIsPanelOpen(false);
    },
    [scrollToHeading],
  );

  if (items.length < 2) return null;

  return (
    <nav
      aria-label={label}
      ref={panelRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex flex-col items-start gap-3">
        <ol className="flex flex-col gap-1 pl-1">
          {items.map((item, index) => {
            const isActive = item.id === activeId;
            const accessibleTitle = item.title || item.id;

            return (
              <li key={item.id}>
                <HoverCard
                  open={!isPanelOpen && previewId === item.id}
                  onOpenChange={(open) =>
                    setPreviewId(open && !isPanelOpen ? item.id : null)
                  }
                  openDelay={100}
                  closeDelay={100}
                >
                  <HoverCardTrigger asChild>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      aria-label={`${index + 1}. ${accessibleTitle}`}
                      onClick={(event) => navigateToSection(event, item.id)}
                      onFocus={(event) => {
                        const trigger = event.currentTarget;
                        window.requestAnimationFrame(() => {
                          if (
                            document.activeElement === trigger &&
                            !isPanelOpen
                          ) {
                            setPreviewId(item.id);
                          }
                        });
                      }}
                      onBlur={() => setPreviewId(null)}
                      className="group flex h-3 w-10 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-0.5 transition-[width,background-color] duration-200 motion-reduce:transition-none",
                          isActive
                            ? "w-8 bg-foreground"
                            : "w-2 bg-muted-foreground/45 group-hover:w-6 group-hover:bg-foreground/70 group-focus-visible:w-6 group-focus-visible:bg-foreground/70",
                        )}
                      />
                    </a>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    align="center"
                    sideOffset={16}
                    className="w-96 max-w-[calc(100vw-5rem)] rounded-2xl border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">
                      {accessibleTitle}
                    </p>
                    {item.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {item.excerpt}
                      </p>
                    )}
                  </HoverCardContent>
                </HoverCard>
              </li>
            );
          })}
        </ol>

        {isPanelOpen && (
          <div
            data-lenis-prevent
            onMouseEnter={handleMouseEnter}
            className="absolute top-1/2 left-12 max-h-[70vh] w-80 -translate-y-1/2 animate-in overflow-y-auto overscroll-contain rounded-2xl border border-border bg-accent p-5 shadow-2xl backdrop-blur-2xl duration-200 zoom-in-95 fade-in transition-opacity"
          >
            <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                <span>{label}</span>
              </div>
              <button
                type="button"
                aria-label="Close outline panel"
                onClick={() => setIsPanelOpen(false)}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-neutral-800 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <ol className="space-y-2 text-sm">
              {items.map((item) => {
                const isActive = item.id === activeId;
                const level = item.level ?? 2;
                const paddingClass =
                  level === 1 ? "pl-0" : level === 3 ? "pl-5" : "pl-2.5";

                return (
                  <li key={item.id} className={paddingClass}>
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => navigateToSection(event, item.id)}
                      className={cn(
                        "inline-block leading-relaxed transition-colors duration-150 hover:underline",
                        isActive
                          ? "font-semibold text-sky-600 underline dark:text-sky-600"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </nav>
  );
}
