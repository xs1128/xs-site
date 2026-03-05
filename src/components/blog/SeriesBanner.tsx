'use client'

import Link from 'next/link'
import type { SeriesDetail } from '@/types/post'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'

interface SeriesBannerProps {
  series: SeriesDetail
  currentPostSlug: string
}

export default function SeriesBanner({ series, currentPostSlug }: SeriesBannerProps) {
  if (!series) return null

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: 'rgba(229, 83, 44, 0.1)',
    border: `1px solid ${colors.accent}`,
    borderRadius: '4px',
    padding: '4px 12px',
    marginBottom: spacing.md,
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.xs,
    fontWeight: 600,
    color: colors.accent,
    textDecoration: 'none',
    transition: TRANSITIONS.fast('color'),
  }

  return (
    <Link
      href={`/series/${series.slug}`}
      style={containerStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(229, 83, 44, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(229, 83, 44, 0.1)'
      }}
    >
      <span style={linkStyle}>
        <span>{series.title}</span>
      </span>
    </Link>
  )
}
