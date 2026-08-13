"use client";

import React, { useRef, useState, ReactNode } from "react";

/**
 * 3D Card wrapper with tilt effect and cursor spotlight
 * Creates tactile, responsive card interactions with 3D tilt
 * Exposes cursor position as --mx/--my CSS variables for the spotlight overlay
 */
export function CardScene({ children }: { children: ReactNode; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const x = (localX / rect.width - 0.5) * 2;
    const y = (localY / rect.height - 0.5) * 2;
    setMousePos({ x, y });

    // Drive the spotlight overlay without re-rendering children
    cardRef.current.style.setProperty("--mx", `${localX}px`);
    cardRef.current.style.setProperty("--my", `${localY}px`);
  };

  const tiltStyle: React.CSSProperties = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${-mousePos.y * 8}deg) rotateY(${mousePos.x * 8}deg) translateZ(20px)`
      : "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)",
    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={tiltStyle}
      className="expertise-card expertise-card--3d"
    >
      {children}
    </div>
  );
}
