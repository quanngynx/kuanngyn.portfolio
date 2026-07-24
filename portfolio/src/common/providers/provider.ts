import fs from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { findRepeatingElements } from '../utils/array'

export const contentTypes = ['article', 'youtube-video', 'talk'] as const
export type ContentType = (typeof contentTypes)[number]

export interface Content {
  type: ContentType
  title: string
  description: string
  thumbnail: string
  slug: string
  date: string
  tags: string[]
  body: string
  published: boolean
}

const CONTENT_SUBDIRS: Record<ContentType, string> = {
  article: 'articles',
  'youtube-video': 'youtube-videos',
  talk: 'talks',
}

const getContent = async <T extends Content>(
  subDir: string,
  type: ContentType
): Promise<T[]> => {
  const contentPath = path.join(process.cwd(), 'src', 'lib', 'content', subDir)

  try {
    const content = await fs.readdir(contentPath)

    return await Promise.all(
      content
        .filter((file) => path.extname(file) === '.mdx')
        .map(async (file) => {
          const filePath = path.join(contentPath, file)
          const [fileName] = file.split('.')
          const fileContent = await fs.readFile(filePath, 'utf8')
          const { data, content } = matter(fileContent)

          return {
            ...data,
            body: content,
            slug: fileName,
            type,
          } as T
        })
    )
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ENOENT'
    ) {
      return []
    }
    throw error
  }
}

export class NonUniqueSlugsError extends Error {
  constructor(nonUniqueSlugs: string[]) {
    super(
      `All content slugs must be unique. Found ${nonUniqueSlugs.length} non-unique slugs: ${nonUniqueSlugs.toString()}`
    )
    this.name = 'NonUniqueSlugsError'
  }
}

export const getAllContent = async (): Promise<Content[]> => {
  const contentEntries = await Promise.all(
    Object.entries(CONTENT_SUBDIRS).map(([contentType, subDir]) =>
      getContent(subDir, contentType as ContentType)
    )
  )
  const content = contentEntries.flat()

  const nonUniqueSlugs = findRepeatingElements(content, (entry) => entry.slug)
  if (nonUniqueSlugs.length) {
    throw new NonUniqueSlugsError(nonUniqueSlugs)
  }

  return content.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export const getContentEntry = async (
  slug: string
): Promise<Content | undefined> => {
  const content = await getAllContent()

  return content.find((item) => item.slug === slug)
}

