/* WebGL only. The DOM reads colours from CSS custom properties; three.js
   materials take a literal, so these two are re-stated here. Keep them equal
   to --color-accent and --color-landing-bg in globals.css :root. */
export const colors = {
  accent: '#E5532C',
  background: '#F2E9D8',
} as const;
