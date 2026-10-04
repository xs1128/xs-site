'use client';

/**
 * 3D Name scene content - layered text with depth effect
 * Does not include transform logic (handled by parent NameDisplay)
 */
export function NameScene() {
  return (
    <div className="name-3d-scene">
      {/* Layer 1: Shadow/Accent (back) - offset */}
      <div className="name-3d-layer name-3d-layer--accent" aria-hidden="true">
        Xinsheng
        <br />
        Ooi
      </div>

      {/* Layer 2: Front text */}
      <div className="name-3d-layer name-3d-layer--front">
        Xinsheng
        <br />
        Ooi
      </div>
    </div>
  );
}
