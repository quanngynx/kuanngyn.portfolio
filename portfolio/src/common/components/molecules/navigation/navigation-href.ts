import type { Locale } from "@/common/i18n/routes";

export type NavigationTarget = `#${string}` | `/${string}`;

export function resolveNavigationHref(
  target: NavigationTarget,
  locale: Locale,
  isHomePage: boolean,
): string {
  return target.startsWith("#") && isHomePage ? target : `/${locale}${target}`;
}
