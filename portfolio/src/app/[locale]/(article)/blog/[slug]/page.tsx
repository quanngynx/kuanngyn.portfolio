import { notFound } from "next/navigation";

import { getAllPosts } from "@/common/blog/content";
import { ArticlePageProps, resolvePost } from "@/common/blog/resolve-post";
import { ArticlePageContent } from "@/common/components/organisms/blog/article-page-content";
import { routing } from "@/common/i18n/routes";
import { generateArticleMetadata } from "@/common/utils/metadata";

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateMetadata(props: ArticlePageProps) {
  return generateArticleMetadata(await resolvePost(props));
}

export async function generateStaticParams() {
  const postsByLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      posts: await getAllPosts(locale),
    })),
  );

  return postsByLocale.flatMap(({ locale, posts }) =>
    posts.flatMap((post) =>
      post.kind === "blog" ? [{ locale, slug: post.slug }] : [],
    ),
  );
}

export default async function BlogArticlePage(props: ArticlePageProps) {
  const post = await resolvePost(props);
  if (post.kind !== "blog") notFound();

  return <ArticlePageContent post={post} />;
}
