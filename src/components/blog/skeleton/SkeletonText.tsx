import { spacing } from '@/styles/blog/typography';

interface SkeletonTextProps {
  lines?: number;
  width?: string | string[];
  height?: string;
  className?: string;
}

export default function SkeletonText({
  lines = 1,
  width = '100%',
  height = '1em',
  className = '',
}: SkeletonTextProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  };

  const getLineWidth = (index: number): string => {
    if (Array.isArray(width)) {
      return width[index] || width[width.length - 1];
    }
    return width;
  };

  return (
    <div style={containerStyle} className={className}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          style={{
            width: getLineWidth(index),
            height,
            backgroundColor: '#3E454C',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(90deg, #3E454C 0%, #4A535C 50%, #3E454C 100%)',
              backgroundSize: '200% 100%',
              animation: 'blogShimmer 1.5s ease-in-out infinite',
            }}
          />
        </div>
      ))}
    </div>
  );
}
