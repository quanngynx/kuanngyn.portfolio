import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import type { Locale } from "@/common/i18n/routes";
import { routing } from "@/common/i18n/routes";

import type { ArticleKind, BlogPost, BlogSlug } from "./content-schema";
import {
  estimateReadingMinutes,
  parseBlogPostFrontmatter,
  parseBlogSlug,
} from "./content-schema";
import { calculateReadingStats } from "./reading-stats";

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

    const frontmatter = parseBlogPostFrontmatter(data, sourcePath);
    return {
      ...frontmatter,
      slug,
      locale,
      tags: frontmatter.tags || [],
      body: content,
      readingMinutes: estimateReadingMinutes(content),
      readingStats: calculateReadingStats(content),
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
    const mdxFiles = entries.filter(
      (entry) => entry.isFile() && path.extname(entry.name) === ".mdx",
    );

    const posts = await Promise.all(
      mdxFiles.map(async (entry) => {
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

export async function getPostLocales(
  slug: BlogSlug,
  kind: ArticleKind,
): Promise<Locale[]> {
  const localizedPosts = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      post: await getPost(locale, slug),
    })),
  );

  return localizedPosts.flatMap(({ locale, post }) =>
    post?.kind === kind ? [locale] : [],
  );
}
