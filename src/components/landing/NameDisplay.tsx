import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { NameDisplayProps } from '@/types';
import { useScrollParallax } from '@/hooks/useScrollParallax';

// Lazy load 3D scene component
const NameSceneContent = dynamic(() => import('@/components/3d/landing/NameScene').then(mod => ({ default: mod.NameScene })), {
  ssr: false,
  loading: () => <div className="name-scene-placeholder" />,
});

/**
 * Centered name display with 3D parallax tilt effect and scroll-based parallax
 * Uses 3D parallax tilt effect on all screen sizes
 * Scrolls up with parallax effect when scrolling to about section
 */
export function NameDisplay({ onToggle, showInitials, isFading, isSmallScreen, containerRef }: NameDisplayProps) {
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

  // Scroll-based parallax effect (with SSR safety)
  const maxScrollDistance = typeof window !== 'undefined' ? window.innerHeight * 0.4 : 0;
  const parallaxOffset = useScrollParallax(containerRef, {
    maxScrollDistance,  // 40vh
    triggerThreshold: 0  // Immediate start
  });

  const containerStyle = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${-parallaxOffset}px)`,
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
