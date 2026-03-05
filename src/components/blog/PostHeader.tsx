import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import type { Post, SeriesDetail } from '@/types/post'
import { formatDate, formatReadTime } from '@/lib/utils/post'

interface PostHeaderProps {
  post: Post
  series?: SeriesDetail[]
}

export default function PostHeader({ post, series }: PostHeaderProps) {
  // Cap series at 3 and add "..." if more
  const displaySeries = series && series.length > 0 ? series.slice(0, 3) : []
  const hasMoreSeries = series && series.length > 3
  const containerStyle: React.CSSProperties = {
    marginBottom: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp['3xl'],
    fontWeight: 700,
    color: colors.darkText,
    marginBottom: spacing.lg,
    lineHeight: 1.2,
    textAlign: 'left' as const,
  }

  const metaContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottom: `1px solid ${colors.border}`,
  }

  const metaLeftStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  }

  const metaRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  }

  const metaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#999999',
  }

  const authorStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#999999',
    fontWeight: 500,
  }

  const seriesStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: colors.accent,
    fontWeight: 500,
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{post.title}</h1>

      <div style={metaContainerStyle}>
        <div style={metaLeftStyle}>
          {post.date && (
            <div style={metaItemStyle}>
              <span>{formatDate(post.date)}</span>
            </div>
          )}

          {post.read_time && (
            <div style={metaItemStyle}>
              <span>·</span>
              <span>{formatReadTime(post.read_time)}</span>
            </div>
          )}

          {displaySeries.length > 0 && (
            <div style={metaItemStyle}>
              <span>·</span>
              {displaySeries.map((s, index) => (
                <span key={s.id}>
                  <span style={seriesStyle}>{s.title}</span>
                  {index < displaySeries.length - 1 && ', '}
                  {index === displaySeries.length - 1 && hasMoreSeries && (
                    <span style={{ color: '#999999' }}>...</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={metaRightStyle}>
          <span style={authorStyle}>{post.author_name || 'Author'}</span>
        </div>
      </div>
    </div>
  )
}
