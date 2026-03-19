import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

interface UseScrollParallaxOptions {
  maxScrollDistance: number;  // Maximum distance in pixels (e.g., 40vh)
  triggerThreshold: number;   // When to start (0 = immediate)
}

/**
 * Hook for implementing scroll-based parallax effect
 * Tracks scroll position within a container and calculates parallax offset
 *
 * @param containerRef - Reference to the scroll container
 * @param options - Configuration options for parallax behavior
 * @returns Current parallax offset in pixels
 *
 * @example
 * const offset = useScrollParallax(containerRef, {
 *   maxScrollDistance: window.innerHeight * 0.4,  // 40vh
 *   triggerThreshold: 0  // Immediate start
 * });
 */
export function useScrollParallax(
  containerRef: RefObject<HTMLDivElement | null>,
  options: UseScrollParallaxOptions
): number {
  const { maxScrollDistance, triggerThreshold } = options;
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const lastOffsetRef = useRef(0);

  const handleScroll = useCallback(() => {
    // Throttle using requestAnimationFrame for 60fps performance
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const scrollY = containerRef.current.scrollTop;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress within landing section (0-90vh)
      const scrollRange = viewportHeight * 0.9;
      const scrollProgress = Math.min(
        Math.max((scrollY - triggerThreshold) / scrollRange, 0),
        1
      );

      // Calculate parallax offset
      const newOffset = scrollProgress * maxScrollDistance;

      // Only update state if value changed significantly (optimization)
      if (Math.abs(newOffset - lastOffsetRef.current) > 0.5) {
        lastOffsetRef.current = newOffset;
        setParallaxOffset(newOffset);
      }

      rafRef.current = undefined;
    });
  }, [containerRef, maxScrollDistance, triggerThreshold]);

  const handleResize = useCallback(() => {
    // Recalculate on resize to ensure accuracy
    handleScroll();
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set up scroll listener with passive flag for performance
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Calculate initial offset
    handleScroll();

    return () => {
      // Cleanup
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, handleScroll, handleResize]);

  return parallaxOffset;
}
