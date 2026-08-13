import { useState, useEffect, useRef, RefObject } from 'react';
import type { AnimationTriggerOptions, IntersectionAnimationState } from '@/types';

/**
 * Hook for detecting when an element enters the viewport and triggering animations
 * Uses IntersectionObserver API for performant scroll detection
 * Latches on first intersection and never resets
 *
 * @param targetRef - Ref to the element to observe
 * @param options - Configuration options
 * @returns Animation state object
 *
 * @example
 * ```tsx
 * const sectionRef = useRef<HTMLElement>(null);
 * const { isVisible } = useIntersectionAnimation(sectionRef, {
 *   threshold: 0.15,
 *   rootMargin: '-50px'
 * });
 * ```
 */
export function useIntersectionAnimation(
  targetRef: RefObject<Element | null>,
  options: AnimationTriggerOptions = {}
): IntersectionAnimationState {
  const {
    threshold = 0.15,
    rootMargin = '-50px'
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const target = targetRef.current;

    // Check if IntersectionObserver is available (browser support)
    if (typeof window === 'undefined' || !window.IntersectionObserver || !target) {
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

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, threshold, rootMargin]);

  return {
    isVisible
  };
}
