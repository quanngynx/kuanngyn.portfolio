import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPosts, getPost, getPostLocales } from "@/common/blog/content";
import { parseBlogSlug } from "@/common/blog/content-schema";
import { MdxRenderer } from "@/common/components/organisms/blog/mdx-renderer";
import { BASE_URL } from "@/common/constants";
import { isSupportedLocale, routing, type Locale } from "@/common/i18n/routes";

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const postsByLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      posts: await getAllPosts(locale),
    })),
  );

  return postsByLocale.flatMap(({ locale, posts }) =>
    posts.map((post) => ({ locale, slug: post.slug })),
  );
}

function articleUrl(locale: Locale, slug: string): string {
  return `${BASE_URL}/${locale}/blog/${slug}`;
}

async function resolvePost({ params }: ArticlePageProps) {
  const { locale, slug: rawSlug } = await params;
  const slug = parseBlogSlug(rawSlug);

  if (!isSupportedLocale(locale) || !slug) notFound();

  const post = await getPost(locale, slug);
  if (!post) notFound();

  return post;
}

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

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export default async function ArticlePage(props: ArticlePageProps) {
  const post = await resolvePost(props);
  const canonicalUrl = articleUrl(post.locale, post.slug);

  return (
    <article className="article-content mx-auto max-w-180">
      <Link
        href={`/${post.locale}/blog`}
        className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        ← {post.locale === "vi" ? "Bài viết" : "Blog"}
      </Link>

      <header className="pt-16 pb-14 md:pt-24 md:pb-20">
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">
          {post.title}
        </h1>
        <p className="mt-6 text-xl leading-8 text-muted-foreground md:text-2xl">
          {post.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt, post.locale)}
          </time>
          {post.updatedAt && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.updatedAt}>
                {post.locale === "vi" ? "Cập nhật" : "Updated"}{" "}
                {formatDate(post.updatedAt, post.locale)}
              </time>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>
            {post.readingMinutes}{" "}
            {post.locale === "vi" ? "phút đọc" : "min read"}
          </span>
        </div>
      </header>

      <MdxRenderer
        locale={post.locale}
        source={post.body}
        sourcePath={post.sourcePath}
        articleUrl={canonicalUrl}
        articleTitle={post.title}
      />
    </article>
  );
}
