import React, { useState } from 'react';

/**
 * Props for MagneticCTA component
 */
export interface MagneticCTAProps {
  /** Click handler for the CTA */
  onClick: () => void;
  /** Whether the element is visible */
  isVisible: boolean;
}

/**
 * Magnetic call-to-action button that subtly follows cursor on desktop
 * Provides engaging micro-interaction while maintaining usability
 *
 * Desktop behavior:
 * - Button moves up to 8px toward cursor (15% intensity)
 * - Smooth spring-back on mouse leave
 * - Scale effect (1.02x) on hover
 * - Arrow moves up 8px on hover
 *
 * Mobile behavior:
 * - No magnetic effect
 * - Standard hover/click interactions
 *
 * @param props - Component props
 * @returns JSX element with magnetic effect
 *
 * @example
 * ```tsx
 * <MagneticCTA onClick={handleScrollToContact} isVisible={isVisible} />
 * ```
 */
export function MagneticCTA({ onClick, isVisible }: MagneticCTAProps) {
  const [magneticStyle, setMagneticStyle] = useState<React.CSSProperties>({});

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Touch synthesises one mousemove per tap, which would stick the offset
    if (e.pointerType !== 'mouse') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Subtle movement (max ~8px at 15% intensity)
    const moveX = x * 0.15;
    const moveY = y * 0.15;

    setMagneticStyle({
      transform: `translate(${moveX}px, ${moveY}px)`
    });
  };

  const handlePointerLeave = () => {
    // Smooth spring-back to original position
    setMagneticStyle({
      transform: 'translate(0, 0)',
      transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
  };

  return (
    <div
      className={`about-content__cta ${isVisible ? 'about-content__cta--visible' : ''}`}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={magneticStyle}
    >
      <div className="about-content__cta-arrow">↓</div>
      <p className="about-content__cta-text">Have a problem that needs solving?</p>
      <p className="about-content__cta-subtext">Let&apos;s chat &mdash; I&apos;d love to hear about it</p>
    </div>
  );
}
