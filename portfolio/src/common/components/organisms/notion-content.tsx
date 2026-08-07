import type { NotionBlockNode } from "@/common/blog/notion-types";
import type { BlogPost } from "@/common/blog/content-schema";
import type { AdjacentPosts } from "@/common/blog/adjacent-posts";
import { extractNotionOutline } from "@/common/blog/notion-blocks";
import { ArticleNavigator } from "@/common/components/molecules/navigation/article-navigator";
import { NotionRenderer } from "@/common/components/molecules/notion-renderer";
import { ReadingProgressBar } from "@/common/components/molecules/blog/reading-progress-bar";
import { ReadingControlWidget } from "@/common/components/molecules/blog/reading-control-widget";
import { RelatedPosts } from "@/common/components/molecules/blog/related-posts";
import { ArticlePaginationNav } from "@/common/components/molecules/blog/article-pagination-nav";
import { DraftPreviewBanner } from "@/common/components/molecules/blog/draft-preview-banner";

interface Props {
  generalInfo: BlogPost;
  blockTree: NotionBlockNode[];
  adjacent?: AdjacentPosts;
  relatedPosts?: BlogPost[];
}

export function NotionContent({ generalInfo, blockTree, adjacent, relatedPosts = [] }: Props) {
  const outline = extractNotionOutline(blockTree);

  return (
    <>
      {generalInfo.draft && <DraftPreviewBanner />}
      <ReadingProgressBar />
      <ArticleNavigator items={outline} label="Article sections" />
      <article id="blog-article" className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-10 space-y-4">
          {generalInfo.kind && (
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium tracking-wider uppercase text-primary">
              {generalInfo.kind}
            </span>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {generalInfo.title}
          </h1>
          {generalInfo.subtitle && (
            <p className="text-xl text-muted-foreground">
              {generalInfo.subtitle}
            </p>
          )}
          <div className="flex items-center gap-4 border-t border-border pt-2 text-xs text-muted-foreground">
            <span>By {generalInfo.author}</span>
            <span>•</span>
            <time dateTime={generalInfo.publishedAt}>
              {generalInfo.publishedAt}
            </time>
            {generalInfo.readingMinutes > 0 && (
              <>
                <span>•</span>
                <span>{generalInfo.readingMinutes} min read</span>
              </>
            )}
          </div>
        </header>

        {generalInfo.image && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-border">
            <img
              src={generalInfo.image}
              alt={generalInfo.imageAlt || generalInfo.title}
              className="max-h-120 w-full object-cover"
            />
          </div>
        )}

        <main className="prose prose-invert max-w-none">
          <NotionRenderer nodes={blockTree} />
        </main>

        {adjacent && <ArticlePaginationNav adjacent={adjacent} />}
        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
      </article>

      {generalInfo.readingStats && (
        <ReadingControlWidget stats={generalInfo.readingStats} />
      )}
    </>
  );
}
