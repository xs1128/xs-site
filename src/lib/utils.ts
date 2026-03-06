/**
 * Scroll to about section and update theme
 * @param setIsDarkTheme - Function to update dark theme state
 */
export function scrollToAbout(setIsDarkTheme: (value: boolean) => void): void {
  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: "smooth" });
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
    contactSection.scrollIntoView({ behavior: "smooth" });
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

/**
 * Scroll to a specific section by ID
 * @param sectionId - The ID of the section to scroll to
 */
export function scrollToSection(sectionId: string): void {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Check scroll position and update theme based on viewport
 * @param scrollY - Current scroll Y position
 * @param viewportHeight - Height of the viewport
 * @returns Theme state (true for light, false for dark)
 */
export function getThemeForScrollPosition(scrollY: number, viewportHeight: number): boolean {
  // Landing section (0 - 0.9 viewport): dark marquee (false)
  // About section (0.9 - 1.9 viewports): light marquee (true)
  // Contact section (1.9+ viewports): dark marquee (false)
  if (scrollY >= viewportHeight * 0.9 && scrollY < viewportHeight * 1.9) {
    return true; // Light theme for about section
  }
  return false; // Dark theme for landing and contact sections
}
