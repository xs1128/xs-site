"use client";

import { useState, useEffect, useRef } from "react";
import { StaticIcon } from "../components/icons/StaticIcon";

const BREAKPOINT = 625;

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
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
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
  setIsDarkTheme,
}: {
  isSmallScreen: boolean;
  setIsDarkTheme: (value: boolean) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: isSmallScreen ? "5%" : "6%",
        left: isSmallScreen ? "4vw" : "5vw",
        padding: isSmallScreen ? "1.5vh 3vw" : "2vh 3vw",
        display: "flex",
        justifyContent: "flex-start",
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
          onClick={() => {
            handleClose();
            setTimeout(() => scrollToContact(setIsDarkTheme), 100);
          }}
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

        <a
          href="https://blog.xsooi.com"
          target="_blank"
          rel="noopener noreferrer"
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
            display: "block",
            textDecoration: "none",
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
        </a>
      </div>
    </div>
  );
}

const EnvelopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

// Expertise Card Component
function ExpertiseCard({
  icon,
  title,
  description,
  isSmallScreen,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSmallScreen: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: "#E4D9C2",
        border: "1px solid #D6CBB3",
        borderRadius: "12px",
        padding: isSmallScreen ? "24px" : "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "16px",
        flex: 1,
        minWidth: isSmallScreen ? "100%" : "0",
        position: "relative",
        zIndex: isHovered ? 10 : 1,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div style={{ color: "#2A2F35", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: 700,
          color: "#2A2F35",
          fontFamily: "Hubot Sans, sans-serif",
          minHeight: "2.6em",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "clamp(14px, 1.8vw, 18px)",
          color: "#2A2F35",
          fontFamily: "Hubot Sans, sans-serif",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
}

// About Content Component
function AboutContent({ isSmallScreen }: { isSmallScreen: boolean }) {
  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isSmallScreen ? "28px" : "40px",
        maxWidth: isSmallScreen ? "100%" : "900px",
        width: "100%",
        paddingBottom: isSmallScreen ? "3vh" : "4vh",
      }}
    >
      {/* Hero Headline */}
      <h2
        style={{
          margin: 0,
          marginTop: isSmallScreen ? "6vh" : "4vh",
          maxWidth: "680px",
          fontSize: isSmallScreen ? "clamp(18px, 3.5vw, 26px)" : "clamp(22px, 2.5vw, 32px)",
          fontWeight: 700,
          color: "#E5532C",
          fontFamily: "Roboto Mono, monospace",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        I turn real problems into automated solutions.
      </h2>

      {/* Introduction */}
      <div
        style={{
          maxWidth: "750px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            marginTop: isSmallScreen ? "-2vh" : "-1.5vh",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            color: "#F2E9D8",
            fontFamily: "Roboto Mono, monospace",
            lineHeight: 1.6,
          }}
        >
          I'm Xinsheng. From deployment pipelines to system monitoring, I build automation that keeps things running smoothly.
        </p>
      </div>

      {/* Expertise Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: isSmallScreen ? "24px" : "32px",
          width: "100%",
          alignItems: "stretch",
          padding: isSmallScreen ? "0 24px" : "0",
        }}
      >
        <ExpertiseCard
          icon={<StaticIcon src="/icons/terminal.svg" alt="Scripting & Automation" />}
          title="Scripting & Automation"
          description="Streamlining operations through Python, Bash, and Linux/UNIX scripting for custom automation and system management."
          isSmallScreen={isSmallScreen}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/server.svg" alt="Homelab Infrastructure" />}
          title="Homelab Infrastructure"
          description="Managing self-hosted servers with Docker, Docker Compose, and Cloudflare for containerization and domain routing."
          isSmallScreen={isSmallScreen}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/globe.svg" alt="Infrastructure" />}
          title="Infrastructure"
          description="Handling domains and deployments via Cloudflare DNS and SSH for reliable hosting."
          isSmallScreen={isSmallScreen}
        />
      </div>

      {/* Call to Action */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          cursor: "pointer",
          marginTop: isSmallScreen ? "80px" : "100px",
          maxWidth: "680px",
          width: "100%",
        }}
        onClick={handleScrollToContact}
      >
        <div
          style={{
            fontSize: "24px",
            color: "#F2E9D8",
            animation: "bounce 2s infinite",
          }}
        >
          ↓
        </div>
        <p
          style={{
            margin: 0,
            fontSize: isSmallScreen ? "15px" : "17px",
            color: "#F2E9D8",
            fontFamily: "Roboto Mono, monospace",
            textAlign: "center",
          }}
        >
          Have a problem that needs solving?
        </p>
        <p
          style={{
            margin: 0,
            fontSize: isSmallScreen ? "14px" : "16px",
            color: "#E5532C",
            fontFamily: "Roboto Mono, monospace",
            textAlign: "center",
          }}
        >
          Let's chat - I'd love to hear about it
        </p>
      </div>
    </div>
  );
}

// Contact Header Component
function ContactHeader({
  isSmallScreen,
}: {
  isSmallScreen: boolean;
}) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: isSmallScreen ? "5%" : "6%",
        left: isSmallScreen ? "4vw" : "5vw",
        padding: isSmallScreen ? "1.5vh 3vw" : "2vh 3vw",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        color: "#2A2F35",
        fontFamily: "Roboto Mono, monospace",
        zIndex: 10,
      }}
    >
      {/* Left: CONTACT with underline */}
      <button
        onClick={handleScrollToTop}
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
        CONTACT
        <span
          style={{
            position: "absolute",
            bottom: "-4px",
            left: 0,
            width: "100%",
            height: "1px",
            backgroundColor: "#2A2F35",
          }}
        />
      </button>
    </div>
  );
}

// Social Icon Link Component
function SocialIconLink({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        backgroundColor: "#E4D9C2",
        color: "#2A2F35",
        textDecoration: "none",
        transition: "transform 0.2s ease, background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.backgroundColor = "#E5532C";
        e.currentTarget.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.backgroundColor = "#E4D9C2";
        e.currentTarget.style.color = "#2A2F35";
      }}
    >
      {icon}
    </a>
  );
}

// Custom hook for contact section animations
function useContactAnimations() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes contactSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes contactSlideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes contactSlideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      @keyframes contactFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes contactFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

// Spinning Circular Text Component
function SpinningCircularText({
  text,
  diameter,
  onClick,
  isSmallScreen,
  isExpanded,
}: {
  text: string;
  diameter: number;
  onClick: () => void;
  isSmallScreen: boolean;
  isExpanded: boolean;
}) {
  const radius = diameter / 2;
  const charAngle = 360 / text.length;

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: "50%",
        cursor: "pointer",
        transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1), height 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: "contactSpin 20s linear infinite",
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transformOrigin: "0 0",
            transform: `rotate(${i * charAngle}deg) translate(${radius}px) rotate(90deg)`,
            fontSize: isSmallScreen ? "20px" : "26px",
            fontFamily: "Roboto Mono, monospace",
            color: "#2A2F35",
            fontWeight: 500,
            pointerEvents: "none",
            transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), font-size 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}

      {/* Center tap indicator - just text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          color: "#2A2F35",
          fontSize: isSmallScreen ? "32px" : "40px",
          fontFamily: "Roboto Mono, monospace",
          fontWeight: 700,
          cursor: "pointer",
          userSelect: "none",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
        }}
      >
        {isExpanded ? "-" : "+"}
      </div>
    </div>
  );
}

// Contact Popup Component
function ContactPopup({
  isOpen,
  isClosing,
  onClose,
  isSmallScreen,
}: {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  isSmallScreen: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(errorMsg);
      }

      setSubmitStatus('success');
      setFormData({ name: "", email: "", message: "" });

      // Close form after short delay to show success
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isSmallScreen ? "12px" : "16px",
        width: "100%",
        height: isSmallScreen ? "auto" : "100%",
        padding: isSmallScreen ? "4px 0 0 0" : "0 0 0 48px",
        opacity: isClosing ? 0 : 1,
        overflow: "visible",
        transition: "none",
      }}
    >
      {/* Header with close button and title */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: isSmallScreen ? "12px" : "0",
          marginBottom: isSmallScreen ? "0" : "8px",
        }}
      >
        <h2
          style={{
            margin: "0",
            fontSize: isSmallScreen ? "20px" : "24px",
            fontWeight: 700,
            color: "#E5532C",
            fontFamily: "Roboto Mono, monospace",
            order: 1,
          }}
        >
          Get in Touch
        </h2>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#2A2F35",
            fontSize: "24px",
            cursor: "pointer",
            fontFamily: "Roboto Mono, monospace",
            padding: "0",
            lineHeight: 1,
            order: 2,
          }}
        >
          ✕
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              color: "#2A2F35",
              fontFamily: "Roboto Mono, monospace",
              fontWeight: 500,
            }}
          >
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              fontFamily: "Roboto Mono, monospace",
              backgroundColor: "#E4D9C2",
              border: "1px solid #D6CBB3",
              color: "#2A2F35",
              borderRadius: "0",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              color: "#2A2F35",
              fontFamily: "Roboto Mono, monospace",
              fontWeight: 500,
            }}
          >
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              fontFamily: "Roboto Mono, monospace",
              backgroundColor: "#E4D9C2",
              border: "1px solid #D6CBB3",
              color: "#2A2F35",
              borderRadius: "0",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              color: "#2A2F35",
              fontFamily: "Roboto Mono, monospace",
              fontWeight: 500,
            }}
          >
            Message
          </label>
          <textarea
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              fontFamily: "Roboto Mono, monospace",
              backgroundColor: "#E4D9C2",
              border: "1px solid #D6CBB3",
              color: "#2A2F35",
              borderRadius: "0",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>

        {/* Status messages */}
        {submitStatus === 'success' && (
          <div style={{
            padding: '12px',
            backgroundColor: '#2A2F35',
            color: '#F2E9D8',
            fontSize: '14px',
            fontFamily: 'Roboto Mono, monospace',
            borderRadius: '0',
          }}>
            Message sent successfully!
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={{
            padding: '12px',
            backgroundColor: '#E5532C',
            color: '#F2E9D8',
            fontSize: '14px',
            fontFamily: 'Roboto Mono, monospace',
            borderRadius: '0',
          }}>
            {errorMessage || 'Failed to send message. Please try again.'}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Roboto Mono, monospace",
            backgroundColor: isSubmitting ? "#D6CBB3" : "#E5532C",
            color: "#F2E9D8",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
            transition: "background-color 0.2s ease",
            alignSelf: "flex-start",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = "#D64626";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = "#E5532C";
            }
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

// Contact Section Component
function ContactSection({
  isSmallScreen,
}: {
  isSmallScreen: boolean;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCircleClick = () => {
    if (isAnimating) return;

    if (isPopupOpen) {
      setIsAnimating(true);
      setIsPopupOpen(false);
      setIsPopupClosing(true);

      setTimeout(() => {
        setIsPopupClosing(false);
        setIsAnimating(false);
      }, 1200);
    } else {
      setIsAnimating(true);
      setIsPopupOpen(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }
  };

  const handlePopupClose = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsPopupOpen(false);
    setIsPopupClosing(true);

    setTimeout(() => {
      setIsPopupClosing(false);
      setIsAnimating(false);
    }, 1200);
  };

  return (
    <section
      id="contact"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#F2E9D8",
        color: "#2A2F35",
        padding: isSmallScreen ? "3vh 4vw" : "4vh 5vw",
        paddingTop: isSmallScreen ? "12vh" : "15vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        flexShrink: 0,
      }}
    >
      <ContactHeader isSmallScreen={isSmallScreen} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
            maxWidth: isPopupOpen ? "1200px" : "800px",
          transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Main content area with spinning text and form */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isSmallScreen ? "8px" : "48px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Circle - different animation for small vs large screens */}
          <div style={{
            position: isSmallScreen ? "absolute" : "absolute",
            left: isSmallScreen ? "50%" : "50%",
            top: isSmallScreen ? "50%" : "50%",
            transform: isSmallScreen
              ? (isPopupOpen ? "translate(-50%, -50%) translateY(-150%)" : "translate(-50%, -50%)")
              : `translate(-50%, -50%) ${isPopupOpen ? "translateX(-100%)" : ""}`,
            opacity: isSmallScreen ? (isPopupOpen ? 0 : 1) : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: isSmallScreen
              ? "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: isAnimating ? "none" : "auto"
          }}>
            <SpinningCircularText
              text="Xinsheng Ooi • Xinsheng Ooi • Xinsheng Ooi • "
              diameter={isSmallScreen ? (isPopupOpen ? 180 : 200) : (isPopupOpen ? 240 : 280)}
              onClick={handleCircleClick}
              isSmallScreen={isSmallScreen}
              isExpanded={isPopupOpen}
            />
          </div>

          {/* Divider - only for large screens */}
          {!isSmallScreen && (isPopupOpen || isPopupClosing) && (
            <div style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "2px",
              height: "80%",
              background: "#D6CBB3",
              opacity: isPopupClosing ? 0 : 1,
              transition: isPopupClosing
                ? "opacity 0.3s ease"
                : "opacity 0.4s ease 0.4s",
              pointerEvents: "none"
            }} />
          )}

          {/* Form container - different animation for small vs large screens */}
          <div style={{
            position: isSmallScreen ? "relative" : "absolute",
            left: isSmallScreen ? "auto" : "calc(50% + 20px)",
            top: isSmallScreen ? "auto" : "50%",
            width: isSmallScreen ? "100%" : "calc(50% - 40px)",
            opacity: isPopupOpen ? 1 : 0,
            transform: isSmallScreen
              ? (isPopupOpen ? "translateY(0)" : "translateY(100%)")
              : `translateY(-50%) ${isPopupOpen ? "translateX(0)" : "translateX(100%)"}`,
            transition: isSmallScreen
              ? (isPopupClosing ? "opacity 0.3s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "opacity 0.3s ease 0.3s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s")
              : (isPopupClosing ? "opacity 0.3s ease, transform 0.3s ease" : "opacity 0.3s ease 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s"),
            pointerEvents: isPopupOpen && !isPopupClosing ? "auto" : "none"
          }}>
            <ContactPopup
              isOpen={isPopupOpen}
              isClosing={isPopupClosing}
              onClose={handlePopupClose}
              isSmallScreen={isSmallScreen}
            />
          </div>
        </div>

        {/* Email and social icons at the bottom */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isSmallScreen ? "24px" : "32px",
            width: "100%",
            marginTop: "80px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: isSmallScreen ? "18px" : "20px",
              fontFamily: "Roboto Mono, monospace",
              color: "#2A2F35",
            }}
          >
            email: hi@xsooi.com
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <SocialIconLink
              icon={<GitHubIcon />}
              href="https://github.com/xs1128"
              label="GitHub"
            />
            <SocialIconLink
              icon={<InstagramIcon />}
              href="https://www.instagram.com/xs_ooi1128"
              label="Instagram"
            />
            <SocialIconLink
              icon={<FacebookIcon />}
              href="https://www.facebook.com/ooi.xinsheng/"
              label="Facebook"
            />
            <SocialIconLink
              icon={<LinkedInIcon />}
              href="https://www.linkedin.com/in/xinsheng-ooi-6738083b4"
              label="LinkedIn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// About Section Component
function AboutSection({
  isSmallScreen,
  setIsDarkTheme,
}: {
  isSmallScreen: boolean;
  setIsDarkTheme: (value: boolean) => void;
}) {
  return (
    <section
      id="about"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#2A2F35",
        color: "#F2E9D8",
        padding: isSmallScreen ? "3vh 4vw" : "4vh 5vw",
        paddingTop: isSmallScreen ? "12vh" : "15vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        boxSizing: "border-box",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        flexShrink: 0,
      }}
    >
      <AboutHeader
        isSmallScreen={isSmallScreen}
        setIsDarkTheme={setIsDarkTheme}
      />
      <AboutContent isSmallScreen={isSmallScreen} />
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

// Reusable function to scroll to contact section
function scrollToContact(setIsDarkTheme: (value: boolean) => void) {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" });
    // Update theme after scroll animation completes
    setTimeout(() => {
      setIsDarkTheme(false);
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
  const [isPastLanding, setIsPastLanding] = useState(false);
  const [isIconFading, setIsIconFading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Always load navigation animations
  useNavAnimations();
  useMarqueeAnimation();
  useContactAnimations();

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

  const handleNameClick = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setShowXs(!showXs);
      setTimeout(() => setIsFading(false), 400);
    }, 400);
  };

  const handleMenuToggle = () => {
    if (!isAboutMenuOpen) {
      setIsIconFading(true);
      setTimeout(() => {
        setIsIconFading(false);
        setIsAboutMenuOpen(true);
      }, 100);
    } else {
      setIsAboutMenuOpen(false);
    }
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
        <button
          onClick={handleMenuToggle}
          style={{
            position: "fixed",
            top: isSmallScreen ? "56px" : "60px",
            right: isSmallScreen ? "4vw" : "5vw",
            backgroundColor: "transparent",
            border: "none",
            color: isDarkTheme ? "#F2E9D8" : "#2A2F35",
            fontSize: isSmallScreen ? "32px" : "40px",
            cursor: "pointer",
            padding: "8px",
            lineHeight: 1,
            fontFamily: "Roboto Mono, monospace",
            zIndex: 100,
            opacity: isAboutMenuOpen ? 0 : 1,
            pointerEvents: isAboutMenuOpen ? "none" : "auto",
            transition: "opacity 0.3s ease, color 0.3s ease",
          }}
        >
          <span className={isIconFading ? "hamburger-fading" : ""}>☰</span>
        </button>
      )}

      <div
        ref={scrollContainerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
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
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            flexShrink: 0,
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
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => scrollToContact(setIsDarkTheme), 100);
                  }}
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
            <AnimatedButton
              style={{ position: "absolute", bottom: "5vh", right: "5vw" }}
              reverse
              onClick={() => scrollToContact(setIsDarkTheme)}
            >
              CONTACT
            </AnimatedButton>
          </>
        )}
        </main>

        {/* Second Section - About */}
        <AboutSection
          isSmallScreen={isSmallScreen}
          setIsDarkTheme={setIsDarkTheme}
        />

        {/* Third Section - Contact */}
        <ContactSection
          isSmallScreen={isSmallScreen}
        />
      </div>
    </>
  );
}
