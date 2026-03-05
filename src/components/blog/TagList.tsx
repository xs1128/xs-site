'use client'

import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'

interface TagListProps {
  tags: string[]
}

export default function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
    marginTop: spacing.lg,
  }

  const tagStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.xs,
    fontWeight: 500,
    color: colors.accent,
    backgroundColor: `${colors.accent}15`,
    padding: '6px 12px',
    borderRadius: '20px',
    border: `1px solid ${colors.accent}40`,
  }

  return (
    <div style={containerStyle}>
      {tags.map((tag) => (
        <span key={tag} style={tagStyle}>
          #{tag}
        </span>
      ))}
    </div>
  )
}
