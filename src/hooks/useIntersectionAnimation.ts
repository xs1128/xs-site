import { useState, useEffect, useRef } from 'react';
import type { AnimationTriggerOptions, IntersectionAnimationState } from '@/types';

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
): IntersectionAnimationState {
  const {
    threshold = 0.15,
    rootMargin = '-50px'
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

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
          // Only set to true once when entering viewport, never back to false
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            setIsVisible(true);
          }
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
