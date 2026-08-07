import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getCombinedPublishedPosts } from "@/common/blog/resolve-post";
import { filterPosts } from "@/common/blog/filters";
import { BlogFilterToolbar } from "@/common/components/organisms/blog/blog-filter-toolbar";
import { isSupportedLocale, type Locale } from "@/common/i18n/routes";
import { articlePath } from "@/common/utils/url";

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

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });
  return { title: t("title"), description: t("description") };
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
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

      <BlogFilterToolbar availableTags={availableTags} />

      {filteredPosts.length === 0 ? (
        <p className="mt-16 text-muted-foreground">{t("empty")}</p>
      ) : (
        <ol className="mt-12 divide-y divide-border">
          {filteredPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={articlePath(locale, post.slug, post.kind)}
                className="group block py-10 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt, locale)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>
                    {t("minuteRead", { minutes: post.readingMinutes })}
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight transition-opacity group-hover:opacity-65 md:text-4xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
                  {post.subtitle}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
