import { NextResponse } from "next/server";
import { getCombinedPublishedPosts } from "@/common/blog/resolve-post";

export async function GET() {
  try {
    const posts = await getCombinedPublishedPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
