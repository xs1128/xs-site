import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useScrollParallax } from '@/hooks/useScrollParallax';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Tooltip } from '@/components/ui/Tooltip';

// Peak tilt away from centre. Small enough to read as depth rather than as the
// card turning.
const MAX_TILT_DEG = 5;

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
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let rafId: number | null = null;
    let nextTilt = { rotateX: 0, rotateY: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      nextTilt = { rotateX: y * MAX_TILT_DEG, rotateY: x * MAX_TILT_DEG };

      // A pointer can outpace the display, so commit at most one tilt per frame.
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setTilt(nextTilt);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reducedMotion]);

  const parallaxOffset = useScrollParallax(containerRef, {
    maxDistanceVh: 0.4,
  });

  const containerStyle = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(${-parallaxOffset}px)`,
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
        <Tooltip label="Automate. Containerize. Ship." followCursor>
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
