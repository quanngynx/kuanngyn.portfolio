export interface ReadingStats {
  wordCount: number
  sectionCount: number
  readingMinutes: number
}

export function calculateReadingStats(bodyText: string): ReadingStats {
  const trimmed = bodyText.trim()
  if (!trimmed) {
    return { wordCount: 0, sectionCount: 0, readingMinutes: 1 }
  }

  const words = trimmed.split(/\s+/u).length
  const headingMatches = trimmed.match(/^#{1,6}\s+/gm)
  const sectionCount = headingMatches ? headingMatches.length : 0
  const readingMinutes = Math.max(1, Math.ceil(words / 200))

  return {
    wordCount: words,
    sectionCount,
    readingMinutes
  }
}
