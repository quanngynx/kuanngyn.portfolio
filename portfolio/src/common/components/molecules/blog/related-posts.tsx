import Link from 'next/link'
import type { BlogPost } from '@/common/blog/content-schema'

interface Props {
  posts: BlogPost[]
}

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-6 text-xl font-bold text-foreground">Related Articles</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card/40 p-5 transition-colors hover:border-border hover:bg-card/80"
          >
            <div>
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary uppercase">
                  {post.kind}
                </span>
                <span>{post.readingStats?.readingMinutes ?? post.readingMinutes} min read</span>
              </div>
              <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                {post.description}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
