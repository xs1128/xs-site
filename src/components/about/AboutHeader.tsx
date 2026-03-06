import React from 'react';
import type { AboutHeaderProps } from '@/types';
import { scrollToAbout } from '@/lib/utils';

/**
 * About section header with ABOUT button
 * Positioned absolutely at the top-left of the about section
 */
export function AboutHeader({ isSmallScreen, setIsDarkTheme }: AboutHeaderProps) {
  return (
    <div className="about-header">
      <button
        onClick={() => scrollToAbout(setIsDarkTheme)}
        className="about-header__button"
      >
        ABOUT
        <span className="about-header__underline" />
      </button>
    </div>
  );
}
