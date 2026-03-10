"use client";

import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { colors } from "@/styles/colors";
import InteractiveScene from "./scene/InteractiveScene";

interface ThreeDCanvasProps {
  isSmallScreen?: boolean;
}

export default function ThreeDCanvas({ isSmallScreen = false }: ThreeDCanvasProps) {
  const isMobile = useIsMobile();

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

  const cameraPosition = isMobile ? [0, 0, 4] : [0, 0, 3.5];

  return (
    <div style={containerStyle}>
      <Canvas
        camera={{ position: cameraPosition as [number, number, number], fov: 50 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        dpr={[1, 2]} // Optimize for high DPI displays
      >
        <InteractiveScene />
      </Canvas>
    </div>
  );
}
