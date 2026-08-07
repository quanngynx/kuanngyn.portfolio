import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { AdjacentPosts } from '@/common/blog/adjacent-posts'

interface Props {
  adjacent: AdjacentPosts
}

export function ArticlePaginationNav({ adjacent }: Props) {
  const { olderPost, newerPost } = adjacent
  if (!olderPost && !newerPost) return null

  return (
    <nav aria-label="Article navigation" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {newerPost ? (
        <Link
          href={`/blog/${newerPost.slug}`}
          className="group flex flex-col rounded-2xl border border-border/80 bg-card/40 p-4 transition-colors hover:border-border hover:bg-card/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Newer Article
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {newerPost.title}
          </span>
        </Link>
      ) : <div />}

      {olderPost ? (
        <Link
          href={`/blog/${olderPost.slug}`}
          className="group flex flex-col items-end rounded-2xl border border-border/80 bg-card/40 p-4 transition-colors hover:border-border hover:bg-card/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            Older Article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {olderPost.title}
          </span>
        </Link>
      ) : <div />}
    </nav>
  )
}
