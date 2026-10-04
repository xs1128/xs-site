// Shared animation timing functions and durations
export const TIMING = {
  // Cubic bezier easing functions
  smooth: 'ease',

  // Duration presets
  fast: '0.3s ease',
  slower: '0.8s ease',
} as const;

// Shared transition strings
export const TRANSITIONS = {
  fast: (property: string) => `${property} ${TIMING.fast}`,

  // Common combinations
  marqueeExpand: 'height 0.4s ease',
} as const;
