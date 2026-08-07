import assert from "node:assert/strict";
import test from "node:test";
import { parsePostMetadata, checkForDuplicateSlugs } from "./post-metadata.ts";
import { generateHeadingSlug } from "./notion-blocks.ts";

const mockPageObject = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  created_time: "2026-08-01T00:00:00.000Z",
  last_edited_time: "2026-08-05T00:00:00.000Z",
  properties: {
    Title: {
      id: "title",
      type: "title",
      title: [
        {
          type: "text",
          text: { content: "My Notion Article" },
          plain_text: "My Notion Article",
        },
      ],
    },
    Subtitle: {
      id: "sub",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: "Subtitle text" },
          plain_text: "Subtitle text",
        },
      ],
    },
    Slug: {
      id: "slug",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: "my-notion-article" },
          plain_text: "my-notion-article",
        },
      ],
    },
    Status: {
      id: "status",
      type: "status",
      status: { name: "Done" },
    },
    Description: {
      id: "desc",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: "Post summary" },
          plain_text: "Post summary",
        },
      ],
    },
    Author: {
      id: "auth",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: "Author Name" },
          plain_text: "Author Name",
        },
      ],
    },
    PublishedAt: {
      id: "date",
      type: "date",
      date: { start: "2026-08-01" },
    },
    Tags: {
      id: "tags",
      type: "multi_select",
      multi_select: [{ name: "tech" }, { name: "case-study" }],
    },
  },
};

test("parses Notion page object into BlogPost metadata", () => {
  const result = parsePostMetadata(
    mockPageObject,
    "en",
    "Sample body text for reading time",
  );

  assert.equal(result.title, "My Notion Article");
  assert.equal(result.slug, "my-notion-article");
  assert.equal(result.kind, "case-study");
  assert.equal(result.draft, false);
  assert.equal(result.author, "Author Name");
  assert.equal(result.publishedAt, "2026-08-01");
});

test("detects draft when status is not Done", () => {
  const draftPage = {
    ...mockPageObject,
    properties: {
      ...mockPageObject.properties,
      Status: { id: "status", type: "status", status: { name: "In progress" } },
    },
  };
  const result = parsePostMetadata(draftPage, "en");

  assert.equal(result.draft, true);
});

test("deduplicates heading slugs correctly", () => {
  const existingSlugs = new Map();
  const slug1 = generateHeadingSlug("Architecture Design", existingSlugs);
  const slug2 = generateHeadingSlug("Architecture Design", existingSlugs);
  const slug3 = generateHeadingSlug("Architecture Design", existingSlugs);

  assert.equal(slug1, "architecture-design");
  assert.equal(slug2, "architecture-design-2");
  assert.equal(slug3, "architecture-design-3");
});

test("throws on duplicate post slugs", () => {
  const posts = [{ slug: "same-slug" }, { slug: "same-slug" }];
  assert.throws(
    () => checkForDuplicateSlugs(posts),
    /Duplicate Notion blog slug detected/,
  );
});
