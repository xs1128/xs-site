"use client";

import { useState, useEffect } from "react";

const BREAKPOINT = 300;

// Custom hook for marquee functionality
function useMarquee(text: string, gap: number = 120) {
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    const tempSpan = document.createElement("span");
    tempSpan.style.font = "14px Hubot Sans, sans-serif";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.textContent = text;
    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    const itemWidth = textWidth + gap;
    const screenWidth = window.innerWidth;
    const itemsNeeded = Math.ceil(screenWidth / itemWidth) * 2 + 4;

    setItems(Array.from({ length: itemsNeeded }, (_, i) => i));
  }, [text, gap]);

  return items;
}

// Custom hook for marquee animation CSS
function useMarqueeAnimation() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-content {
        display: flex;
        gap: 120px;
        white-space: nowrap;
        animation: marquee 30s linear infinite;
        width: max-content;
      }
      @media (hover: hover) {
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      }
      .marquee-item {
        flex-shrink: 0;
      }
      @media (hover: hover) {
        .nav-item:hover {
          transform: translateX(20px);
        }
      }
      @media (hover: hover) {
        .animated-button:hover .animated-button-underline {
          width: 100%;
        }
      }
      .animated-button-underline {
        position: absolute;
        bottom: 4px;
        height: 2px;
        background-color: #E5532C;
        width: 0%;
        transition: width 0.3s ease;
      }
      @media (hover: hover) {
        .dropdown-item:hover {
          background-color: #F0C4B4;
        }
      }
      .name-container {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
      }
      button, .animated-button {
        -webkit-tap-highlight-color: transparent;
      }
    `;
    document.head.appendChild(style);
    return () => {
        document.head.removeChild(style);
    }
  }, []);
}

// Custom hook for navigation animations (always loaded)
function useNavAnimations() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes slideInRight {
        0% {
          opacity: 0;
          transform: translateX(100%);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOutRight {
        0% {
          opacity: 1;
          transform: translateX(0);
        }
        100% {
          opacity: 0;
          transform: translateX(100%);
        }
      }
      @keyframes fadeInSlide {
        0% {
          opacity: 0;
          transform: translateX(50px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fadeOutSlide {
        0% {
          opacity: 1;
          transform: translateX(0);
        }
        100% {
          opacity: 0;
          transform: translateX(50px);
        }
      }
      @keyframes hamburgerFadeOut {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      .nav-item-opening {
        animation: fadeInSlide 0.9s cubic-bezier(0.16, 1, 0.3, 1) backwards;
      }
      .nav-item-closing {
        animation: fadeOutSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .hamburger-fading {
        animation: hamburgerFadeOut 0.3s ease forwards;
      }
      /* Text fill animation for navigation buttons */
      .nav-item {
        position: relative;
      }
      .nav-item::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        right: auto;
        top: 0;
        bottom: 0;
        color: #E5532C;
        background-color: inherit;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        padding: inherit;
        margin: inherit;
        clip-path: inset(0 100% 0 0);
        pointer-events: none;
        transition: clip-path 0.7s cubic-bezier(0.6, 0, 0.4, 1);
        z-index: 1;
        width: fit-content;
      }
      .nav-item > span {
        position: relative;
        z-index: 0;
      }
      .nav-item svg {
        transition: stroke 0.3s cubic-bezier(0.6, 0, 0.4, 1);
        transition-delay: 0.7s;
        position: relative;
        z-index: 2;
      }
      @media (hover: hover) {
        .nav-item:hover {
          transform: translateX(20px);
        }
        .nav-item:hover::before {
          clip-path: inset(0 0 0 0);
        }
        .nav-item:hover svg {
          stroke: #E5532C;
        }
        .close-button:hover {
          color: #E5532C !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

// Announcement Marquee Component
function AnnouncementMarquee({ isDarkTheme }: { isDarkTheme: boolean }) {
  const items = useMarquee("Site Under Construction");
  useMarqueeAnimation();

  // Dynamic theme based on section
  const theme = isDarkTheme
    ? {
        // Light theme (vintage yellow/cream)
        backgroundColor: "#F2E9D8",
        color: "#2A2F35",
      }
    : {
        // Dark theme (default)
        backgroundColor: "#2A2F35",
        color: "#F2E9D8",
      };

  return (
    <div
      className="marquee-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.backgroundColor,
        color: theme.color,
        fontSize: "14px",
        fontWeight: 400,
        fontFamily: "Hubot Sans, sans-serif",
        zIndex: 1000,
        overflow: "hidden",
        padding: "12px 0",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div className="marquee-content">
        {items.map((item) => (
          <span key={item} className="marquee-item">
            Site Under Construction
          </span>
        ))}
      </div>
    </div>
  );
}

// About Header Component
function AboutHeader({
  isSmallScreen,
  isMenuOpen,
  setIsMenuOpen,
  setIsDarkTheme,
}: {
  isSmallScreen: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  setIsDarkTheme: (value: boolean) => void;
}) {
  const [isIconFading, setIsIconFading] = useState(false);

  const handleMenuToggle = () => {
    if (!isMenuOpen) {
      // Fade out hamburger icon before opening menu
      setIsIconFading(true);
      setTimeout(() => {
        setIsIconFading(false);
        setIsMenuOpen(true);
      }, 100);
    } else {
      // Instant change back to hamburger
      setIsMenuOpen(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "2%",
        left: isSmallScreen ? "4vw" : "5vw",
        right: isSmallScreen ? "4vw" : "5vw",
        padding: isSmallScreen ? "1.5vh 3vw" : "2vh 3vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#F2E9D8",
        fontFamily: "Roboto Mono, monospace",
        zIndex: 10,
      }}
    >
      {/* Left: ABOUT with underline */}
      <button
        onClick={() => scrollToAbout(setIsDarkTheme)}
        style={{
          position: "relative",
          fontSize: isSmallScreen ? "24px" : "32px",
          fontWeight: 500,
          backgroundColor: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: 0,
        }}
      >
        ABOUT
        <span
          style={{
            position: "absolute",
            bottom: "-4px",
            left: 0,
            width: "100%",
            height: "1px",
            backgroundColor: "#F2E9D8",
          }}
        />
      </button>

      {/* Right: hamburger icon button */}
      <button
        onClick={handleMenuToggle}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#F2E9D8",
          fontSize: isSmallScreen ? "48px" : "56px",
          cursor: "pointer",
          padding: "8px",
          lineHeight: 1,
          fontFamily: "Roboto Mono, monospace",
          opacity: isMenuOpen ? 0 : 1,
          pointerEvents: isMenuOpen ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        <span className={isIconFading ? "hamburger-fading" : ""}>☰</span>
      </button>
    </div>
  );
}

// Full-Screen Navigation Overlay Component
function FullScreenNav({
  isOpen,
  onClose,
  isSmallScreen,
  setIsDarkTheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  isSmallScreen: boolean;
  setIsDarkTheme: (value: boolean) => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  // Disable scrolling when nav is open
  useEffect(() => {
    if (isOpen || isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 800);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#363D44",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: isClosing
          ? "slideOutRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
          : "slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: isClosing ? "none" : "auto",
        willChange: isClosing ? "transform, opacity" : "auto",
        contain: "strict",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden" as const,
      }}
    >
      {/* Navigation items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
          textAlign: "left",
        }}
      >
        {/* MENU label with close button - outer container with outline */}
        <div
          style={{
            border: "1px solid #D6CBB3",
            backgroundColor: "#444C55",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* MENU word with outline */}
          <div
            style={{
              borderRight: "1px solid #D6CBB3",
              color: "#F2E9D8",
              fontFamily: "Roboto Mono, monospace",
              fontSize: isSmallScreen ? "32px" : "48px",
              fontWeight: 500,
              padding: isSmallScreen ? "0.5vh 1vw" : "0.5vh 1vw",
            }}
          >
            MENU
          </div>

          {/* Spacer for gap */}
          <div style={{ width: isSmallScreen ? "1vw" : "1.5vw" }}></div>

          {/* Close button with outline */}
          <div
            style={{
              borderLeft: "1px solid #D6CBB3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "stretch",
              paddingLeft: isSmallScreen ? "1vw" : "1vw",
              paddingRight: isSmallScreen ? "1vw" : "1vw",
              paddingTop: "0",
              paddingBottom: "0",
              marginTop: "0",
              marginBottom: "0",
            }}
          >
            <button
              onClick={handleClose}
              className="close-button"
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#F2E9D8",
                fontSize: isSmallScreen ? "48px" : "64px",
                cursor: "pointer",
                padding: "0",
                lineHeight: 0.85,
                fontFamily: "Roboto Mono, monospace",
                fontWeight: 500,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            handleClose();
            setTimeout(() => scrollToAbout(setIsDarkTheme), 100);
          }}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="ABOUT"
          style={{
            backgroundColor: "#444C55",
            border: "1px solid #D6CBB3",
            color: "#F2E9D8",
            fontSize: isSmallScreen ? "15vw" : "11vw",
            fontWeight: 700,
            fontFamily: "Roboto Mono, monospace",
            cursor: "pointer",
            textAlign: "left",
            padding: isSmallScreen ? "0.5vh 1vw" : "0.5vh 1vw",
            margin: "0",
            lineHeight: 0.85,
            transition: "transform 0.2s ease",
            animationDelay: isClosing ? "0ms" : "100ms",
            width: "100%",
          }}
        >
          ABOUT
        </button>

        <button
          onClick={handleClose}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="CONTACT"
          style={{
            backgroundColor: "#444C55",
            border: "1px solid #D6CBB3",
            color: "#F2E9D8",
            fontSize: isSmallScreen ? "15vw" : "11vw",
            fontWeight: 700,
            fontFamily: "Roboto Mono, monospace",
            cursor: "pointer",
            textAlign: "left",
            padding: isSmallScreen ? "0.5vh 1vw" : "0.5vh 1vw",
            margin: "0",
            lineHeight: 0.85,
            transition: "transform 0.2s ease",
            animationDelay: isClosing ? "0ms" : "200ms",
            width: "100%",
          }}
        >
          CONTACT
        </button>

        <button
          onClick={handleClose}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="PROJECTS"
          style={{
            backgroundColor: "#444C55",
            border: "1px solid #D6CBB3",
            color: "#F2E9D8",
            fontSize: isSmallScreen ? "15vw" : "11vw",
            fontWeight: 700,
            fontFamily: "Roboto Mono, monospace",
            cursor: "pointer",
            textAlign: "left",
            padding: isSmallScreen ? "0.5vh 1vw" : "0.5vh 1vw",
            margin: "0",
            lineHeight: 0.85,
            transition: "transform 0.2s ease",
            animationDelay: isClosing ? "0ms" : "400ms",
            width: "100%",
          }}
        >
          <span style={{ display: "flex", alignItems: "flex-start", gap: isSmallScreen ? "2vw" : "1.5vw" }}>
            PROJECTS
            <svg
              width={isSmallScreen ? "0.9em" : "0.75em"}
              height={isSmallScreen ? "0.9em" : "0.75em"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="miter"
              style={{ fontWeight: 700 }}
            >
              <polyline points="7,17 15,9" />
              <polyline points="17,17 17,7 7,7" />
            </svg>
          </span>
        </button>

        <button
          onClick={handleClose}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="BLOG"
          style={{
            backgroundColor: "#444C55",
            border: "1px solid #D6CBB3",
            color: "#F2E9D8",
            fontSize: isSmallScreen ? "15vw" : "11vw",
            fontWeight: 700,
            fontFamily: "Roboto Mono, monospace",
            cursor: "pointer",
            textAlign: "left",
            padding: isSmallScreen ? "0.5vh 1vw" : "0.5vh 1vw",
            margin: "0",
            lineHeight: 0.85,
            transition: "transform 0.2s ease",
            animationDelay: isClosing ? "0ms" : "500ms",
            width: "100%",
          }}
        >
          <span style={{ display: "flex", alignItems: "flex-start", gap: isSmallScreen ? "2vw" : "1.5vw" }}>
            BLOG
            <svg
              width={isSmallScreen ? "0.9em" : "0.75em"}
              height={isSmallScreen ? "0.9em" : "0.75em"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="miter"
              style={{ fontWeight: 700 }}
            >
              <polyline points="7,17 15,9" />
              <polyline points="17,17 17,7 7,7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

// About Section Component
function AboutSection({
  isSmallScreen,
  isAboutMenuOpen,
  setIsAboutMenuOpen,
  setIsDarkTheme,
}: {
  isSmallScreen: boolean;
  isAboutMenuOpen: boolean;
  setIsAboutMenuOpen: (value: boolean) => void;
  setIsDarkTheme: (value: boolean) => void;
}) {
  return (
    <section
      id="about"
      style={{
        height: "100dvh",
        backgroundColor: "#2A2F35", // dark charcoal from palette
        color: "#F2E9D8", // warm aged paper from palette
        padding: isSmallScreen ? "3vh 4vw" : "4vh 5vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative", // Add this for header positioning
      }}
    >
      <AboutHeader
        isSmallScreen={isSmallScreen}
        isMenuOpen={isAboutMenuOpen}
        setIsMenuOpen={setIsAboutMenuOpen}
        setIsDarkTheme={setIsDarkTheme}
      />
      {/* Empty content area for now */}
    </section>
  );
}

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  isMenuButton?: boolean;
  isDropdownItem?: boolean;
  reverse?: boolean;
}

function AnimatedButton({
  children,
  onClick,
  style,
  isMenuButton = false,
  isDropdownItem = false,
  reverse = false,
}: AnimatedButtonProps) {
  const baseButtonStyle: React.CSSProperties = {
    padding: isMenuButton ? "8px 16px" : isDropdownItem ? "12px 20px" : "12px 24px",
    borderRadius: isMenuButton || isDropdownItem ? (isDropdownItem ? "0" : "24px") : "0",
    backgroundColor: isMenuButton || isDropdownItem ? "#E4D9C2" : "transparent",
    color: "#2A2F35",
    fontSize: isMenuButton ? "14px" : "20px",
    fontWeight: 400,
    fontFamily: "Roboto Mono, monospace",
    border: "none",
    cursor: "pointer",
    boxShadow: isMenuButton ? "4px 4px 12px rgba(0,0,0,0.3)" : "none",
    position: "relative",
    overflow: "hidden",
    transition: "background-color 0.2s ease",
    ...style,
  };

  const underlineStyle: React.CSSProperties = {
    position: "absolute",
    bottom: isDropdownItem ? "8px" : "4px",
    left: reverse ? "auto" : "0",
    right: reverse ? "0" : "auto",
    height: "2px",
  };

  return (
    <button
      className={!isMenuButton && !isDropdownItem ? "animated-button" : undefined}
      style={baseButtonStyle}
      onClick={onClick}
    >
      {children}
      {!isMenuButton && !isDropdownItem && <span className="animated-button-underline" style={underlineStyle} />}
    </button>
  );
}

// Reusable function to scroll to about section and update theme
function scrollToAbout(setIsDarkTheme: (value: boolean) => void) {
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

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [showXs, setShowXs] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Always load navigation animations
  useNavAnimations();

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < BREAKPOINT);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Scroll detection for marquee theme change
  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      // When scrolled past 90% through the first section, switch to light theme
      if (scrollY >= viewportHeight * 0.9) {
        setIsDarkTheme(true);
      } else {
        setIsDarkTheme(false);
      }
    };

    // Check initial scroll position on mount
    checkScrollPosition();

    const handleScroll = () => {
      checkScrollPosition();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNameClick = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setShowXs(!showXs);
      setTimeout(() => setIsFading(false), 400);
    }, 400);
  };

  return (
    <>
      <AnnouncementMarquee isDarkTheme={isDarkTheme} />

      {/* Full-screen overlay navigation */}
      <FullScreenNav
        isOpen={isAboutMenuOpen}
        onClose={() => setIsAboutMenuOpen(false)}
        isSmallScreen={isSmallScreen}
        setIsDarkTheme={setIsDarkTheme}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* First Section - Landing */}
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100dvh",
            backgroundColor: "#F2E9D8",
            padding: isSmallScreen ? "3vh 4vw" : "4vh 5vw",
            position: "relative",
          }}
        >
        {/* Mobile Dropdown Menu */}
        {isSmallScreen && (
          <div style={{ position: "absolute", top: "0.5%", right: "4vw", zIndex: 100 }}>
            <AnimatedButton isMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? "✕" : "☰"}
            </AnimatedButton>

            {isMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  backgroundColor: "#E4D9C2",
                  borderRadius: "16px",
                  boxShadow: "4px 4px 12px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                  minWidth: "150px",
                }}
              >
                <button
                  className="dropdown-item"
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: "16px",
                    color: "#2A2F35",
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => scrollToAbout(setIsDarkTheme), 100);
                  }}
                >
                  ABOUT
                </button>
                <button
                  className="dropdown-item"
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    borderTop: "1px solid #D6CBB3",
                    cursor: "pointer",
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: "16px",
                    color: "#2A2F35",
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTACT
                </button>
              </div>
            )}
          </div>
        )}

        {/* Name */}
        <div
          className="name-container"
          style={{
            textAlign: "left",
            fontFamily: "Roboto Mono, monospace",
            position: "relative",
            cursor: isFading ? "default" : "pointer",
            pointerEvents: isFading ? "none" : "auto",
          }}
          onClick={handleNameClick}
        >
          <h1
            style={{
              fontSize: isSmallScreen
                ? "clamp(48px, 15vw, 120px)"
                : "clamp(65px, 10vw, 180px)",
              fontWeight: 570,
              margin: 0,
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
              color: "#2A2F35",
              userSelect: "none",
              WebkitUserSelect: "none",
              opacity: isFading ? 0 : 1,
              transition: "opacity 0.4s ease",
            }}
          >
            {isSmallScreen || showXs ? (
              <>
                xs<br />
              </>
            ) : (
              <>
                Xinsheng<br />
                Ooi
              </>
            )}
          </h1>
        </div>

        {/* Desktop Buttons */}
        {!isSmallScreen && (
          <>
            <AnimatedButton
              style={{ position: "absolute", bottom: "5vh", left: "5vw" }}
              onClick={() => scrollToAbout(setIsDarkTheme)}
            >
              ABOUT
            </AnimatedButton>
            <AnimatedButton style={{ position: "absolute", bottom: "5vh", right: "5vw" }} reverse>
              CONTACT
            </AnimatedButton>
          </>
        )}
        </main>

        {/* Second Section - About */}
        <AboutSection
          isSmallScreen={isSmallScreen}
          isAboutMenuOpen={isAboutMenuOpen}
          setIsAboutMenuOpen={setIsAboutMenuOpen}
          setIsDarkTheme={setIsDarkTheme}
        />
      </div>
    </>
  );
}
