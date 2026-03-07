"use client";

import { useState, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

interface HamburgerButtonProps {
  onClick: () => void;
  isPastLanding: boolean;
  isDarkTheme: boolean;
  isNavOpen: boolean;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Manages the fade animation state when navigation opens/closes
 */
function useFadeAnimation(isNavOpen: boolean) {
  const [isFaded, setIsFaded] = useState(false);

  useEffect(() => {
    if (isNavOpen) {
      setIsFaded(true);
    } else {
      setIsFaded(false);
    }
  }, [isNavOpen]);

  return isFaded;
}

/**
 * Determines the icon color based on current theme
 */
function useIconColor(isDarkTheme: boolean): string {
  // Vintage yellow (#F2E9D8) on dark backgrounds (About section)
  // Dark charcoal (#2A2F35) on light backgrounds (Contact section)
  return isDarkTheme ? "#F2E9D8" : "#2A2F35";
}

// ============================================================================
// Component
// ============================================================================

/**
 * Fixed hamburger button for navigation
 *
 * Behavior:
 * - Fades out when full-screen navigation opens
 * - Color changes based on section (vintage yellow after landing, charcoal on landing)
 * - Positioned fixed on right side of screen
 */
export function HamburgerButton({ onClick, isPastLanding, isDarkTheme, isNavOpen }: HamburgerButtonProps) {
  const isFaded = useFadeAnimation(isNavOpen);
  const iconColor = useIconColor(isDarkTheme);

  // Mount/unmount logging
  useEffect(() => {
    console.log('🍔 HamburgerButton MOUNTED', {
      isPastLanding,
      isDarkTheme,
      iconColor,
      isNavOpen,
      colorName: iconColor === '#F2E9D8' ? 'Vintage Yellow' : 'Dark Charcoal',
      section: isDarkTheme ? 'About (dark)' : 'Contact (light)'
    });

    return () => {
      console.log('🍔 HamburgerButton UNMOUNTED');
    };
  }, []);

  // Props update logging
  useEffect(() => {
    console.log('🍔 HamburgerButton props updated:', {
      isPastLanding,
      isDarkTheme,
      iconColor,
      isNavOpen,
      colorName: iconColor === '#F2E9D8' ? 'Vintage Yellow' : 'Dark Charcoal',
      section: isDarkTheme ? 'About (dark)' : 'Contact (light)'
    });
  }, [isPastLanding, isDarkTheme, iconColor, isNavOpen]);

  const handleClick = () => {
    if (!isFaded) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`hamburger-button ${isFaded ? "hamburger-button--faded" : ""}`}
      aria-label="Open navigation menu"
      aria-expanded={isNavOpen}
      type="button"
      data-color={iconColor}
      data-color-name={iconColor === '#F2E9D8' ? 'Vintage Yellow' : 'Dark Charcoal'}
      data-section={isDarkTheme ? 'About' : 'Contact'}
      data-is-past-landing={isPastLanding.toString()}
      data-is-dark-theme={isDarkTheme.toString()}
    >
      <span
        className="hamburger-button__icon"
        style={{ color: iconColor }}
      >
        ☰
      </span>
    </button>
  );
}
