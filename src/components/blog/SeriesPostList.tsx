import type { SeriesPost } from '@/types/post'
import SeriesPostCard from './SeriesPostCard'
import { spacing } from '@/styles/typography'

interface SeriesPostListProps {
  posts: SeriesPost[]
}

export default function SeriesPostList({ posts }: SeriesPostListProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 clamp(32px, 5vh, 60px) clamp(40px, 6vh, 80px)`,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  }

  const emptyStateStyle: React.CSSProperties = {
    fontFamily: 'var(--font-primary)',
    fontSize: 'clamp(14px, 2vw, 18px)',
    color: '#CCCCCC',
    textAlign: 'center',
    padding: 'clamp(40px, 6vh, 80px)',
  }

  if (!posts || posts.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={emptyStateStyle}>
          This series has no posts yet.
        </p>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {posts.map((post) => (
        <SeriesPostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
