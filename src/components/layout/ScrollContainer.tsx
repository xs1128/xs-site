import React, { forwardRef } from 'react';

export interface ScrollContainerProps {
  children: React.ReactNode;
}

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
