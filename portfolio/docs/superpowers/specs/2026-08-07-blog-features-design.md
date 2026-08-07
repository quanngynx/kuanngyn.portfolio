# Blog Features Design Specification

**Date**: 2026-08-07  
**Status**: Revised (Approved Design v3 - Design Token System)  
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

## 2. Architecture & Design System Rules

### 2.1 Theme Consistency Constraint
> **Theme Consistency Constraint:** All new blog components must reuse the existing semantic colors and CSS variables defined in `globals.css` (e.g. `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary`, `bg-accent`, `text-accent-foreground`). Do not hard-code standalone Tailwind palettes such as `amber-*`, `sky-*`, or `neutral-*` unless the existing design system explicitly maps to those values.

### 2.2 Normalized Data Model

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
- Measured relative to `<article id="blog-article">` using Framer Motion `useScroll({ target: articleRef, offset: ["start start", "end end"] })`:
- **`ReadingProgressBar`** (`src/common/components/molecules/blog/reading-progress-bar.tsx`):
  - Fixed at `top-0 left-0 right-0 z-50`.
  - 2px accent line using `bg-primary`.

- **`ReadingControlWidget`** (`src/common/components/molecules/blog/reading-control-widget.tsx`):
  - Fixed at `bottom-6 right-6 z-40`.
  - **Remaining Time**:
    - When `progress < 0.98`: `Math.max(0, Math.ceil((1 - progress) * totalMinutes)) + " min left"`.
    - When `progress >= 0.98`: `"Finished"`.
  - Uses semantic styles: `border-border bg-card/90 text-muted-foreground hover:text-foreground`.
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

    const matchingTags = candidate.tags.filter((t) => currentPost.tags.includes(t));
    score += Math.min(matchingTags.length, 3) * 3;

    if (candidate.kind === currentPost.kind) {
      score += 2;
    }

    const candidateDate = new Date(candidate.publishedAt).getTime();
    if (Math.abs(candidateDate - currentDate) <= THIRTY_DAYS_MS) {
      score += 1;
    }

    return { post: candidate, score };
  });

  scored.sort((a, b) => b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt));

  const result = scored.filter((item) => item.score > 0).map((item) => item.post);

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
- Renders `← Older article` and `Newer article →` links cleanly using semantic tokens (`border-border bg-card/40 hover:bg-card/80 text-foreground`).

---

### 3.4 Client-Side Blog Filtering & URL Synchronization

#### Architecture & Semantic Styling
- Search Input: Debounced by `300ms` using `useDebouncedCallback`.
- Multi-Tag URL Format: Repeated `tag` search params (`/blog?tag=react&tag=nextjs`).
- AND Semantics for Tags.
- Clean URL Defaults: Default parameters (`kind="all"`, `sort="newest"`, empty query/tags) omitted from URL (`/blog`).
- Styled using `border-border bg-card/40 text-foreground text-muted-foreground`.

---

### 3.5 Next.js Draft Mode Preview Architecture

#### Handlers & Banner
- **`/api/draft/route.ts`**: Secret token check + `(await draftMode()).enable()`.
- **`/api/draft/disable/route.ts`**: Calls `(await draftMode()).disable()`.
- **`DraftPreviewBanner`** (`src/common/components/molecules/blog/draft-preview-banner.tsx`):
  - Sticky warning bar using `border-border bg-primary/10 text-primary-foreground`.
  - Exit link calling `/api/draft/disable`.

---

## 4. Verification & Testing Plan

1. `pnpm exec tsc --noEmit`
2. `pnpm exec eslint .`
3. `pnpm build`
4. Domain unit tests (`related-posts`, `adjacent-posts`, `filters`, `reading-stats`).
5. Manual verification of semantic design tokens & Draft Mode preview flow.
