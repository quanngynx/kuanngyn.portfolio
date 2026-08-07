import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  const expectedSecret = process.env.BLOG_PREVIEW_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!slug || !slug.startsWith('/') || slug.startsWith('//')) {
    return new Response('Invalid redirect path', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(slug)
}
