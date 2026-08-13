import React from 'react';
import { scrollToAbout } from '@/lib/utils';

/**
 * About section header with ABOUT button
 * Positioned absolutely at the top-left of the about section
 */
export function AboutHeader() {
  return (
    <div className="about-header">
      <button onClick={scrollToAbout} className="about-header__button">
        ABOUT
        <span className="about-header__underline" />
      </button>
    </div>
  );
}
