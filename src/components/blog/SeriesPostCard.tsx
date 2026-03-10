import Link from 'next/link'
import type { SeriesPost } from '@/types/post'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'

interface SeriesPostCardProps {
  post: SeriesPost
}

export default function SeriesPostCard({ post }: SeriesPostCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#E4D9C2',
    border: '1px solid #D6CBB3',
    borderRadius: '8px',
    padding: spacing.md,
    textDecoration: 'none',
    transition: TRANSITIONS.fast('all'),
    display: 'block',
  }

  const orderStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.xs,
    fontWeight: 700,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: spacing.xs,
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.lg,
    fontWeight: 700,
    color: colors.darkText,
    marginBottom: spacing.sm,
  }

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#666666',
    marginBottom: spacing.sm,
  }

  const excerptStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#666666',
    lineHeight: 1.6,
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = colors.accent
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#D6CBB3'
      }}
    >
      <div style={orderStyle}>
        Part {post.order_in_series}
      </div>
      <h2 style={titleStyle}>{post.title}</h2>
      <div style={metaStyle}>
        <span>{formatDate(post.date)}</span>
        {post.read_time && (
          <>
            <span>•</span>
            <span>{post.read_time} min read</span>
          </>
        )}
      </div>
      {post.summary && (
        <p style={excerptStyle}>{post.summary}</p>
      )}
    </Link>
  )
}
