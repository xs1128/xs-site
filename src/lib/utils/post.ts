import type { Heading } from '@/types/post'

/**
 * Calculate estimated reading time for post content
 * Average reading speed: 200 words per minute
 */
export function calculateReadTime(content: string): number {
  if (!content) return 0

  // Remove markdown syntax for word count
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '')         // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/[#*_~`-]/g, '')        // Remove markdown chars

  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length

  // Calculate: 200 words per minute, minimum 1 minute
  return Math.max(1, Math.ceil(wordCount / 200))
}

/**
 * Extract headings (h2, h3) from markdown content for TOC
 */
export function extractHeadings(content: string): Heading[] {
  if (!content) return []

  const headings: Heading[] = []
  const lines = content.split('\n')
  const headingCount: Record<string, number> = {}

  for (const line of lines) {
    // Match h1 (#) through h6 (######) headings
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()

      // Generate slug-friendly ID
      const baseId = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Handle duplicates
      if (!headingCount[baseId]) {
        headingCount[baseId] = 0
      }

      const count = headingCount[baseId]
      headingCount[baseId]++

      const id = count === 0 ? baseId : `${baseId}-${count}`

      headings.push({ id, text, level })
    }
  }

  return headings
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!slug) {
    throw new Error('Please enter a valid title')
  }

  return slug
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format read time for display
 */
export function formatReadTime(minutes: number): string {
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}
