"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { FunnyPicture } from "@/types/post";
import { TRANSITIONS } from "@/styles/animations";
import { FONTS, clamp, spacing } from "@/styles/typography";

// Constants
const SCROLL_SPEED = 40; // Pixels per second (2.6x faster than before)

interface FunnyMarqueeProps {
  pictures: FunnyPicture[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Collapse handle component
function CollapseHandle({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const handleContainerStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "44px",
    display: "flex",
    flexDirection: isCollapsed ? "column" : "row",
    alignItems: "center",
    justifyContent: isCollapsed ? "center" : "center",
    backgroundColor: isCollapsed ? "#2A2F35" : "transparent",
    borderTop: isCollapsed ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
    borderBottom: isCollapsed ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
    borderLeft: isCollapsed ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
    borderRight: "none",
    borderRadius: "8px 0 0 8px",
    zIndex: 300,
  };

  const textStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: "clamp(14px, 2.5vw, 22px)",
    fontWeight: 700,
    color: "#F2E9D8",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    transform: "rotate(180deg)",
    whiteSpace: "nowrap",
    flex: 1,
    display: isCollapsed ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const handleStyle: React.CSSProperties = {
    width: "44px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.2s ease",
    flexShrink: 0,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: isCollapsed ? "0 8px 8px 0" : "8px 0 0 8px",
    backgroundColor: "#2A2F35",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "24px",
    color: "#E5532C",
    fontWeight: 700,
    transition: "transform 0.3s ease",
    transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
    fontFamily: "monospace",
  };

  return (
    <div style={handleContainerStyle}>
      {/* Top div - RANDOM MOMENTS (only when collapsed) */}
      {isCollapsed && <div style={textStyle}>RANDOM MOMENTS</div>}

      {/* Handle */}
      <div
        style={handleStyle}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#363D44";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2A2F35";
        }}
      >
        <span style={iconStyle}>◀</span>
      </div>

      {/* Bottom div - RANDOM MOMENTS (only when collapsed) */}
      {isCollapsed && <div style={textStyle}>RANDOM MOMENTS</div>}
    </div>
  );
}

export default function FunnyMarquee({ pictures, isCollapsed = false, onToggleCollapse }: FunnyMarqueeProps) {
  // Clean state - no refs mixed with state
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [oneSetHeight, setOneSetHeight] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Map<number, { width: number; height: number }>>(new Map());

  // Only refs for direct DOM access
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);

  // 3x duplication ensures seamless infinite loop with no visible gaps
  const visiblePictures = [...pictures, ...pictures, ...pictures];

  // Detect mobile device
  const isMobileDevice = useCallback(() => {
    return 'ontouchstart' in window || (navigator.maxTouchPoints > 0);
  }, []);

  // Unified interaction handler for desktop and mobile
  const handleInteraction = useCallback((index: number | null, type: 'hover' | 'touch') => {
    const isMobile = isMobileDevice();

    if (isMobile && type === 'touch') {
      // Mobile: tap to toggle expansion and pause
      if (expandedIndex === index) {
        // Second tap: collapse and resume
        setExpandedIndex(null);
        setIsPaused(false);
      } else {
        // First tap: expand and pause
        setExpandedIndex(index);
        setIsPaused(true);
      }
    } else if (!isMobile && type === 'hover') {
      // Desktop: hover expands and pauses, mouse leave collapses and resumes
      if (index !== null) {
        setExpandedIndex(index);
        setIsPaused(true);
      } else {
        // mouse leave - collapse and resume (same as mobile second tap)
        setExpandedIndex(null);
        setIsPaused(false);
      }
    }
  }, [expandedIndex, isMobileDevice]);

  // Capture image natural dimensions for aspect ratio calculation
  const handleImageLoad = useCallback((pictureId: number, imgElement: HTMLImageElement) => {
    setImageDimensions(prev => {
      const newMap = new Map(prev);
      newMap.set(pictureId, {
        width: imgElement.naturalWidth,
        height: imgElement.naturalHeight
      });
      return newMap;
    });
  }, []);

  // Infinite scroll animation - no timers, immediate resume
  const animateScroll = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Only update position if NOT paused
    if (!isPaused && oneSetHeight > 0) {
      setScrollPosition(prev => {
        const newPosition = prev + (deltaTime / 1000) * SCROLL_SPEED;
        // Reset when we've scrolled through one complete set
        return newPosition >= oneSetHeight ? newPosition % oneSetHeight : newPosition;
      });
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, [isPaused, oneSetHeight]);

  // Start/stop animation based on pause state
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateScroll);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateScroll]);

  // Calculate height using ResizeObserver (reliable, no setTimeout)
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const totalHeight = entry.contentRect.height;
      const sets = visiblePictures.length / pictures.length;
      const oneSet = totalHeight / sets;
      setOneSetHeight(oneSet);
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [visiblePictures.length]);

  // Update DOM transform when scroll position changes
  useEffect(() => {
    if (contentRef.current && oneSetHeight > 0) {
      contentRef.current.style.transform = `translateY(-${scrollPosition}px)`;
      contentRef.current.style.willChange = "transform";
    }
  }, [scrollPosition, oneSetHeight]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    height: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#2A2F35",
    display: "flex",
    flexDirection: "column",
  };

  // Content wrapper style - handles collapse animation
  const contentWrapperStyle: React.CSSProperties = {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    opacity: isCollapsed ? 0 : 1,
    pointerEvents: isCollapsed ? "none" : "auto",
    transition: "opacity 0.3s ease",
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 700,
    color: "#FFFFFF",
    padding: "clamp(6px, 1vh, 12px)",
    margin: "0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    flexShrink: 0,
    textAlign: "center",
    position: "relative",
    zIndex: 100,
    backgroundColor: "#2A2F35",
  };

  const marqueeWrapperStyle: React.CSSProperties = {
    width: "100%",
    flex: 1,
    overflow: "hidden",
    position: "relative",
  };

  const marqueeContentStyle: React.CSSProperties = {
    padding: `${spacing.sm} clamp(6px, 1vw, 12px)`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
  };

  return (
    <div style={containerStyle}>
      {/* Collapse Handle */}
      {onToggleCollapse && (
        <CollapseHandle
          isCollapsed={isCollapsed}
          onToggle={onToggleCollapse}
        />
      )}

      {/* Content wrapper - fades out when collapsed */}
      <div style={contentWrapperStyle}>
        <h2 style={headerStyle}>RANDOM MOMENT</h2>
        <div style={marqueeWrapperStyle}>
        <div
          ref={contentRef}
          style={marqueeContentStyle}
        >
          {visiblePictures.map((picture, index) => {
            const isExpanded = expandedIndex === index;
            const hasError = imageErrors.has(picture.id); // Track by ID, not index

            // Calculate expanded height based on image aspect ratio
            const dimensions = imageDimensions.get(picture.id);
            const collapsedHeight = "clamp(60px, 20vh, 120px)";
            let expandedHeight = collapsedHeight;

            if (dimensions) {
              const { width: imgWidth, height: imgHeight } = dimensions;
              const aspectRatio = imgWidth / imgHeight;

              // Container is 30% of viewport width (from gridTemplateColumns)
              // After scaleX(0.80), visible width = 80% of container
              const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
              const containerWidth = viewportWidth * 0.30;
              const scaledWidth = containerWidth * 0.80;
              const calculatedHeight = scaledWidth / aspectRatio;

              // Cap at viewport height minus header (~80px) and spacing (~40px)
              const maxHeight = typeof window !== 'undefined' ? window.innerHeight - 120 : 600;
              expandedHeight = `${Math.min(calculatedHeight, maxHeight)}px`;
            }

            return (
              <div
                key={`${picture.id}-${index}`}
                style={{
                  position: "relative",
                  width: "100%",
                  height: isExpanded ? expandedHeight : collapsedHeight,
                  flexShrink: 0,
                  overflow: "visible", // Changed from hidden to allow expansion
                  cursor: "pointer",
                  zIndex: isExpanded ? 200 : 1, // Above header (z: 100)
                  transition: `height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), z-index 0s`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onTouchStart={(e) => {
                  e.preventDefault(); // Prevent mouse emulation
                  handleInteraction(index, 'touch');
                }}
                onMouseEnter={() => handleInteraction(index, 'hover')}
                onMouseLeave={() => handleInteraction(null, 'hover')}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: isExpanded ? "scaleX(0.80)" : "scaleX(1)",
                  transformOrigin: "center", // Changed from "left"
                  transition: `transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)`,
                }}>
                  {hasError ? (
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#444C55",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(24px, 5vw, 40px)",
                      color: "#666666"
                    }}>📸</div>
                  ) : (
                    <>
                      {/* Cover image - default state, crops to fit, fades OUT on hover/expand */}
                      <img
                        src={picture.image}
                        alt={picture.title}
                        loading="lazy"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          opacity: isExpanded ? 0 : 1,
                          transition: "opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                          pointerEvents: "none",
                        }}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          handleImageLoad(picture.id, img);
                        }}
                        onError={() => setImageErrors(prev => new Set(prev).add(picture.id))}
                      />
                      {/* Contain image - shows full photo, fades IN on hover/expand */}
                      <img
                        src={picture.image}
                        alt={picture.title}
                        loading="lazy"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                          opacity: isExpanded ? 1 : 0,
                          transition: "opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                          pointerEvents: "none",
                        }}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          handleImageLoad(picture.id, img);
                        }}
                        onError={() => setImageErrors(prev => new Set(prev).add(picture.id))}
                      />
                    </>
                  )}
                  {/* Overlay - no pointerEvents: "none" to allow tap interactions */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: spacing.xs,
                    padding: spacing.sm,
                    opacity: isExpanded ? 1 : 0,
                    transition: "opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    zIndex: 2,
                  }}>
                    <h3 style={{
                      fontFamily: FONTS.primary,
                      fontSize: clamp.sm,
                      fontWeight: 700,
                      color: "#FFFFFF",
                      margin: "0",
                      lineHeight: "1.3",
                      textAlign: "center",
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                    }}>{picture.title}</h3>
                    <p style={{
                      fontFamily: FONTS.primary,
                      fontSize: clamp.xs,
                      fontWeight: 400,
                      color: "#CCCCCC",
                      margin: "0",
                      textAlign: "center",
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                    }}>{picture.location} · {picture.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
