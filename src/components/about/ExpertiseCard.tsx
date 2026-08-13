import React, { useState } from 'react';
import { CardScene } from '@/components/3d/about/CardScene';
import { useIsSmallScreen } from '@/hooks/useIsSmallScreen';

export interface ExpertiseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}

/**
 * Expertise card component with 3D tilt effect
 * Displays an index badge, icon, title, and description in a styled card
 * Uses 3D tilt + cursor spotlight on desktop, regular hover on mobile
 */
export function ExpertiseCard({ icon, title, description, index = 0 }: ExpertiseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isSmallScreen = useIsSmallScreen();

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
      index={index}
    >
      <span className="expertise-card__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="expertise-card__content">
        <div className="expertise-card__icon">{icon}</div>
        <h3 className="expertise-card__title">{title}</h3>
        <p className="expertise-card__description">{description}</p>
      </div>
    </CardWrapper>
  );
}
