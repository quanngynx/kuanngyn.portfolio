# Localized MDX Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual repository-backed MDX blog with independently available English and Vietnamese posts, static article routes, localized SEO, and a header-free editorial layout.

**Architecture:** `gray-matter` discovers and validates direct MDX children under `content/blog/{locale}`. A server-only `@mdx-js/mdx` renderer evaluates only repository-controlled bodies with an explicit component map; route groups keep the portfolio navbar on the homepage/blog index and remove it from article pages.

**Tech Stack:** Next.js 16.2.9 App Router, React 19.2.7 Server Components, TypeScript 6, next-intl 4.13, Tailwind CSS 4, gray-matter 4, @mdx-js/mdx 3.1.1.

## Global Constraints

- Store source files only under `portfolio/content/blog/{locale}/{slug}.mdx`.
- Support `en` and `vi` independently; never fall back to another locale.
- Slugs must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
- Read only direct `*.mdx` children; do not recurse.
- Required frontmatter: `title`, `subtitle`, `description`, `author`, `publishedAt`.
- Optional frontmatter: `updatedAt`, `image`, `imageAlt`, `draft`.
- Dates must be real UTC calendar dates in exact `YYYY-MM-DD` form.
- Require `imageAlt` whenever `image` is present.
- Exclude drafts from production listings, static parameters, language alternates, and sitemap entries.
- Sort posts by `publishedAt` descending.
- Reading time is an estimated whitespace word count at 200 words per minute, with a minimum of one minute.
- Compile only repository-controlled MDX on the server; never accept or compile user-submitted MDX.
- The MDX component map is an allowlist, not a JavaScript sandbox.
- Use `https://kuanngyn.io.vn` for canonical and sitemap URLs.
- Keep the article route free of the main portfolio navbar.
- Do not add search, categories, tags, pagination, CMS, likes, views, comments, RSS, or syntax-highlighting plugins.

---

## File Map

**Content and loading**

- `portfolio/content/blog/en/building-a-bilingual-mdx-blog.mdx`: English smoke article.
- `portfolio/content/blog/vi/building-a-bilingual-mdx-blog.mdx`: Vietnamese smoke article with the same slug.
- `portfolio/src/common/blog/content-schema.ts`: types, slug/date/frontmatter validation, and reading-time estimate.
- `portfolio/src/common/blog/content.ts`: server-only direct-directory loader and localized lookup functions.

**Rendering**

- `portfolio/src/common/components/atoms/article-image.tsx`: allowlisted responsive article image.
- `portfolio/src/common/components/organisms/blog/mdx-components.tsx`: styled MDX component map.
- `portfolio/src/common/components/organisms/blog/mdx-renderer.tsx`: server-only trusted MDX evaluator.

**Routes and presentation**

- `portfolio/src/app/[locale]/(portfolio)/layout.tsx`: adds the navbar to portfolio routes.
- `portfolio/src/app/[locale]/(portfolio)/page.tsx`: relocated homepage.
- `portfolio/src/app/[locale]/(portfolio)/blog/page.tsx`: localized chronological blog index.
- `portfolio/src/app/[locale]/(article)/blog/[slug]/layout.tsx`: header-free editorial shell.
- `portfolio/src/app/[locale]/(article)/blog/[slug]/page.tsx`: localized article, static params, and metadata.

**Integration**

- `portfolio/src/app/[locale]/layout.tsx`: retains providers but no longer renders the navbar.
- `portfolio/src/common/components/molecules/navigation/navbar.tsx`: routes homepage anchors correctly from `/blog`.
- `portfolio/src/common/i18n/routes.ts`: shared supported-locale guard.
- `portfolio/src/common/i18n/en.json`: English blog UI copy.
- `portfolio/src/common/i18n/vi.json`: Vietnamese blog UI copy.
- `portfolio/src/app/sitemap.ts`: the single site-wide localized sitemap.
- `portfolio/src/common/constants/index.tsx`: correct canonical origin and remove copied blog constants.
- Delete `portfolio/src/app/[locale]/blog/sitemap.ts`: unfinished duplicate sitemap.
- Delete `portfolio/src/common/providers/provider.ts`: superseded copied content provider.

---

### Task 1: Add the Validated Localized Content Loader

**Files:**

- Modify: `portfolio/package.json`
- Modify: `portfolio/pnpm-lock.yaml`
- Modify: `portfolio/src/common/i18n/routes.ts`
- Create: `portfolio/src/common/blog/content-schema.ts`
- Create: `portfolio/src/common/blog/content.ts`
- Create: `portfolio/content/blog/en/building-a-bilingual-mdx-blog.mdx`
- Create: `portfolio/content/blog/vi/building-a-bilingual-mdx-blog.mdx`

**Interfaces:**

- Produces: `isSupportedLocale(value: string): value is Locale`
- Produces: `parseBlogSlug(value: string): BlogSlug | undefined`
- Produces: `parseBlogPostFrontmatter(value: unknown, sourcePath: string): BlogPostFrontmatter`
- Produces: `estimateReadingMinutes(body: string): number`
- Produces: `getAllPosts(locale: Locale): Promise<BlogPost[]>`
- Produces: `getPost(locale: Locale, slug: BlogSlug): Promise<BlogPost | undefined>`
- Produces: `getPostLocales(slug: BlogSlug): Promise<Locale[]>`

- [ ] **Step 1: Install the maintained MDX compiler**

Run from `portfolio/`:

```powershell
pnpm add @mdx-js/mdx@^3.1.1
```

Expected: `package.json` and `pnpm-lock.yaml` include `@mdx-js/mdx`; no `next-mdx-remote` package is added.

- [ ] **Step 2: Add a reusable locale guard**

Append to `src/common/i18n/routes.ts`:

```ts
export function isSupportedLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}
```

Replace the existing casted locale check in `src/app/[locale]/layout.tsx` in Task 3, after route groups are created.

- [ ] **Step 3: Implement the typed schema and pure validators**

Create `src/common/blog/content-schema.ts`:

```ts
import type { Locale } from "@/common/i18n/routes";

const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type BlogSlug = string & { readonly __blogSlug: unique symbol };

export interface BlogPostFrontmatter {
  title: string;
  subtitle: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  imageAlt?: string;
  draft: boolean;
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: BlogSlug;
  locale: Locale;
  body: string;
  readingMinutes: number;
  sourcePath: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requiredString(
  data: Record<string, unknown>,
  key: string,
  sourcePath: string,
): string {
  const value = data[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${sourcePath}: frontmatter "${key}" must be a non-empty string`,
    );
  }

  return value.trim();
}

function optionalString(
  data: Record<string, unknown>,
  key: string,
  sourcePath: string,
): string | undefined {
  const value = data[key];

  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${sourcePath}: frontmatter "${key}" must be a non-empty string`,
    );
  }

  return value.trim();
}

function isRealIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function validatedDate(
  data: Record<string, unknown>,
  key: "publishedAt" | "updatedAt",
  sourcePath: string,
  required: boolean,
): string | undefined {
  const value = required
    ? requiredString(data, key, sourcePath)
    : optionalString(data, key, sourcePath);

  if (value !== undefined && !isRealIsoDate(value)) {
    throw new Error(
      `${sourcePath}: frontmatter "${key}" must be a real YYYY-MM-DD date`,
    );
  }

  return value;
}

export function parseBlogSlug(value: string): BlogSlug | undefined {
  return BLOG_SLUG_PATTERN.test(value) ? (value as BlogSlug) : undefined;
}

export function estimateReadingMinutes(body: string): number {
  const words = body.trim() === "" ? 0 : body.trim().split(/\s+/u).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function parseBlogPostFrontmatter(
  value: unknown,
  sourcePath: string,
): BlogPostFrontmatter {
  if (!isRecord(value)) {
    throw new Error(`${sourcePath}: frontmatter must be an object`);
  }

  const image = optionalString(value, "image", sourcePath);
  const imageAlt = optionalString(value, "imageAlt", sourcePath);
  const draft = value.draft ?? false;

  if (typeof draft !== "boolean") {
    throw new Error(`${sourcePath}: frontmatter "draft" must be a boolean`);
  }

  if (image && !imageAlt) {
    throw new Error(
      `${sourcePath}: frontmatter "imageAlt" is required when "image" exists`,
    );
  }

  return {
    title: requiredString(value, "title", sourcePath),
    subtitle: requiredString(value, "subtitle", sourcePath),
    description: requiredString(value, "description", sourcePath),
    author: requiredString(value, "author", sourcePath),
    publishedAt: validatedDate(
      value,
      "publishedAt",
      sourcePath,
      true,
    ) as string,
    updatedAt: validatedDate(value, "updatedAt", sourcePath, false),
    image,
    imageAlt,
    draft,
  };
}
```

- [ ] **Step 4: Implement direct-child filesystem loading**

Create `src/common/blog/content.ts`:

```ts
import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import type { Locale } from "@/common/i18n/routes";
import { routing } from "@/common/i18n/routes";

import {
  type BlogPost,
  type BlogSlug,
  estimateReadingMinutes,
  parseBlogPostFrontmatter,
  parseBlogSlug,
} from "./content-schema";

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function isVisible(post: BlogPost): boolean {
  return process.env.NODE_ENV !== "production" || !post.draft;
}

async function loadPostFile(
  locale: Locale,
  slug: BlogSlug,
): Promise<BlogPost | undefined> {
  const sourcePath = path.join(BLOG_ROOT, locale, `${slug}.mdx`);

  try {
    const source = await readFile(sourcePath, "utf8");
    const { data, content } = matter(source);

    return {
      ...parseBlogPostFrontmatter(data, sourcePath),
      slug,
      locale,
      body: content,
      readingMinutes: estimateReadingMinutes(content),
      sourcePath,
    };
  } catch (error) {
    if (isMissingFile(error)) return undefined;
    throw error;
  }
}

export async function getAllPosts(locale: Locale): Promise<BlogPost[]> {
  const localeDirectory = path.join(BLOG_ROOT, locale);

  try {
    const entries = await readdir(localeDirectory, { withFileTypes: true });
    const posts = await Promise.all(
      entries
        .filter(
          (entry) => entry.isFile() && path.extname(entry.name) === ".mdx",
        )
        .map(async (entry) => {
          const slug = parseBlogSlug(path.basename(entry.name, ".mdx"));

          if (!slug) {
            throw new Error(
              `${path.join(localeDirectory, entry.name)}: invalid blog slug`,
            );
          }

          return loadPostFile(locale, slug);
        }),
    );

    return posts
      .filter((post): post is BlogPost => post !== undefined && isVisible(post))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } catch (error) {
    if (isMissingFile(error)) return [];
    throw error;
  }
}

export async function getPost(
  locale: Locale,
  slug: BlogSlug,
): Promise<BlogPost | undefined> {
  const post = await loadPostFile(locale, slug);
  return post && isVisible(post) ? post : undefined;
}

export async function getPostLocales(slug: BlogSlug): Promise<Locale[]> {
  const localizedPosts = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      post: await getPost(locale, slug),
    })),
  );

  return localizedPosts
    .filter(({ post }) => post !== undefined)
    .map(({ locale }) => locale);
}
```

- [ ] **Step 5: Add one bilingual smoke article**

Create `content/blog/en/building-a-bilingual-mdx-blog.mdx`:

```mdx
---
title: "Building a Bilingual MDX Blog"
subtitle: "Repository-controlled writing with independent translations"
description: "How this portfolio keeps English and Vietnamese articles simple, static, and independently publishable."
author: "Nguyen Minh Quan"
publishedAt: "2026-07-28"
draft: false
---

## Why local MDX

Local MDX keeps writing close to the code while preserving typed metadata, static rendering, and deliberate React components.

> Each translation is published independently. A missing translation never falls back to another language.
```

Create `content/blog/vi/building-a-bilingual-mdx-blog.mdx`:

```mdx
---
title: "Xây dựng Blog MDX Song ngữ"
subtitle: "Nội dung được quản lý trong mã nguồn với bản dịch độc lập"
description: "Cách portfolio quản lý bài viết tiếng Anh và tiếng Việt đơn giản, tĩnh và có thể xuất bản độc lập."
author: "Nguyễn Minh Quân"
publishedAt: "2026-07-28"
draft: false
---

## Vì sao chọn MDX cục bộ

MDX cục bộ giúp nội dung nằm gần mã nguồn, đồng thời giữ metadata có kiểu dữ liệu rõ ràng, render tĩnh và hỗ trợ các React component được chọn trước.

> Mỗi bản dịch được xuất bản độc lập. Khi thiếu bản dịch, hệ thống không tự chuyển sang ngôn ngữ khác.
```

- [ ] **Step 6: Verify types and formatting**

Run from `portfolio/`:

```powershell
pnpm exec prettier --write package.json src/common/i18n/routes.ts src/common/blog content/blog
pnpm exec tsc --noEmit
pnpm exec eslint src/common/i18n/routes.ts src/common/blog
```

Expected: all commands pass.

- [ ] **Step 7: Commit**

```powershell
git add package.json pnpm-lock.yaml src/common/i18n/routes.ts src/common/blog content/blog
git commit -m "feat: add localized blog content loader"
```

---

### Task 2: Add the Server-Only MDX Renderer

**Files:**

- Create: `portfolio/src/common/components/atoms/article-image.tsx`
- Create: `portfolio/src/common/components/organisms/blog/mdx-components.tsx`
- Create: `portfolio/src/common/components/organisms/blog/mdx-renderer.tsx`

**Interfaces:**

- Consumes: trusted `BlogPost.body` and `BlogPost.sourcePath` from Task 1.
- Produces: `ArticleImage(props: ImageProps): ReactElement`
- Produces: `blogMdxComponents: MDXComponents`
- Produces: `MdxRenderer({ source, sourcePath }): Promise<ReactElement>`

- [ ] **Step 1: Add the allowlisted article image**

Create `src/common/components/atoms/article-image.tsx`:

```tsx
import Image, { type ImageProps } from "next/image";

export function ArticleImage(props: ImageProps) {
  return (
    <figure className="my-10">
      <Image
        {...props}
        className="h-auto w-full rounded-xl border border-border"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </figure>
  );
}
```

- [ ] **Step 2: Define the explicit MDX component map**

Create `src/common/components/organisms/blog/mdx-components.tsx`:

```tsx
import type { MDXComponents } from "mdx/types.js";

import { ArticleImage } from "@/common/components/atoms/article-image";

export const blogMdxComponents: MDXComponents = {
  ArticleImage,
  h1: (props) => (
    <h2 className="mt-14 text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props) => (
    <h2 className="mt-14 text-3xl font-bold tracking-tight" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-10 text-2xl font-semibold tracking-tight" {...props} />
  ),
  p: (props) => (
    <p className="mt-6 text-lg leading-8 text-foreground/85" {...props} />
  ),
  a: (props) => (
    <a
      className="underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-2 border-foreground/30 pl-6 text-lg italic text-foreground/70"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="my-6 list-disc space-y-3 pl-6 text-lg leading-8"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-6 list-decimal space-y-3 pl-6 text-lg leading-8"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-b bg-muted px-1.5 py-0.5 font-mono text-sm"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-8 overflow-x-auto rounded-xl bg-muted p-5 text-sm leading-6"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-12 border-border" {...props} />,
};
```

- [ ] **Step 3: Evaluate trusted MDX only on the server**

Create `src/common/components/organisms/blog/mdx-renderer.tsx`:

```tsx
import "server-only";

import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

import { blogMdxComponents } from "./mdx-components";

interface MdxRendererProps {
  source: string;
  sourcePath: string;
}

export async function MdxRenderer({ source, sourcePath }: MdxRendererProps) {
  // Repository-controlled MDX only. The component map is not a sandbox.
  const { default: Content } = await evaluate(
    { value: source, path: sourcePath },
    { ...runtime, baseUrl: import.meta.url },
  );

  return <Content components={blogMdxComponents} />;
}
```

- [ ] **Step 4: Verify the server boundary**

Run:

```powershell
pnpm exec prettier --write src/common/components/atoms/article-image.tsx src/common/components/organisms/blog
pnpm exec tsc --noEmit
pnpm exec eslint src/common/components/atoms/article-image.tsx src/common/components/organisms/blog
```

Expected: all commands pass; neither renderer file contains `"use client"`.

- [ ] **Step 5: Commit**

```powershell
git add src/common/components/atoms/article-image.tsx src/common/components/organisms/blog
git commit -m "feat: add trusted server MDX renderer"
```

---

### Task 3: Separate Portfolio and Article Layouts

**Files:**

- Modify: `portfolio/src/app/[locale]/layout.tsx`
- Create: `portfolio/src/app/[locale]/(portfolio)/layout.tsx`
- Move: `portfolio/src/app/[locale]/page.tsx` to `portfolio/src/app/[locale]/(portfolio)/page.tsx`
- Move: `portfolio/src/app/[locale]/blog/page.tsx` to `portfolio/src/app/[locale]/(portfolio)/blog/page.tsx`
- Modify: `portfolio/src/common/components/molecules/navigation/navbar.tsx`

**Interfaces:**

- Consumes: `isSupportedLocale` from Task 1.
- Produces: provider-only locale layout shared by all localized routes.
- Produces: navbar-wrapped `(portfolio)` routes.
- Preserves public URLs `/[locale]` and `/[locale]/blog`.

- [ ] **Step 1: Move the homepage and blog index into the portfolio route group**

Use native PowerShell moves; Git will detect the renames:

```powershell
New-Item -ItemType Directory -Force -LiteralPath 'src/app/[locale]/(portfolio)/blog'
Move-Item -LiteralPath 'src/app/[locale]/page.tsx' -Destination 'src/app/[locale]/(portfolio)/page.tsx'
Move-Item -LiteralPath 'src/app/[locale]/blog/page.tsx' -Destination 'src/app/[locale]/(portfolio)/blog/page.tsx'
```

Do not move the old localized sitemap; Task 6 deletes it after the root sitemap is updated.

- [ ] **Step 2: Remove the navbar from the parent locale layout**

In `src/app/[locale]/layout.tsx`:

```tsx
import { isSupportedLocale } from "@/common/i18n/routes";
```

Replace the casted locale check with:

```tsx
if (!isSupportedLocale(locale)) {
  notFound();
}
```

Remove the `Navbar` import and `<Navbar />` element. Keep `BaseLayout`, theme, cursor, preloader, and smooth-scroll providers unchanged.

- [ ] **Step 3: Add the navbar only to portfolio routes**

Create `src/app/[locale]/(portfolio)/layout.tsx`:

```tsx
import Navbar from "@/common/components/molecules/navigation/navbar";

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
```

- [ ] **Step 4: Make homepage anchors work from the blog index**

In `navbar.tsx`, import:

```tsx
import { useLocale } from "next-intl";
import { usePathname } from "@/common/i18n/routes";
```

Inside `Navbar`:

```tsx
const locale = useLocale();
const pathname = usePathname();
const isHomePage = pathname === "/";
const sectionHref = (hash: string) => (isHomePage ? hash : `/${locale}${hash}`);
```

Use `sectionHref(link.href)` for every desktop/mobile navigation link. Call `scrollToSection` only on the homepage:

```tsx
onClick={(event) => {
  if (isHomePage) {
    scrollToSection(event, link.href);
  } else {
    setIsMobileMenuOpen(false);
  }
}}
```

Apply the same behavior to the logo's `#home` link.

- [ ] **Step 5: Verify URL preservation and layout ownership**

Run:

```powershell
pnpm exec prettier --write 'src/app/[locale]' src/common/components/molecules/navigation/navbar.tsx
pnpm exec tsc --noEmit
pnpm exec eslint 'src/app/[locale]' src/common/components/molecules/navigation/navbar.tsx
pnpm build
```

Expected: `/en`, `/vi`, `/en/blog`, and `/vi/blog` remain buildable; only `(portfolio)/layout.tsx` renders `<Navbar />`.

- [ ] **Step 6: Commit**

```powershell
git add 'src/app/[locale]' src/common/components/molecules/navigation/navbar.tsx
git commit -m "refactor: separate portfolio and article layouts"
```

---

### Task 4: Build the Localized Blog Index

**Files:**

- Modify: `portfolio/src/app/[locale]/(portfolio)/blog/page.tsx`
- Modify: `portfolio/src/common/i18n/en.json`
- Modify: `portfolio/src/common/i18n/vi.json`

**Interfaces:**

- Consumes: `getAllPosts(locale)` and `isSupportedLocale(value)`.
- Produces: localized `/[locale]/blog` listing and index metadata.

- [ ] **Step 1: Add exact localized blog UI copy**

Add to `en.json`:

```json
"Blog": {
  "title": "Writing",
  "description": "Notes on software engineering, architecture, and the work behind the projects.",
  "empty": "No articles have been published in English yet.",
  "minuteRead": "{minutes} min read"
}
```

Add to `vi.json`:

```json
"Blog": {
  "title": "Bài viết",
  "description": "Ghi chú về kỹ thuật phần mềm, kiến trúc và quá trình xây dựng các dự án.",
  "empty": "Chưa có bài viết tiếng Việt nào được xuất bản.",
  "minuteRead": "{minutes} phút đọc"
}
```

- [ ] **Step 2: Replace the empty blog page**

Replace `src/app/[locale]/(portfolio)/blog/page.tsx` with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getAllPosts } from "@/common/blog/content";
import { isSupportedLocale, type Locale } from "@/common/i18n/routes";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });
  return { title: t("title"), description: t("description") };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const [posts, t] = await Promise.all([
    getAllPosts(locale),
    getTranslations({ locale, namespace: "Blog" }),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-container pb-24 pt-36 md:pb-32 md:pt-48">
      <header className="max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("description")}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-muted-foreground">{t("empty")}</p>
      ) : (
        <ol className="mt-16 divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group block py-10 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt, locale)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>
                    {t("minuteRead", { minutes: post.readingMinutes })}
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight transition-opacity group-hover:opacity-65 md:text-4xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
                  {post.subtitle}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Verify independent locale discovery**

Run:

```powershell
pnpm exec prettier --write 'src/app/[locale]/(portfolio)/blog/page.tsx' src/common/i18n/en.json src/common/i18n/vi.json
pnpm exec tsc --noEmit
pnpm exec eslint 'src/app/[locale]/(portfolio)/blog/page.tsx'
pnpm build
```

Expected: both sample translations appear. Temporarily renaming only the Vietnamese file to `.mdx.off` removes it only from `/vi/blog`; restore the filename immediately after confirming.

Then temporarily change the English `publishedAt` to `2026-02-30` and rerun `pnpm build`.

Expected: the build fails with the English source path and `"publishedAt" must be a real YYYY-MM-DD date`. Restore `2026-07-28` and rerun `pnpm build` successfully.

- [ ] **Step 4: Commit**

```powershell
git add 'src/app/[locale]/(portfolio)/blog/page.tsx' src/common/i18n/en.json src/common/i18n/vi.json
git commit -m "feat: add localized blog index"
```

---

### Task 5: Build the Header-Free Article Route and SEO

**Files:**

- Create: `portfolio/src/app/[locale]/(article)/blog/[slug]/layout.tsx`
- Create: `portfolio/src/app/[locale]/(article)/blog/[slug]/page.tsx`

**Interfaces:**

- Consumes: `getAllPosts`, `getPost`, `getPostLocales`, `parseBlogSlug`, `isSupportedLocale`, and `MdxRenderer`.
- Produces: static localized article pages, canonical URL, and existing-translation language alternates.

- [ ] **Step 1: Add the article-only shell**

Create `src/app/[locale]/(article)/blog/[slug]/layout.tsx`:

```tsx
export default function ArticleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen px-container pb-24 pt-16 md:pb-36 md:pt-24">
      {children}
    </main>
  );
}
```

- [ ] **Step 2: Add validated top-down static parameters**

Start `page.tsx` with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPosts, getPost, getPostLocales } from "@/common/blog/content";
import { parseBlogSlug } from "@/common/blog/content-schema";
import { MdxRenderer } from "@/common/components/organisms/blog/mdx-renderer";
import { BASE_URL } from "@/common/constants";
import { isSupportedLocale, type Locale } from "@/common/i18n/routes";

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams({
  params: { locale },
}: {
  params: { locale: string };
}) {
  if (!isSupportedLocale(locale)) return [];

  return (await getAllPosts(locale)).map((post) => ({
    slug: post.slug,
  }));
}
```

This uses the parent `[locale]` generator. Across its `en` and `vi` calls, the generated routes are exactly the union of existing visible locale/slug pairs.

- [ ] **Step 3: Add canonical and translation-aware metadata**

Continue `page.tsx`:

```tsx
function articleUrl(locale: Locale, slug: string): string {
  return `${BASE_URL}/${locale}/blog/${slug}`;
}

async function resolvePost({ params }: ArticlePageProps) {
  const { locale, slug: rawSlug } = await params;
  const slug = parseBlogSlug(rawSlug);

  if (!isSupportedLocale(locale) || !slug) notFound();

  const post = await getPost(locale, slug);
  if (!post) notFound();

  return post;
}

export async function generateMetadata(
  props: ArticlePageProps,
): Promise<Metadata> {
  const post = await resolvePost(props);
  const locales = await getPostLocales(post.slug);
  const canonical = articleUrl(post.locale, post.slug);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, articleUrl(locale, post.slug)]),
      ),
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.description,
      publishedTime: new Date(
        `${post.publishedAt}T00:00:00.000Z`,
      ).toISOString(),
      modifiedTime: post.updatedAt
        ? new Date(`${post.updatedAt}T00:00:00.000Z`).toISOString()
        : undefined,
      images:
        post.image && post.imageAlt
          ? [{ url: post.image, alt: post.imageAlt }]
          : undefined,
    },
  };
}
```

- [ ] **Step 4: Render the editorial article hierarchy**

Finish `page.tsx`:

```tsx
function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export default async function ArticlePage(props: ArticlePageProps) {
  const post = await resolvePost(props);

  return (
    <article className="mx-auto max-w-[720px]">
      <Link
        href={`/${post.locale}/blog`}
        className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        ← {post.locale === "vi" ? "Bài viết" : "Blog"}
      </Link>

      <header className="pb-14 pt-16 md:pb-20 md:pt-24">
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">
          {post.title}
        </h1>
        <p className="mt-6 text-xl leading-8 text-muted-foreground md:text-2xl">
          {post.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt, post.locale)}
          </time>
          {post.updatedAt && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.updatedAt}>
                {post.locale === "vi" ? "Cập nhật" : "Updated"}{" "}
                {formatDate(post.updatedAt, post.locale)}
              </time>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>
            {post.readingMinutes}{" "}
            {post.locale === "vi" ? "phút đọc" : "min read"}
          </span>
        </div>
      </header>

      <MdxRenderer source={post.body} sourcePath={post.sourcePath} />
    </article>
  );
}
```

- [ ] **Step 5: Verify missing translations and article metadata**

Run:

```powershell
pnpm exec prettier --write 'src/app/[locale]/(article)'
pnpm exec tsc --noEmit
pnpm exec eslint 'src/app/[locale]/(article)'
pnpm build
```

Expected: both sample routes are prerendered. Temporarily renaming the Vietnamese MDX file removes `/vi/blog/building-a-bilingual-mdx-blog`, makes that URL return 404, and removes `vi` from the English article's language alternates; restore the file immediately.

- [ ] **Step 6: Commit**

```powershell
git add 'src/app/[locale]/(article)'
git commit -m "feat: add localized MDX article pages"
```

---

### Task 6: Consolidate the Site-Wide Sitemap and Complete Verification

**Files:**

- Modify: `portfolio/src/app/sitemap.ts`
- Modify: `portfolio/src/common/constants/index.tsx`
- Delete: `portfolio/src/app/[locale]/blog/sitemap.ts`
- Delete: `portfolio/src/common/providers/provider.ts`

**Interfaces:**

- Consumes: `getAllPosts(locale)` and `routing.locales`.
- Produces: the single `/sitemap.xml` containing localized home, index, and visible article URLs.

- [ ] **Step 1: Correct the canonical origin and remove copied blog constants**

In `src/common/constants/index.tsx`, replace the development/`kawka.me` branch with:

```ts
export const BASE_URL = "https://kuanngyn.io.vn";
export const BLOG_PATH = "/blog";
```

Remove the `ContentType` import, `BLOG_PATH_WITH_CATEGORY`, and `GOOGLE_CODE_IN_ARTICLE_PATH`. Keep unrelated constants unchanged.

- [ ] **Step 2: Extend the existing root sitemap**

Replace `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from "next";

import { getAllPosts } from "@/common/blog/content";
import { BASE_URL, BLOG_PATH } from "@/common/constants";
import { routing } from "@/common/i18n/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      posts: await getAllPosts(locale),
    })),
  );

  const staticUrls: MetadataRoute.Sitemap = routing.locales.flatMap(
    (locale) => [
      {
        url: `${BASE_URL}/${locale}`,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${BASE_URL}/${locale}${BLOG_PATH}`,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ],
  );

  const articleUrls: MetadataRoute.Sitemap = postsByLocale.flatMap(
    ({ locale, posts }) =>
      posts.map((post) => ({
        url: `${BASE_URL}/${locale}${BLOG_PATH}/${post.slug}`,
        lastModified: post.updatedAt ?? post.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  );

  return [...staticUrls, ...articleUrls];
}
```

- [ ] **Step 3: Remove superseded copied files**

Delete:

```text
src/app/[locale]/blog/sitemap.ts
src/common/providers/provider.ts
```

Run:

```powershell
rg -n "common/providers/provider|BLOG_PATH_WITH_CATEGORY|GOOGLE_CODE_IN_ARTICLE_PATH|next-mdx-remote|kawka\.me" src package.json
```

Expected: no matches.

- [ ] **Step 4: Run repository verification**

Run from `portfolio/`:

```powershell
pnpm exec prettier --write src content package.json
pnpm exec eslint .
pnpm build
pnpm doctor
```

Expected:

- Prettier and ESLint pass.
- Build prerenders both localized article routes.
- React Doctor completes without a new blog finding.
- `/sitemap.xml` contains `/en`, `/vi`, both blog indexes, and only visible localized articles.

- [ ] **Step 5: Perform manual browser QA**

Run:

```powershell
pnpm dev
```

Verify:

1. `/en/blog` and `/vi/blog` show locale-specific content sorted newest first.
2. Both sample article pages render MDX with title, subtitle, author, date, estimated reading time, and narrow body column.
3. Article pages have no main navbar; the homepage and blog index retain it.
4. Navbar links on the blog index return to localized homepage sections.
5. Unsupported locales, malformed slugs, and missing localized files return 404.
6. Canonical URLs point to the current localized page.
7. Language alternates contain only translations that exist.
8. Desktop and mobile layouts, keyboard focus, reduced motion, light/dark themes, and browser console are clean.

- [ ] **Step 6: Review the final diff**

Run:

```powershell
git status --short
git diff --check
git diff --stat
```

Expected: only planned blog, layout, localization, sitemap, dependency, and documentation changes are present. The pre-existing root `README.md` change remains unstaged and untouched.

- [ ] **Step 7: Commit**

```powershell
git add src/app/sitemap.ts src/common/constants/index.tsx 'src/app/[locale]/blog/sitemap.ts' src/common/providers/provider.ts
git commit -m "feat: publish localized blog sitemap"
```
