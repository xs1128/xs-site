import React from 'react';
import type { LandingButtonsProps } from '@/types';
import { NameDisplay } from './NameDisplay';
import { LandingButtons } from './LandingButtons';

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
