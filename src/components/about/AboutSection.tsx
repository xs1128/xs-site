import React, { useRef } from 'react';
import { AboutHeader } from './AboutHeader';
import { AboutContent } from './AboutContent';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { useCursorGlow } from '@/hooks/useCursorGlow';
import { scrollToContact } from '@/lib/utils';

/**
 * About section wrapper component
 * Contains header navigation and main content
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isVisible } = useIntersectionAnimation(sectionRef, {
    threshold: 0.15,
    rootMargin: '-50px',
  });
  const glowHandlers = useCursorGlow(sectionRef);

  return (
    <section
      id="about"
      className="about-section"
      ref={sectionRef}
      {...glowHandlers}
    >
      <AboutHeader />
      <AboutContent isVisible={isVisible} onScrollToContact={scrollToContact} />
    </section>
  );
}
