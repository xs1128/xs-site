/**
 * Standard breakpoints following web design conventions
 * These values match Tailwind CSS default breakpoints
 */
export const breakpoints = {
  sm: '640px', // Small screens
  md: '768px', // Medium screens (tablets)
  lg: '1024px', // Large screens (laptops)
  xl: '1280px', // Extra large screens (desktops)
} as const;

export type BreakpointKey = keyof typeof breakpoints;

/**
 * Media query helpers for use in CSS files
 */
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,

  // Max-width for mobile-first approach
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
} as const;
