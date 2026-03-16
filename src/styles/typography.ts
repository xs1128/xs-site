// Shared typography and text styles
export const FONTS = {
  primary: "'Hubot Sans', sans-serif",
  mono: "'Roboto Mono', monospace",
} as const;

export const TEXT_STYLES = {
  // Header styles
  header: {
    fontFamily: FONTS.primary,
    fontWeight: 700 as const,
  },

  // Body styles
  body: {
    fontFamily: FONTS.primary,
    fontWeight: 400 as const,
  },

  // Mono styles
  mono: {
    fontFamily: FONTS.mono,
  },
} as const;

// Responsive font size helpers
export const clamp = {
  xs: 'clamp(10px, 1.2vw, 12px)',
  sm: 'clamp(11px, 1.5vw, 14px)',
  base: 'clamp(15px, 1.8vw, 18px)',
  lg: 'clamp(14px, 2vw, 20px)',
  xl: 'clamp(18px, 2.5vw, 24px)',
  '2xl': 'clamp(24px, 3vw, 32px)',
  '3xl': 'clamp(2rem, 5vw, 3.5rem)',
} as const;

// Shared spacing helpers
export const spacing = {
  xs: 'clamp(4px, 1vh, 8px)',
  sm: 'clamp(8px, 1.5vh, 16px)',
  md: 'clamp(12px, 2vh, 24px)',
  lg: 'clamp(20px, 3vh, 40px)',
} as const;
