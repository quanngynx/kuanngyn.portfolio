import { cache } from "react";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "./notion-client";
import { queryAllDataSourcePages } from "./notion-data-source";
import { checkForDuplicateSlugs, parsePostMetadata } from "./post-metadata";
import { fetchPageBlockTree } from "./notion-blocks";
import { NOTION_DATABASE_ID } from "../venv";
import type { BlogPost } from "./content-schema";
import type { Locale } from "../i18n/routes";
import type { NotionBlockNode } from "./notion-types";

function isFullPage(page: unknown): page is PageObjectResponse {
  return typeof page === "object" && page !== null && "properties" in page;
}

export const getAllPublishedPosts = cache(
  async (
    locale: Locale = "en",
    includeDrafts = false,
  ): Promise<BlogPost[]> => {
    const databaseId = NOTION_DATABASE_ID || "";
    if (!databaseId) {
      console.warn("NOTION_DATABASE_ID is missing in environment variables");
      return [];
    }

    try {
      const filter = includeDrafts
        ? undefined
        : process.env.NODE_ENV === "production"
          ? {
              property: "Status",
              status: {
                equals: "Done",
              },
            }
          : {
              or: [
                { property: "Status", status: { equals: "Done" } },
                { property: "Status", status: { equals: "In progress" } },
              ],
            };

      const rawPages = await queryAllDataSourcePages(notion, databaseId, {
        filter,
        sorts: [
          {
            property: "PublishedAt",
            direction: "descending",
          },
        ],
      });

      const posts: BlogPost[] = [];
      for (const page of rawPages) {
        if (isFullPage(page)) {
          const post = parsePostMetadata(page, locale);
          posts.push(post);
        }
      }

      checkForDuplicateSlugs(posts);
      return posts;
    } catch (error) {
      console.warn("Failed to fetch published posts from Notion API:", error);
      return [];
    }
  },
);

export const getPostGeneralInfoBySlug = cache(
  async (
    slug: string,
    locale: Locale = "en",
    includeDrafts = false,
  ): Promise<BlogPost | undefined> => {
    const posts = await getAllPublishedPosts(locale, includeDrafts);
    return posts.find((p) => p.slug === slug);
  },
);

export const getPageBySlug = cache(
  async (
    slug: string,
    locale: Locale = "en",
    options?: { includeDrafts?: boolean },
  ): Promise<{
    generalInfo: BlogPost;
    blockTree: NotionBlockNode[];
  } | null> => {
    const includeDrafts = options?.includeDrafts ?? false;
    const generalInfo = await getPostGeneralInfoBySlug(
      slug,
      locale,
      includeDrafts,
    );
    if (!generalInfo) return null;

    try {
      const pageId = generalInfo.sourcePath.replace("notion://", "");
      const blockTree = await fetchPageBlockTree(notion, pageId);

      return {
        generalInfo,
        blockTree,
      };
    } catch (error) {
      console.warn(
        `Failed to fetch block tree for Notion page ${slug}:`,
        error,
      );
      return null;
    }
  },
);
