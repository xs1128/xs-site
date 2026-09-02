import React from 'react';
import { AnimatedButton } from '@/components/navigation/AnimatedButton';
import { useScrollParallax } from '@/hooks/useScrollParallax';

export interface LandingButtonsProps {
  onScrollToAbout: () => void;
  onScrollToContact: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Navigation buttons at bottom of landing section
 * ABOUT button (bottom left) and CONTACT button (bottom right)
 * Visible on both desktop and mobile
 * Has parallax effect that starts later than the name display
 */
export function LandingButtons({
  onScrollToAbout,
  onScrollToContact,
  containerRef,
}: LandingButtonsProps) {
  // Same travel as the name, but held back so the name exits first.
  const parallaxOffset = useScrollParallax(containerRef, {
    maxDistanceVh: 0.4,
    triggerThresholdVh: 0.2,
  });

  const buttonStyle = {
    transform: `translateY(${-parallaxOffset}px)`,
  };

  return (
    <>
      <AnimatedButton
        className="landing-button--about"
        onClick={onScrollToAbout}
        style={buttonStyle}
      >
        ABOUT
      </AnimatedButton>
      <AnimatedButton
        className="landing-button--contact"
        reverse
        onClick={onScrollToContact}
        style={buttonStyle}
      >
        CONTACT
      </AnimatedButton>
    </>
  );
}
