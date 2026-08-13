import React from 'react';
import { NameDisplay } from './NameDisplay';
import { LandingButtons, type LandingButtonsProps } from './LandingButtons';

/**
 * Landing section component with centered name and navigation
 * Contains name display and desktop buttons
 */
export function LandingSection({
  onScrollToAbout,
  onScrollToContact,
  containerRef,
}: {
  onScrollToAbout: () => void;
  onScrollToContact: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const landingButtonsProps: LandingButtonsProps = {
    onScrollToAbout,
    onScrollToContact,
    containerRef,
  };

  return (
    <main className="landing-section">
      <NameDisplay containerRef={containerRef} />

      <LandingButtons {...landingButtonsProps} />
    </main>
  );
}
