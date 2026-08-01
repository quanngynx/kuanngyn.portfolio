import { notFound } from "next/navigation";
import { isSupportedLocale } from "../i18n/routes";
import { getPost } from "./content";
import { parseBlogSlug } from "./content-schema";

export interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function resolvePost({ params }: ArticlePageProps) {
  const { locale, slug: rawSlug } = await params;
  const slug = parseBlogSlug(rawSlug);

  if (!isSupportedLocale(locale) || !slug) notFound();

  const post = await getPost(locale, slug);
  if (!post) notFound();

  return post;
}