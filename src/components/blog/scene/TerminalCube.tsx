"use client";

import { useRef, useMemo, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { createFaceTexture, disposeTextures, type FaceTextConfig } from "./createFaceTexture";
import type { TerminalStats } from "./useTerminalStats";
import * as THREE from "three";

interface TerminalCubeProps {
  stats: TerminalStats;
}

export interface TerminalCubeRef {
  rotateCube: (direction: string) => void;
}

const TerminalCube = forwardRef<TerminalCubeRef, TerminalCubeProps>(({ stats }, ref) => {
  const meshRef = useRef<Mesh>(null);
  const [targetRotationX, setTargetRotationX] = useState(0);
  const [targetRotationY, setTargetRotationY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Expose rotateCube method to parent
  useImperativeHandle(ref, () => ({
    rotateCube: (direction: string) => {
      if (isAnimating) return;

      setIsAnimating(true);

      switch (direction) {
        case "left":
          setTargetRotationY(targetRotationY + Math.PI / 2);
          break;
        case "right":
          setTargetRotationY(targetRotationY - Math.PI / 2);
          break;
        case "up":
          setTargetRotationX(targetRotationX - Math.PI / 2);
          break;
        case "down":
          setTargetRotationX(targetRotationX + Math.PI / 2);
          break;
      }
    },
  }));

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

  // Smooth rotation animation
  useFrame(() => {
    if (!meshRef.current) return;

    if (isAnimating) {
      const rotationSpeed = 0.1;
      const diffX = targetRotationX - meshRef.current.rotation.x;
      const diffY = targetRotationY - meshRef.current.rotation.y;

      if (Math.abs(diffX) < 0.01 && Math.abs(diffY) < 0.01) {
        meshRef.current.rotation.x = targetRotationX;
        meshRef.current.rotation.y = targetRotationY;
        setIsAnimating(false);
      } else {
        meshRef.current.rotation.x += diffX * rotationSpeed;
        meshRef.current.rotation.y += diffY * rotationSpeed;
      }
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[2, 2, 2]} />
        {materials.map((mat, index) => (
          <meshStandardMaterial key={index} attach={`material-${index}`} {...mat} />
        ))}
      </mesh>
    </>
  );
});

TerminalCube.displayName = "TerminalCube";

export default TerminalCube;
