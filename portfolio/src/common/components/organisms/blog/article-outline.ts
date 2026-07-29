export interface ArticleOutlineItem {
  id: string;
  title: string;
  excerpt?: string;
}

interface MdastNode {
  type: string;
  value?: string;
  depth?: number;
  children?: MdastNode[];
  data?: {
    hProperties?: Record<string, unknown>;
  };
}

interface MdastRoot extends MdastNode {
  type: "root";
  children: MdastNode[];
}

const MAX_EXCERPT_LENGTH = 180;

function plainText(node: MdastNode): string {
  if (
    (node.type === "text" || node.type === "inlineCode") &&
    typeof node.value === "string"
  ) {
    return node.value;
  }

  return node.children?.map(plainText).join("") ?? "";
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function headingSlug(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("đ", "d")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function uniqueId(baseId: string, usedIds: Set<string>): string {
  let id = baseId;
  let suffix = 2;

  while (usedIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
}

function excerptAfterHeading(
  children: MdastNode[],
  headingIndex: number,
): string | undefined {
  for (let index = headingIndex + 1; index < children.length; index += 1) {
    const node = children[index];

    if (node.type === "heading" && node.depth === 2) break;
    if (node.type !== "paragraph") continue;

    const excerpt = normalizeWhitespace(plainText(node));
    if (!excerpt) continue;

    if (excerpt.length <= MAX_EXCERPT_LENGTH) return excerpt;
    return `${excerpt.slice(0, MAX_EXCERPT_LENGTH - 1).trimEnd()}…`;
  }

  return undefined;
}

export function createArticleOutlineCollector(): {
  outline: ArticleOutlineItem[];
  remarkPlugin: () => (tree: MdastRoot) => void;
} {
  const outline: ArticleOutlineItem[] = [];

  return {
    outline,
    remarkPlugin() {
      return (tree) => {
        const usedIds = new Set<string>();

        tree.children.forEach((node, index) => {
          if (node.type !== "heading" || node.depth !== 2) return;

          const title = normalizeWhitespace(plainText(node));
          const baseId = headingSlug(title) || `section-${outline.length + 1}`;
          const id = uniqueId(baseId, usedIds);

          node.data ??= {};
          node.data.hProperties ??= {};
          node.data.hProperties.id = id;

          outline.push({
            id,
            title,
            excerpt: excerptAfterHeading(tree.children, index),
          });
        });
      };
    },
  };
}
