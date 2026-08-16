/* Handles for inline styles, which can't read a stylesheet. Values live in
   app/globals.css :root. Never parse these as numbers. */

export const FONTS = {
  body: 'var(--font-body)',
  code: 'var(--font-code)',
} as const;

export const clamp = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  base: 'var(--text-base)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)',
  '2xl': 'var(--text-2xl)',
  '3xl': 'var(--text-3xl)',
} as const;

export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
} as const;
