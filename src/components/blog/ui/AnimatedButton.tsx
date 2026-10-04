'use client';

import Link from 'next/link';
import { useButtonAnimations } from '@/hooks/useButtonAnimations';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  reverse?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  href,
  reverse = false,
  style,
  className = '',
}: AnimatedButtonProps) {
  useButtonAnimations();

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'clamp(4px, 0.5vw, 8px)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: '#2A2F35',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    borderRadius: '4px',
    transition:
      'opacity 0.2s ease, color 0.3s ease, transform 0.4s var(--ease-out-back) 0.8s',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    overflow: 'hidden',
    ...style,
  };

  const buttonContent = (
    <>
      {children}
      <span className="btn-underline-line" />
    </>
  );

  const buttonProps = {
    className:
      `${className} btn-underline ${reverse ? 'btn-underline-reverse' : ''}`.trim(),
    style: baseStyle,
  };

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link href={href} {...buttonProps}>
          {buttonContent}
        </Link>
      );
    }
    return (
      <a href={href} {...buttonProps}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button onClick={onClick} {...buttonProps}>
      {buttonContent}
    </button>
  );
}
