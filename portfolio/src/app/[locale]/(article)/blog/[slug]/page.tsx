import { notFound } from "next/navigation";

import { getPost as getLocalPost } from "@/common/blog/content";
import { parseBlogSlug } from "@/common/blog/content-schema";
import { getPageBySlug } from "@/common/blog/notion-posts";
import {
  ArticlePageProps,
  getCombinedPublishedPosts,
  resolvePost,
} from "@/common/blog/resolve-post";
import { ArticlePageContent } from "@/common/components/organisms/blog/article-page-content";
import { NotionContent } from "@/common/components/organisms/notion-content";
import { isSupportedLocale, routing } from "@/common/i18n/routes";
import { generateArticleMetadata } from "@/common/utils/metadata";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata(props: ArticlePageProps) {
  const post = await resolvePost(props);
  return generateArticleMetadata(post);
}

export async function generateStaticParams() {
  const postsByLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      posts: await getCombinedPublishedPosts(locale),
    })),
  );

  return postsByLocale.flatMap(({ locale, posts }) =>
    posts.flatMap((post) =>
      post.kind === "blog" ? [{ locale, slug: post.slug }] : [],
    ),
  );
}

export default async function BlogArticlePage(props: ArticlePageProps) {
  const { locale, slug: rawSlug } = await props.params;
  const slug = parseBlogSlug(rawSlug);

  if (!isSupportedLocale(locale) || !slug) {
    notFound();
  }

  const pageData = await getPageBySlug(slug, locale);

  if (pageData && pageData.generalInfo.kind === "blog") {
    return (
      <NotionContent
        generalInfo={pageData.generalInfo}
        blockTree={pageData.blockTree}
      />
    );
  }

  const localPost = await getLocalPost(locale, slug);

  if (localPost && localPost.kind === "blog") {
    return <ArticlePageContent post={localPost} />;
  }

  notFound();
}
