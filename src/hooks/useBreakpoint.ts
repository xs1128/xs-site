import { useState, useEffect } from 'react'
import { breakpoints } from '@/styles/breakpoints'

/**
 * Custom hook for responsive breakpoint detection
 * Replaces all window.innerWidth checks throughout the codebase
 */
export function useBreakpoint(breakpointKey: keyof typeof breakpoints = 'md'): boolean {
  const [isMatch, setIsMatch] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpointKey]})`)

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMatch(e.matches)
    }

    // Set initial value
    setIsMatch(mediaQuery.matches)

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Legacy support
    else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [breakpointKey])

  return isMatch
}

/**
 * Convenience hook for mobile detection (screens smaller than 768px)
 */
export function useIsMobile(): boolean {
  return useBreakpoint('md') === false
}
