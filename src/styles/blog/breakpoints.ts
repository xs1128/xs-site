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

/* Consumed only by useBreakpoint, which feeds matchMedia. There is no `media`
   helper emitting `@media` strings — inline styles can't take an at-rule. */
