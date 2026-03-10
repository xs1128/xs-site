import Link from 'next/link'
import type { SeriesDetail } from '@/types/post'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'

interface SeriesHeaderProps {
  series: SeriesDetail
}

export default function SeriesHeader({ series }: SeriesHeaderProps) {
  const headerStyle: React.CSSProperties = {
    padding: 'clamp(40px, 6vh, 80px) clamp(20px, 3vh, 40px)',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  }

  const backButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    fontWeight: 600,
    color: colors.accent,
    textDecoration: 'none',
    marginBottom: spacing.md,
    transition: TRANSITIONS.fast('color'),
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp['2xl'],
    fontWeight: 700,
    color: colors.darkText,
    marginBottom: spacing.md,
    lineHeight: 1.2,
  }

  const descriptionStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    color: '#CCCCCC',
    lineHeight: 1.6,
    maxWidth: '800px',
  }

  return (
    <header style={headerStyle}>
      <Link
        href="/"
        style={backButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#CC4420'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.accent
        }}
      >
        ← Back to Home
      </Link>
      <h1 style={titleStyle}>{series.title}</h1>
      {series.description && (
        <p style={descriptionStyle}>{series.description}</p>
      )}
    </header>
  )
}
