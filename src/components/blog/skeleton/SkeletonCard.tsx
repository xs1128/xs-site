interface SkeletonCardProps {
  isSmallScreen?: boolean;
  className?: string;
}

export default function SkeletonCard({
  isSmallScreen = false,
  className = '',
}: SkeletonCardProps) {
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
  // Match BlogCard dimensions exactly.
  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#363D44',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 'clamp(6px, 1vw, 10px)',
    overflow: 'hidden',
    height: isSmallScreen ? 'min(100%, 200px)' : 'min(100%, 260px)',
    aspectRatio: isSmallScreen ? '160 / 200' : '200 / 260',
    width: 'auto',
    flexShrink: 0,
  };
  const imageAreaStyle: React.CSSProperties = {
    width: '100%',
    height: '64%',
    backgroundColor: '#3E454C',
    position: 'relative',
    overflow: 'hidden',
  };
  const titleBarStyle: React.CSSProperties = {
    backgroundColor: '#1A1D21',
    padding: 'clamp(12px, 2vh, 20px)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '8px',
  };
  const titleSkeletonStyle: React.CSSProperties = {
    width: '90%',
    height: '14px',
    backgroundColor: '#3E454C',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
  };
  const metadataSkeletonStyle: React.CSSProperties = {
    width: '60%',
    height: '11px',
    backgroundColor: '#3E454C',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
  };
  return (
    <div style={cardStyle} className={className}>
      <div style={imageAreaStyle}>
        <div style={shimmerStyle} />
      </div>
      <div style={titleBarStyle}>
        <div style={titleSkeletonStyle}>
          <div style={shimmerStyle} />
        </div>
        <div style={metadataSkeletonStyle}>
          <div style={shimmerStyle} />
        </div>
      </div>
    </div>
  );
}
