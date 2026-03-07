"use client";

import { useState, useEffect, useRef } from "react";
import { AnnouncementMarquee } from "../components/marquee/AnnouncementMarquee";
import { FullScreenNav } from "../components/navigation/FullScreenNav";
import { HamburgerButton } from "../components/navigation/HamburgerButton";
import { AboutSection } from "../components/about/AboutSection";
import { ContactSection } from "../components/contact/ContactSection";
import { LandingSection } from "../components/landing/LandingSection";
import { ScrollContainer } from "../components/layout/ScrollContainer";
import { scrollToAbout, scrollToContact } from "@/lib/utils";

const BREAKPOINT = 640;

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isPastLanding, setIsPastLanding] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < BREAKPOINT);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Scroll detection for marquee theme change
  useEffect(() => {
    const checkScrollPosition = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollY = container.scrollTop;
      const viewportHeight = window.innerHeight;

      // Landing section (0 - 1 viewport): dark marquee
      // About section (1 - 2 viewports): light marquee
      // Contact section (2+ viewports): dark marquee
      if (scrollY < viewportHeight * 0.9) {
        setIsDarkTheme(false); // Landing - dark marquee
        setIsPastLanding(false);
      } else if (scrollY >= viewportHeight * 0.9 && scrollY < viewportHeight * 1.9) {
        setIsDarkTheme(true); // About - light marquee
        setIsPastLanding(true);
      } else {
        setIsDarkTheme(false); // Contact - dark marquee
        setIsPastLanding(true);
      }
    };

    // Check initial scroll position on mount
    checkScrollPosition();

    const handleScroll = () => {
      checkScrollPosition();
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleMenuToggle = () => {
    setIsAboutMenuOpen(!isAboutMenuOpen);
  };

  return (
    <>
      {/* <AnnouncementMarquee isDarkTheme={isDarkTheme} /> */}

      {/* Full-screen overlay navigation */}
      <FullScreenNav
        isOpen={isAboutMenuOpen}
        onClose={() => setIsAboutMenuOpen(false)}
        isSmallScreen={isSmallScreen}
        setIsDarkTheme={setIsDarkTheme}
      />

      {/* Fixed hamburger button for about/contact sections */}
      {isPastLanding && (
        <HamburgerButton
          onClick={handleMenuToggle}
          isSmallScreen={isSmallScreen}
        />
      )}

      <ScrollContainer>
        {/* First Section - Landing */}
        <LandingSection
          isSmallScreen={isSmallScreen}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onScrollToAbout={() => scrollToAbout(setIsDarkTheme)}
          onScrollToContact={() => scrollToContact(setIsDarkTheme)}
        />

        {/* Second Section - About */}
        <AboutSection
          isSmallScreen={isSmallScreen}
          setIsDarkTheme={setIsDarkTheme}
        />

        {/* Third Section - Contact */}
        <ContactSection
          isSmallScreen={isSmallScreen}
          onOpenNav={handleMenuToggle}
        />
      </ScrollContainer>
    </>
  );
}
