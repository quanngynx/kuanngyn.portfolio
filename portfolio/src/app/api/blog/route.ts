import { NextResponse } from 'next/server'
import { getAllPublishedPosts } from '@/common/blog/notion-posts'

export async function GET() {
  try {
    const posts = await getAllPublishedPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
