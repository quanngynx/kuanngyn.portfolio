# Blog Features Design Specification

**Date**: 2026-08-07  
**Status**: Draft (Under Review)  
**Target Scope**: Next.js Portfolio Blog System (`portfolio/`)

---

## 1. Overview & Goals

This specification defines 5 core feature enhancements for the portfolio blog system (both MDX and Notion-backed posts):

1. **Reading Progress & Floating Widget**: Top progress bar with bottom-right control widget (reading time left, word count, section count, back-to-top button).
2. **Related Posts System**: Recommendation engine scoring posts by tags (+3), content type (+2), technology (+2), and recent date (+1), with recency backfill fallback.
3. **Previous / Next Article Navigation**: Chronological article navigation ordered by `publishedAt`.
4. **Blog List Filtering & URL Sync**: Filter by content type, tags, search query, and sort order, synchronized with `searchParams`.
5. **Draft Preview Mode**: Secure token-based preview (`?preview=<TOKEN>`) for unpublished posts with `noindex` metadata and no-cache headers.

---

## 2. Component & Architecture Design

### 2.1 Reading Progress & Floating Control Widget

#### Components
- `ReadingProgressBar` (`src/common/components/molecules/blog/reading-progress-bar.tsx`):
  - Fixed at `top-0 left-0 right-0 z-50`.
  - 2px height with gradient fill (`bg-amber-500` / `bg-gradient-to-r from-amber-500 to-sky-400`).
  - Dynamic `width` bound to window scroll percentage: `(scrollY / (scrollHeight - innerHeight)) * 100`.

- `ReadingControlWidget` (`src/common/components/molecules/blog/reading-control-widget.tsx`):
  - Fixed at `bottom-6 right-6 z-40`.
  - Displays remaining reading time calculation (`Math.ceil((1 - progress) * totalMinutes)`).
  - Displays progress percentage badge.
  - Hover popover showing total word count, section count, and total reading time.
  - Interactive "Back to Top" button with smooth scroll via `Lenis` or `window.scrollTo({ top: 0, behavior: 'smooth' })`.

---

### 2.2 Related Posts Recommendation Engine

#### Algorithm Specification
Function `getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit = 3): BlogPost[]`:

1. Exclude `currentPost` and any draft posts.
2. Calculate score for each candidate post:
   - **Tag match**: +3 points for each overlapping tag in `currentPost.tags` vs `candidate.tags`.
   - **Content type match**: +2 points if `currentPost.kind === candidate.kind`.
   - **Technology match**: +2 points for matching tech tags (e.g. `React`, `TypeScript`, `Next.js`).
   - **Recency match**: +1 point if candidate was published within 30 days of `currentPost.publishedAt`.
3. Sort candidate posts by `score` descending, then by `publishedAt` descending.
4. **Fallback logic**: If fewer than `limit` posts have `score > 0`, append the most recent published posts (`publishedAt` descending) until `limit` (3-4 posts) is fulfilled.

#### Component
- `RelatedPostsCard` (`src/common/components/molecules/blog/related-posts.tsx`):
  - Grid layout (1 col mobile, 3 col desktop) at the end of the article.
  - Displays post cover image, title, kind badge, tags, reading time, and date.

---

### 2.3 Previous / Next Article Navigation

#### Specification
- Fetch all published posts sorted by `publishedAt` descending.
- Locate current article index `i`:
  - **Next Article** (newer): `posts[i - 1]` (if `i > 0`).
  - **Previous Article** (older): `posts[i + 1]` (if `i < posts.length - 1`).
- Component `ArticlePaginationNav` (`src/common/components/molecules/blog/article-pagination-nav.tsx`):
  - Positioned directly above Related Posts section.
  - Responsive two-column split (`← Previous Article` on left, `Next Article →` on right).
  - Displays article title, category badge, and publication date.

---

### 2.4 Blog Filtering & URL SearchParams Synchronization

#### Component
- `BlogFilterToolbar` (`src/common/components/organisms/blog/blog-filter-toolbar.tsx`):
  - **Content Type Filter Chips**: `All`, `Blog`, `Case Study`, `Tutorial`, `Project Log`.
  - **Search Input**: Real-time keyword filter matching title and description.
  - **Tag Multi-Select Dropdown**: Filter by selected tags.
  - **Sort Select**: `Newest First` (`desc`) vs `Oldest First` (`asc`).
- **URL Synchronization**:
  - Uses `useSearchParams`, `usePathname`, and `useRouter` from `next/navigation`.
  - Updates URL query string without full page reload: `?kind=blog&tag=react&sort=newest&q=query`.
  - Works on both SSR initial load and client interactions.

---

### 2.5 Draft Preview Mode & Security

#### Specification
- **Notion Status Criteria**: Posts with Notion Status `Not started` or `In progress` are classified as `draft = true`.
- **Public Isolation**:
  - `getAllPublishedPosts()` filters out `draft === true` by default.
  - `sitemap.ts` and RSS route handlers query published posts only.
- **Preview Route Resolution**:
  - Access URL: `/[locale]/blog/[slug]?preview=<SECRET_TOKEN>`.
  - `getPageBySlug(slug, locale, { previewToken })`:
    - Validates `previewToken` against `process.env.BLOG_PREVIEW_SECRET`.
    - If valid, returns the draft post block tree.
    - If invalid or missing for a draft post, returns `null` (404 Not Found).
- **Metadata & Caching Controls**:
  - `generateMetadata`: Sets `robots: { index: false, follow: false, noimageindex: true }` when in preview mode.
  - Response headers: `Cache-Control: no-store, max-age=0, must-revalidate`.
- **UI Banner**:
  - `DraftPreviewBanner` (`src/common/components/molecules/blog/draft-preview-banner.tsx`):
    - Sticky warning bar at top of page: `⚠️ Draft Preview Mode - Unpublished Article`.
    - Includes exit preview link returning to `/blog`.

---

## 3. Verification & Testing Plan

1. **Type & Lint Validation**:
   - `pnpm exec tsc --noEmit`
   - `pnpm exec eslint .`
2. **Functional Unit Tests**:
   - Related posts scoring algorithm unit tests (`related-posts.test.ts`).
   - Reading minutes & draft token validation unit tests.
3. **Manual Verification**:
   - Test draft preview URL with valid vs invalid token.
   - Verify filter URL sync bookmarking on `/blog`.
   - Test scroll progress bar & back-to-top smooth scroll widget.
