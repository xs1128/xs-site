import React from 'react';
import type { ContactHeaderProps } from '@/types';

/**
 * Contact section header with CONTACT button
 * Positioned absolutely at the top-left of the contact section
 * Scrolls to top when clicked
 */
export function ContactHeader({ isSmallScreen }: ContactHeaderProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="contact-header">
      <button onClick={handleScrollToTop} className="contact-header__button">
        CONTACT
        <span className="contact-header__underline" />
      </button>
    </div>
  );
}
