import type { BlogPost } from './content-schema'

export interface FilterOptions {
  kind?: string
  tags?: string[]
  query?: string
  sort?: 'newest' | 'oldest'
}

export function filterPosts(
  posts: BlogPost[],
  options: FilterOptions = {}
): BlogPost[] {
  const { kind, tags = [], query = '', sort = 'newest' } = options

  let filtered = posts.filter((p) => !p.draft)

  if (kind && kind !== 'all') {
    filtered = filtered.filter((p) => p.kind === kind)
  }

  if (tags.length > 0) {
    filtered = filtered.filter((p) => {
      const postTags = p.tags || []
      return tags.every((tag) => postTags.includes(tag))
    })
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  filtered.sort((a, b) =>
    sort === 'newest'
      ? b.publishedAt.localeCompare(a.publishedAt)
      : a.publishedAt.localeCompare(b.publishedAt)
  )

  return filtered
}
