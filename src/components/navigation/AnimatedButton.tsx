import React from 'react';

export interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'menu' | 'dropdown';
  reverse?: boolean;
  isMenuButton?: boolean;
  isDropdownItem?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

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
  className = '',
}: AnimatedButtonProps) {
  const baseClasses = [
    'animated-button',
    isMenuButton && 'animated-button--menu',
    isDropdownItem && 'animated-button--dropdown',
    className,
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
      {!isMenuButton && !isDropdownItem && (
        <span className={underlineClasses} />
      )}
    </button>
  );
}
