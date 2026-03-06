"use client";

interface ThreeDAssetPlaceholderProps {
  isSmallScreen?: boolean;
}

export default function ThreeDAssetPlaceholder({ isSmallScreen = false }: ThreeDAssetPlaceholderProps) {
  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: isSmallScreen ? "center" : "flex-start",
    justifyContent: isSmallScreen ? "center" : "flex-end",
    padding: 0, // No padding
    minHeight: 0,
    border: "none", // No border
    margin: 0, // No margin
    backgroundColor: "transparent",
  };

  const placeholderStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(14px, 2vw, 20px)",
    fontWeight: 500,
    color: "#FFFFFF",
    textAlign: isSmallScreen ? "center" : "right",
    opacity: 1,
    maxWidth: "100%",
    wordBreak: "break-word",
    padding: "clamp(12px, 2vh, 24px)", // Padding on text element
  };

  return (
    <div style={containerStyle}>
    </div>
  );
}
