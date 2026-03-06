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

  // Create textures for all 6 faces
  const materials = useMemo(() => {
    const currentYear = new Date().getFullYear();

    // Face configurations (order: right, left, top, bottom, front, back)
    const faceConfigs: FaceTextConfig[] = [
      // Face 1 (right): POSTS
      {
        mainText: "POSTS",
        valueText: stats.isLoading ? "..." : stats.postCount.toString(),
      },
      // Face 2 (left): CATEGORIES
      {
        mainText: "CATEGORIES",
        valueText: stats.isLoading ? "..." : stats.categoryCount.toString(),
      },
      // Face 3 (top): LAST UPDATE
      {
        mainText: "LAST UPDATE",
        subtext: stats.lastUpdate,
      },
      // Face 4 (bottom): PICTURES
      {
        mainText: "PICTURES",
        valueText: stats.isLoading ? "..." : stats.pictureCount.toString(),
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

    // Create textures
    const textures = faceConfigs.map(config => createFaceTexture(config));

    // Create materials array (6 materials for 6 faces)
    const mats = textures.map(texture => ({
      map: texture,
      roughness: 0.3,
      metalness: 0.1,
    }));

    return mats;
  }, [stats]);

  // Clean up textures on unmount
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        materials.forEach(mat => {
          if (mat.map) mat.map.dispose();
        });
      }
    };
  }, [materials]);

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
        {materials.map((mat, index) => (
          <meshStandardMaterial key={index} attach={`material-${index}`} {...mat} />
        ))}
      </mesh>
    </>
  );
}
