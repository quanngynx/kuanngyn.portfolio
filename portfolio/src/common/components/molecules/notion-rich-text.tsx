import React from "react";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import type { NotionLinkOverrides } from "@/common/blog/notion-types";

interface Props {
  richText: RichTextItemResponse[];
  linkOverrides?: NotionLinkOverrides;
}

function normalizeNotionId(value: string): string {
  return value.replace(/-/g, "").toLowerCase();
}

export function NotionRichText({ richText, linkOverrides }: Props) {
  if (!richText || !richText.length) return null;

  return (
    <>
      {richText.map((item, idx) => {
        const pageId =
          item.type === "mention" && item.mention.type === "page"
            ? normalizeNotionId(item.mention.page.id)
            : undefined;
        const linkOverride = pageId ? linkOverrides?.[pageId] : undefined;
        const { annotations } = item;
        const href = linkOverride ? linkOverride.href : item.href;
        const text = linkOverride?.label || item.plain_text;
        let content: React.ReactNode = text;

        if (annotations.bold) {
          content = <strong>{content}</strong>;
        }
        if (annotations.italic) {
          content = <em>{content}</em>;
        }
        if (annotations.strikethrough) {
          content = <del>{content}</del>;
        }
        if (annotations.underline) {
          content = <u>{content}</u>;
        }
        if (annotations.code) {
          content = (
            <code className="rounded bg-accent-foreground px-1.5 py-0.5 font-mono text-sm text-amber-400 dark:text-amber-600">
              {content}
            </code>
          );
        }
        if (href) {
          content = (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline-offset-4 hover:text-muted-foreground/60 hover:underline"
            >
              {content}
            </a>
          );
        }

        const key = `rt-${idx}-${item.plain_text.slice(0, 20)}`;
        return <React.Fragment key={key}>{content}</React.Fragment>;
      })}
    </>
  );
}
