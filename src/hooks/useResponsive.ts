import { useState, useEffect } from 'react';

/**
 * Reusable hook for responsive screen size detection
 * @param breakpoint - The breakpoint in pixels (default: 625)
 * @returns Object with isSmallScreen boolean
 */
export function useResponsive(breakpoint: number = 625) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };

    // Check initial screen size
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return { isSmallScreen };
}
