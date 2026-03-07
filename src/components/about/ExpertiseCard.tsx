import React, { useState } from 'react';
import type { ExpertiseCardProps } from '@/types';
import { CardScene } from '@/components/3d/about/CardScene';

/**
 * Expertise card component with 3D tilt effect
 * Displays an icon, title, and description in a styled card
 * Uses 3D tilt on desktop, regular hover on mobile
 */
export function ExpertiseCard({ icon, title, description, isSmallScreen }: ExpertiseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsHovered(!isHovered);
  };

  // On mobile, use simple div; on desktop, use 3D CardScene
  const CardWrapper = isSmallScreen ? 'div' : CardScene;

  return (
    <CardWrapper
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`expertise-card ${isHovered ? 'expertise-card--hovered' : ''}`}
      index={0} // Only used by CardScene
    >
      <div className="expertise-card__content">
        <div className="expertise-card__icon">{icon}</div>
        <h3 className="expertise-card__title">{title}</h3>
        <p className="expertise-card__description">{description}</p>
      </div>
    </CardWrapper>
  );
}
