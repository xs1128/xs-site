import React, { useRef, useCallback } from 'react';
import type { AboutSectionProps } from '@/types';
import { AboutHeader } from './AboutHeader';
import { AboutContent } from './AboutContent';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { scrollToContact } from '@/lib/utils';

/**
 * About section wrapper component
 * Contains header navigation and main content
 * Tracks cursor position (desktop only) to drive the ambient
 * dot-grid reveal and glow via --glow-x/--glow-y CSS variables
 */
export function AboutSection({ isSmallScreen, setIsDarkTheme }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const { isVisible } = useIntersectionAnimation(sectionRef, {
    threshold: 0.15,
    rootMargin: '-50px',
  });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (isSmallScreen || e.pointerType !== 'mouse') return;
    const { clientX, clientY } = e;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      section.style.setProperty('--glow-x', `${clientX - rect.left}px`);
      section.style.setProperty('--glow-y', `${clientY - rect.top}px`);
      section.style.setProperty('--glow-opacity', '1');
    });
  }, [isSmallScreen]);

  const handlePointerLeave = useCallback(() => {
    sectionRef.current?.style.setProperty('--glow-opacity', '0');
  }, []);

  return (
    <section
      id="about"
      className="about-section"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <AboutHeader
        isSmallScreen={isSmallScreen}
        setIsDarkTheme={setIsDarkTheme}
      />
      <AboutContent
        isSmallScreen={isSmallScreen}
        isVisible={isVisible}
        onScrollToContact={() => scrollToContact(setIsDarkTheme)}
      />
    </section>
  );
}
