import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { NameDisplayProps } from '@/types';

// Lazy load 3D scene component
const NameSceneContent = dynamic(() => import('@/components/3d/landing/NameScene').then(mod => ({ default: mod.NameScene })), {
  ssr: false,
  loading: () => <div className="name-scene-placeholder" />,
});

/**
 * Centered name display with 3D parallax tilt effect
 * Uses 3D parallax tilt effect on all screen sizes
 */
export function NameDisplay({ onToggle, showInitials, isFading, isSmallScreen }: NameDisplayProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Mouse tracking for parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setRotateX(y * 5);
      setRotateY(x * 5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerStyle = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
  };

  return (
    <div className="name-display-wrapper" style={containerStyle}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NameSceneContent showInitials={false} />
      </div>
      <h2 className="landing-section__headline">
        I turn real problems into automated solutions.
      </h2>
    </div>
  );
}
