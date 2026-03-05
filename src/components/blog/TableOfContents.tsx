'use client'

import type { Heading } from '@/types/post'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS, TIMING } from '@/styles/animations'

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {

  function scrollToHeading(headingId: string) {
    const element = document.getElementById(headingId)
    if (element) {
      const offset = 80 // Account for fixed header if any
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const getIndentPadding = (level: number): string => {
    const baseIndent = 12  // Base indentation unit in pixels
    switch (level) {
      case 1: return '0'
      case 2: return `${baseIndent}px`
      case 3: return `${baseIndent * 2}px`
      case 4: return `${baseIndent * 3}px`
      case 5: return `${baseIndent * 4}px`
      case 6: return `${baseIndent * 5}px`
      default: return '0'
    }
  }

  const containerStyle: React.CSSProperties = {
    position: 'sticky',
    top: '120px',
    width: '100%',
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
    paddingLeft: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    fontWeight: 700,
    color: colors.darkText,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }

  const getHeadingStyle = (level: number): React.CSSProperties => ({
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    fontWeight: 400,
    color: '#999999',
    cursor: 'pointer',
    padding: `${spacing.xs} 0`,
    paddingLeft: getIndentPadding(level),
    transition: `color ${TIMING.slower} ${TIMING.smooth}, font-weight ${TIMING.medium} ${TIMING.smooth}, transform ${TIMING.fast} ${TIMING.smooth}`,
    borderLeft: level > 1 ? `1px solid ${colors.border}` : 'none',
  })

  if (headings.length === 0) return null

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Contents</h3>

      <ul style={listStyle}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={getHeadingStyle(heading.level)}
            onClick={() => scrollToHeading(heading.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#999999'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            {heading.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
