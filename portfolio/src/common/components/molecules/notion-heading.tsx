import React from "react";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionRichText } from "./notion-rich-text";

interface Props {
  level: 1 | 2 | 3;
  richText: RichTextItemResponse[];
  slug: string;
}

const LEVEL_STYLES = {
  1: "text-3xl font-bold tracking-tight mt-10 mb-4 border-b border-neutral-800 pb-2",
  2: "text-2xl font-semibold tracking-tight mt-8 mb-3",
  3: "text-xl font-medium tracking-tight text-muted-foreground mt-6 mb-2",
} as const;

export function NotionHeading({ level, richText, slug }: Props) {
  const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";

  return (
    <Tag
      id={slug}
      className={`group relative scroll-mt-20 ${LEVEL_STYLES[level]}`}
    >
      <a
        href={`#${slug}`}
        aria-label={`Link to section ${slug}`}
        className="absolute -left-5 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
      >
        #
      </a>
      <NotionRichText richText={richText} />
    </Tag>
  );
}
