import React from 'react';
import type { LandingButtonsProps } from '@/types';
import { NameDisplay } from './NameDisplay';
import { LandingButtons } from './LandingButtons';
import { MobileDropdown } from '@/components/navigation/MobileDropdown';

/**
 * Landing section component with centered name and navigation
 * Contains name display, mobile dropdown, and desktop buttons
 */
export function LandingSection({
  showXs,
  isFading,
  onNameClick,
  isSmallScreen,
  isMenuOpen,
  setIsMenuOpen,
  onScrollToAbout,
  onScrollToContact,
}: {
  showXs: boolean;
  isFading: boolean;
  onNameClick: () => void;
  isSmallScreen: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
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
      {/* Mobile Dropdown Menu */}
      {isSmallScreen && (
        <MobileDropdown
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigateToSection={(sectionId) => {
            if (sectionId === 'about') {
              onScrollToAbout();
            } else if (sectionId === 'contact') {
              onScrollToContact();
            }
          }}
          setIsDarkTheme={() => {}}
        />
      )}

      {/* Name */}
      <NameDisplay
        onToggle={onNameClick}
        showInitials={showXs || isSmallScreen}
        isFading={isFading}
      />

      {/* Desktop Buttons */}
      <LandingButtons {...landingButtonsProps} />
    </main>
  );
}
