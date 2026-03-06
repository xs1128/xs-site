import React from 'react';
import type { NameDisplayProps } from '@/types';

/**
 * Centered name display with click-to-toggle functionality
 * Toggles between full name and initials with fade animation
 */
export function NameDisplay({ onToggle, showInitials, isFading }: NameDisplayProps) {
  return (
    <div
      className="name-container"
      onClick={onToggle}
      style={{
        cursor: isFading ? "default" : "pointer",
        pointerEvents: isFading ? "none" : "auto",
      }}
    >
      <h1 className={`name-display ${showInitials ? 'name-display--initials' : ''} ${isFading ? 'name-display--fading' : ''}`}>
        {showInitials ? (
          <>
            xs<br />
          </>
        ) : (
          <>
            Xinsheng<br />
            Ooi
          </>
        )}
      </h1>
    </div>
  );
}
