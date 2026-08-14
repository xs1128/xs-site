"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import FunnyMarqueeWrapper from "@/components/blog/FunnyMarqueeWrapper";
import RecentBlogsGrid from "@/components/blog/RecentBlogsGrid";
import BlogExpandedContent from "@/components/blog/BlogExpandedContent";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { ArrowUp, ArrowDown, ArrowUpRight } from "lucide-react";
import { colors } from "@/styles/colors";

const useBeforePaintEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const MARQUEE_RESIZE_MS = 620;

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
        padding-right: 0;
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

// Full-Screen Navigation Overlay Component
function FullScreenNav({
  isOpen,
  onClose,
  isSmallScreen,
}: {
  isOpen: boolean;
  onClose: () => void;
  isSmallScreen: boolean;
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
          href="https://www.xsooi.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="SITE"
          style={{
            backgroundColor: colors.navButtonPanel,
            border: `1px solid ${colors.border}`,
            color: colors.darkText,
            fontSize: isSmallScreen ? "14.5vw" : "10.5vw",
            fontWeight: 700,
            fontFamily: "Roboto Mono, monospace",
            cursor: "pointer",
            textAlign: "left",
            padding: "0.5vh 3vw 0.5vh 1vw",
            margin: "0",
            lineHeight: 0.85,
            transition: "transform 0.2s ease",
            animationDelay: isClosing ? "0ms" : "200ms",
            width: "100%",
            display: "block",
            textDecoration: "none",
          }}
        >
          <span style={{ display: "flex", alignItems: "baseline", gap: isSmallScreen ? "2vw" : "1.5vw" }}>
            SITE
            <ArrowUpRight
              viewBox="5.5 5.5 13 13"
              style={{ width: "0.8cap", height: "0.8cap", transform: "translateY(-0.2cap)", flexShrink: 0 }}
              strokeWidth={3}
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          </span>
        </a>

        <a
          href="https://github.com/xs1128"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={`nav-item ${isClosing ? "nav-item-closing" : "nav-item-opening"}`}
          data-text="PROJECTS"
          style={{
            backgroundColor: colors.navButtonPanel,
            border: `1px solid ${colors.border}`,
            color: colors.darkText,
            fontSize: isSmallScreen ? "14.5vw" : "10.5vw",
            fontWeight: 700,
            fontFamily: "Roboto Mono, monospace",
            cursor: "pointer",
            textAlign: "left",
            padding: "0.5vh 3vw 0.5vh 1vw",
            margin: "0",
            lineHeight: 0.85,
            transition: "transform 0.2s ease",
            animationDelay: isClosing ? "0ms" : "400ms",
            width: "100%",
            display: "block",
            textDecoration: "none",
          }}
        >
          <span style={{ display: "flex", alignItems: "baseline", gap: isSmallScreen ? "2vw" : "1.5vw" }}>
            PROJECTS
            <ArrowUpRight
              viewBox="5.5 5.5 13 13"
              style={{ width: "0.8cap", height: "0.8cap", transform: "translateY(-0.2cap)", flexShrink: 0 }}
              strokeWidth={3}
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          </span>
        </a>
      </div>
    </div>
  );
}

export default function HomePageClient({
  heroImageUrl,
  heroBlurDataURL,
}: {
  heroImageUrl: string;
  heroBlurDataURL: string | null;
}) {
  useNavAnimations();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [navDroppedIn, setNavDroppedIn] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMarqueeCollapsed, setIsMarqueeCollapsed] = useState(true);
  const [isMarqueeResizing, setIsMarqueeResizing] = useState(false);
  const [skipTransitions, setSkipTransitions] = useState(false);
  const marqueeResizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (marqueeResizeTimer.current) clearTimeout(marqueeResizeTimer.current);
    };
  }, []);

  const toggleMarquee = () => {
    setIsMarqueeCollapsed((previous) => !previous);
    setIsMarqueeResizing(true);
    if (marqueeResizeTimer.current) clearTimeout(marqueeResizeTimer.current);
    marqueeResizeTimer.current = setTimeout(() => setIsMarqueeResizing(false), MARQUEE_RESIZE_MS);
  };

  // ?expanded=true is a deep link: land on the expanded state instead of
  // travelling there, so kill the transitions for the commit that flips it.
  useBeforePaintEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expanded') !== 'true') return;

    setSkipTransitions(true);
    setIsSwapped(true);
    setIsExpanded(true);
    setNavDroppedIn(true);

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSkipTransitions(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };

    const checkScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    checkScreenSize();
    checkScroll();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const triggerCardSwap = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (isSwapped) {
      // Going back: collapse and swap simultaneously
      setNavDroppedIn(false);
      setIsExpanded(false);
      setIsSwapped(false);
      setTimeout(() => setIsAnimating(false), 800);
    } else {
      // Going forward: swap and expand simultaneously
      setIsSwapped(true);
      setIsExpanded(true);
      setTimeout(() => {
        setNavDroppedIn(true);
        setTimeout(() => setIsAnimating(false), 400);
      }, 800);
    }
  };

  const transition = (value: string) => (skipTransitions ? "none" : value);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    overflowX: "hidden",
  };

  const cardContainerStyle: React.CSSProperties = {
    position: "relative",
    width: isExpanded ? "100%" : "clamp(300px, 90vw, 1100px)",
    height: isExpanded
      ? "100vh"
      : "clamp(400px, 80vh, 750px)",
    overflow: "hidden",
    overflowX: "hidden",
    borderRadius: isExpanded ? "0" : "12px",
    transition: transition("width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)"),
    willChange: isAnimating ? "width, height, border-radius" : "auto",
  };

  const cardBaseStyle = {
    position: "absolute" as const,
    top: 0,
    left: "50%",
    width: isExpanded ? "100%" : "100%",
    height: "100%",
    borderRadius: "0px",
    transition: transition("transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)"),
    transform: "translateX(-50%)",
  };

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isExpanded
      ? "clamp(10px, 1.5vh, 20px) clamp(30px, 5vw, 60px)"
      : "clamp(20px, 3vh, 40px) clamp(30px, 5vw, 60px)",
    zIndex: 9999,
    backgroundColor: isExpanded ? colors.background : "transparent", // Use vintage yellow from color scheme
    transition: transition(
      isExpanded
        ? "background-color 0.3s ease 0.8s, padding 0.3s ease 0.8s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s"
        : "background-color 0.8s ease, padding 0.8s ease, opacity 0.2s ease"
    ),
    opacity: navDroppedIn ? 1 : isSwapped ? 0 : (isAtTop ? 1 : 0),
    pointerEvents: navDroppedIn ? "auto" : isSwapped ? "none" : (isAtTop ? "auto" : "none"),
    transform: "translateY(0)",
    transformOrigin: "top",
    willChange: isAnimating ? "padding, background-color, transform, opacity" : "auto",
  };

  const navRightStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "clamp(20px, 3vw, 40px)",
  };

  const backButtonTextStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(18px, 2.5vw, 24px)",
    fontWeight: 700,
    color: "#2A2F35",
    textDecoration: "none",
    cursor: "pointer",
    transition: transition("opacity 0.2s ease, color 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s"),
    display: "flex",
    alignItems: "center",
    gap: "clamp(4px, 0.5vw, 8px)",
    opacity: navDroppedIn ? 1 : 0,
    pointerEvents: navDroppedIn ? "auto" : "none",
    transform: navDroppedIn ? "translateY(0)" : (isSwapped ? "translateY(0)" : "translateY(-20px)"),
    transformOrigin: "top",
  };

  const brandStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(18px, 2.5vw, 24px)",
    fontWeight: 700,
    color: "#2A2F35",
    letterSpacing: "0.05em",
    opacity: !isSwapped || navDroppedIn ? 1 : 0,
    transition: transition("opacity 0.2s ease, color 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s"),
    pointerEvents: navDroppedIn ? "auto" : (isSwapped ? "none" : (isAtTop ? "auto" : "none")),
    transform: navDroppedIn ? "translateY(0)" : (isSwapped ? "translateY(0)" : "translateY(10px)"),
    transformOrigin: "top",
  };

  const menuLinkStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(18px, 2.5vw, 24px)",
    fontWeight: 700,
    color: "#2A2F35",
    textDecoration: "none",
    cursor: "pointer",
    transition: transition("color 0.3s ease, opacity 0.2s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s"),
    opacity: !isSwapped || navDroppedIn ? 1 : 0,
    pointerEvents: navDroppedIn ? "auto" : (isSwapped ? "none" : (isAtTop ? "auto" : "none")),
    transform: navDroppedIn ? "translateY(0)" : (isSwapped ? "translateY(0)" : "translateY(10px)"),
    transformOrigin: "top",
    display: "flex",
    alignItems: "center",
  };

  const mainStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: isExpanded ? "flex-start" : "center",
    alignItems: "center",
    flex: 1,
    padding: isExpanded ? "0" : "0",
    transition: transition("padding 0.3s ease"),
    width: "100%",
    overflowX: "hidden",
  };

  const contentBlockStyle: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "0",
    width: "clamp(300px, 80vw, 1100px)",
    height: "clamp(400px, 80vh, 750px)",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  };

  const heroCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    ...contentBlockStyle,
    transform: isSwapped ? "translateX(-50%) translateY(-100%)" : "translateX(-50%) translateY(0)",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
    transition: transition("transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)"),
    willChange: isAnimating ? "transform" : "auto",
  };

  const contentCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    backgroundColor: "#2A2F35",
    display: "grid",
    gridTemplateColumns: isSmallScreen ? "100%" : (isMarqueeCollapsed ? "40px 1fr" : "30% 70%"),
    overflow: "hidden",
    zIndex: 1,
    paddingTop: isExpanded ? "clamp(40px, 7vh, 64px)" : "0",
    transform: isSwapped ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100%)",
    transition: transition("transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), padding-top 0.8s ease, grid-template-columns 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)"),
    willChange: isAnimating || isMarqueeResizing ? "transform, padding-top, grid-template-columns" : "auto",
  };

  const tapAreaStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "clamp(120px, 20vw, 200px)",
    height: "clamp(60px, 10vh, 100px)",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "clamp(4px, 1vh, 8px)",
    transition: "transform 0.2s ease",
  };

  const tapAreaTextStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.5vw, 14px)",
    fontWeight: 600,
    color: "#E5532C",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    textAlign: "center",
  };

  const tapAreaDotStyle: React.CSSProperties = {
    width: "clamp(40px, 6vw, 60px)",
    height: "clamp(40px, 6vw, 60px)",
    borderRadius: "50%",
    border: "2px solid #E5532C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "clamp(18px, 3vw, 24px)",
    color: "#E5532C",
    fontWeight: 700,
  };

  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    objectPosition: "center",
    filter: "grayscale(100%) brightness(0.7) contrast(1.2)",
    zIndex: 0,
  };

  const headlineStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    color: "#E5532C",
    margin: "0",
    padding: "clamp(16px, 3vh, 32px)",
    letterSpacing: "-0.02em",
    lineHeight: "1.2",
    position: "relative",
    zIndex: 1,
  };

  return (
    <>
      {/* Container */}
      <div style={containerStyle}>
        {/* Navigation */}
        <nav style={navStyle}>
          <div style={brandStyle}>BLOG</div>
          <div style={navRightStyle}>
            <AnimatedButton
              variant="underline"
              reverse
              onClick={triggerCardSwap}
              style={backButtonTextStyle}
            >
              <span style={{ fontSize: "clamp(20px, 3vw, 28px)", display: "inline-flex" }}>
                <ArrowUp size="1em" strokeWidth={2.5} />
              </span>
              {!isSmallScreen && " BACK"}
            </AnimatedButton>
            <AnimatedButton
              variant="underline"
              reverse
              onClick={() => setIsNavOpen(true)}
              style={menuLinkStyle}
            >
              <span style={{ fontSize: "clamp(22px, 3vw, 28px)", transform: "translateY(-3px)", display: "inline-block" }}>☰</span>
              {isSmallScreen ? "" : " MENU"}
            </AnimatedButton>
          </div>
        </nav>

        {/* Main Content */}
        <main style={mainStyle}>
          {/* 3D Card Container */}
          <div style={cardContainerStyle}>
            {/* Hero Card (Front) */}
            <div style={heroCardStyle}>
              {/* Monochrome Background Image */}
              {heroImageUrl && (
                <Image
                  src={heroImageUrl}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1375px) 80vw, 1100px"
                  style={imageStyle}
                  placeholder={heroBlurDataURL ? "blur" : "empty"}
                  blurDataURL={heroBlurDataURL ?? undefined}
                />
              )}

              {/* Headline */}
              <h1 style={headlineStyle}>
                SHARING & LOGGING
              </h1>

              {/* Tap Area */}
              <div
                style={tapAreaStyle}
                onClick={triggerCardSwap}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(-50%) scale(1)";
                }}
              >
                <span style={tapAreaDotStyle}>
                  <ArrowDown size="1em" strokeWidth={2.5} />
                </span>
                <span style={tapAreaTextStyle}>Tap to explore</span>
              </div>
            </div>

            {/* Content Card (Back) */}
            <div style={contentCardStyle}>
              {/* Left Marquee */}
              {!isSmallScreen && (
                <FunnyMarqueeWrapper
                  isCollapsed={isMarqueeCollapsed}
                  isResizing={isMarqueeResizing}
                  onToggleCollapse={toggleMarquee}
                />
              )}

              {/* Right Content */}
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%", borderLeft: isSmallScreen ? "none" : "1px solid rgba(255, 255, 255, 0.2)", position: "relative", padding: isExpanded ? "0" : "clamp(16px, 3vh, 32px)", gap: isExpanded ? "0" : "clamp(16px, 3vh, 32px)", contain: "layout paint" }}>
                {/* RECENT BLOGS Section */}
                <RecentBlogsGrid isExpanded={isExpanded} isSmallScreen={isSmallScreen} />

                {/* FEATURED SERIES & 3D ANIMATION Sections */}
                <BlogExpandedContent isSmallScreen={isSmallScreen} isResizing={isMarqueeResizing} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Full-Screen Navigation */}
      <FullScreenNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        isSmallScreen={isSmallScreen}
      />
    </>
  );
}
