import assert from "node:assert/strict";
import test from "node:test";

import { articlePath, articleUrl } from "./url.ts";

test("builds localized paths for blog posts and case studies", () => {
  assert.equal(
    articlePath("en", "article-slug", "blog"),
    "/en/blog/article-slug",
  );
  assert.equal(
    articlePath("vi", "case-study-slug", "case-study"),
    "/vi/case-study/case-study-slug",
  );
});

test("builds canonical article URLs from the article kind", () => {
  assert.equal(
    articleUrl("en", "case-study-slug", "case-study"),
    "https://kuanngyn.io.vn/en/case-study/case-study-slug",
  );
});
