import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { filterPosts } from "@/common/blog/filters";
import { getCombinedPublishedPosts } from "@/common/blog/resolve-post";
import { AnimatedBlogList } from "@/common/components/organisms/blog/animated-blog-list";
import { BlogFilterToolbar } from "@/common/components/organisms/blog/blog-filter-toolbar";
import { isSupportedLocale } from "@/common/i18n/routes";

export const revalidate = 300;

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    kind?: string;
    sort?: "newest" | "oldest";
    q?: string;
    tag?: string | string[];
  }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });
  return { title: t("title"), description: t("description") };
}

export default async function BlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const sp = (await searchParams) || {};
  const kind = sp.kind || "all";
  const sort = (sp.sort as "newest" | "oldest") || "newest";
  const query = sp.q || "";
  const rawTags = sp.tag;
  const tags = Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : [];

  const [posts, t] = await Promise.all([
    getCombinedPublishedPosts(locale),
    getTranslations({ locale, namespace: "Blog" }),
  ]);

  const availableTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || [])),
  ).sort();

  const filteredPosts = filterPosts(posts, {
    kind,
    sort,
    query,
    tags,
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-container pt-36 pb-24 md:pt-48 md:pb-32">
      <header className="max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("description")}
        </p>
      </header>

      <Suspense fallback={<div className="mt-8 mb-4 h-20 rounded-2xl border border-border bg-card/40" />}>
        <BlogFilterToolbar availableTags={availableTags} />
      </Suspense>

      <AnimatedBlogList posts={filteredPosts} locale={locale} />
    </main>
  );
}
