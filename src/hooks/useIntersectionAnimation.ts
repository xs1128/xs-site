import { useState, useEffect } from 'react';

/**
 * Options for intersection animation trigger
 */
export interface AnimationTriggerOptions {
  /** Percentage of element visible before triggering (0-1) */
  threshold?: number;
  /** Margin around root element (CSS margin syntax) */
  rootMargin?: string;
}

/**
 * Animation state returned by hook
 */
export interface AnimationState {
  /** Element is currently visible in viewport */
  isVisible: boolean;
}

/**
 * Hook for detecting when element enters viewport and triggering animations
 * Uses IntersectionObserver API for performant scroll detection
 *
 * @param options - Configuration options
 * @returns Animation state object
 *
 * @example
 * ```tsx
 * const { isVisible } = useIntersectionAnimation({
 *   threshold: 0.15,
 *   rootMargin: '-50px'
 * });
 * ```
 */
export function useIntersectionAnimation(
  options: AnimationTriggerOptions = {}
): AnimationState {
  const {
    threshold = 0.15,
    rootMargin = '-50px'
  } = options;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if IntersectionObserver is available (browser support)
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      // Fallback for browsers without IntersectionObserver
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    // Observe the about section element
    const targetElement = document.querySelector('.about-section');
    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return {
    isVisible
  };
}
