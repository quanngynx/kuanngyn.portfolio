"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AlignLeft } from "lucide-react";
import { extractNotionOutline } from "@/common/blog/notion-blocks";
import type { NotionBlockNode } from "@/common/blog/notion-types";
import { useLenis } from "@/common/providers/smooth-scroll-provider";
import { cn } from "@/common/utils/ui";

interface Props {
  nodes: NotionBlockNode[];
}

function currentHeadingId(itemIds: string[]): string {
  if (typeof window === "undefined") return itemIds[0] ?? "";
  const threshold = window.innerHeight * 0.3;
  let currentId = itemIds[0] ?? "";

  for (const id of itemIds) {
    const heading = document.getElementById(id);
    if (!heading || heading.getBoundingClientRect().top > threshold) break;
    currentId = id;
  }

  return currentId;
}

export function NotionTableOfContents({ nodes }: Props) {
  const items = extractNotionOutline(nodes);
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const itemIds = items.map((item) => item.id);

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
        itemIds.includes(hashId) ? hashId : currentHeadingId(itemIds),
      );
    });

    const observer = new IntersectionObserver(
      () => {
        setActiveId(currentHeadingId(itemIds));
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const id of itemIds) {
      const heading = document.getElementById(id);
      if (heading) observer.observe(heading);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [itemIds]);

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }
    scrollToHeading(id);
  };

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of Contents"
      className="my-6 rounded-2xl border border-border p-6"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        <AlignLeft className="h-4 w-4 text-muted-foreground" />
        <span>Table of Contents</span>
      </div>

      <ol className="space-y-2.5 text-sm">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const level = item.level ?? 2;
          const paddingClass =
            level === 1 ? "pl-0" : level === 3 ? "pl-6" : "pl-3";

          return (
            <li key={item.id} className={paddingClass}>
              <a
                href={`#${item.id}`}
                onClick={(event) => handleNavigate(event, item.id)}
                className={cn(
                  "inline-block leading-relaxed transition-colors duration-150 hover:underline",
                  isActive
                    ? "font-semibold text-sky-600 dark:text-sky-600"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
