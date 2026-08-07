import type { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { NotionBlockNode } from "./notion-types";
import type { ArticleOutlineItem } from "@/common/components/organisms/blog/article-outline";

function isFullBlock(
  block: BlockObjectResponse | PartialBlockObjectResponse,
): block is BlockObjectResponse {
  return "type" in block && block.type !== "unsupported";
}

export function richTextToPlainText(richText: RichTextItemResponse[]): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText.map((item) => item.plain_text || "").join("");
}

const SKIP_CHILD_FETCH = new Set([
  "child_page",
  "child_database",
  "column",
  "column_list",
]);

export async function fetchAllChildBlocks(
  client: Client,
  blockId: string,
): Promise<BlockObjectResponse[]> {
  const results: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    for (const child of response.results) {
      if (isFullBlock(child)) {
        results.push(child);
      }
    }

    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return results;
}

export async function fetchPageBlockTree(
  client: Client,
  pageId: string,
): Promise<NotionBlockNode[]> {
  async function buildTree(blockId: string): Promise<NotionBlockNode[]> {
    const children = await fetchAllChildBlocks(client, blockId);
    const nodes: NotionBlockNode[] = [];

    for (const child of children) {
      if (child.type === "child_page" || child.type === "child_database")
        continue;

      let grandChildren: NotionBlockNode[] = [];
      if (child.has_children && !SKIP_CHILD_FETCH.has(child.type)) {
        grandChildren = await buildTree(child.id);
      }

      nodes.push({
        block: child,
        children: grandChildren,
      });
    }

    return nodes;
  }

  return buildTree(pageId);
}

export function generateHeadingSlug(
  text: string,
  existingSlugs: Map<string, number>,
): string {
  const baseSlug =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "heading";

  const count = existingSlugs.get(baseSlug) || 0;
  existingSlugs.set(baseSlug, count + 1);

  return count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
}

export function extractNotionOutline(
  nodes: NotionBlockNode[],
): ArticleOutlineItem[] {
  const outline: ArticleOutlineItem[] = [];
  const existingSlugs = new Map<string, number>();

  function walk(tree: NotionBlockNode[]) {
    for (let i = 0; i < tree.length; i += 1) {
      const { block, children } = tree[i];
      let level: number | null = null;
      let richText: RichTextItemResponse[] | null = null;

      if (block.type === "heading_1") {
        level = 1;
        richText = block.heading_1.rich_text;
      } else if (block.type === "heading_2") {
        level = 2;
        richText = block.heading_2.rich_text;
      } else if (block.type === "heading_3") {
        level = 3;
        richText = block.heading_3.rich_text;
      }

      if (level !== null && richText) {
        const title = richTextToPlainText(richText);
        if (title.trim()) {
          const id = generateHeadingSlug(title, existingSlugs);

          let excerpt: string | undefined;
          for (let j = i + 1; j < tree.length; j += 1) {
            const nextBlock = tree[j].block;
            if (nextBlock.type.startsWith("heading_")) break;
            if (nextBlock.type === "paragraph") {
              const text = richTextToPlainText(nextBlock.paragraph.rich_text);
              if (text.trim()) {
                excerpt =
                  text.length > 180 ? `${text.slice(0, 179).trimEnd()}…` : text;
                break;
              }
            }
          }

          outline.push({ id, title, level, excerpt });
        }
      }

      if (children && children.length > 0) {
        walk(children);
      }
    }
  }

  walk(nodes);
  return outline;
}

export function calculateNotionReadingStats(
  nodes: NotionBlockNode[],
): { wordCount: number; sectionCount: number; readingMinutes: number } {
  let sectionCount = 0;
  const textParts: string[] = [];

  function extractText(tree: NotionBlockNode[]) {
    for (const node of tree) {
      const b = node.block;
      if (
        b.type === "heading_1" ||
        b.type === "heading_2" ||
        b.type === "heading_3"
      ) {
        sectionCount += 1;
      }

      let richText: RichTextItemResponse[] | undefined;

      switch (b.type) {
        case "paragraph":
          richText = b.paragraph.rich_text;
          break;
        case "heading_1":
          richText = b.heading_1.rich_text;
          break;
        case "heading_2":
          richText = b.heading_2.rich_text;
          break;
        case "heading_3":
          richText = b.heading_3.rich_text;
          break;
        case "bulleted_list_item":
          richText = b.bulleted_list_item.rich_text;
          break;
        case "numbered_list_item":
          richText = b.numbered_list_item.rich_text;
          break;
        case "callout":
          richText = b.callout.rich_text;
          break;
        case "quote":
          richText = b.quote.rich_text;
          break;
        case "code":
          richText = b.code.rich_text;
          break;
        case "to_do":
          richText = b.to_do.rich_text;
          break;
        case "toggle":
          richText = b.toggle.rich_text;
          break;
      }

      if (richText) {
        const text = richTextToPlainText(richText);
        if (text.trim()) {
          textParts.push(text.trim());
        }
      }

      if (node.children && node.children.length > 0) {
        extractText(node.children);
      }
    }
  }

  extractText(nodes);

  const fullText = textParts.join(" ");
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/u).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    sectionCount,
    readingMinutes,
  };
}
