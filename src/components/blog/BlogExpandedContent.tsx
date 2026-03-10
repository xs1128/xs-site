"use client";

import SeriesGrid from "./SeriesGrid";
import ThreeDCanvas from "./ThreeDCanvas";

interface BlogExpandedContentProps {
  isSmallScreen?: boolean;
}

export default function BlogExpandedContent({ isSmallScreen = false }: BlogExpandedContentProps) {
  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: isSmallScreen ? "column" : "row",
    overflow: "hidden",
    minHeight: 0,
    gap: 0,
  };

  const sectionStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
    borderRight: isSmallScreen ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
    margin: 0, // Explicitly set margin to 0
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 700,
    color: "#FFFFFF",
    paddingLeft: "clamp(16px, 3vw, 24px)",
    paddingRight: "clamp(6px, 1vh, 12px)",
    paddingTop: "clamp(6px, 1vh, 12px)",
    paddingBottom: "clamp(6px, 1vh, 12px)",
    margin: "0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
    padding: 0,
    margin: 0, // Explicitly set margin to 0
  };

  return (
    <div style={containerStyle}>
      {/* Mobile: 3D Animation Section first, Desktop: Series first */}
      {isSmallScreen && <ThreeDCanvas isSmallScreen={isSmallScreen} />}

      {/* Featured Series Section */}
      <div style={sectionStyle}>
        <h2 style={headerStyle}>Series</h2>
        <div style={contentStyle}>
          <SeriesGrid isSmallScreen={isSmallScreen} />
        </div>
      </div>

      {/* Desktop: 3D Animation Section second */}
      {!isSmallScreen && <ThreeDCanvas isSmallScreen={isSmallScreen} />}
    </div>
  );
}
