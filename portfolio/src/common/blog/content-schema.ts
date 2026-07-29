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
