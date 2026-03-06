import React from 'react';
import type { AnnouncementMarqueeProps } from '@/types';
import { useMarquee } from '@/hooks/useMarquee';

/**
 * Announcement marquee bar at the top of the page
 * Displays scrolling text with theme switching based on scroll position
 */
export function AnnouncementMarquee({ isDarkTheme }: AnnouncementMarqueeProps) {
  const items = useMarquee("Site Under Construction");

  return (
    <div
      className={`marquee-container ${isDarkTheme ? 'marquee-container--light' : ''}`}
    >
      <div className="marquee-content">
        {items.map((item) => (
          <span key={item} className="marquee-item">
            Site Under Construction
          </span>
        ))}
      </div>
    </div>
  );
}
