'use client'

import { spacing } from '@/styles/typography'
import { SkeletonHero } from '@/components/skeleton'

interface PostHeroProps {
  imageUrl: string
  alt?: string
  loading?: boolean
}

export default function PostHero({ imageUrl, alt = 'Featured image', loading = false }: PostHeroProps) {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxHeight: '400px',
    position: 'relative',
    marginBottom: spacing.lg,
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '400px',
    width: 'auto',
    height: 'auto',
    borderRadius: '8px',
  }

  return (
    <div style={containerStyle}>
      {loading ? (
        <SkeletonHero />
      ) : (
        <img src={imageUrl} alt={alt} style={imageStyle} />
      )}
    </div>
  )
}
