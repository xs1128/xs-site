import { useState, useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

// Sub-pixel moves aren't visible but still cost a render, so state only follows
// changes larger than this.
const MIN_OFFSET_DELTA_PX = 0.5;

// Travel is spread over slightly less than one viewport, so the landing content
// has cleared before the about section snaps in. Pairs with the theme
// thresholds in page.tsx — move both together.
const SCROLL_RANGE_VH = 0.9;

export interface UseScrollParallaxOptions {
  /** Peak travel, as a fraction of viewport height. */
  maxDistanceVh: number;
  /** Scroll distance before travel begins, as a fraction of viewport height. */
  triggerThresholdVh?: number;
}

/**
 * Translates an element as its scroll container moves, at a fraction of the
 * container's speed.
 *
 * Distances are fractions of the viewport rather than pixels so a resize or
 * orientation change is picked up by the next frame. Taking pixels meant the
 * caller had to compute them from `window.innerHeight` at render time, and
 * since a resize re-renders nothing here, that value went stale while the
 * hook's own viewport read stayed current.
 *
 * Returns 0 under `prefers-reduced-motion`, which is re-read for the lifetime
 * of the component rather than latched at mount.
 */
export function useScrollParallax(
  containerRef: RefObject<HTMLDivElement | null>,
  { maxDistanceVh, triggerThresholdVh = 0 }: UseScrollParallaxOptions,
): number {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const reducedMotion = useReducedMotion();
  // Null rather than undefined so a rAF id of 0 still reads as pending.
  const rafRef = useRef<number | null>(null);
  const lastOffsetRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const update = () => {
      // Cleared first: an early return below must not leave the throttle
      // latched, or scroll updates stop for the life of the component.
      rafRef.current = null;

      const viewportHeight = window.innerHeight;
      const scrolled =
        container.scrollTop - triggerThresholdVh * viewportHeight;
      const progress = Math.min(
        Math.max(scrolled / (SCROLL_RANGE_VH * viewportHeight), 0),
        1,
      );
      const offset = progress * maxDistanceVh * viewportHeight;

      if (Math.abs(offset - lastOffsetRef.current) > MIN_OFFSET_DELTA_PX) {
        lastOffsetRef.current = offset;
        setParallaxOffset(offset);
      }
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    handleScroll();

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [containerRef, maxDistanceVh, triggerThresholdVh, reducedMotion]);

  return reducedMotion ? 0 : parallaxOffset;
}
