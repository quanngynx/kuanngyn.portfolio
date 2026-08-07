import { Client } from "@notionhq/client";
import { NOTION_TOKEN } from "../venv";

export const NOTION_API_VERSION = "2025-09-03";

if (!NOTION_TOKEN) {
  console.warn("NOTION_ACCESS_TOKEN is missing in environment variables");
}

export const notion = new Client({
  auth: NOTION_TOKEN || "",
  notionVersion: NOTION_API_VERSION,
});
