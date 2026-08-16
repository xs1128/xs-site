// Shared animation timing functions and durations
export const TIMING = {
  // Cubic bezier easing functions
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  bouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Duration presets
  instant: '0.2s ease',
  fast: '0.3s ease',
  medium: '0.4s ease',
  slow: '0.6s ease',
  slower: '0.8s ease',
} as const;

// Shared transition strings
export const TRANSITIONS = {
  instant: (property: string) => `${property} ${TIMING.instant}`,
  fast: (property: string) => `${property} ${TIMING.fast}`,
  medium: (property: string) => `${property} ${TIMING.medium}`,
  slow: (property: string) => `${property} ${TIMING.slow}`,
  slower: (property: string) => `${property} ${TIMING.slower}`,

  // Common combinations
  cardFlip: 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
  cardExpand:
    'width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
  marqueeExpand: 'height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
  navDrop:
    'background-color 0.3s ease 0.8s, padding 0.3s ease 0.8s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s',
  opacity: 'opacity 0.2s ease',
  color: 'color 0.3s ease',
} as const;

// Transform values
export const TRANSFORMS = {
  translateY0: 'translateY(0)',
  translateY10: 'translateY(10px)',
  translateYNegative20: 'translateY(-20px)',
  translateX0: 'translateX(0)',
  translateXNegative50: 'translateX(-50%)',
  scale1: 'scale(1)',
} as const;
