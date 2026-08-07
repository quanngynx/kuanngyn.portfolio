import React from "react";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionRichText } from "./notion-rich-text";

interface Props {
  richText: RichTextItemResponse[];
  children?: React.ReactNode;
}

export function NotionRevealAnswer({ richText, children }: Props) {
  return (
    <details className="group my-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-colors">
      <summary className="cursor-pointer rounded font-medium text-neutral-200 focus:ring-2 focus:ring-neutral-500 focus:outline-none">
        <NotionRichText richText={richText} />
      </summary>
      <div className="mt-3 border-l-2 border-neutral-800 pl-4 text-neutral-300">
        {children}
      </div>
    </details>
  );
}
