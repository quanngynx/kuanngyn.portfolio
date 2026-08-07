import type { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { NotionBlockNode } from "./notion-types";

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
