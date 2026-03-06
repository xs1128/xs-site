import React from 'react';
import type { HamburgerButtonProps } from '@/types';

/**
 * Fixed hamburger button for navigation
 * Appears after scrolling past landing section
 */
export function HamburgerButton({ onClick, isSmallScreen }: HamburgerButtonProps) {
  const [isIconFading, setIsIconFading] = React.useState(false);

  const handleClick = () => {
    if (!isIconFading) {
      setIsIconFading(true);
      setTimeout(() => {
        setIsIconFading(false);
      }, 300);
      onClick();
    }
  };

  return (
    <button onClick={handleClick} className="hamburger-button">
      <span className={isIconFading ? "hamburger-fading" : ""}>☰</span>
    </button>
  );
}
