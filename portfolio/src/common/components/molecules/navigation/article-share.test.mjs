import assert from "node:assert/strict";
import test from "node:test";

import { createArticleShareUrls, shareOrCopyArticle } from "./article-share.ts";

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

test("prefers native sharing when it is available", async () => {
  let sharedData;
  const result = await shareOrCopyArticle(
    {
      share: async (data) => {
        sharedData = data;
      },
      clipboard: {
        writeText: async () => assert.fail("clipboard fallback was used"),
      },
    },
    "Article title",
    "https://example.com/en/blog/article",
  );

  assert.equal(result, "shared");
  assert.deepEqual(sharedData, {
    title: "Article title",
    url: "https://example.com/en/blog/article",
  });
});

test("falls back to the clipboard when native sharing fails", async () => {
  let copiedUrl;
  const result = await shareOrCopyArticle(
    {
      share: async () => {
        throw new Error("Native share failed");
      },
      clipboard: {
        writeText: async (url) => {
          copiedUrl = url;
        },
      },
    },
    "Article title",
    "https://example.com/vi/blog/article",
  );

  assert.equal(result, "copied");
  assert.equal(copiedUrl, "https://example.com/vi/blog/article");
});

test("treats an aborted native share as cancellation", async () => {
  let copied = false;
  const cancellation = Object.assign(new Error("Cancelled"), {
    name: "AbortError",
  });
  const result = await shareOrCopyArticle(
    {
      share: async () => {
        throw cancellation;
      },
      clipboard: {
        writeText: async () => {
          copied = true;
        },
      },
    },
    "Article title",
    "https://example.com/en/blog/article",
  );

  assert.equal(result, "cancelled");
  assert.equal(copied, false);
});

test("fails when neither native sharing nor clipboard is available", async () => {
  await assert.rejects(
    shareOrCopyArticle(
      {},
      "Article title",
      "https://example.com/en/blog/article",
    ),
    /Sharing unavailable/u,
  );
});
