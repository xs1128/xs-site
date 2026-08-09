"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { createFaceTexture, disposeTextures, type FaceTextConfig } from "./createFaceTexture";
import type { TerminalStats } from "./useTerminalStats";

interface TerminalCubeProps {
  stats: TerminalStats;
}

export default function TerminalCube({ stats }: TerminalCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const { postCount, seriesCount, pictureCount, lastUpdate, isLoading } = stats;

  const textures = useMemo(() => {
    const currentYear = new Date().getFullYear();

    // Face configurations (order: right, left, top, bottom, front, back)
    const faceConfigs: FaceTextConfig[] = [
      // Face 1 (right): POSTS
      {
        mainText: "POSTS",
        valueText: isLoading ? "..." : postCount.toString(),
      },
      // Face 2 (left): SERIES
      {
        mainText: "SERIES",
        valueText: isLoading ? "..." : seriesCount.toString(),
      },
      // Face 3 (top): LAST UPDATE
      {
        mainText: "LAST UPDATE",
        subtext: lastUpdate,
      },
      // Face 4 (bottom): PICTURES
      {
        mainText: "PICTURES",
        valueText: isLoading ? "..." : pictureCount.toString(),
      },
      // Face 5 (front): YEAR + VERSION
      {
        mainText: `© ${currentYear}`,
        subtext: "BLOG v1.0",
      },
      // Face 6 (back): GREETING
      {
        mainText: '> echo "Hello, world!"',
        subtext: '> "Xinsheng here."',
      },
    ];

    return faceConfigs.map(config => createFaceTexture(config));
  }, [postCount, seriesCount, pictureCount, lastUpdate, isLoading]);

  useEffect(() => {
    return () => disposeTextures(textures);
  }, [textures]);

  // Gentle auto-rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        {textures.map((texture, index) => (
          <meshLambertMaterial key={index} attach={`material-${index}`} map={texture} />
        ))}
      </mesh>
    </>
  );
}
