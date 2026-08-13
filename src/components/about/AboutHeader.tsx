import React from 'react';
import type { AboutHeaderProps } from '@/types';
import { scrollToAbout } from '@/lib/utils';

/**
 * About section header with ABOUT button
 * Positioned absolutely at the top-left of the about section
 */
export function AboutHeader({ isSmallScreen }: AboutHeaderProps) {
  return (
    <div className="about-header">
      <button
        onClick={scrollToAbout}
        className="about-header__button"
      >
        ABOUT
        <span className="about-header__underline" />
      </button>
    </div>
  );
}
