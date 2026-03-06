import React, { useState } from 'react';
import type { ExpertiseCardProps } from '@/types';

/**
 * Expertise card component with hover lift effect
 * Displays an icon, title, and description in a styled card
 */
export function ExpertiseCard({ icon, title, description }: ExpertiseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`expertise-card ${isHovered ? 'expertise-card--hovered' : ''}`}
    >
      <div className="expertise-card__icon">{icon}</div>
      <h3 className="expertise-card__title">{title}</h3>
      <p className="expertise-card__description">{description}</p>
    </div>
  );
}
