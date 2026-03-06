import React from 'react';
import type { MobileDropdownProps } from '@/types';
import { AnimatedButton } from './AnimatedButton';

/**
 * Mobile dropdown menu for navigation
 * Shows ABOUT and CONTACT options
 */
export function MobileDropdown({
  isOpen,
  onClose,
  onNavigateToSection,
  setIsDarkTheme,
}: MobileDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="mobile-dropdown">
      <AnimatedButton
        isMenuButton
        onClick={onClose}
      >
        ✕
      </AnimatedButton>

      <div className="mobile-dropdown__menu">
        <button
          className="mobile-dropdown__item"
          onClick={() => {
            onClose();
            setTimeout(() => onNavigateToSection('about'), 100);
          }}
        >
          ABOUT
        </button>
        <button
          className="mobile-dropdown__item mobile-dropdown__item--bordered"
          onClick={() => {
            onClose();
            setTimeout(() => onNavigateToSection('contact'), 100);
          }}
        >
          CONTACT
        </button>
      </div>
    </div>
  );
}
