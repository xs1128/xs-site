'use client'

import { spacing } from '@/styles/typography'

interface PostHeroProps {
  imageUrl: string
  alt?: string
}

export default function PostHero({ imageUrl, alt = 'Featured image' }: PostHeroProps) {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
    position: 'relative',
    marginBottom: spacing.lg,
    borderRadius: '12px',
    overflow: 'hidden',
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }

  return (
    <div style={containerStyle}>
      <img src={imageUrl} alt={alt} style={imageStyle} />
    </div>
  )
}
