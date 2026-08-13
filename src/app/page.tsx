"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isPastLanding, setIsPastLanding] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number | undefined;

    // Landing (0 - 0.9vh): light | About (0.9 - 1.9vh): dark | Contact (1.9vh+): light
    const checkScrollPosition = () => {
      rafId = undefined;
      const scrollY = container.scrollTop;
      const viewportHeight = window.innerHeight;

      if (scrollY < viewportHeight * 0.9) {
        setIsDarkTheme(false);
        setIsPastLanding(false);
      } else if (scrollY < viewportHeight * 1.9) {
        setIsDarkTheme(true);
        setIsPastLanding(true);
      } else {
        setIsDarkTheme(false);
        setIsPastLanding(true);
      }
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(checkScrollPosition);
    };

    checkScrollPosition();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < BREAKPOINT);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleMenuToggle = () => {
    setIsAboutMenuOpen(!isAboutMenuOpen);
  };

  return (
    <>
      {/* Full-screen overlay navigation */}
      <FullScreenNav
        isOpen={isAboutMenuOpen}
        onClose={() => setIsAboutMenuOpen(false)}
        isSmallScreen={isSmallScreen}
      />

      {/* Fixed hamburger button - hidden on landing page */}
      {isPastLanding && (
        <HamburgerButton
          onClick={handleMenuToggle}
          isPastLanding={isPastLanding}
          isDarkTheme={isDarkTheme}
          isNavOpen={isAboutMenuOpen}
        />
      )}

      <ScrollContainer ref={scrollContainerRef}>
        {/* First Section - Landing */}
        <LandingSection
          isSmallScreen={isSmallScreen}
          onScrollToAbout={scrollToAbout}
          onScrollToContact={scrollToContact}
          containerRef={scrollContainerRef}
        />

        {/* Second Section - About */}
        <AboutSection isSmallScreen={isSmallScreen} />

        {/* Third Section - Contact */}
        <ContactSection isSmallScreen={isSmallScreen} />
      </ScrollContainer>
    </>
  );
}
