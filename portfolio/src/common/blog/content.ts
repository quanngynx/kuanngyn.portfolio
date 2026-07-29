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
