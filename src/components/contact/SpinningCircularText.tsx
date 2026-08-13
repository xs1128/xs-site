import React from 'react';

export interface SpinningCircularTextProps {
  text: string;
  onClick: () => void;
  isExpanded: boolean;
}

/**
 * Spinning circular text component that expands on click
 * Characters are arranged in a circle and rotate continuously
 * Diameter comes from --diameter in contact.css, so the ring resizes
 * by media query rather than by prop
 */
export function SpinningCircularText({
  text,
  onClick,
  isExpanded,
}: SpinningCircularTextProps) {
  const charAngle = 360 / text.length;

  return (
    <div onClick={onClick} className="spinning-circular-text">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="spinning-circular-text__char"
          style={{
            transform: `rotate(${i * charAngle}deg) translate(calc(var(--diameter) / 2)) rotate(90deg)`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}

      <div className="spinning-circular-text__center">{isExpanded ? '-' : '+'}</div>
    </div>
  );
}
