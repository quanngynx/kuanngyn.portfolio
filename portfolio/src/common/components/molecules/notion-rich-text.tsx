import React from "react";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  richText: RichTextItemResponse[];
}

export function NotionRichText({ richText }: Props) {
  if (!richText || !richText.length) return null;

  return (
    <>
      {richText.map((item, idx) => {
        const { annotations, href, plain_text: text } = item;
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
            <code className="rounded bg-neutral-800/60 px-1.5 py-0.5 font-mono text-sm text-amber-400">
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
              className="text-neutral-200 underline underline-offset-4 hover:text-white"
            >
              {content}
            </a>
          );
        }

        return <React.Fragment key={idx}>{content}</React.Fragment>;
      })}
    </>
  );
}
