import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useScrollParallax } from '@/hooks/useScrollParallax';
import { Tooltip } from '@/components/ui/Tooltip';

export interface NameDisplayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// Lazy load 3D scene component
const NameSceneContent = dynamic(
  () =>
    import('@/components/3d/landing/NameScene').then((mod) => ({
      default: mod.NameScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="name-scene-placeholder">
        <div className="name-scene-placeholder__bar" />
        <div className="name-scene-placeholder__bar name-scene-placeholder__bar--short" />
      </div>
    ),
  },
);

/**
 * Centered name display with 3D parallax tilt effect and scroll-based parallax
 * Uses 3D parallax tilt effect on all screen sizes
 * Scrolls up with parallax effect when scrolling to about section
 */
export function NameDisplay({ containerRef }: NameDisplayProps) {
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll-based parallax effect (with SSR safety)
  const maxScrollDistance =
    typeof window !== 'undefined' ? window.innerHeight * 0.4 : 0;
  const parallaxOffset = useScrollParallax(containerRef, {
    maxScrollDistance, // 40vh
    triggerThreshold: 0, // Immediate start
  });

  const containerStyle = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${-parallaxOffset}px)`,
  };

  return (
    <>
      {/* Semantic content for SEO and screen readers */}
      <div className="landing-section__semantic-content">
        <h1 className="visually-hidden">Xinsheng Ooi</h1>
        <p className="visually-hidden">
          Expert in Python scripting, Docker containerization, Bash automation,
          and deployment pipelines for robust infrastructure solutions.
        </p>
      </div>

      <div className="name-display-wrapper" style={containerStyle}>
        <Tooltip label="I make deploys boring." followCursor>
          <div
            className="name-display__canvas-container"
            role="img"
            aria-label="3D animation: Xinsheng Ooi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NameSceneContent showInitials={false} />
          </div>
        </Tooltip>
        <h2 className="landing-section__headline">
          I turn real problems into automated solutions.
        </h2>
      </div>
    </>
  );
}
