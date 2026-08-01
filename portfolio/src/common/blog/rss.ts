import type { Locale } from "@/common/i18n/routes";

export interface RssFeedPost {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
}

function escapeXml(value: string): string {
  return value.replace(
    /[&<>"']/gu,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
}

function rssDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toUTCString();
}

export function renderRssFeed(
  posts: readonly RssFeedPost[],
  siteUrl: string,
): string {
  const baseUrl = new URL(siteUrl).toString().replace(/\/$/u, "");
  const sortedPosts = [...posts].sort((a, b) =>
    (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt),
  );
  const lastBuildDate = sortedPosts[0]
    ? rssDate(sortedPosts[0].updatedAt ?? sortedPosts[0].publishedAt)
    : undefined;
  const items = sortedPosts.map((post) => {
    const url = `${baseUrl}/${post.locale}/blog/${post.slug}`;

    return [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <description>${escapeXml(post.description)}</description>`,
      `      <pubDate>${rssDate(post.publishedAt)}</pubDate>`,
      "    </item>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Quanngynx Blog</title>",
    `    <link>${escapeXml(baseUrl)}</link>`,
    "    <description>Software engineering, architecture, and project notes.</description>",
    ...(lastBuildDate
      ? [`    <lastBuildDate>${lastBuildDate}</lastBuildDate>`]
      : []),
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
