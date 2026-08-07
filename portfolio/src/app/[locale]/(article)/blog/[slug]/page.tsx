import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import { getPost as getLocalPost } from "@/common/blog/content";
import { parseBlogSlug } from "@/common/blog/content-schema";
import { getPageBySlug } from "@/common/blog/notion-posts";
import { getAdjacentPosts } from "@/common/blog/adjacent-posts";
import { getRelatedPosts } from "@/common/blog/related-posts";
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

  const isDraftMode = (await draftMode()).isEnabled;
  const [pageData, allPosts] = await Promise.all([
    getPageBySlug(slug, locale, { includeDrafts: isDraftMode }),
    getCombinedPublishedPosts(locale, isDraftMode),
  ]);

  if (pageData && pageData.generalInfo.kind === "blog") {
    const adjacent = getAdjacentPosts(slug, allPosts);
    const relatedPosts = getRelatedPosts(pageData.generalInfo, allPosts);

    return (
      <NotionContent
        generalInfo={pageData.generalInfo}
        blockTree={pageData.blockTree}
        adjacent={adjacent}
        relatedPosts={relatedPosts}
      />
    );
  }

  const localPost = await getLocalPost(locale, slug);

  if (localPost && localPost.kind === "blog") {
    const adjacent = getAdjacentPosts(slug, allPosts);
    const relatedPosts = getRelatedPosts(localPost, allPosts);

    return (
      <ArticlePageContent
        post={localPost}
        adjacent={adjacent}
        relatedPosts={relatedPosts}
      />
    );
  }

  notFound();
}
