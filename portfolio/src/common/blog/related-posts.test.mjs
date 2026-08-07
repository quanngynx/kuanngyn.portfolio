import assert from 'node:assert/strict'
import test from 'node:test'
import { getRelatedPosts } from './related-posts.ts'

const mockPosts = [
  {
    slug: 'current-post',
    locale: 'en',
    kind: 'blog',
    tags: ['React', 'TypeScript', 'Frontend'],
    publishedAt: '2026-08-01',
    draft: false
  },
  {
    slug: 'post-high-score',
    locale: 'en',
    kind: 'blog',
    tags: ['React', 'TypeScript'],
    publishedAt: '2026-07-25',
    draft: false
  },
  {
    slug: 'post-low-score',
    locale: 'en',
    kind: 'case-study',
    tags: ['Python'],
    publishedAt: '2026-08-02',
    draft: false
  },
  {
    slug: 'post-draft',
    locale: 'en',
    kind: 'blog',
    tags: ['React', 'TypeScript', 'Frontend'],
    publishedAt: '2026-08-05',
    draft: true
  }
]

test('getRelatedPosts scores tags, kind, recency and excludes drafts and current post', () => {
  const result = getRelatedPosts(mockPosts[0], mockPosts, 2)
  assert.equal(result.length, 2)
  assert.equal(result[0].slug, 'post-high-score')
  assert.equal(result.some(p => p.slug === 'post-draft'), false)
  assert.equal(result.some(p => p.slug === 'current-post'), false)
})

test('getRelatedPosts backfills with recent published posts when positive scores < limit', () => {
  const result = getRelatedPosts(mockPosts[0], mockPosts, 3)
  assert.equal(result.length, 2) // Only 2 non-draft candidates exist in total
  assert.equal(result[1].slug, 'post-low-score')
})
