import { cache } from "react";
import { notFound } from "next/navigation";
import { isSupportedLocale, type Locale } from "../i18n/routes";
import {
  getAllPosts as getAllLocalPosts,
  getPost as getLocalPost,
} from "./content";
import {
  getAllPublishedPosts as getAllNotionPosts,
  getPostGeneralInfoBySlug,
} from "./notion-posts";
import { parseBlogSlug, type BlogPost } from "./content-schema";

export interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const getCombinedPublishedPosts = cache(
  async (locale: Locale = "en"): Promise<BlogPost[]> => {
    const [notionPosts, localPosts] = await Promise.all([
      getAllNotionPosts(locale),
      getAllLocalPosts(locale),
    ]);

    const notionSlugs = new Set(notionPosts.map((post) => post.slug));
    const uniqueLocalPosts = localPosts.filter(
      (post) => !notionSlugs.has(post.slug),
    );

    const combined = [...notionPosts, ...uniqueLocalPosts];
    return combined.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
);

export async function resolvePost({ params }: ArticlePageProps) {
  const { locale, slug: rawSlug } = await params;
  const slug = parseBlogSlug(rawSlug);

  if (!isSupportedLocale(locale) || !slug) notFound();

  const notionPost = await getPostGeneralInfoBySlug(slug, locale);
  if (notionPost) return notionPost;

  const localPost = await getLocalPost(locale, slug);
  if (!localPost) notFound();

  return localPost;
}
