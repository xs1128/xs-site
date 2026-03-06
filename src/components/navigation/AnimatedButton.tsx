import React from 'react';
import type { AnimatedButtonProps } from '@/types';

/**
 * Reusable button with optional underline animation
 * Used throughout the app for navigation and menu buttons
 */
export function AnimatedButton({
  children,
  onClick,
  style,
  isMenuButton = false,
  isDropdownItem = false,
  reverse = false,
}: AnimatedButtonProps) {
  const baseClasses = [
    'animated-button',
    isMenuButton && 'animated-button--menu',
    isDropdownItem && 'animated-button--dropdown',
  ]
    .filter(Boolean)
    .join(' ');

  const underlineClasses = [
    'animated-button-underline',
    reverse && 'animated-button-underline--reverse',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={baseClasses} style={style} onClick={onClick}>
      {children}
      {!isMenuButton && !isDropdownItem && <span className={underlineClasses} />}
    </button>
  );
}
