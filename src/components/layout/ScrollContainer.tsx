import React, { forwardRef, useEffect } from 'react';
import type { ScrollContainerProps } from '@/types';

/**
 * Scroll container with snap behavior
 * Wraps all sections and provides smooth scrolling
 */
export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  ({ children }, ref) => {
    useEffect(() => {
      // Notify parent that container is ready
      const container = (ref as React.RefObject<HTMLDivElement>).current;
      console.log('📦 ScrollContainer MOUNTED, ref:', container);
    }, [ref]);

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
