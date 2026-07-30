import assert from "node:assert/strict";
import test from "node:test";

import { createArticleShareUrls } from "./article-share.ts";

test("creates encoded Facebook and X links from the canonical article URL", () => {
  const articleUrl =
    "https://example.com/vi/blog/xay-dung-mdx?source=portfolio";
  const articleTitle = "Xây dựng MDX & định tuyến";
  const links = createArticleShareUrls(articleUrl, articleTitle);

  const facebook = new URL(links.facebook);
  const x = new URL(links.x);

  assert.equal(facebook.origin, "https://www.facebook.com");
  assert.equal(facebook.pathname, "/sharer/sharer.php");
  assert.equal(facebook.searchParams.get("u"), articleUrl);

  assert.equal(x.origin, "https://x.com");
  assert.equal(x.pathname, "/intent/tweet");
  assert.equal(x.searchParams.get("text"), articleTitle);
  assert.equal(x.searchParams.get("url"), articleUrl);
  assert.equal(x.hash, "");
});
