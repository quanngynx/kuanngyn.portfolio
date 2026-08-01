
import Link from "next/link";

import { getAllPosts, getPostLocales } from "@/common/blog/content";
import { MdxRenderer } from "@/common/components/organisms/blog/mdx-renderer";
import { routing } from "@/common/i18n/routes";
import { articleUrl } from "@/common/utils/url";
import { ArticlePageProps, resolvePost } from "@/common/blog/resolve-post";
import { generateMetadata as generateMetadataUtils } from "@/common/utils/metadata";
import { formatDate } from "@/common/utils/time";

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateMetadata(props: ArticlePageProps) {
  return generateMetadataUtils(props);
}

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

export default async function ArticlePage(props: ArticlePageProps) {
  const post = await resolvePost(props);
  const locales = await getPostLocales(post.slug);
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
        {locales.length > 1 && (
          <nav
            aria-label={
              post.locale === "vi"
                ? "Bản dịch hiện có"
                : "Available translations"
            }
            className="mb-8 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase"
          >
            {locales.map((locale) =>
              locale === post.locale ? (
                <span
                  key={locale}
                  aria-current="page"
                  className="rounded-full bg-foreground px-3 py-1.5 text-background"
                >
                  {locale}
                </span>
              ) : (
                <Link
                  key={locale}
                  href={`/${locale}/blog/${post.slug}`}
                  className="rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {locale}
                </Link>
              ),
            )}
          </nav>
        )}
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
