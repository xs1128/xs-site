'use client'

import Link from 'next/link'
import type { Post } from '@/types/post'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'

interface OtherPostsProps {
  posts: Post[]
}

export default function OtherPosts({ posts }: OtherPostsProps) {
  if (!posts || posts.length === 0) return null

  const containerStyle: React.CSSProperties = {
    marginTop: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    fontWeight: 700,
    color: colors.text,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.xs,
  }

  const linkStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#666666',
    textDecoration: 'none',
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.card,
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    transition: TRANSITIONS.fast('all'),
    cursor: 'pointer',
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Other Posts</h3>
      <ul style={listStyle}>
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.slug}`}
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.border
                e.currentTarget.style.color = colors.text
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.card
                e.currentTarget.style.color = '#666666'
              }}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
