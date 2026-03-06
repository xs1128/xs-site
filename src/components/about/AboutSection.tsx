import React from 'react';
import type { AboutSectionProps } from '@/types';
import { AboutHeader } from './AboutHeader';
import { AboutContent } from './AboutContent';

/**
 * About section wrapper component
 * Contains header navigation and main content
 */
export function AboutSection({ isSmallScreen, setIsDarkTheme }: AboutSectionProps) {
  return (
    <section id="about" className="about-section">
      <AboutHeader
        isSmallScreen={isSmallScreen}
        setIsDarkTheme={setIsDarkTheme}
      />
      <AboutContent
        isSmallScreen={isSmallScreen}
        onScrollToContact={() => {
          const contactSection = document.getElementById("contact");
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
    </section>
  );
}
