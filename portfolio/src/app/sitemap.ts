import type { MetadataRoute } from "next";

import { getAllPosts } from "@/common/blog/content";
import { BASE_URL, BLOG_PATH } from "@/common/constants";
import { routing } from "@/common/i18n/routes";
import { articlePath } from "@/common/utils/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      posts: await getAllPosts(locale),
    })),
  );

  const staticUrls: MetadataRoute.Sitemap = routing.locales.flatMap(
    (locale) => [
      {
        url: `${BASE_URL}/${locale}`,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${BASE_URL}/${locale}${BLOG_PATH}`,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ],
  );

  const articleUrls: MetadataRoute.Sitemap = postsByLocale.flatMap(
    ({ locale, posts }) =>
      posts.map((post) => ({
        url: `${BASE_URL}${articlePath(locale, post.slug, post.kind)}`,
        lastModified: post.updatedAt ?? post.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  );

  return [...staticUrls, ...articleUrls];
}
