import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import { getPost as getLocalPost } from "@/common/blog/content";
import { parseBlogSlug } from "@/common/blog/content-schema";
import { getPageBySlug } from "@/common/blog/notion-posts";
import { getSeriesPageBySlug } from "@/common/blog/notion-series";
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
  const { locale, slug: rawSlug } = await props.params;
  const slug = parseBlogSlug(rawSlug);

  if (isSupportedLocale(locale) && slug) {
    const series = await getSeriesPageBySlug(slug, locale);
    if (series) return generateArticleMetadata(series.generalInfo);
  }

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

  const articleParams = postsByLocale.flatMap(({ locale, posts }) =>
    posts.flatMap((post) =>
      post.kind === "case-study" ? [{ locale, slug: post.slug }] : [],
    ),
  );

  const servexaSeries = await getSeriesPageBySlug(
    "engineering-servexa-warranty-ai",
    "en",
  );

  return servexaSeries
    ? [...articleParams, { locale: "en", slug: servexaSeries.generalInfo.slug }]
    : articleParams;
}

export default async function CaseStudyPage(props: ArticlePageProps) {
  const { locale, slug: rawSlug } = await props.params;
  const slug = parseBlogSlug(rawSlug);

  if (!isSupportedLocale(locale) || !slug) {
    notFound();
  }

  const isDraftMode = (await draftMode()).isEnabled;
  const [seriesData, pageData, allPosts] = await Promise.all([
    getSeriesPageBySlug(slug, locale),
    getPageBySlug(slug, locale, { includeDrafts: isDraftMode }),
    getCombinedPublishedPosts(locale, isDraftMode),
  ]);

  if (seriesData) {
    return (
      <NotionContent
        generalInfo={seriesData.generalInfo}
        blockTree={seriesData.blockTree}
        linkOverrides={seriesData.linkOverrides}
        seriesStatus={seriesData.status}
      />
    );
  }

  if (pageData && pageData.generalInfo.kind === "case-study") {
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

  if (localPost && localPost.kind === "case-study") {
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
