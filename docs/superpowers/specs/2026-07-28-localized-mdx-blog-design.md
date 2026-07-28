# Localized MDX Blog Design

## Goal

Add a bilingual blog to the existing Next.js portfolio. Posts live in the repository as trusted MDX, are discovered independently per locale, and render as static article pages with a clean editorial layout.

## Scope

The first release includes:

- A localized blog index at `/[locale]/blog`.
- Localized article pages at `/[locale]/blog/[slug]`.
- English and Vietnamese MDX stored separately with matching slugs when both translations exist.
- Build-time frontmatter validation, reading-time calculation, metadata, language alternates, and sitemap entries.
- A header-free article experience with a large title, subtitle, author/date/read-time metadata, generous whitespace, and a narrow reading column.

The first release does not include a CMS, user-authored content, translation fallback, search, categories, tags, pagination, likes, view counts, comments, an RSS feed, or syntax-highlighting plugins.

## Content Model

Content is stored under the deployable application:

```text
portfolio/
+-- content/
    +-- blog/
        +-- en/
        |   +-- building-microfrontends.mdx
        +-- vi/
            +-- building-microfrontends.mdx
```

The filename is the URL slug. A post appears in a locale only when that locale's file exists. Matching slugs associate translations, but either translation may exist independently.

Each file starts with YAML frontmatter:

```yaml
---
title: "Building Microfrontends"
subtitle: "Design goals and technology choices"
description: "A concise description used by listings and search metadata."
author: "Quang Nguyen"
publishedAt: "2026-07-28"
updatedAt: "2026-08-02"
image: "/blog/building-microfrontends/cover.webp"
imageAlt: "Diagram of independently deployed frontend applications"
draft: false
---
```

`title`, `subtitle`, `description`, `author`, and `publishedAt` are required strings. `publishedAt` and `updatedAt` use the timezone-stable ISO `YYYY-MM-DD` form and must round-trip as real UTC calendar dates; values such as `2026-02-30` are invalid. `updatedAt`, `image`, `imageAlt`, and `draft` are optional. When `image` is present, `imageAlt` is required. Unknown fields are ignored rather than exposed.

`BlogPostFrontmatter` is the normalized TypeScript shape. A small manual validator checks required values, date formats, and the image/image-alt relationship while loading files. Validation errors name the source file and invalid field so a bad post fails the build with an actionable message.

The loader derives `slug`, `locale`, `body`, and `readingTime`; authors never store them in frontmatter. Reading time is an estimate based on whitespace-separated words divided by 200 words per minute, rounded up to at least one minute. This intentionally simple estimate can be less precise for Vietnamese content.

## Content Loading

The existing `gray-matter`-based provider is narrowed into a server-only blog content module:

- `getAllPosts(locale)` reads only direct `*.mdx` children of `content/blog/<locale>`, never scans recursively, validates each file, excludes production drafts, and sorts by `publishedAt` descending.
- `getPost(locale, slug)` accepts already validated inputs, reads exactly one localized file, and returns `undefined` only when that file does not exist or is a production draft.
- `getPostLocales(slug)` returns only supported locales with a visible file for that slug.
- `getAllPostParams()` returns the union of visible `{ locale, slug }` pairs.

Route code rejects unsupported locales and slugs that do not match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` before calling the loader or touching the filesystem. Filesystem paths are then built from the fixed content root and validated values, so no request-controlled value can escape the content directory.

Drafts remain visible in development for authoring. They are excluded from production indexes, static parameters, sitemaps, and language alternates.

## MDX Rendering and Security

The renderer is a server-only component using `evaluate` from `@mdx-js/mdx` with React's automatic JSX runtime. It receives only the body already extracted by `gray-matter`.

The component map is an explicit allowlist. The initial allowlist contains styled intrinsic elements plus `ArticleImage`; additional components are added only when a post needs them. MDX files do not import application modules directly.

The allowlist controls which rendering components the application supplies; it is not a JavaScript sandbox. `evaluate` executes JavaScript and is therefore limited to repository-controlled files committed with the application. The system never accepts, stores, compiles, or renders user-submitted MDX. This trust boundary is documented beside the renderer.

No client-side compiler or compiled source is shipped to the browser.

## Routing and Layouts

The current locale layout renders the global navbar, so an article's nested layout cannot remove it. The route tree is restructured without changing public URLs:

```text
src/app/[locale]/
+-- layout.tsx
+-- (portfolio)/
|   +-- layout.tsx
|   +-- page.tsx
|   +-- blog/
|       +-- page.tsx
+-- (article)/
    +-- blog/
        +-- [slug]/
            +-- layout.tsx
            +-- page.tsx
```

The locale layout keeps shared HTML, localization, theme, cursor, preloader, and smooth-scroll providers. `(portfolio)/layout.tsx` adds the existing navbar for the homepage and blog index. `(article)` deliberately has no navbar; its article layout supplies only the editorial page shell.

The blog index retains the existing portfolio navigation. Its home-section links must navigate back to the localized homepage before scrolling when the current route is not the homepage.

Both the locale layout and article page reject unsupported locales with `notFound()`. The article page also calls `notFound()` when the localized MDX file is absent.

`generateStaticParams()` returns the union of all visible locale-and-slug pairs. A post does not need a matching translation to be generated.

## Metadata, Alternates, and Sitemap

Canonical and sitemap URLs use `https://kuanngyn.io.vn`, matching the existing `robots.txt`; the stale copied `https://kawka.me` constant is corrected.

Each article generates:

- `title` and `description` from validated frontmatter.
- Open Graph image metadata only when `image` and `imageAlt` exist.
- `publishedTime` and optional `modifiedTime`.
- `alternates.canonical` for the current localized URL.
- `alternates.languages` only for visible translations that actually exist.

The blog index has localized title and description copy in both translation JSON files.

The project already has a site-wide sitemap at `src/app/sitemap.ts`. That sitemap is extended with the localized blog loader and remains the only sitemap; the unfinished `src/app/[locale]/blog/sitemap.ts` is removed. It includes localized homepage and blog-index URLs plus one article URL per visible locale-and-slug pair, uses `updatedAt ?? publishedAt` as `lastModified`, and never emits drafts or nonexistent translations.

## Page Design

The reference establishes hierarchy rather than a pixel-for-pixel target:

- A restrained article shell with generous top and bottom space.
- A large responsive title followed by a quieter subtitle.
- Author, publication date, optional updated date, and derived reading time grouped above the body.
- A readable body column around 680-720 pixels wide.
- Clear heading rhythm, comfortable paragraph line-height, visible keyboard focus, underlined links, responsive images, code blocks that scroll horizontally, and light/dark theme support.

The blog index uses the same editorial language: a simple heading and a chronological list of title, subtitle, date, and reading time. No filters or featured-content system are added.

## Error Handling

- Unsupported locale: `notFound()`.
- Missing localized post: `notFound()`.
- Missing locale directory: empty index.
- Invalid slug: `notFound()` before filesystem access.
- Invalid frontmatter or malformed MDX: fail the development request or production build with the source path and cause.
- Duplicate slugs cannot occur within a locale because each slug maps to one filename.

## Verification

The production build is the runnable content check: static parameter generation loads and validates every visible post, and article prerendering compiles every visible MDX body.

Before completion:

1. Run Prettier on touched source and documentation files.
2. Run `pnpm exec eslint .`.
3. Run `pnpm build`.
4. Run `pnpm doctor`, which is confirmed in `portfolio/package.json`.
5. Manually verify English-only, Vietnamese-only, and translated slugs.
6. Verify missing translations return 404, drafts are absent from the production build, language alternates contain only existing translations, and the navbar is absent on article pages.
7. Check desktop/mobile layouts, keyboard focus, reduced motion, both themes, both locales, and browser console errors.

## Success Criteria

- Adding a valid MDX file under one locale creates only that localized post.
- Matching files create localized pages with mutual language alternates.
- A missing translation never falls back to another language.
- Invalid metadata fails with an actionable build error.
- Drafts are unavailable in production discovery and prerendering.
- Articles render repository-controlled MDX entirely on the server.
- Article pages contain no main site navbar and preserve the approved editorial hierarchy.
