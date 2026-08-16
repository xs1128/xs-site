import { spacing } from '@/styles/blog/typography';

interface SkeletonHeroProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function SkeletonHero({
  width = '100%',
  height = '280px',
  className = '',
}: SkeletonHeroProps) {
  const containerStyle: React.CSSProperties = {
    width,
    height,
    maxHeight: '400px',
    position: 'relative',
    marginBottom: spacing.lg,
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#3E454C',
  };

  const shimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, #3E454C 0%, #4A535C 50%, #3E454C 100%)',
    backgroundSize: '200% 100%',
    animation: 'blogShimmer 1.5s ease-in-out infinite',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={shimmerStyle} />
    </div>
  );
}
