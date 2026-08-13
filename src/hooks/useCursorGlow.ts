import React, { useCallback, useEffect, useRef, RefObject } from 'react';

/**
 * Tracks the cursor over an element and writes --glow-x/--glow-y/--glow-opacity
 * onto it. Mouse only; rAF-throttled; no-ops under reduced motion. Returns
 * handlers to spread on the target.
 */
export function useCursorGlow(targetRef: RefObject<HTMLElement | null>) {
  const rafRef = useRef<number | null>(null);

  // Stale frame would write coords after unmount
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== 'mouse') return;
      // CSS can't gate a JS-written custom property
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const { clientX, clientY } = e;
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const target = targetRef.current;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--glow-x', `${clientX - rect.left}px`);
        target.style.setProperty('--glow-y', `${clientY - rect.top}px`);
        target.style.setProperty('--glow-opacity', '1');
      });
    },
    [targetRef],
  );

  const onPointerLeave = useCallback(() => {
    targetRef.current?.style.setProperty('--glow-opacity', '0');
  }, [targetRef]);

  return { onPointerMove, onPointerLeave };
}
