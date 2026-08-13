const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/**
 * Scroll to about section and update theme
 * @param setIsDarkTheme - Function to update dark theme state
 */
export function scrollToAbout(setIsDarkTheme: (value: boolean) => void): void {
  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: scrollBehavior() });
    // Update theme after scroll animation completes
    setTimeout(() => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      if (scrollY >= viewportHeight * 0.9) {
        setIsDarkTheme(true);
      }
    }, 1000);
  }
}

/**
 * Scroll to contact section and update theme
 * @param setIsDarkTheme - Function to update dark theme state
 */
export function scrollToContact(setIsDarkTheme: (value: boolean) => void): void {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: scrollBehavior() });
    // Update theme after scroll animation completes
    setTimeout(() => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      // Contact section (2+ viewports): dark marquee
      if (scrollY >= viewportHeight * 1.9) {
        setIsDarkTheme(false);
      }
    }, 1000);
  }
}

