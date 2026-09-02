import React from 'react';

export interface ExpertiseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}

/**
 * One column in the about expertise row. The index is the architecture —
 * oversized, decorative, sitting on the charcoal — not a badge on a card.
 */
export function ExpertiseCard({
  icon,
  title,
  description,
  index = 0,
}: ExpertiseCardProps) {
  return (
    <div className="expertise-card">
      <span className="expertise-card__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="expertise-card__content">
        <div className="expertise-card__icon">{icon}</div>
        <h3 className="expertise-card__title">{title}</h3>
        <p className="expertise-card__description">{description}</p>
      </div>
    </div>
  );
}
