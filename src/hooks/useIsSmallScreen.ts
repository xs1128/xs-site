import { useSyncExternalStore } from 'react';

// Matches --breakpoint-small and the 640px media queries in src/styles/
const QUERY = '(max-width: 640px)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/**
 * Viewport check for the rare case CSS can't cover — swapping which
 * component renders. Prefer a media query for anything styling-only.
 */
export function useIsSmallScreen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // no viewport on the server; desktop branch
  );
}
