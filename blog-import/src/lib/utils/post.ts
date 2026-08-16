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
 * Strip inline markdown (code, bold, italic, strikethrough, links, images)
 * down to its plain text. Used so a heading's TOC label and its DOM id are
 * derived from the SAME text the renderer ends up showing.
 *
 * Without this, `## Why \`yt-dlp\`?` slugs from raw markdown ("why-yt-dlp")
 * while the rendered <h2> slugs from "[object Object]", so the two never match,
 * breaking both scroll-to-section and active highlighting.
 */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // image -> alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // link -> link text
    .replace(/`([^`]+)`/g, '$1')              // inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1')        // bold
    .replace(/__([^_]+)__/g, '$1')            // bold
    .replace(/\*([^*]+)\*/g, '$1')            // italic
    .replace(/_([^_]+)_/g, '$1')              // italic
    .replace(/~~([^~]+)~~/g, '$1')            // strikethrough
    .trim()
}

/**
 * Slugify already-plain heading text into a stable DOM id fragment.
 * Shared by extractHeadings and PostContent so ids are identical on both sides.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extract headings (h1–h6) from markdown content for TOC.
 * Stores plain (markdown-stripped) text and a slug id that matches the id the
 * renderer assigns to each heading element.
 */
export function extractHeadings(content: string): Heading[] {
  if (!content) return []

  const headings: Heading[] = []
  const lines = content.split('\n')
  const headingCount: Record<string, number> = {}
  let inFence = false

  for (const line of lines) {
    // Skip fenced code blocks so "# comment" inside code isn't treated as a heading.
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    // Match h1 (#) through h6 (######) headings
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = stripInlineMarkdown(match[2].trim())
      if (!text) continue

      const baseId = slugifyHeading(text)

      // Handle duplicates deterministically (same scheme as the renderer).
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
