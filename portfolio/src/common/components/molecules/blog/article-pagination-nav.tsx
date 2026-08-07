import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { AdjacentPosts } from '@/common/blog/adjacent-posts'
import { articlePath } from '@/common/utils/url'
import type { Locale } from '@/common/i18n/routes'

interface Props {
  adjacent: AdjacentPosts
  locale?: Locale
}

export function ArticlePaginationNav({ adjacent, locale }: Props) {
  const { olderPost, newerPost } = adjacent
  if (!olderPost && !newerPost) return null

  const currentLocale = locale || olderPost?.locale || newerPost?.locale || 'en'
  const blogUrl = `/${currentLocale}/blog`

  return (
    <nav aria-label="Article navigation" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Left Slot: Newer Article OR Back to Blog */}
      {newerPost ? (
        <Link
          href={articlePath(newerPost.locale, newerPost.slug, newerPost.kind)}
          className="group flex flex-col rounded-2xl border border-border/80 bg-card/40 p-4 transition-colors hover:border-border hover:bg-card/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            {currentLocale === 'vi' ? 'Bài mới hơn' : 'Newer Article'}
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {newerPost.title}
          </span>
        </Link>
      ) : (
        <Link
          href={blogUrl}
          className="group flex flex-col rounded-2xl border border-border/80 bg-card/40 p-4 transition-colors hover:border-border hover:bg-card/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            {currentLocale === 'vi' ? 'Bài mới nhất' : 'Latest Article'}
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {currentLocale === 'vi' ? 'Quay lại danh sách bài viết' : 'Back to all articles'}
          </span>
        </Link>
      )}

      {/* Right Slot: Older Article OR Back to Blog */}
      {olderPost ? (
        <Link
          href={articlePath(olderPost.locale, olderPost.slug, olderPost.kind)}
          className="group flex flex-col items-end text-right rounded-2xl border border-border/80 bg-card/40 p-4 transition-colors hover:border-border hover:bg-card/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {currentLocale === 'vi' ? 'Bài cũ hơn' : 'Older Article'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {olderPost.title}
          </span>
        </Link>
      ) : (
        <Link
          href={blogUrl}
          className="group flex flex-col items-end text-right rounded-2xl border border-border/80 bg-card/40 p-4 transition-colors hover:border-border hover:bg-card/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {currentLocale === 'vi' ? 'Bài đầu tiên' : 'First Article'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {currentLocale === 'vi' ? 'Quay lại danh sách bài viết' : 'Back to all articles'}
          </span>
        </Link>
      )}
    </nav>
  )
}
