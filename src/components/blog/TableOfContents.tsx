'use client'

import { useState, useEffect } from 'react'
import type { Heading } from '@/types/post'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS, TIMING } from '@/styles/animations'
import { SkeletonList } from '@/components/skeleton'

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

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
    width: '100%',
    marginBottom: spacing.md,
    paddingLeft: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    fontWeight: 700,
    color: colors.darkText,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }

  const getHeadingStyle = (level: number, isActive: boolean, isHovered: boolean): React.CSSProperties => ({
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? colors.accent : (isHovered ? colors.darkText : '#999999'),
    cursor: 'pointer',
    padding: `${spacing.xs} 0`,
    paddingLeft: getIndentPadding(level),
    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
    transition: `color ${TIMING.slower} ${TIMING.smooth}, transform ${TIMING.fast} ${TIMING.smooth}`,
    borderLeft: level > 1 ? `1px solid ${colors.border}` : 'none',
  })

  if (headings.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Contents</h3>
        <SkeletonList variant="heading" items={5} />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Contents</h3>

      <ul style={listStyle}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={getHeadingStyle(heading.level, activeId === heading.id, hoveredId === heading.id)}
            onClick={() => scrollToHeading(heading.id)}
            onMouseEnter={() => setHoveredId(heading.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {heading.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
