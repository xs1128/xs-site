'use client';

import { useIsMobile } from '@/hooks/useBreakpoint';
import AnimatedButton from '@/components/blog/ui/AnimatedButton';

interface BlogPageHeaderProps {
  onMenuClick: () => void;
}

export default function BlogPageHeader({ onMenuClick }: BlogPageHeaderProps) {
  const isMobile = useIsMobile();

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'clamp(12px, 2vh, 24px) clamp(20px, 3vh, 40px)',
    backgroundColor: 'var(--color-dark-text)',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: 'var(--font-primary)',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: 'var(--color-dark-background)',
    textDecoration: 'none',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    paddingBottom: '4px',
  };

  const menuButtonStyle: React.CSSProperties = {
    fontFamily: 'var(--font-primary)',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: 'var(--color-dark-background)',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <header style={headerStyle}>
      <AnimatedButton variant="underline" href="/blog" style={logoStyle}>
        BLOG
      </AnimatedButton>
      <AnimatedButton
        variant="underline"
        reverse
        onClick={onMenuClick}
        style={menuButtonStyle}
      >
        <span
          style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            transform: 'translateY(-4px)',
            display: 'inline-block',
          }}
        >
          ☰
        </span>
        {!isMobile && <span>MENU</span>}
      </AnimatedButton>
    </header>
  );
}
