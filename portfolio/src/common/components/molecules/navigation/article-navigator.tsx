"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

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
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
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

    headings.forEach((heading) => observer.observe(heading));
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

  const navigateToSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();

      const hash = `#${id}`;
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }

      scrollToHeading(id);
    },
    [scrollToHeading],
  );

  if (items.length < 2) return null;

  return (
    <nav
      aria-label={label}
      className="fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const accessibleTitle = item.title || item.id;

          return (
            <li key={item.id}>
              <HoverCard
                open={previewId === item.id}
                onOpenChange={(open) => setPreviewId(open ? item.id : null)}
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
                        if (document.activeElement === trigger) {
                          setPreviewId(item.id);
                        }
                      });
                    }}
                    onBlur={() => setPreviewId(null)}
                    className="group flex h-3 w-10 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
    </nav>
  );
}
