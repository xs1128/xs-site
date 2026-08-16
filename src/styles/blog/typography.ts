/* Both names are surface-relative: on .blog-root --font-body resolves to Hubot
   Sans and --font-code to Roboto Mono, the inverse of the site's roles. */
export const FONTS = {
  body: 'var(--font-body)',
  code: 'var(--font-code)',
} as const;

/* The scales themselves live in app/globals.css :root — these are handles for
   inline styles, which can't read a stylesheet. Values belong there, not here.
   Only valid inside a rendered document; never parse these as numbers. */

// Responsive font size helpers
export const clamp = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  base: 'var(--text-base)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)',
  '2xl': 'var(--text-2xl)',
  '3xl': 'var(--text-3xl)',
} as const;

// Shared spacing helpers
export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
} as const;
