import { spacing } from '@/styles/blog/typography'

interface SkeletonListProps {
  items?: number
  variant?: 'heading' | 'post' | 'tag'
  className?: string
}

export default function SkeletonList({
  items = 3,
  variant = 'post',
  className = '',
}: SkeletonListProps) {
  const shimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, #3E454C 0%, #4A535C 50%, #3E454C 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s ease-in-out infinite',
  }

  if (variant === 'tag') {
    // Tag pills
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.sm,
    }

    const tagStyle: React.CSSProperties = {
      height: '32px',
      padding: '6px 12px',
      borderRadius: '20px',
      border: '1px solid rgba(229, 83, 44, 0.25)',
      backgroundColor: '#3E454C',
      position: 'relative',
      overflow: 'hidden',
    }

    return (
      <div style={containerStyle} className={className}>
        {[...Array(items)].map((_, index) => (
          <div key={index} style={tagStyle}>
            <div style={shimmerStyle} />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'heading') {
    // TOC headings with indentation
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
    }

    const headingStyle = (level: number): React.CSSProperties => ({
      height: '14px',
      backgroundColor: '#3E454C',
      borderRadius: '4px',
      marginLeft: `${level * 16}px`,
      width: level === 0 ? '90%' : '75%',
      position: 'relative',
      overflow: 'hidden',
    })

    return (
      <div style={containerStyle} className={className}>
        {[...Array(items)].map((_, index) => (
          <div key={index} style={headingStyle(index % 3)}>
            <div style={shimmerStyle} />
          </div>
        ))}
      </div>
    )
  }

  // Post variant (for related posts, series posts)
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  }

  const itemStyle: React.CSSProperties = {
    padding: spacing.md,
    backgroundColor: '#363D44',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  }

  const titleStyle: React.CSSProperties = {
    width: '85%',
    height: '16px',
    backgroundColor: '#3E454C',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
  }

  const metaStyle: React.CSSProperties = {
    width: '50%',
    height: '12px',
    backgroundColor: '#3E454C',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div style={containerStyle} className={className}>
      {[...Array(items)].map((_, index) => (
        <div key={index} style={itemStyle}>
          <div style={titleStyle}>
            <div style={shimmerStyle} />
          </div>
          <div style={metaStyle}>
            <div style={shimmerStyle} />
          </div>
        </div>
      ))}
    </div>
  )
}
