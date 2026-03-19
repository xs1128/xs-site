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

  // Callback ref to detect when container is mounted
  const setScrollContainerRef = (node: HTMLDivElement | null) => {
    if (node) {
      console.log('🎯 ScrollContainer ref CALLBACK FIRED, node:', node);
      scrollContainerRef.current = node;
      setupScrollListener(node);
    }
  };

  const setupScrollListener = (container: HTMLDivElement) => {
    console.log('🔧 Setting up scroll listener...');

    const checkScrollPosition = () => {
      const scrollY = container.scrollTop;
      const viewportHeight = window.innerHeight;

      const threshold = viewportHeight * 0.9;

      // Landing section (0 - 1 viewport): light theme
      // About section (1 - 2 viewports): dark theme
      // Contact section (2+ viewports): light theme
      if (scrollY < threshold) {
        // LANDING SECTION
        setIsDarkTheme(false);
        setIsPastLanding(false);
        console.log('📍 Landing Section', {
          scrollY,
          viewportHeight,
          threshold,
          isPastLanding: false,
          hamburger: 'HIDDEN (component not mounted)'
        });
      } else if (scrollY >= threshold && scrollY < viewportHeight * 1.9) {
        // ABOUT SECTION
        setIsDarkTheme(true);
        setIsPastLanding(true);
        console.log('📍 About Section', {
          scrollY,
          viewportHeight,
          threshold,
          isPastLanding: true,
          hamburger: 'VISIBLE (should be vintage yellow #F2E9D8)',
          hamburgerColor: '#F2E9D8'
        });
      } else {
        // CONTACT SECTION
        setIsDarkTheme(false);
        setIsPastLanding(true);
        console.log('📍 Contact Section', {
          scrollY,
          viewportHeight,
          threshold,
          isPastLanding: true,
          hamburger: 'VISIBLE (should be vintage yellow #F2E9D8)',
          hamburgerColor: '#F2E9D8'
        });
      }
    };

    // Check initial scroll position
    console.log('🚀 Initial mount - checking scroll position...');
    checkScrollPosition();

    const handleScroll = () => {
      console.log('📜 SCROLL EVENT FIRED!');
      checkScrollPosition();
    };

    container.addEventListener("scroll", handleScroll);
    console.log('✅ Scroll listener attached');

    return () => {
      console.log('🧹 Cleaning up scroll listener');
      container.removeEventListener("scroll", handleScroll);
    };
  };

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
        setIsDarkTheme={setIsDarkTheme}
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

      <ScrollContainer ref={setScrollContainerRef}>
        {/* First Section - Landing */}
        <LandingSection
          isSmallScreen={isSmallScreen}
          onScrollToAbout={() => scrollToAbout(setIsDarkTheme)}
          onScrollToContact={() => scrollToContact(setIsDarkTheme)}
          containerRef={scrollContainerRef}
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
