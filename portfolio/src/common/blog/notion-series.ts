import { cache } from "react";
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { NOTION_DATABASE_ID_SERIES } from "../venv";
import type { Locale } from "../i18n/routes";
import type { BlogPost } from "./content-schema";
import { parseBlogSlug } from "./content-schema";
import {
  fetchPageBlockTree,
  calculateNotionReadingStats,
} from "./notion-blocks";
import { notion } from "./notion-client";
import { queryAllDataSourcePages } from "./notion-data-source";
import { getAllPublishedPosts } from "./notion-posts";
import type { NotionBlockNode, NotionLinkOverrides } from "./notion-types";

const SERVEXA_SERIES_SLUG = "engineering-servexa-warranty-ai";
const SERVEXA_SERIES_PAGE_ID = "3bc511edf06f81bb8887f046272c6ead";
const SERVEXA_COVER = "/projects/servexa-warranty-ai.svg";

const SERIES_PROPERTIES = {
  title: "Name",
  description: "Description",
  slug: "Slug",
  status: "Status",
} as const;

export interface NotionSeriesPage {
  generalInfo: BlogPost;
  blockTree: NotionBlockNode[];
  linkOverrides: NotionLinkOverrides;
  status: string;
}

function isFullPage(page: unknown): page is PageObjectResponse {
  return typeof page === "object" && page !== null && "properties" in page;
}

function extractPlainText(property: unknown): string {
  if (!property || typeof property !== "object") return "";

  if ("title" in property && Array.isArray(property.title)) {
    return property.title
      .map((item: RichTextItemResponse) => item.plain_text || "")
      .join("");
  }

  if ("rich_text" in property && Array.isArray(property.rich_text)) {
    return property.rich_text
      .map((item: RichTextItemResponse) => item.plain_text || "")
      .join("");
  }

  return "";
}

function extractStatus(property: unknown): string {
  if (
    property &&
    typeof property === "object" &&
    "status" in property &&
    property.status &&
    typeof property.status === "object" &&
    "name" in property.status
  ) {
    return String(property.status.name || "");
  }

  return "";
}

function normalizeNotionId(value: string): string {
  return value.replace(/-/g, "").toLowerCase();
}

function buildPostLinkOverrides(posts: BlogPost[]): NotionLinkOverrides {
  return Object.fromEntries(
    posts.map((post) => {
      const pageId = normalizeNotionId(
        post.sourcePath.replace("notion://", ""),
      );

      return [
        pageId,
        post.draft
          ? { label: `${post.title} — In progress` }
          : {
              href: `/en/case-study/${post.slug}`,
              label: post.title,
            },
      ];
    }),
  );
}

export const getSeriesPageBySlug = cache(
  async (
    slug: string,
    locale: Locale = "en",
  ): Promise<NotionSeriesPage | null> => {
    if (locale !== "en") return null;

    const parsedSlug = parseBlogSlug(slug);
    const databaseId = NOTION_DATABASE_ID_SERIES || "";
    if (!parsedSlug || !databaseId) return null;

    try {
      const directPage =
        parsedSlug === SERVEXA_SERIES_SLUG
          ? await notion.pages.retrieve({ page_id: SERVEXA_SERIES_PAGE_ID })
          : null;
      const rawPages = directPage
        ? []
        : await queryAllDataSourcePages(notion, databaseId);
      const page =
        directPage ||
        rawPages.find((candidate) => {
          if (!isFullPage(candidate)) return false;
          return (
            extractPlainText(candidate.properties[SERIES_PROPERTIES.slug]) ===
            parsedSlug
          );
        });

      if (!page || !isFullPage(page)) return null;

      const title =
        extractPlainText(page.properties[SERIES_PROPERTIES.title]) ||
        "Untitled series";
      const description =
        extractPlainText(page.properties[SERIES_PROPERTIES.description]) ||
        title;
      const status =
        extractStatus(page.properties[SERIES_PROPERTIES.status]) ||
        "In progress";
      const [blockTree, posts] = await Promise.all([
        fetchPageBlockTree(notion, page.id),
        getAllPublishedPosts("en", true),
      ]);
      const stats = calculateNotionReadingStats(blockTree);

      return {
        generalInfo: {
          kind: "case-study",
          title,
          subtitle: description,
          description,
          author: "Nguyen Minh Quan",
          publishedAt: page.created_time.slice(0, 10),
          updatedAt: page.last_edited_time.slice(0, 10),
          image: parsedSlug === SERVEXA_SERIES_SLUG ? SERVEXA_COVER : undefined,
          imageAlt:
            parsedSlug === SERVEXA_SERIES_SLUG
              ? "Servexa Warranty AI cover"
              : undefined,
          draft: false,
          slug: parsedSlug,
          locale,
          tags: ["Case Study", "System Design"],
          body: "",
          readingMinutes: stats.readingMinutes,
          readingStats: stats,
          sourcePath: `notion://${page.id}`,
        },
        blockTree,
        linkOverrides: buildPostLinkOverrides(posts),
        status,
      };
    } catch (error) {
      console.warn(`Failed to fetch Notion series ${slug}:`, error);
      return null;
    }
  },
);
