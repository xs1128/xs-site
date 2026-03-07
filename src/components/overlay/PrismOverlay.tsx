"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom 3D mesh with triangular surface
function TriangularMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  // Create triangulated mesh geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Create vertices for triangulated plane
    const vertices: number[] = [];
    const indices: number[] = [];
    const normals: number[] = [];

    const width = 8;
    const height = 4;
    const segmentsX = 15;
    const segmentsY = 10;

    // Generate vertices with some height variation for 3D effect
    for (let y = 0; y <= segmentsY; y++) {
      for (let x = 0; x <= segmentsX; x++) {
        const px = (x / segmentsX) * width - width / 2;
        const py = (y / segmentsY) * height - height / 2;

        // Add subtle height variation based on position
        const pz = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.2;

        vertices.push(px, py, pz);
        normals.push(0, 0, 1);
      }
    }

    // Create triangle indices
    for (let y = 0; y < segmentsY; y++) {
      for (let x = 0; x < segmentsX; x++) {
        const a = y * (segmentsX + 1) + x;
        const b = y * (segmentsX + 1) + x + 1;
        const c = (y + 1) * (segmentsX + 1) + x;
        const d = (y + 1) * (segmentsX + 1) + x + 1;

        // Two triangles per quad
        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    // Initialize color attribute with transparent/zero color
    const colors = new Float32Array(vertices.length);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = 0; // R
      colors[i + 1] = 0; // G
      colors[i + 2] = 0; // B
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geo;
  }, []);

  // Handle pointer move to detect which face is hovered
  const handlePointerMove = (event: any) => {
    if (meshRef.current) {
      const intersections = event.intersections;
      if (intersections.length > 0) {
        const faceIndex = intersections[0].faceIndex;
        if (faceIndex !== undefined) {
          setHoveredFace(faceIndex);
        }
      }
    }
  };

  // Update colors based on hovered face
  useFrame(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      const colorAttribute = geometry.getAttribute('color');
      const indexAttribute = geometry.getIndex();

      if (colorAttribute && indexAttribute) {
        // Reset all colors to invisible (black/zero)
        for (let i = 0; i < colorAttribute.count; i++) {
          colorAttribute.setXYZ(i, 0, 0, 0);
        }

        // Only highlight if a face is hovered
        if (hoveredFace !== null) {
          // Get vertices of hovered face
          const ia = indexAttribute.getX(hoveredFace);
          const ib = indexAttribute.getY(hoveredFace);
          const ic = indexAttribute.getZ(hoveredFace);

          // Highlight the hovered face's vertices
          [ia, ib, ic].forEach(vertexIndex => {
            colorAttribute.setXYZ(vertexIndex, 0.9, 0.32, 0.17);
          });
        }

        colorAttribute.needsUpdate = true;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHoveredFace(null)}
    >
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        metalness={0.1}
        roughness={0.8}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export function PrismOverlay() {
  const [bounds, setBounds] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateBounds = () => {
      const wrapper = document.querySelector(".name-display-wrapper");
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const padding = 40;
        setBounds({
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          left: rect.left - padding,
          top: rect.top - padding,
        });
      }
    };

    updateBounds();
    const resizeTimer = setTimeout(updateBounds, 100);
    window.addEventListener("resize", updateBounds);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  if (bounds.width === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: `${bounds.left}px`,
        top: `${bounds.top}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        zIndex: 5,
        pointerEvents: "auto",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#E5532C" />

        <TriangularMesh />
      </Canvas>
    </div>
  );
}
