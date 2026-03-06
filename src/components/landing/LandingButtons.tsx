import React from 'react';
import type { LandingButtonsProps } from '@/types';
import { AnimatedButton } from '@/components/navigation/AnimatedButton';

/**
 * Desktop navigation buttons at bottom of landing section
 * ABOUT button (bottom left) and CONTACT button (bottom right)
 */
export function LandingButtons({ onScrollToAbout, onScrollToContact, isSmallScreen }: LandingButtonsProps) {
  if (isSmallScreen) return null;

  return (
    <>
      <AnimatedButton
        className="landing-button--about"
        onClick={onScrollToAbout}
      >
        ABOUT
      </AnimatedButton>
      <AnimatedButton
        className="landing-button--contact"
        reverse
        onClick={onScrollToContact}
      >
        CONTACT
      </AnimatedButton>
    </>
  );
}
