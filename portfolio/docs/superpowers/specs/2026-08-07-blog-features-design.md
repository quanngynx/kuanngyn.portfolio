# Blog Features Design Specification

**Date**: 2026-08-07  
**Status**: Revised (Approved Design v2)  
**Target Scope**: Next.js Portfolio Blog System (`portfolio/`)

---

## 1. Overview & Goals

This specification defines 5 core feature enhancements for the portfolio blog system (supporting both MDX and Notion-backed posts):

1. **Reading Progress & Floating Widget**: Progress bar measured relative to `<article>`, combined with a floating control widget (remaining reading time, word count, section count, back-to-top button).
2. **Related Posts System**: Recommendation engine in `src/common/blog/related-posts.ts` scoring posts by capped tags (+3 max 3), content type (+2), and publication proximity within 30 days (+1), with recency backfill.
3. **Chronological Article Navigation (`olderPost` / `newerPost`)**: Pure domain navigation in `src/common/blog/adjacent-posts.ts` based on `publishedAt`.
4. **Client-Side Blog Filtering & URL Sync**: Fast client-side filtering by tags (AND semantics), content type, keyword search (300ms debounced), and sort order, synchronized with `searchParams` without default param noise.
5. **Next.js Draft Mode Preview**: Secure cookie-based preview via `/api/draft` and `/api/draft/disable` with normalized `draft: boolean` status, `noindex` metadata, and cache bypass.

---

## 2. Architecture & Domain Layer Separation

All domain logic is isolated under `src/common/blog/`:

```text
src/common/blog/
├── content-schema.ts      # Normalized BlogPost model (kind, draft, tags, etc.)
├── reading-stats.ts       # Server-side calculation of wordCount, sectionCount, readingMinutes
├── related-posts.ts       # Recommendation scoring algorithm & recency backfill
├── adjacent-posts.ts      # Chronological olderPost / newerPost navigation
├── filters.ts             # Client-side filtering logic & AND tag matching
└── notion-posts.ts        # Notion post fetching & draft status mapping
```

### 2.1 Normalized Data Model

```ts
export interface ReadingStats {
  wordCount: number;
  sectionCount: number;
  readingMinutes: number;
}

export interface BlogPost {
  slug: BlogSlug;
  locale: Locale;
  kind: ArticleKind;
  title: string;
  subtitle: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  imageAlt?: string;
  tags: string[];
  draft: boolean;
  body: string;
  readingStats: ReadingStats;
  sourcePath: string;
}
```

- **Notion Source**: `draft = status !== "Done"` (handles `Not started` and `In progress`).
- **MDX Source**: `draft = frontmatter.draft ?? false`.

---

## 3. Detailed Component & Feature Design

### 3.1 Reading Progress & Floating Control Widget

#### Progress Calculation
- Measured relative to `<article id="blog-article">` using Framer Motion `useScroll({ target: articleRef, offset: ["start start", "end end"] })` or element top/height offset:
  ```ts
  const start = articleTop;
  const end = articleTop + articleHeight - window.innerHeight;
  const progress = clamp((window.scrollY - start) / (end - start), 0, 1);
  ```
- **`ReadingProgressBar`** (`src/common/components/molecules/blog/reading-progress-bar.tsx`):
  - Fixed at `top-0 left-0 right-0 z-50`.
  - 2px accent line (`bg-amber-500` / `bg-gradient-to-r from-amber-500 to-sky-400`).

- **`ReadingControlWidget`** (`src/common/components/molecules/blog/reading-control-widget.tsx`):
  - Fixed at `bottom-6 right-6 z-40`.
  - **Remaining Time**:
    - When `progress < 1`: `Math.ceil((1 - progress) * totalMinutes) + " min left"`.
    - When `progress === 1`: `"Finished"`.
  - Hover popover displays server-generated `wordCount`, `sectionCount`, and `readingMinutes`.
  - "Back to Top" smooth scroll button.

---

### 3.2 Related Posts Recommendation Engine

#### Algorithm Specification (`src/common/blog/related-posts.ts`)

```ts
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit = 3,
): BlogPost[] {
  const candidates = allPosts.filter(
    (p) => p.slug !== currentPost.slug && !p.draft && p.locale === currentPost.locale,
  );

  const currentDate = new Date(currentPost.publishedAt).getTime();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  const scored = candidates.map((candidate) => {
    let score = 0;

    // 1. Tag overlap (capped at 3 tags max to prevent tag-stuffing bias)
    const matchingTags = candidate.tags.filter((t) => currentPost.tags.includes(t));
    score += Math.min(matchingTags.length, 3) * 3;

    // 2. Same content kind (case-study vs blog)
    if (candidate.kind === currentPost.kind) {
      score += 2;
    }

    // 3. Publication date proximity (within 30 days of target post)
    const candidateDate = new Date(candidate.publishedAt).getTime();
    if (Math.abs(candidateDate - currentDate) <= THIRTY_DAYS_MS) {
      score += 1;
    }

    return { post: candidate, score };
  });

  // Sort by score desc, then by publishedAt desc
  scored.sort((a, b) => b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt));

  const result = scored.filter((item) => item.score > 0).map((item) => item.post);

  // Recency backfill if under limit
  if (result.length < limit) {
    const existingSlugs = new Set(result.map((p) => p.slug));
    const recentBackfill = candidates
      .filter((p) => !existingSlugs.has(p.slug))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

    result.push(...recentBackfill.slice(0, limit - result.length));
  }

  return result.slice(0, limit);
}
```

---

### 3.3 Chronological Article Navigation (`olderPost` / `newerPost`)

#### Domain Logic (`src/common/blog/adjacent-posts.ts`)

```ts
export interface AdjacentPosts {
  olderPost: BlogPost | null;
  newerPost: BlogPost | null;
}

export function getAdjacentPosts(
  currentSlug: string,
  allPosts: BlogPost[],
): AdjacentPosts {
  const published = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const index = published.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return { olderPost: null, newerPost: null };

  return {
    newerPost: index > 0 ? published[index - 1] : null,
    olderPost: index < published.length - 1 ? published[index + 1] : null,
  };
}
```

#### Component (`src/common/components/molecules/blog/article-pagination-nav.tsx`)
- Renders `← Older article` and `Newer article →` links cleanly.

---

### 3.4 Client-Side Blog Filtering & URL Synchronization

#### Architecture
- Single server load of published posts `BlogPostSummary[]`.
- Client component `BlogFilterToolbar` manages UI state and URL synchronization.

#### Features & Behavior
- **Search Input**: Debounced by `300ms` using `useDebouncedCallback` to prevent unnecessary router replacements.
- **Multi-Tag URL Format**: Repeated `tag` search params (`/blog?tag=react&tag=nextjs`).
- **AND Semantics for Tags**:
  ```ts
  selectedTags.every((tag) => post.tags.includes(tag));
  ```
- **Clean URL Defaults**: Default parameters (`kind="all"`, `sort="newest"`, empty query/tags) are omitted from the URL (`/blog`).
- **Sort Order**: Supports `newest` (desc) vs `oldest` (asc).

---

### 3.5 Next.js Draft Mode Preview Architecture

#### 1. Route Handlers
- **`/api/draft/route.ts`**:
  - Validates `secret` parameter against `process.env.BLOG_PREVIEW_SECRET`.
  - Validates `slug` redirect target (must start with `/` and not `//` to prevent open redirect vulnerabilities).
  - Calls `(await draftMode()).enable()`.
  - Redirects to `slug`.

- **`/api/draft/disable/route.ts`**:
  - Calls `(await draftMode()).disable()`.
  - Redirects to `/blog`.

#### 2. Repository Layer (`notion-posts.ts`)
- Function `getPageBySlug(slug, locale, { includeDrafts: boolean })`.
- Does NOT handle secret tokens directly; relies on `includeDrafts` boolean flag.
- When `includeDrafts: true`, bypasses ISR shared cache and fetches directly.

#### 3. Page Component Integration
- Page checks `const { isEnabled } = await draftMode()`.
- Fetches post using `getPageBySlug(slug, locale, { includeDrafts: isEnabled })`.
- `generateMetadata`:
  ```ts
  if (isEnabled) {
    return {
      robots: { index: false, follow: false, noimageindex: true },
    };
  }
  ```
- Displays `DraftPreviewBanner` with link to `/api/draft/disable`.

---

## 4. Verification & Testing Plan

### Automated Build & Lint
1. `pnpm exec tsc --noEmit`
2. `pnpm exec eslint .`
3. `pnpm build` (Ensures server/client component boundary, searchParams, and draft mode build cleanly).

### Domain Unit Tests
- `src/common/blog/related-posts.test.mjs`: Tests scoring weights, tag cap, recency proximity, and backfill.
- `src/common/blog/adjacent-posts.test.mjs`: Tests chronological ordering for newest, middle, and oldest posts.
- `src/common/blog/filters.test.mjs`: Tests AND tag matching, search filtering, and sorting.
- `src/common/blog/reading-stats.test.mjs`: Tests word count, reading minutes, and section count calculations.

### Security Tests for Draft Mode
- Attempt accessing draft post directly -> `404 Not Found`.
- Call `/api/draft?secret=wrong&slug=/blog/post` -> `401 Unauthorized`.
- Call `/api/draft?secret=valid&slug=//evil.com` -> `400 Invalid redirect path`.
- Call `/api/draft?secret=valid&slug=/en/blog/draft-slug` -> Sets draft mode cookie, redirects to `/en/blog/draft-slug`, renders `noindex` metadata and `DraftPreviewBanner`.
- Click `Exit Preview` -> Calls `/api/draft/disable`, clears cookie, redirects to `/blog`.
