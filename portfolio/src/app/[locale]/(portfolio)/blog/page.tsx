import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getAllPosts } from "@/common/blog/content";
import { isSupportedLocale, type Locale } from "@/common/i18n/routes";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
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

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const [posts, t] = await Promise.all([
    getAllPosts(locale),
    getTranslations({ locale, namespace: "Blog" }),
  ]);

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

      {posts.length === 0 ? (
        <p className="mt-16 text-muted-foreground">{t("empty")}</p>
      ) : (
        <ol className="mt-16 divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
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
