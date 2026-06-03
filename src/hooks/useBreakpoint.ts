import { useCallback, useSyncExternalStore } from 'react'
import { breakpoints } from '@/styles/breakpoints'

/**
 * Custom hook for responsive breakpoint detection.
 * Uses useSyncExternalStore so the value is correct on first client render
 * (no flash) and SSR-safe — no setState-in-effect.
 */
export function useBreakpoint(breakpointKey: keyof typeof breakpoints = 'md'): boolean {
  const query = `(min-width: ${breakpoints[breakpointKey]})`

  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query]
  )

  const getSnapshot = () => window.matchMedia(query).matches
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Convenience hook for mobile detection (screens smaller than 768px)
 */
export function useIsMobile(): boolean {
  return useBreakpoint('md') === false
}
