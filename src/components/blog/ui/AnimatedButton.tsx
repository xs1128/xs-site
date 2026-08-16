'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useButtonAnimations } from '@/hooks/useButtonAnimations';

type AnimationVariant = 'underline' | 'text-fill' | 'both';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: AnimationVariant;
  reverse?: boolean;
  style?: React.CSSProperties;
  className?: string;
  // Legacy props for backward compatibility
  isMenuButton?: boolean;
  isDropdownItem?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  href,
  variant = 'underline',
  reverse = false,
  style,
  className = '',
  isMenuButton = false,
  isDropdownItem = false,
}: AnimatedButtonProps) {
  // Load button animations
  useButtonAnimations();

  // Build class name based on variant
  const getClassName = () => {
    const baseClass = className;

    let variantClass = '';
    switch (variant) {
      case 'underline':
        variantClass = 'btn-underline';
        break;
      case 'text-fill':
        variantClass = 'btn-text-fill';
        break;
      case 'both':
        variantClass = 'btn-both';
        break;
    }

    const reverseClass =
      reverse && variant !== 'text-fill' ? 'btn-underline-reverse' : '';

    return `${baseClass} ${variantClass} ${reverseClass}`.trim();
  };

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
    padding: isMenuButton ? '12px 20px' : '0',
    borderRadius: isMenuButton ? '8px' : isDropdownItem ? '0' : '4px',
    transition:
      'opacity 0.2s ease, color 0.3s ease, transform 0.4s var(--ease-out-back) 0.8s',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    overflow:
      variant === 'text-fill' || variant === 'both' ? 'visible' : 'hidden',
    ...style,
  };

  const menuButtonStyle: React.CSSProperties = isMenuButton
    ? {
        backgroundColor: '#E4D9C2',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    : {};

  const combinedStyle = { ...baseStyle, ...menuButtonStyle };

  // Wrap children in span for text-fill and both variants
  const shouldWrapChildren = variant === 'text-fill' || variant === 'both';
  const content = shouldWrapChildren ? <span>{children}</span> : children;

  // Add underline for underline and both variants
  const underline =
    variant === 'underline' || variant === 'both' ? (
      <span className="btn-underline-line" />
    ) : null;

  const buttonContent = (
    <>
      {content}
      {underline}
    </>
  );

  // Get data-text attribute for text-fill animations
  const getTextData = () => {
    if (variant === 'text-fill' || variant === 'both') {
      // Extract text from children
      const text = typeof children === 'string' ? children : undefined;
      return text ? { 'data-text': text } : {};
    }
    return {};
  };

  const buttonProps = {
    className: getClassName(),
    style: combinedStyle,
    ...getTextData(),
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
