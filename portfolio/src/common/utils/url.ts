import { BASE_URL } from "../constants";
import { type Locale } from "@/common/i18n/routes";

export function articleUrl(locale: Locale, slug: string): string {
  return `${BASE_URL}/${locale}/blog/${slug}`;
}