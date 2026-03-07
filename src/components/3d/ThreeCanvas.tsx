"use client";

import { Canvas } from "@react-three/fiber";
import type { ThreeCanvasProps } from "@/types";

/**
 * Canvas wrapper for React Three Fiber scenes
 * Provides responsive camera positioning and performance optimizations
 */
export function ThreeCanvas({ children, isSmallScreen = false }: ThreeCanvasProps) {
  const cameraPosition = isSmallScreen ? [0, 0, 5] : [0, 0, 3.5];

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: cameraPosition as [number, number, number], fov: 45 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        dpr={[1, 2]} // Optimize for high DPI
        gl={{ antialias: true, alpha: true }}
      >
        {children}
      </Canvas>
    </div>
  );
}
