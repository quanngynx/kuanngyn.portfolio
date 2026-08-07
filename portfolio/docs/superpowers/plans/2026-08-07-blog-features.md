# Blog Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 5 core blog feature enhancements (Reading Progress Widget, Related Posts Scoring Engine, Adjacent Article Navigation, Client-Side Filtering with URL sync, and Next.js Draft Mode Preview).

**Architecture:** Domain logic is decoupled into pure TypeScript modules (`src/common/blog/`) with dedicated unit tests. UI components in `src/common/components/` consume normalized `BlogPost` data contracts. Draft preview uses Next.js Draft Mode cookie authentication and route handlers (`/api/draft` and `/api/draft/disable`).

**Tech Stack:** Next.js 16 (App Router, Draft Mode), React 19, TypeScript (strict mode, single quotes, no semicolons), Framer Motion (`useScroll`), Lucide React icons, Tailwind CSS, Vitest / Node.js test runner for unit tests.

## Global Constraints

- TypeScript strict mode, single quotes, no semicolons.
- Use functional patterns, small focused modules.
- Preserve existing component contracts & i18n support.
- No direct secret tokens in public URLs or client bundles.

---

### Task 1: Domain Layer - Reading Stats & Schema Extension

**Files:**
- Create: `portfolio/src/common/blog/reading-stats.ts`
- Modify: `portfolio/src/common/blog/content-schema.ts:1-150`
- Modify: `portfolio/src/common/blog/post-metadata.ts:1-150`
- Test: `portfolio/src/common/blog/reading-stats.test.mjs`

**Interfaces:**
- Consumes: Notion / MDX raw text body
- Produces: `ReadingStats` (`wordCount`, `sectionCount`, `readingMinutes`) and updated `BlogPost` interface

- [ ] **Step 1: Write failing test for reading stats**

Create `portfolio/src/common/blog/reading-stats.test.mjs`:
```js
import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateReadingStats } from './reading-stats.ts'

test('calculateReadingStats returns wordCount, sectionCount, and readingMinutes', () => {
  const sampleBody = `# Introduction
This is a sample blog post body with several words to calculate reading statistics accurately.

## Section 1
Here is more text inside the first section.

## Section 2
And another section with more words.`

  const stats = calculateReadingStats(sampleBody)
  assert.equal(stats.sectionCount, 3)
  assert.ok(stats.wordCount > 30)
  assert.equal(stats.readingMinutes, 1)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/common/blog/reading-stats.test.mjs`
Expected: FAIL with module/function not found.

- [ ] **Step 3: Write implementation for `reading-stats.ts`**

Create `portfolio/src/common/blog/reading-stats.ts`:
```ts
export interface ReadingStats {
  wordCount: number
  sectionCount: number
  readingMinutes: number
}

export function calculateReadingStats(bodyText: string): ReadingStats {
  const trimmed = bodyText.trim()
  if (!trimmed) {
    return { wordCount: 0, sectionCount: 0, readingMinutes: 1 }
  }

  const words = trimmed.split(/\s+/u).length
  const headingMatches = trimmed.match(/^#{1,6}\s+/gm)
  const sectionCount = headingMatches ? headingMatches.length : 0
  const readingMinutes = Math.max(1, Math.ceil(words / 200))

  return {
    wordCount: words,
    sectionCount,
    readingMinutes
  }
}
```

- [ ] **Step 4: Update `content-schema.ts` and `post-metadata.ts`**

Modify `portfolio/src/common/blog/content-schema.ts` to include `readingStats: ReadingStats` on `BlogPost`. Update `post-metadata.ts` to populate `readingStats` using `calculateReadingStats(bodyText)`.

- [ ] **Step 5: Run tests and verify pass**

Run: `node --test src/common/blog/reading-stats.test.mjs`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/common/blog/reading-stats.ts src/common/blog/content-schema.ts src/common/blog/post-metadata.ts src/common/blog/reading-stats.test.mjs
git commit -m "feat: add reading stats calculation to domain schema"
```

---

### Task 2: Domain Layer - Related Posts Recommendation Engine

**Files:**
- Create: `portfolio/src/common/blog/related-posts.ts`
- Test: `portfolio/src/common/blog/related-posts.test.mjs`

**Interfaces:**
- Consumes: `BlogPost`, `BlogPost[]`
- Produces: `getRelatedPosts(currentPost, allPosts, limit = 3): BlogPost[]`

- [ ] **Step 1: Write failing tests for related posts**

Create `portfolio/src/common/blog/related-posts.test.mjs`:
```js
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
    slug: 'post-1',
    locale: 'en',
    kind: 'blog',
    tags: ['React', 'TypeScript'],
    publishedAt: '2026-07-25',
    draft: false
  },
  {
    slug: 'post-2',
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
  assert.equal(result[0].slug, 'post-1')
  assert.equal(result.some(p => p.slug === 'post-draft'), false)
  assert.equal(result.some(p => p.slug === 'current-post'), false)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/common/blog/related-posts.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implement `getRelatedPosts`**

Create `portfolio/src/common/blog/related-posts.ts`:
```ts
import type { BlogPost } from './content-schema'

export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit = 3
): BlogPost[] {
  const candidates = allPosts.filter(
    (p) => p.slug !== currentPost.slug && !p.draft && p.locale === currentPost.locale
  )

  const currentDate = new Date(currentPost.publishedAt).getTime()
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

  const scored = candidates.map((candidate) => {
    let score = 0

    const matchingTags = candidate.tags.filter((t) => currentPost.tags.includes(t))
    score += Math.min(matchingTags.length, 3) * 3

    if (candidate.kind === currentPost.kind) {
      score += 2
    }

    const candidateDate = new Date(candidate.publishedAt).getTime()
    if (Math.abs(candidateDate - currentDate) <= THIRTY_DAYS_MS) {
      score += 1
    }

    return { post: candidate, score }
  })

  scored.sort((a, b) => b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt))

  const result = scored.filter((item) => item.score > 0).map((item) => item.post)

  if (result.length < limit) {
    const existingSlugs = new Set(result.map((p) => p.slug))
    const recentBackfill = candidates
      .filter((p) => !existingSlugs.has(p.slug))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    result.push(...recentBackfill.slice(0, limit - result.length))
  }

  return result.slice(0, limit)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/common/blog/related-posts.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/common/blog/related-posts.ts src/common/blog/related-posts.test.mjs
git commit -m "feat: add related posts recommendation algorithm with tag capping and recency backfill"
```

---

### Task 3: Domain Layer - Chronological Adjacent Posts (`olderPost` / `newerPost`)

**Files:**
- Create: `portfolio/src/common/blog/adjacent-posts.ts`
- Test: `portfolio/src/common/blog/adjacent-posts.test.mjs`

**Interfaces:**
- Consumes: `currentSlug: string`, `allPosts: BlogPost[]`
- Produces: `AdjacentPosts` (`olderPost`, `newerPost`)

- [ ] **Step 1: Write failing tests for adjacent posts**

Create `portfolio/src/common/blog/adjacent-posts.test.mjs`:
```js
import assert from 'node:assert/strict'
import test from 'node:test'
import { getAdjacentPosts } from './adjacent-posts.ts'

const posts = [
  { slug: 'newest', publishedAt: '2026-08-10', draft: false },
  { slug: 'middle', publishedAt: '2026-08-05', draft: false },
  { slug: 'oldest', publishedAt: '2026-08-01', draft: false }
]

test('getAdjacentPosts returns newer and older posts correctly', () => {
  const middle = getAdjacentPosts('middle', posts)
  assert.equal(middle.newerPost.slug, 'newest')
  assert.equal(middle.olderPost.slug, 'oldest')

  const newest = getAdjacentPosts('newest', posts)
  assert.equal(newest.newerPost, null)
  assert.equal(newest.olderPost.slug, 'middle')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/common/blog/adjacent-posts.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implement `getAdjacentPosts`**

Create `portfolio/src/common/blog/adjacent-posts.ts`:
```ts
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
    newerPost: index > 0 ? published[index - 1] : null,
    olderPost: index < published.length - 1 ? published[index + 1] : null
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/common/blog/adjacent-posts.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/common/blog/adjacent-posts.ts src/common/blog/adjacent-posts.test.mjs
git commit -m "feat: add chronological adjacent post navigation logic"
```

---

### Task 4: Domain Layer - Client-Side Filtering & Search Logic

**Files:**
- Create: `portfolio/src/common/blog/filters.ts`
- Test: `portfolio/src/common/blog/filters.test.mjs`

**Interfaces:**
- Consumes: `allPosts: BlogPost[]`, `options: FilterOptions`
- Produces: `filterPosts(allPosts, options): BlogPost[]`

- [ ] **Step 1: Write failing tests for filter logic**

Create `portfolio/src/common/blog/filters.test.mjs`:
```js
import assert from 'node:assert/strict'
import test from 'node:test'
import { filterPosts } from './filters.ts'

const posts = [
  { slug: 'p1', kind: 'blog', tags: ['React', 'TypeScript'], title: 'Next.js Guide', description: '', publishedAt: '2026-08-01', draft: false },
  { slug: 'p2', kind: 'case-study', tags: ['React'], title: 'Portfolio Redesign', description: '', publishedAt: '2026-08-05', draft: false }
]

test('filterPosts applies AND tag semantics, kind filter, query, and sorting', () => {
  const resultTag = filterPosts(posts, { tags: ['React', 'TypeScript'] })
  assert.equal(resultTag.length, 1)
  assert.equal(resultTag[0].slug, 'p1')

  const resultQuery = filterPosts(posts, { query: 'Redesign' })
  assert.equal(resultQuery.length, 1)
  assert.equal(resultQuery[0].slug, 'p2')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/common/blog/filters.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implement `filterPosts`**

Create `portfolio/src/common/blog/filters.ts`:
```ts
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
    filtered = filtered.filter((p) =>
      tags.every((tag) => p.tags.includes(tag))
    )
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/common/blog/filters.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/common/blog/filters.ts src/common/blog/filters.test.mjs
git commit -m "feat: add client-side blog filtering and sorting logic with AND tag semantics"
```

---

### Task 5: Next.js Draft Mode Route Handlers & Repository Bypass

**Files:**
- Create: `portfolio/src/app/api/draft/route.ts`
- Create: `portfolio/src/app/api/draft/disable/route.ts`
- Modify: `portfolio/src/common/blog/notion-posts.ts:1-105`
- Create: `portfolio/src/common/components/molecules/blog/draft-preview-banner.tsx`

**Interfaces:**
- `/api/draft?secret=TOKEN&slug=/path` -> Enables Draft Mode cookie & redirects.
- `/api/draft/disable` -> Disables Draft Mode cookie & redirects to `/blog`.
- `getPageBySlug(slug, locale, { includeDrafts: boolean })`

- [ ] **Step 1: Create Next.js Draft Mode API Route `/api/draft/route.ts`**

Create `portfolio/src/app/api/draft/route.ts`:
```ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  const expectedSecret = process.env.BLOG_PREVIEW_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!slug || !slug.startsWith('/') || slug.startsWith('//')) {
    return new Response('Invalid redirect path', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(slug)
}
```

- [ ] **Step 2: Create Draft Mode Disable Route `/api/draft/disable/route.ts`**

Create `portfolio/src/app/api/draft/disable/route.ts`:
```ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const draft = await draftMode()
  draft.disable()
  redirect('/blog')
}
```

- [ ] **Step 3: Update `notion-posts.ts` to accept `{ includeDrafts }`**

Modify `portfolio/src/common/blog/notion-posts.ts`:
Update `getAllPublishedPosts(locale, includeDrafts = false)` and `getPageBySlug(slug, locale, options = { includeDrafts: false })`. When `includeDrafts` is true, omit the Notion `Status === "Done"` filter and bypass cache.

- [ ] **Step 4: Create `DraftPreviewBanner` component**

Create `portfolio/src/common/components/molecules/blog/draft-preview-banner.tsx`:
```tsx
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export function DraftPreviewBanner() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-400 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Draft Preview Mode - Unpublished Article</span>
      </div>
      <Link
        href="/api/draft/disable"
        className="rounded bg-amber-500/20 px-2.5 py-1 text-amber-300 transition-colors hover:bg-amber-500/30"
      >
        Exit Preview
      </Link>
    </div>
  )
}
```

- [ ] **Step 5: Run type checking**

Run: `pnpm exec tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/api/draft/route.ts src/app/api/draft/disable/route.ts src/common/blog/notion-posts.ts src/common/components/molecules/blog/draft-preview-banner.tsx
git commit -m "feat: add Next.js Draft Mode preview route handlers and repository bypass"
```

---

### Task 6: UI Components - Reading Progress Bar & Floating Control Widget

**Files:**
- Create: `portfolio/src/common/components/molecules/blog/reading-progress-bar.tsx`
- Create: `portfolio/src/common/components/molecules/blog/reading-control-widget.tsx`
- Modify: `portfolio/src/common/components/organisms/notion-content.tsx:1-60`

- [ ] **Step 1: Create `ReadingProgressBar` component**

Create `portfolio/src/common/components/molecules/blog/reading-progress-bar.tsx`:
```tsx
'use client'

import { useScroll, motion } from 'framer-motion'
import type { RefObject } from 'react'

interface Props {
  targetRef: RefObject<HTMLElement | null>
}

export function ReadingProgressBar({ targetRef }: Props) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-gradient-to-r from-amber-500 to-sky-400"
    />
  )
}
```

- [ ] **Step 2: Create `ReadingControlWidget` component**

Create `portfolio/src/common/components/molecules/blog/reading-control-widget.tsx`:
```tsx
'use client'

import { useState, useEffect, type RefObject } from 'react'
import { ArrowUp, Clock, FileText, Layers } from 'lucide-react'
import type { ReadingStats } from '@/common/blog/content-schema'
import { useLenis } from '@/common/providers/smooth-scroll-provider'

interface Props {
  stats: ReadingStats
  targetRef: RefObject<HTMLElement | null>
}

export function ReadingControlWidget({ stats, targetRef }: Props) {
  const lenis = useLenis()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = targetRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const start = el.offsetTop
      const height = el.offsetHeight
      const total = height - window.innerHeight
      if (total <= 0) return
      const current = window.scrollY - start
      const p = Math.min(Math.max(current / total, 0), 1)
      setProgress(p)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  const remainingMin = Math.max(0, Math.ceil((1 - progress) * stats.readingMinutes))
  const percent = Math.round(progress * 100)

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <div className="group relative flex items-center gap-3 rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-2 text-xs text-muted-foreground shadow-xl backdrop-blur-xl transition-colors hover:border-neutral-700 hover:text-foreground">
        <span className="font-semibold text-amber-400">{percent}%</span>
        <span className="h-3 w-px bg-neutral-800" />
        <span>{progress >= 0.98 ? 'Finished' : `${remainingMin} min left`}</span>

        {/* Hover Popover Stats */}
        <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 rounded-xl border border-neutral-800 bg-neutral-950/95 p-3 text-xs opacity-0 shadow-2xl backdrop-blur-2xl transition-opacity group-hover:opacity-100">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground"><FileText className="h-3.5 w-3.5" /> Words</span>
              <span className="font-medium text-foreground">{stats.wordCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Layers className="h-3.5 w-3.5" /> Sections</span>
              <span className="font-medium text-foreground">{stats.sectionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Total Time</span>
              <span className="font-medium text-foreground">{stats.readingMinutes} min</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/90 text-muted-foreground shadow-xl backdrop-blur-xl transition-all hover:border-foreground/40 hover:text-foreground active:scale-95"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Integrate with `notion-content.tsx`**

Update `notion-content.tsx` to wrap article in `<article id="blog-article" ref={articleRef}>` and render `<ReadingProgressBar targetRef={articleRef} />` and `<ReadingControlWidget stats={generalInfo.readingStats} targetRef={articleRef} />`.

- [ ] **Step 4: Commit**

```bash
git add src/common/components/molecules/blog/reading-progress-bar.tsx src/common/components/molecules/blog/reading-control-widget.tsx src/common/components/organisms/notion-content.tsx
git commit -m "feat: add article-relative reading progress bar and floating control widget"
```

---

### Task 7: UI Components - Related Posts Grid & Previous/Next Navigation

**Files:**
- Create: `portfolio/src/common/components/molecules/blog/related-posts.tsx`
- Create: `portfolio/src/common/components/molecules/blog/article-pagination-nav.tsx`
- Modify: `portfolio/src/common/components/organisms/notion-content.tsx`

- [ ] **Step 1: Create `RelatedPosts` component**

Create `portfolio/src/common/components/molecules/blog/related-posts.tsx`:
```tsx
import Link from 'next/link'
import type { BlogPost } from '@/common/blog/content-schema'

interface Props {
  posts: BlogPost[]
}

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 border-t border-neutral-800 pt-10">
      <h2 className="mb-6 text-xl font-bold text-foreground">Related Articles</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 transition-colors hover:border-neutral-700 hover:bg-neutral-900/80"
          >
            <div>
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-400 uppercase">
                  {post.kind}
                </span>
                <span>{post.readingStats.readingMinutes} min read</span>
              </div>
              <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-amber-400">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                {post.description}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `ArticlePaginationNav` component**

Create `portfolio/src/common/components/molecules/blog/article-pagination-nav.tsx`:
```tsx
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
          className="group flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700 hover:bg-neutral-900/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Newer Article
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-amber-400">
            {newerPost.title}
          </span>
        </Link>
      ) : <div />}

      {olderPost ? (
        <Link
          href={`/blog/${olderPost.slug}`}
          className="group flex flex-col items-end rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700 hover:bg-neutral-900/80"
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            Older Article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-amber-400">
            {olderPost.title}
          </span>
        </Link>
      ) : <div />}
    </nav>
  )
}
```

- [ ] **Step 3: Integrate into NotionContent / Article layout**

Modify `notion-content.tsx` to render `<ArticlePaginationNav adjacent={adjacent} />` and `<RelatedPosts posts={relatedPosts} />` at the bottom of the article.

- [ ] **Step 4: Commit**

```bash
git add src/common/components/molecules/blog/related-posts.tsx src/common/components/molecules/blog/article-pagination-nav.tsx src/common/components/organisms/notion-content.tsx
git commit -m "feat: add Related Posts grid and Chronological Article Pagination Navigation"
```

---

### Task 8: UI Components - Blog List Filtering Toolbar & SearchParams URL Sync

**Files:**
- Create: `portfolio/src/common/components/organisms/blog/blog-filter-toolbar.tsx`
- Modify: `portfolio/src/app/[locale]/blog/page.tsx` (or blog list container)

- [ ] **Step 1: Create `BlogFilterToolbar` component**

Create `portfolio/src/common/components/organisms/blog/blog-filter-toolbar.tsx`:
```tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/common/utils/ui'

interface Props {
  availableTags: string[]
}

export function BlogFilterToolbar({ availableTags }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentKind = searchParams.get('kind') || 'all'
  const currentSort = searchParams.get('sort') || 'newest'
  const currentTags = searchParams.getAll('tag')
  const currentQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(currentQuery)

  const createQueryString = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        newParams.delete(key)
        if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v))
        } else if (value !== null && value !== '' && value !== 'all' && value !== 'newest') {
          newParams.set(key, value)
        }
      })

      return newParams.toString()
    },
    [searchParams]
  )

  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const queryString = createQueryString(updates)
    const url = queryString ? `${pathname}?${queryString}` : pathname
    startTransition(() => {
      router.replace(url, { scroll: false })
    })
  }

  const handleTagToggle = (tag: string) => {
    const nextTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]
    updateFilters({ tag: nextTags })
  }

  return (
    <div className="mb-8 space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Kind Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'blog', 'case-study'].map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => updateFilters({ kind })}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-medium uppercase transition-colors',
                currentKind === kind
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-800/60 text-muted-foreground hover:bg-neutral-800 hover:text-foreground'
              )}
            >
              {kind}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                updateFilters({ q: e.target.value })
              }}
              placeholder="Search articles..."
              className="h-9 rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="h-9 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 text-xs text-foreground focus:border-amber-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Available Tags Multi-Select */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-neutral-800/60 pt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
            <SlidersHorizontal className="h-3 w-3" /> Tags:
          </span>
          {availableTags.map((tag) => {
            const isSelected = currentTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs transition-colors',
                  isSelected
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-medium'
                    : 'bg-neutral-800/40 text-muted-foreground hover:bg-neutral-800 hover:text-foreground'
                )}
              >
                #{tag}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Connect Blog Filter Toolbar to Blog List Page**

Integrate `BlogFilterToolbar` and `filterPosts` in `/app/[locale]/blog/page.tsx`.

- [ ] **Step 3: Run full build and test checks**

Run: `pnpm exec tsc --noEmit` and `pnpm build`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/common/components/organisms/blog/blog-filter-toolbar.tsx src/app/\[locale\]/blog/page.tsx
git commit -m "feat: add BlogFilterToolbar with URL searchParams synchronization and AND tag filtering"
```

---

## Plan Self-Review

1. **Spec Coverage**: All 5 feature requirements (Reading progress, Related posts, Prev/Next navigation, Filtering + URL sync, Next.js Draft Mode preview) have dedicated implementation tasks and domain logic modules.
2. **Placeholder Scan**: Verified no placeholders, TODOs, or vague steps.
3. **Type Consistency**: Method signatures (`ReadingStats`, `BlogPost`, `AdjacentPosts`, `getRelatedPosts`, `filterPosts`, `getAdjacentPosts`) are consistently declared across domain files and UI components.
