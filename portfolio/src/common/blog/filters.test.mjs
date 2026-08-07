import assert from 'node:assert/strict'
import test from 'node:test'
import { filterPosts } from './filters.ts'

const posts = [
  { slug: 'p1', kind: 'blog', tags: ['React', 'TypeScript'], title: 'Next.js Guide', description: 'Deep dive into Next.js', publishedAt: '2026-08-01', draft: false },
  { slug: 'p2', kind: 'case-study', tags: ['React'], title: 'Portfolio Redesign', description: 'Case study on portfolio', publishedAt: '2026-08-05', draft: false },
  { slug: 'p3', kind: 'blog', tags: ['Python'], title: 'AI Agent Architecture', description: 'Building agents with Python', publishedAt: '2026-08-10', draft: false },
  { slug: 'draft-p4', kind: 'blog', tags: ['React'], title: 'Draft Post', description: 'Draft', publishedAt: '2026-08-12', draft: true }
]

test('filterPosts applies AND tag semantics, kind filter, query search, and sort order', () => {
  const resultAndTags = filterPosts(posts, { tags: ['React', 'TypeScript'] })
  assert.equal(resultAndTags.length, 1)
  assert.equal(resultAndTags[0].slug, 'p1')

  const resultKind = filterPosts(posts, { kind: 'case-study' })
  assert.equal(resultKind.length, 1)
  assert.equal(resultKind[0].slug, 'p2')

  const resultQuery = filterPosts(posts, { query: 'agent' })
  assert.equal(resultQuery.length, 1)
  assert.equal(resultQuery[0].slug, 'p3')

  const resultOldest = filterPosts(posts, { sort: 'oldest' })
  assert.equal(resultOldest[0].slug, 'p1')
  assert.equal(resultOldest[resultOldest.length - 1].slug, 'p3')
})
