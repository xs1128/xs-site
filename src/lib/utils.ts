const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/**
 * Scroll to the about section.
 * Theme follows from the scroll listener in page.tsx.
 */
export function scrollToAbout(): void {
  document.getElementById("about")?.scrollIntoView({ behavior: scrollBehavior() });
}

/**
 * Scroll to the contact section.
 * Theme follows from the scroll listener in page.tsx.
 */
export function scrollToContact(): void {
  document.getElementById("contact")?.scrollIntoView({ behavior: scrollBehavior() });
}
