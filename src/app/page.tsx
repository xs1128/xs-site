"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import FunnyMarquee from "@/components/blog/FunnyMarquee";
import RecentLogs from "@/components/blog/RecentLogs";
import FeaturedSeries from "@/components/blog/FeaturedSeries";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [navDroppedIn, setNavDroppedIn] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
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
  const containerStyle: React.CSSProperties = {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const cardContainerStyle: React.CSSProperties = {
    position: "relative",
    width: isExpanded ? "100vw" : "clamp(300px, 80vw, 1100px)",
    height: isExpanded
      ? "100vh"
      : "clamp(400px, 80vh, 750px)",
    overflow: "hidden",
    borderRadius: isExpanded ? "0" : "12px",
    transition: "width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
    willChange: isAnimating ? "width, height, border-radius" : "auto",
  };

  const cardBaseStyle = {
    position: "absolute" as const,
    top: 0,
    left: "50%",
    width: isExpanded ? "100%" : "100%",
    height: "100%",
    borderRadius: "0px",
    transition: "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
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
    backgroundColor: isExpanded ? "#F2E9D8" : "transparent",
    transition: isExpanded
      ? "background-color 0.3s ease 0.8s, padding 0.3s ease 0.8s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s"
      : "background-color 0.8s ease, padding 0.8s ease, opacity 0.2s ease",
    opacity: navDroppedIn ? 1 : isSwapped ? 0 : 1,
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
    transition: "opacity 0.2s ease, color 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s",
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
    transition: "opacity 0.2s ease, color 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s",
    pointerEvents: navDroppedIn ? "auto" : (isSwapped ? "none" : "auto"),
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
    transition: "color 0.3s ease, opacity 0.2s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s",
    opacity: !isSwapped || navDroppedIn ? 1 : 0,
    pointerEvents: navDroppedIn ? "auto" : (isSwapped ? "none" : "auto"),
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
    padding: isExpanded ? "0" : "0 20px",
    transition: "padding 0.3s ease",
  };

  const contentBlockStyle: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
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
    transition: "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
    willChange: isAnimating ? "transform" : "auto",
  };

  const contentCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    backgroundColor: "#2A2F35",
    display: "grid",
    gridTemplateColumns: "30% 70%",
    overflow: "hidden",
    zIndex: 1,
    paddingTop: isExpanded ? "clamp(40px, 7vh, 64px)" : "0",
    transform: isSwapped ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100%)",
    transition: "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), padding-top 0.8s ease",
    willChange: isAnimating ? "transform, padding-top" : "auto",
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url(/IMG_1953.jpeg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
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
              <span style={{ fontSize: "clamp(20px, 3vw, 28px)" }}>↑</span>
              {!isSmallScreen && " BACK"}
            </AnimatedButton>
            <AnimatedButton
              variant="underline"
              reverse
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
              <div style={imageStyle} />

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
                <span style={tapAreaDotStyle}>↓</span>
                <span style={tapAreaTextStyle}>Tap to explore</span>
              </div>
            </div>

            {/* Content Card (Back) */}
            <div style={contentCardStyle}>
              {/* Left Marquee */}
              <FunnyMarquee />

              {/* Right Content */}
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%", borderLeft: "1px solid rgba(255, 255, 255, 0.2)", position: "relative" }}>
                {/* RECENT Section */}
                <RecentLogs />

                {/* FEATURED SERIES Section */}
                <FeaturedSeries />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
