import type { ArticleKind } from "@/common/blog/content-schema";
import type { Locale } from "@/common/i18n/routes";

export const BASE_URL = "https://kuanngyn.io.vn";

export function articlePath(
  locale: Locale,
  slug: string,
  kind: ArticleKind,
): string {
  return `/${locale}/${kind === "case-study" ? "case-study" : "blog"}/${slug}`;
}

export function articleUrl(
  locale: Locale,
  slug: string,
  kind: ArticleKind,
): string {
  return `${BASE_URL}${articlePath(locale, slug, kind)}`;
}
