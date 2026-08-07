import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateReadingStats } from './reading-stats.ts'

test('calculateReadingStats returns wordCount, sectionCount, and readingMinutes', () => {
  const sampleBody = `# Introduction
This is a sample blog post body with several words to calculate reading statistics accurately.

## Section 1
Here is more text inside the first section.

## Section 2
And another section with more words.`

  const stats = calculateReadingStats(sampleBody)
  assert.equal(stats.sectionCount, 3)
  assert.ok(stats.wordCount > 30)
  assert.equal(stats.readingMinutes, 1)
})

test('calculateReadingStats handles empty body gracefully', () => {
  const stats = calculateReadingStats('')
  assert.equal(stats.wordCount, 0)
  assert.equal(stats.sectionCount, 0)
  assert.equal(stats.readingMinutes, 1)
})
