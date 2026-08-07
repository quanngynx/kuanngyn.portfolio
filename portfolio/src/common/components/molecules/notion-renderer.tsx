import { Lightbulb } from "lucide-react";
import type { NotionBlockNode } from "@/common/blog/notion-types";
import {
  richTextToPlainText,
  generateHeadingSlug,
} from "@/common/blog/notion-blocks";
import { NotionRichText } from "./notion-rich-text";
import { NotionHeading } from "./notion-heading";
import { NotionCodeBlock } from "./notion-code-block";
import { NotionRevealAnswer } from "./notion-reveal-answer";
import { NotionTableOfContents } from "./notion-table-of-contents";

interface Props {
  nodes: NotionBlockNode[];
}

function groupListNodes(
  nodes: NotionBlockNode[],
): Array<
  | NotionBlockNode
  | { type: "bulleted_list" | "numbered_list"; items: NotionBlockNode[] }
> {
  const result: Array<
    | NotionBlockNode
    | { type: "bulleted_list" | "numbered_list"; items: NotionBlockNode[] }
  > = [];
  let currentGroup: {
    type: "bulleted_list" | "numbered_list";
    items: NotionBlockNode[];
  } | null = null;

  for (const node of nodes) {
    const type = node.block.type;
    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const groupType =
        type === "bulleted_list_item" ? "bulleted_list" : "numbered_list";
      if (currentGroup && currentGroup.type === groupType) {
        currentGroup.items.push(node);
      } else {
        if (currentGroup) result.push(currentGroup);
        currentGroup = { type: groupType, items: [node] };
      }
    } else {
      if (currentGroup) {
        result.push(currentGroup);
        currentGroup = null;
      }
      result.push(node);
    }
  }

  if (currentGroup) result.push(currentGroup);
  return result;
}

export async function NotionRenderer({ nodes }: Props) {
  if (!nodes || !nodes.length) return null;

  const headingSlugs = new Map<string, number>();
  const groupedNodes = groupListNodes(nodes);

  return (
    <div className="space-y-4 leading-relaxed">
      {groupedNodes.map((item, idx) => {
        if ("items" in item) {
          const Tag = item.type === "bulleted_list" ? "ul" : "ol";
          const listClass =
            item.type === "bulleted_list" ? "list-disc" : "list-decimal";
          return (
            <Tag
              key={`list-${idx}`}
              className={`my-4 space-y-2 pl-6 ${listClass}`}
            >
              {item.items.map((node) => (
                <li key={node.block.id}>
                  {node.block.type === "bulleted_list_item" && (
                    <NotionRichText
                      richText={node.block.bulleted_list_item.rich_text}
                    />
                  )}
                  {node.block.type === "numbered_list_item" && (
                    <NotionRichText
                      richText={node.block.numbered_list_item.rich_text}
                    />
                  )}
                  {node.children && node.children.length > 0 && (
                    <NotionRenderer nodes={node.children} />
                  )}
                </li>
              ))}
            </Tag>
          );
        }

        const node = item;
        const block = node.block;

        switch (block.type) {
          case "paragraph": {
            if (!block.paragraph.rich_text.length)
              return <div key={block.id} className="h-4" />;
            return (
              <p key={block.id} className="my-3">
                <NotionRichText richText={block.paragraph.rich_text} />
              </p>
            );
          }

          case "heading_1": {
            const text = richTextToPlainText(block.heading_1.rich_text);
            const slug = generateHeadingSlug(text, headingSlugs);
            return (
              <NotionHeading
                key={block.id}
                level={1}
                richText={block.heading_1.rich_text}
                slug={slug}
              />
            );
          }

          case "heading_2": {
            const text = richTextToPlainText(block.heading_2.rich_text);
            const slug = generateHeadingSlug(text, headingSlugs);
            return (
              <NotionHeading
                key={block.id}
                level={2}
                richText={block.heading_2.rich_text}
                slug={slug}
              />
            );
          }

          case "heading_3": {
            const text = richTextToPlainText(block.heading_3.rich_text);
            const slug = generateHeadingSlug(text, headingSlugs);
            return (
              <NotionHeading
                key={block.id}
                level={3}
                richText={block.heading_3.rich_text}
                slug={slug}
              />
            );
          }

          case "code": {
            const codeText = richTextToPlainText(block.code.rich_text);
            return (
              <NotionCodeBlock
                key={block.id}
                code={codeText}
                language={block.code.language}
              />
            );
          }

          case "toggle": {
            return (
              <NotionRevealAnswer
                key={block.id}
                richText={block.toggle.rich_text}
              >
                {node.children && node.children.length > 0 && (
                  <NotionRenderer nodes={node.children} />
                )}
              </NotionRevealAnswer>
            );
          }

          case "quote": {
            return (
              <blockquote
                key={block.id}
                className="my-4 border-l-4 border-amber-500/60 pl-4 text-neutral-200 italic"
              >
                <NotionRichText richText={block.quote.rich_text} />
              </blockquote>
            );
          }

          case "callout": {
            const icon = block.callout.icon;
            const emoji = icon?.type === "emoji" ? icon.emoji : null;
            return (
              <div
                key={block.id}
                className="flex items-start gap-3 rounded-lg border border-muted-foreground/20 bg-muted-foreground/20 p-4"
              >
                {emoji ? (
                  <span className="text-xl">{emoji}</span>
                ) : (
                  <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                )}
                <div className="flex-1">
                  <NotionRichText richText={block.callout.rich_text} />
                </div>
              </div>
            );
          }

          case "divider": {
            return (
              <hr key={block.id} className="my-6 border-muted-foreground/40" />
            );
          }

          case "to_do": {
            return (
              <div key={block.id} className="my-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  disabled
                  checked={block.to_do.checked}
                  className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-amber-500"
                />
                <span
                  className={
                    block.to_do.checked ? "text-neutral-500 line-through" : ""
                  }
                >
                  <NotionRichText richText={block.to_do.rich_text} />
                </span>
              </div>
            );
          }

          case "image": {
            const src =
              block.image.type === "external"
                ? block.image.external.url
                : block.image.file.url;
            const caption = richTextToPlainText(block.image.caption);
            return (
              <figure key={block.id} className="my-6">
                <img
                  src={src}
                  alt={caption || "Notion post image"}
                  className="w-full rounded-xl border border-neutral-800 object-cover"
                  loading="lazy"
                />
                {caption && (
                  <figcaption className="mt-2 text-center text-xs text-neutral-500">
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "bookmark": {
            return (
              <div
                key={block.id}
                className="my-4 rounded-lg border border-neutral-800 p-4 hover:border-neutral-700"
              >
                <a
                  href={block.bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-400 underline"
                >
                  {block.bookmark.url}
                </a>
              </div>
            );
          }

          case "table_of_contents": {
            return <NotionTableOfContents key={block.id} nodes={nodes} />;
          }

          default: {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                `Unsupported Notion block type: ${block.type}`,
                block.id,
              );
            }
            return null;
          }
        }
      })}
    </div>
  );
}
