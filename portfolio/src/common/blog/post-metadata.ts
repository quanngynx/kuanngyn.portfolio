import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { BlogPost, BlogPostFrontmatter, BlogSlug } from "./content-schema";
import { estimateReadingMinutes, parseBlogSlug } from "./content-schema";
import { calculateReadingStats } from "./reading-stats";
import type { Locale } from "../i18n/routes";

export const NOTION_POST_PROPERTIES = {
  title: "Title",
  titleFallback: "Title ",
  subtitle: "Subtitle",
  slug: "Slug",
  status: "Status",
  description: "Description",
  media: "PresentativeMedia",
  tags: "Tags",
  author: "Author",
  publishedAt: "PublishedAt",
  updatedAt: "UpdatedAt",
} as const;

function extractPlainText(property: unknown): string {
  if (!property || typeof property !== "object") return "";

  if ("title" in property && Array.isArray(property.title)) {
    return property.title.map((item) => item.plain_text || "").join("");
  }
  if ("rich_text" in property && Array.isArray(property.rich_text)) {
    return property.rich_text.map((item) => item.plain_text || "").join("");
  }
  return "";
}

function extractStatus(property: unknown): string {
  if (
    property &&
    typeof property === "object" &&
    "status" in property &&
    property.status
  ) {
    const statusObj = property.status as { name?: string };
    return statusObj.name || "";
  }
  return "";
}

function extractDate(property: unknown): string | undefined {
  if (
    property &&
    typeof property === "object" &&
    "date" in property &&
    property.date
  ) {
    const dateObj = property.date as { start?: string };
    return dateObj.start || undefined;
  }
  return undefined;
}

function extractTags(property: unknown): string[] {
  if (
    property &&
    typeof property === "object" &&
    "multi_select" in property &&
    Array.isArray(property.multi_select)
  ) {
    return property.multi_select.map((tag: { name: string }) => tag.name);
  }
  return [];
}

function extractMediaUrl(property: unknown): string | undefined {
  if (
    property &&
    typeof property === "object" &&
    "files" in property &&
    Array.isArray(property.files) &&
    property.files.length > 0
  ) {
    const firstFile = property.files[0];
    if (firstFile.type === "external" && firstFile.external) {
      return firstFile.external.url;
    }
    if (firstFile.type === "file" && firstFile.file) {
      return firstFile.file.url;
    }
  }
  return undefined;
}

export function parsePostMetadata(
  page: PageObjectResponse,
  locale: Locale = "en",
  bodyText = "",
): BlogPost {
  const props = page.properties;

  const rawTitle =
    extractPlainText(props[NOTION_POST_PROPERTIES.title]) ||
    extractPlainText(props[NOTION_POST_PROPERTIES.titleFallback]);

  const subtitle = extractPlainText(props[NOTION_POST_PROPERTIES.subtitle]);
  const rawSlug = extractPlainText(props[NOTION_POST_PROPERTIES.slug]);
  const status = extractStatus(props[NOTION_POST_PROPERTIES.status]);
  const description = extractPlainText(
    props[NOTION_POST_PROPERTIES.description],
  );
  const author =
    extractPlainText(props[NOTION_POST_PROPERTIES.author]) || "Kuan Nguyen";
  const publishedAt =
    extractDate(props[NOTION_POST_PROPERTIES.publishedAt]) ||
    new Date(page.created_time).toISOString().slice(0, 10);
  const updatedAt = extractDate(props[NOTION_POST_PROPERTIES.updatedAt]);
  const tags = extractTags(props[NOTION_POST_PROPERTIES.tags]);
  const image = extractMediaUrl(props[NOTION_POST_PROPERTIES.media]);

  const parsedSlug =
    parseBlogSlug(rawSlug) ||
    parseBlogSlug(page.id) ||
    (("post-" + page.id.slice(0, 8)) as BlogSlug);
  const isDraft = status !== "Done";
  const kind = tags.some(
    (t) => t.toLowerCase().trim().replace(/\s+/g, "-") === "case-study",
  )
    ? "case-study"
    : "blog";

  const frontmatter: BlogPostFrontmatter = {
    kind,
    title: rawTitle || "Untitled Post",
    subtitle: subtitle || rawTitle || "Untitled Post",
    description: description || subtitle || rawTitle || "",
    author,
    publishedAt,
    updatedAt,
    image,
    imageAlt: image ? `${rawTitle} cover` : undefined,
    draft: isDraft,
  };

  return {
    ...frontmatter,
    slug: parsedSlug,
    locale,
    tags,
    body: bodyText,
    readingMinutes: estimateReadingMinutes(bodyText),
    readingStats: calculateReadingStats(bodyText),
    sourcePath: `notion://${page.id}`,
  };
}

export function checkForDuplicateSlugs(posts: BlogPost[]): void {
  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.slug)) {
      throw new Error(`Duplicate Notion blog slug detected: "${post.slug}"`);
    }
    seen.add(post.slug);
  }
}
