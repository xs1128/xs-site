import React from 'react';
import type { LandingButtonsProps } from '@/types';
import { NameDisplay } from './NameDisplay';
import { LandingButtons } from './LandingButtons';

/**
 * Landing section component with centered name and navigation
 * Contains name display and desktop buttons
 */
export function LandingSection({
  isSmallScreen,
  onScrollToAbout,
  onScrollToContact,
  containerRef,
}: {
  isSmallScreen: boolean;
  onScrollToAbout: () => void;
  onScrollToContact: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const landingButtonsProps: LandingButtonsProps = {
    onScrollToAbout,
    onScrollToContact,
    isSmallScreen,
    containerRef,
  };

  return (
    <main className="landing-section">
      {/* Name */}
      <NameDisplay containerRef={containerRef} />

      {/* Desktop Buttons */}
      <LandingButtons {...landingButtonsProps} />
    </main>
  );
}
