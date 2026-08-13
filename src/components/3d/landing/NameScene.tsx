'use client';

import { useRef } from 'react';

export interface NameSceneProps {
  showInitials: boolean;
}

/**
 * 3D Name scene content - layered text with depth effect
 * Does not include transform logic (handled by parent NameDisplay)
 */
export function NameScene({ showInitials }: NameSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="name-3d-scene">
      {/* Layer 1: Shadow/Accent (back) - offset */}
      <div className="name-3d-layer name-3d-layer--accent" aria-hidden="true">
        {showInitials ? (
          'xs'
        ) : (
          <>
            Xinsheng
            <br />
            Ooi
          </>
        )}
      </div>

      {/* Layer 2: Front text */}
      <div className="name-3d-layer name-3d-layer--front">
        {showInitials ? (
          'xs'
        ) : (
          <>
            Xinsheng
            <br />
            Ooi
          </>
        )}
      </div>
    </div>
  );
}
