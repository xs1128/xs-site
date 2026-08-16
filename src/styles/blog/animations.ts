// Shared animation timing functions and durations
export const TIMING = {
  // Cubic bezier easing functions
  smooth: 'ease',
  bouncy: 'var(--ease-out-back)',

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
  cardFlip: 'transform 0.8s ease',
  cardExpand: 'width 0.8s ease, height 0.8s ease, border-radius 0.8s ease',
  marqueeExpand: 'height 0.4s ease',
  navDrop:
    'background-color 0.3s ease 0.8s, padding 0.3s ease 0.8s, transform 0.4s var(--ease-out-back) 0.8s',
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
