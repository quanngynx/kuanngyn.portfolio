# P0-P2 Portfolio and Blog Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoan thien cac tinh nang P0-P2 cho portfolio va blog: RSS, accessibility, dieu huong, CV, case study, ban dich bai viet, mobile sharing va social preview.

**Architecture:** Giu nguyen Next.js App Router va blog MDX hien tai. Tai su dung `getAllPosts()`, noi dung case study da xuat ban va native browser APIs; khong them dependency, CMS hoac he thong project route moi.

**Tech Stack:** Next.js 16, React 19, TypeScript, next-intl, MDX, Node.js `node:test`, `ImageResponse`.

## Global Constraints

- Run application commands from `portfolio/`.
- Do not add packages or change the lockfile.
- Preserve repository-controlled MDX, production draft exclusion, and no locale fallback.
- Do not edit, stage, or commit the two untracked SystemEXE drafts.
- Add all new user-facing copy to English and Vietnamese.
- Keep article sharing state and behavior inside `ArticleShareActions`.
- Do not add search, tags, pagination, newsletter, comments, CMS, PWA, or chatbot features.

## Tasks

### Task 1: Publish bilingual RSS

- Create `src/common/blog/rss.ts` and a focused `rss.test.mjs`.
- Create static `src/app/rss.xml/route.ts` using `getAllPosts()` for both locales.
- Escape XML, sort deterministically by `updatedAt ?? publishedAt`, and exclude production drafts through the shared loader.
- Verify `/rss.xml` returns both published translations and excludes `systemexe-interview-log`.
- Commit as `feat: publish bilingual RSS feed`.

### Task 2: Restore mobile zoom

- Remove `maximumScale: 1` and `userScalable: false` from the locale viewport.
- Preserve width, initial scale, and theme colors.
- Commit as `fix: restore mobile page zoom`.

### Task 3: Add Blog to primary navigation

- Add and test `resolveNavigationHref()` for section and localized route links.
- Add localized Blog navigation copy and render it before Contact on desktop and mobile.
- Only run smooth section scrolling for hash targets.
- Commit as `feat: add blog to primary navigation`.

### Task 4: Add resume CTA

- Add localized Hero copy and a secondary external CTA to the approved Google Drive resume URL.
- Open securely in a new tab; do not add an internal resume page or PDF.
- Commit as `feat: link portfolio resume`.

### Task 5: Connect the existing portfolio case study

- Add optional `ProjectItem.caseStudy` and localized case-study URLs for `quanngynx-portfolio`.
- Render an internal modal action, add a stable project-card id, and append locale-correct backlinks to both existing MDX articles.
- Do not create a Servexa case study or expand frontmatter.
- Commit as `feat: connect portfolio project case study`.

### Task 6: Add article translation links

- Use `getPostLocales()` in the article page.
- Render EN/VI controls only for published translations; mark the current locale and never fallback.
- Commit as `feat: add article translation links`.

### Task 7: Add native mobile sharing

- Add and test `shareOrCopyArticle()` with native share, clipboard fallback, cancellation, and failure behavior.
- Keep the existing desktop share rail and render a localized inline mobile action.
- Commit as `feat: support native mobile article sharing`.

### Task 8: Add social preview cards

- Create a dependency-free 1200x630 `ImageResponse` card for Open Graph and re-export it for Twitter.
- Use neutral brand copy so the card can be inherited by both locales and the blog index.
- Commit as `feat: add social preview cards`.

### Task 9: Final verification

- Run all focused Node tests, `pnpm exec eslint .`, `pnpm run build`, and `git diff --check`.
- Smoke-test `/rss.xml`, both locales, both blog indexes, the translated article, mobile sharing, zoom, keyboard focus, reduced motion, and console output.
- Confirm production drafts remain excluded and the two SystemEXE files remain untouched and untracked.

## Public Interfaces

- Add optional `ProjectItem.caseStudy`.
- Add pure helpers `renderRssFeed`, `resolveNavigationHref`, and `shareOrCopyArticle`.
- Add public endpoint `GET /rss.xml`.

## Locked Assumptions

- `/rss.xml` is one combined EN/VI feed.
- The resume is a Hero CTA to the approved Google Drive URL.
- The only case study connected in this iteration is the existing bilingual portfolio MDX article.
- The social card uses locale-neutral brand copy.
- Each implementation task is committed independently without staging unrelated files.
