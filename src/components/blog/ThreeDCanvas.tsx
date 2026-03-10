"use client";

import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { colors } from "@/styles/colors";
import InteractiveScene from "./scene/InteractiveScene";
import { useState, useRef, useEffect } from "react";

interface ThreeDCanvasProps {
  isSmallScreen?: boolean;
}

export default function ThreeDCanvas({ isSmallScreen = false }: ThreeDCanvasProps) {
  const isMobile = useIsMobile();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const sceneRef = useRef<{ rotateCube: (direction: string) => void } | null>(null);

  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
    borderRight: "1px solid rgba(0, 0, 0, 0.08)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    borderLeft: isSmallScreen ? "none" : "1px solid rgba(0, 0, 0, 0.08)",
    margin: 0,
    backgroundColor: colors.background,
    position: "relative",
  };

  const arrowButtonStyle = (position: { top?: string; bottom?: string; left?: string; right?: string; transform?: string }): React.CSSProperties => ({
    position: "absolute",
    top: position.top || "auto",
    bottom: position.bottom || "auto",
    left: position.left || "auto",
    right: position.right || "auto",
    transform: position.transform || "none",
    width: isMobile ? "32px" : "40px",
    height: isMobile ? "32px" : "40px",
    backgroundColor: "transparent",
    border: "none",
    color: "#E5532C",
    fontSize: isMobile ? "24px" : "28px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    zIndex: 10,
    userSelect: "none",
    padding: 0,
  });

  const handleArrowClick = (direction: string) => {
    if (sceneRef.current) {
      sceneRef.current.rotateCube(direction);
    }
  };

  const cameraPosition = isMobile ? [0, 0, 4] : [0, 0, 3.5];

  return (
    <div style={containerStyle}>
      <Canvas
        camera={{ position: cameraPosition as [number, number, number], fov: 50 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        dpr={[1, 2]}
      >
        <InteractiveScene ref={sceneRef} />
      </Canvas>

      {/* Arrow buttons for navigation */}
      <button
        style={arrowButtonStyle({ top: isMobile ? "10px" : "20px", left: "50%", transform: "translateX(-50%)" })}
        onClick={() => handleArrowClick("up")}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#CC4420";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "") + " scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#E5532C";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "").replace(" scale(1.2)", "");
        }}
      >
        ↑
      </button>

      <button
        style={arrowButtonStyle({ bottom: isMobile ? "10px" : "20px", left: "50%", transform: "translateX(-50%)" })}
        onClick={() => handleArrowClick("down")}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#CC4420";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "") + " scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#E5532C";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "").replace(" scale(1.2)", "");
        }}
      >
        ↓
      </button>

      <button
        style={arrowButtonStyle({ left: isMobile ? "10px" : "20px", top: "50%", transform: "translateY(-50%)" })}
        onClick={() => handleArrowClick("left")}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#CC4420";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "") + " scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#E5532C";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "").replace(" scale(1.2)", "");
        }}
      >
        ←
      </button>

      <button
        style={arrowButtonStyle({ right: isMobile ? "10px" : "20px", top: "50%", transform: "translateY(-50%)" })}
        onClick={() => handleArrowClick("right")}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#CC4420";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "") + " scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#E5532C";
          e.currentTarget.style.transform = (e.currentTarget.style.transform || "").replace(" scale(1.2)", "");
        }}
      >
        →
      </button>
    </div>
  );
}
