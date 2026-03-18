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
}: {
  isSmallScreen: boolean;
  onScrollToAbout: () => void;
  onScrollToContact: () => void;
}) {
  const landingButtonsProps: LandingButtonsProps = {
    onScrollToAbout,
    onScrollToContact,
    isSmallScreen,
  };

  return (
    <main className="landing-section">
      {/* Name */}
      <NameDisplay
        onToggle={() => {}}
        showInitials={false}
        isFading={false}
        isSmallScreen={isSmallScreen}
      />

      {/* Desktop Buttons */}
      <LandingButtons {...landingButtonsProps} />
    </main>
  );
}
