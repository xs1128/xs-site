import React from 'react';
import type { LandingButtonsProps } from '@/types';
import { AnimatedButton } from '@/components/navigation/AnimatedButton';

/**
 * Navigation buttons at bottom of landing section
 * ABOUT button (bottom left) and CONTACT button (bottom right)
 * Visible on both desktop and mobile
 */
export function LandingButtons({ onScrollToAbout, onScrollToContact, isSmallScreen }: LandingButtonsProps) {
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
