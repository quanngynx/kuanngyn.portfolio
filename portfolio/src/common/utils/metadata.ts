import type { Metadata } from "next";
import { articleUrl } from "./url";
import { getPostLocales } from "../blog/content";
import { BASE_URL } from "../constants";
import { ArticlePageProps, resolvePost } from "../blog/resolve-post";

export async function generateMetadata(
  props: ArticlePageProps,
): Promise<Metadata> {
  const post = await resolvePost(props);
  const locales = await getPostLocales(post.slug);
  const canonical = articleUrl(post.locale, post.slug);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, articleUrl(locale, post.slug)]),
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