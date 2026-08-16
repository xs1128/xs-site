'use client'

import { useState, useEffect } from 'react'

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 *
 * SSR-safe: lazy-initializes from matchMedia (guarded for SSR, where it falls
 * back to false), then subscribes to changes for the lifetime of the component.
 */
export function useReducedMotion(): boolean {
  // SSR-safe prefers-reduced-motion check: lazy-initialize from matchMedia
  // (guarded for SSR), then only subscribe to changes in the effect.
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reducedMotion
}
