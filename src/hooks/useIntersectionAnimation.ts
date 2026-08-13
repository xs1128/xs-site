import { useState, useEffect, useRef, RefObject } from 'react';
import type { AnimationTriggerOptions, IntersectionAnimationState } from '@/types';

/**
 * Reveals an element once it enters the viewport.
 * Latches on first intersection and never resets.
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

    if (typeof window === 'undefined' || !window.IntersectionObserver || !target) {
      // Fires once and cannot cascade. Initial state instead would break
      // hydration, since the server has no window.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
