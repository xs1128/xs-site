"use client";

import { useState, useEffect } from "react";

const BREAKPOINT = 300;

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
  const [isHovered, setIsHovered] = useState(false);

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
    backgroundColor: "#E5532C",
    width: isHovered ? "100%" : "0%",
    transition: "width 0.3s ease",
  };

  return (
    <button
      style={baseButtonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
      {!isMenuButton && !isDropdownItem && <span style={underlineStyle} />}
    </button>
  );
}

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showXs, setShowXs] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleNameClick = () => {
    if (isFading) return;
    setIsFading(true);

    setTimeout(() => {
      setShowXs(!showXs);
      setTimeout(() => {
        setIsFading(false);
      }, 400);
    }, 400);
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        backgroundColor: "#F2E9D8",
        padding: isSmallScreen ? "20px" : "40px",
        position: "relative",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Dropdown Navbar for small screens */}
      {isSmallScreen && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              padding: "8px 16px",
              borderRadius: "24px",
              backgroundColor: "#E4D9C2",
              color: "#2A2F35",
              fontSize: "14px",
              fontWeight: 400,
              fontFamily: "Roboto Mono, monospace",
              border: "none",
              cursor: "pointer",
              boxShadow: "4px 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>

          {/* Dropdown Menu */}
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
                style={{
                  width: "100%",
                  borderRadius: 0,
                  boxShadow: "none",
                  padding: "12px 20px",
                  textAlign: "left",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Roboto Mono, monospace",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#2A2F35",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0C4B4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </button>
              <button
                style={{
                  width: "100%",
                  borderRadius: 0,
                  boxShadow: "none",
                  padding: "12px 20px",
                  textAlign: "left",
                  backgroundColor: "transparent",
                  border: "none",
                  borderTop: "1px solid #D6CBB3",
                  cursor: "pointer",
                  fontFamily: "Roboto Mono, monospace",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#2A2F35",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0C4B4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </button>
            </div>
          )}
        </div>
      )}

      {/* Name container */}
      <div
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
              xs
              <br />
            </>
          ) : (
            <>
              Xinsheng
              <br />
              Ooi
            </>
          )}
        </h1>
      </div>

      {/* Bottom Buttons - only show on larger screens */}
      {!isSmallScreen && (
        <>
          {/* Bottom Left Button */}
          <AnimatedButton
            style={{
              position: "absolute",
              bottom: "40px",
              left: "40px",
            }}
          >
            ABOUT
          </AnimatedButton>

          {/* Bottom Right Button */}
          <AnimatedButton
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
            }}
            reverse
          >
            CONTACT
          </AnimatedButton>
        </>
      )}
    </main>
  );
}
