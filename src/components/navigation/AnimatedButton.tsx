import React from 'react';

export interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  reverse?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Reusable button with optional underline animation
 * Used by the landing section's ABOUT and CONTACT buttons.
 */
export function AnimatedButton({
  children,
  onClick,
  style,
  reverse = false,
  className = '',
}: AnimatedButtonProps) {
  const baseClasses = ['animated-button', className].filter(Boolean).join(' ');

  const underlineClasses = [
    'animated-button-underline',
    reverse && 'animated-button-underline--reverse',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={baseClasses} style={style} onClick={onClick}>
      {children}
      <span className={underlineClasses} />
    </button>
  );
}
