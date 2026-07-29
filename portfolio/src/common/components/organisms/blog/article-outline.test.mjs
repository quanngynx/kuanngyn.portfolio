import assert from "node:assert/strict";
import test from "node:test";

import { createArticleOutlineCollector } from "./article-outline.ts";

function text(value) {
  return { type: "text", value };
}

function heading(...children) {
  return { type: "heading", depth: 2, children };
}

function paragraph(...children) {
  return { type: "paragraph", children };
}

function collect(children) {
  const collector = createArticleOutlineCollector();
  collector.remarkPlugin()({ type: "root", children });
  return collector.outline;
}

test("normalizes Vietnamese headings and assigns the same id to the heading", () => {
  const title = heading(
    text("Định "),
    { type: "emphasis", children: [text("tuyến")] },
    text(" & MDX"),
  );

  const outline = collect([title, paragraph(text("Đoạn giới thiệu."))]);

  assert.deepEqual(outline, [
    {
      id: "dinh-tuyen-mdx",
      title: "Định tuyến & MDX",
      excerpt: "Đoạn giới thiệu.",
    },
  ]);
  assert.equal(title.data.hProperties.id, outline[0].id);
});

test("deduplicates ids deterministically and avoids generated collisions", () => {
  const outline = collect([
    heading(text("Routing")),
    heading(text("Routing")),
    heading(text("Routing 2")),
    heading({ type: "mdxJsxTextElement", children: [] }),
  ]);

  assert.deepEqual(
    outline.map(({ id }) => id),
    ["routing", "routing-2", "routing-2-2", "section-4"],
  );
});

test("uses the first meaningful paragraph, stops at the next h2, and truncates excerpts", () => {
  const longExcerpt = `${"word ".repeat(40)}ending`;
  const outline = collect([
    heading(text("First")),
    { type: "code", value: "ignored()" },
    paragraph(text("   ")),
    { type: "image", url: "/ignored.webp", alt: "Ignored image" },
    paragraph(text(longExcerpt)),
    heading(text("Second")),
    { type: "list", children: [paragraph(text("Ignored list text"))] },
    paragraph(text("Second excerpt")),
  ]);

  assert.equal(outline[0].excerpt.length, 180);
  assert.match(outline[0].excerpt, /…$/u);
  assert.equal(outline[1].excerpt, "Second excerpt");
});
