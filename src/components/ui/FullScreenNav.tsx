"use client";

import { useState, useEffect } from "react";
import { colors } from "@/styles/colors";

// Custom hook for navigation animations
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
      .nav-item-opening {
        animation: fadeInSlide 0.9s cubic-bezier(0.16, 1, 0.3, 1) backwards;
      }
      .nav-item-closing {
        animation: fadeOutSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

interface FullScreenNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function FullScreenNav({ isOpen, onClose }: FullScreenNavProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useNavAnimations();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
        backgroundColor: colors.navBackground,
        zIndex: 10000,
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
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.navButtonPanel,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* MENU word with outline */}
          <div
            style={{
              borderRight: `1px solid ${colors.border}`,
              color: colors.darkText,
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
              borderLeft: `1px solid ${colors.border}`,
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
                color: colors.darkText,
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

        <a
          href="https://me.xsooi.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="SITE"
          style={{
            backgroundColor: colors.navButtonPanel,
            border: `1px solid ${colors.border}`,
            color: colors.darkText,
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
            display: "block",
            textDecoration: "none",
          }}
        >
          <span style={{ display: "flex", alignItems: "flex-start", gap: isSmallScreen ? "2vw" : "1.5vw" }}>
            SITE
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

        <button
          onClick={handleClose}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="PROJECTS"
          style={{
            backgroundColor: colors.navButtonPanel,
            border: `1px solid ${colors.border}`,
            color: colors.darkText,
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
      </div>
    </div>
  );
}
