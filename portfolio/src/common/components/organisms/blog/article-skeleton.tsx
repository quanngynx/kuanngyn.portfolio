import { Skeleton } from "@/common/components/atoms/skeleton";

export function ArticleSkeleton() {
  return (
    <article className="article-content mx-auto max-w-180 px-container pt-8 md:pt-12">
      {/* Back navigation link skeleton */}
      <Skeleton className="h-5 w-20 rounded-md" />

      {/* Article Header */}
      <header className="pt-12 pb-10 md:pt-16 md:pb-14">
        {/* Language badges skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-7 w-12 rounded-full" />
          <Skeleton className="h-7 w-12 rounded-full" />
        </div>

        {/* Title skeleton (multi-line) */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-full sm:h-14 md:h-16" />
          <Skeleton className="h-10 w-4/5 sm:h-14 md:h-16" />
        </div>

        {/* Subtitle skeleton */}
        <div className="mt-6 space-y-2">
          <Skeleton className="h-6 w-full md:h-7" />
          <Skeleton className="h-6 w-3/4 md:h-7" />
        </div>

        {/* Author / Date / Reading time meta row */}
        <div className="mt-8 flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </header>

      {/* Article Body Skeleton */}
      <div className="space-y-8 pb-16">
        {/* Paragraph 1 */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Hero image placeholder */}
        <Skeleton className="aspect-video w-full rounded-2xl" />

        {/* Paragraph 2 */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Code block placeholder */}
        <Skeleton className="h-48 w-full rounded-xl" />

        {/* Paragraph 3 */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Article Pagination Nav Footer Skeleton */}
      <div className="border-t border-border/50 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </article>
  );
}
