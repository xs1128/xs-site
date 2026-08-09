"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { colors } from "@/styles/colors";
import InteractiveScene from "./scene/InteractiveScene";

interface ThreeDCanvasProps {
  isSmallScreen?: boolean;
}

export default function ThreeDCanvas({ isSmallScreen = false }: ThreeDCanvasProps) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOnscreen, setIsOnscreen] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(([entry]) => setIsOnscreen(entry.isIntersecting));
    observer.observe(container);

    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

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

  const cameraPosition = isMobile ? [0, 0, 5] : [0, 0, 4];

  return (
    <div ref={containerRef} style={containerStyle}>
      <Canvas
        camera={{ position: cameraPosition as [number, number, number], fov: 50 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        dpr={[1, isMobile ? 1.5 : 2]}
        frameloop={isOnscreen && isPageVisible ? "always" : "never"}
      >
        <InteractiveScene />
      </Canvas>
    </div>
  );
}
