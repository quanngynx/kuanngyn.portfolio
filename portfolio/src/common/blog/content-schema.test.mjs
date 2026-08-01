import assert from "node:assert/strict";
import test from "node:test";

import { parseBlogPostFrontmatter } from "./content-schema.ts";

const frontmatter = {
  title: "Article title",
  subtitle: "Article subtitle",
  description: "Article description",
  author: "Article author",
  publishedAt: "2026-08-01",
};

test("defaults missing article kind to blog", () => {
  const result = parseBlogPostFrontmatter(frontmatter, "article.mdx");

  assert.equal(result.kind, "blog");
});

test("accepts case-study article kind", () => {
  const result = parseBlogPostFrontmatter(
    { ...frontmatter, kind: "case-study" },
    "case-study.mdx",
  );

  assert.equal(result.kind, "case-study");
});

test("rejects unsupported article kinds", () => {
  assert.throws(
    () =>
      parseBlogPostFrontmatter({ ...frontmatter, kind: "news" }, "article.mdx"),
    /frontmatter "kind" must be "blog" or "case-study"/u,
  );
});
