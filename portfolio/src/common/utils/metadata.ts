import type { Metadata } from "next";
import { articleUrl } from "./url";
import { getPostLocales } from "../blog/content";
import type { BlogPost } from "../blog/content-schema";
import { BASE_URL } from "../constants";

export async function generateArticleMetadata(
  post: BlogPost,
): Promise<Metadata> {
  const locales = await getPostLocales(post.slug, post.kind);
  const canonical = articleUrl(post.locale, post.slug, post.kind);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          articleUrl(locale, post.slug, post.kind),
        ]),
      ),
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.description,
      publishedTime: new Date(
        `${post.publishedAt}T00:00:00.000Z`,
      ).toISOString(),
      modifiedTime: post.updatedAt
        ? new Date(`${post.updatedAt}T00:00:00.000Z`).toISOString()
        : undefined,
      images:
        post.image && post.imageAlt
          ? [
              {
                url: new URL(post.image, BASE_URL).toString(),
                alt: post.imageAlt,
              },
            ]
          : undefined,
    },
  };
}
