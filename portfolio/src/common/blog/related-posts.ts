import type { BlogPost } from "./content-schema";

export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit = 3,
): BlogPost[] {
  const candidates = allPosts.filter(
    (p) =>
      p.slug !== currentPost.slug &&
      !p.draft &&
      p.locale === currentPost.locale,
  );

  const currentDate = new Date(currentPost.publishedAt).getTime();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const currentTagSet = new Set(currentPost.tags || []);

  const scored = candidates.map((candidate) => {
    let score = 0;

    const candidateTags = candidate.tags || [];
    const matchingTags = candidateTags.filter((t) => currentTagSet.has(t));

    score += Math.min(matchingTags.length, 3) * 3;

    if (candidate.kind === currentPost.kind) {
      score += 2;
    }

    const candidateDate = new Date(candidate.publishedAt).getTime();
    if (
      !Number.isNaN(candidateDate) &&
      Math.abs(candidateDate - currentDate) <= THIRTY_DAYS_MS
    ) {
      score += 1;
    }

    return { post: candidate, score };
  });

  scored.sort(
    (a, b) =>
      b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt),
  );

  const result: BlogPost[] = [];
  for (const item of scored) {
    if (item.score > 0) {
      result.push(item.post);
    }
  }

  if (result.length < limit) {
    const existingSlugs = new Set(result.map((p) => p.slug));
    const recentBackfill = candidates
      .filter((p) => !existingSlugs.has(p.slug))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

    result.push(...recentBackfill.slice(0, limit - result.length));
  }

  return result.slice(0, limit);
}
