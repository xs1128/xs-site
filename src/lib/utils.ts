const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

// Theme follows from the scroll listener in page.tsx
export function scrollToAbout(): void {
  document.getElementById("about")?.scrollIntoView({ behavior: scrollBehavior() });
}

export function scrollToContact(): void {
  document.getElementById("contact")?.scrollIntoView({ behavior: scrollBehavior() });
}
