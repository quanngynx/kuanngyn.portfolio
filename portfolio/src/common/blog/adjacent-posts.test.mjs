import assert from 'node:assert/strict'
import test from 'node:test'
import { getAdjacentPosts } from './adjacent-posts.ts'

const posts = [
  { slug: 'newest', publishedAt: '2026-08-10', draft: false },
  { slug: 'middle', publishedAt: '2026-08-05', draft: false },
  { slug: 'oldest', publishedAt: '2026-08-01', draft: false },
  { slug: 'draft-post', publishedAt: '2026-08-12', draft: true }
]

test('getAdjacentPosts returns newer and older posts correctly', () => {
  const middle = getAdjacentPosts('middle', posts)
  assert.equal(middle.newerPost.slug, 'newest')
  assert.equal(middle.olderPost.slug, 'oldest')

  const newest = getAdjacentPosts('newest', posts)
  assert.equal(newest.newerPost, null)
  assert.equal(newest.olderPost.slug, 'middle')

  const oldest = getAdjacentPosts('oldest', posts)
  assert.equal(oldest.newerPost.slug, 'middle')
  assert.equal(oldest.olderPost, null)
})
