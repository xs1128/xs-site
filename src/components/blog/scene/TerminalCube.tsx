'use client';

import { useMemo, useEffect } from 'react';
import type { RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import {
  createFaceTexture,
  disposeTextures,
  type FaceTextConfig,
} from './createFaceTexture';
import type { TerminalStats } from './useTerminalStats';

interface TerminalCubeProps {
  stats: TerminalStats;
  meshRef: RefObject<Mesh | null>;
}

export default function TerminalCube({ stats, meshRef }: TerminalCubeProps) {
  const {
    postCount,
    seriesCount,
    pictureCount,
    lastUpdate,
    totalViews,
    isLoading,
  } = stats;

  const textures = useMemo(() => {
    const currentYear = new Date().getFullYear();

    // Face configurations (order: right, left, top, bottom, front, back)
    const faceConfigs: FaceTextConfig[] = [
      // Face 1 (right): POSTS
      {
        mainText: 'POSTS',
        valueText: isLoading ? '...' : postCount.toString(),
      },
      // Face 2 (left): SERIES
      {
        mainText: 'SERIES',
        valueText: isLoading ? '...' : seriesCount.toString(),
      },
      // Face 3 (top): LAST UPDATE
      {
        mainText: 'LAST UPDATE',
        subtext: lastUpdate,
      },
      // Face 4 (bottom): PICTURES
      {
        mainText: 'PICTURES',
        valueText: isLoading ? '...' : pictureCount.toString(),
      },
      // Face 5 (front): VISITS
      {
        mainText: 'VISITS',
        valueText: isLoading
          ? '...'
          : (totalViews?.toLocaleString('en-US') ?? '—'),
      },
      // Face 6 (back): YEAR + VERSION
      {
        mainText: `© ${currentYear}`,
        subtext: 'BLOG v1.0',
      },
    ];

    return faceConfigs.map((config) => createFaceTexture(config));
  }, [postCount, seriesCount, pictureCount, lastUpdate, totalViews, isLoading]);

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
          <meshPhongMaterial
            key={index}
            attach={`material-${index}`}
            map={texture}
            emissive="#FFFFFF"
            emissiveMap={texture}
            emissiveIntensity={0.55}
            specular="#5A5A5A"
            shininess={45}
          />
        ))}
      </mesh>
    </>
  );
}
