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
export function LandingButtons({ onScrollToAbout, onScrollToContact, containerRef }: LandingButtonsProps) {
  // Scroll-based parallax effect with delayed start
  // Buttons start sliding up after 20vh of scroll (name starts at 0)
  const maxScrollDistance = typeof window !== 'undefined' ? window.innerHeight * 0.4 : 0;
  const triggerThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.2 : 0;
  const parallaxOffset = useScrollParallax(containerRef, {
    maxScrollDistance,  // 40vh
    triggerThreshold  // Start after 20vh
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
