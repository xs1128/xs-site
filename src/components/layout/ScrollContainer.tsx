import React, { forwardRef, useEffect } from 'react';
import type { ScrollContainerProps } from '@/types';

/**
 * Scroll container with snap behavior
 * Wraps all sections and provides smooth scrolling
 */
export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        className="scroll-container"
      >
        {children}
      </div>
    );
  }
);

ScrollContainer.displayName = 'ScrollContainer';
