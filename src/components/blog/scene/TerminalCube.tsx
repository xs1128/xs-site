"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { createFaceTexture, disposeTextures, type FaceTextConfig } from "./createFaceTexture";
import type { TerminalStats } from "./useTerminalStats";
import * as THREE from "three";

interface TerminalCubeProps {
  stats: TerminalStats;
}

export default function TerminalCube({ stats }: TerminalCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const [currentFace, setCurrentFace] = useState(0); // 0-3 for the 4 main faces
  const [targetRotation, setTargetRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
      // Face 2 (left): SERIES
      {
        mainText: "SERIES",
        valueText: stats.isLoading ? "..." : stats.seriesCount.toString(),
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

  // Handle click to rotate to next face
  const handleClick = (event: any) => {
    event.stopPropagation();
    if (isAnimating) return;

    const nextFace = (currentFace + 1) % 4;
    setCurrentFace(nextFace);
    setTargetRotation(targetRotation + Math.PI / 2); // Rotate 90 degrees
    setIsAnimating(true);
  };

  // Smooth rotation animation
  useFrame(() => {
    if (!meshRef.current) return;

    if (isAnimating) {
      const rotationSpeed = 0.1;
      const diff = targetRotation - meshRef.current.rotation.y;

      if (Math.abs(diff) < 0.01) {
        meshRef.current.rotation.y = targetRotation;
        setIsAnimating(false);
      } else {
        meshRef.current.rotation.y += diff * rotationSpeed;
      }
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onClick={handleClick}
      >
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        {materials.map((mat, index) => (
          <meshStandardMaterial key={index} attach={`material-${index}`} {...mat} />
        ))}
      </mesh>
    </>
  );
}
