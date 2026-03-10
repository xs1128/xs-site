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
    backgroundColor: '#3E454C',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: 'clamp(20px, 4vh, 28px)',
    textDecoration: 'none',
    transition: TRANSITIONS.fast('all'),
    display: 'block',
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.lg,
    fontWeight: 700,
    color: colors.darkText,
    marginBottom: 'clamp(12px, 2vh, 16px)',
  }

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#CCCCCC',
    marginBottom: 'clamp(12px, 2vh, 16px)',
  }

  const excerptStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#CCCCCC',
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
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
      }}
    >
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
