"use client";

import React, { useRef, useState, ReactNode } from "react";

/**
 * 3D Card wrapper with tilt effect
 * Creates tactile, responsive card interactions with 3D tilt
 */
export function CardScene({ children, index }: { children: ReactNode; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
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
