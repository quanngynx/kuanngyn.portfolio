import { getCombinedPublishedPosts } from "@/common/blog/resolve-post";
import { renderRssFeed } from "@/common/blog/rss";
import { BASE_URL } from "@/common/constants";
import { routing } from "@/common/i18n/routes";

export const dynamic = "force-static";

export async function GET() {
  const posts = (
    await Promise.all(
      routing.locales.map((locale) => getCombinedPublishedPosts(locale)),
    )
  ).flat();

  return new Response(renderRssFeed(posts, BASE_URL), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
