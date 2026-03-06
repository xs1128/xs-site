import React from 'react';
import type { SocialIconLinkProps } from '@/types';

/**
 * Social media icon link with hover effects
 * Displays icon in a circular container with scale and color change on hover
 */
export function SocialIconLink({ href, 'aria-label': ariaLabel, children }: SocialIconLinkProps) {
  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      className="social-icon-link"
    >
      {children}
    </a>
  );
}
