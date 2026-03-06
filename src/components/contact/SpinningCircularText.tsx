import React from 'react';
import type { SpinningCircularTextProps } from '@/types';

/**
 * Spinning circular text component that expands on click
 * Characters are arranged in a circle and rotate continuously
 */
export function SpinningCircularText({
  text,
  diameter,
  onClick,
  isExpanded,
}: SpinningCircularTextProps) {
  const radius = diameter / 2;
  const charAngle = 360 / text.length;

  return (
    <div
      onClick={onClick}
      className="spinning-circular-text"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        '--diameter': `${diameter}px`,
      } as React.CSSProperties}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="spinning-circular-text__char"
          style={{
            transform: `rotate(${i * charAngle}deg) translate(${radius}px) rotate(90deg)`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}

      <div className="spinning-circular-text__center">{isExpanded ? '-' : '+'}</div>
    </div>
  );
}
