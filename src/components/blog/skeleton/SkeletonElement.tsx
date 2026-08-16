interface SkeletonElementProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular'
  className?: string
  style?: React.CSSProperties
}

export default function SkeletonElement({
  width = '100%',
  height = '1em',
  variant = 'rectangular',
  className = '',
  style = {},
}: SkeletonElementProps) {
  const baseStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: '#3E454C',
    borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? '4px' : '4px',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  }

  const shimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, #3E454C 0%, #4A535C 50%, #3E454C 100%)',
    backgroundSize: '200% 100%',
    animation: 'blogShimmer 1.5s ease-in-out infinite',
  }

  return (
    <div style={baseStyle} className={`skeleton-element ${className}`}>
      <div style={shimmerStyle} />
    </div>
  )
}
