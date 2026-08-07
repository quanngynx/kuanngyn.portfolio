import type { BlogPost } from './content-schema'

export interface AdjacentPosts {
  olderPost: BlogPost | null
  newerPost: BlogPost | null
}

export function getAdjacentPosts(
  currentSlug: string,
  allPosts: BlogPost[]
): AdjacentPosts {
  const published = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  const index = published.findIndex((p) => p.slug === currentSlug)
  if (index === -1) return { olderPost: null, newerPost: null }

  return {
    newerPost: index > 0 ? (published[index - 1] as BlogPost) : null,
    olderPost: index < published.length - 1 ? (published[index + 1] as BlogPost) : null
  }
}
