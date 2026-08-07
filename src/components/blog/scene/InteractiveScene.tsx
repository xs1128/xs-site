"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, InstancedMesh, Object3D } from "three";
import { OrbitControls } from "@react-three/drei";
import { colors } from "@/styles/colors";
import TerminalCube from "./TerminalCube";
import { useTerminalStats } from "./useTerminalStats";

type Particle = { x: number; y: number; z: number; speed: number; offset: number };

const PARTICLE_COUNT = 50;

// Decorative scatter, generated once at module load, so Math.random never
// runs during render (pure render) and there's no setState-in-effect.
const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: (Math.random() - 0.5) * 15,
  y: (Math.random() - 0.5) * 15,
  z: (Math.random() - 0.5) * 10 - 5,
  speed: Math.random() * 0.5 + 0.5,
  offset: Math.random() * Math.PI * 2,
}));

function BackgroundParticles() {
  const particlesRef = useRef<InstancedMesh>(null);
  const dummy = useRef<Object3D>(new Object3D());

  // Animate background particles
  useFrame((state) => {
    if (!particlesRef.current || !dummy.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = PARTICLES[i];

      // Floating animation
      const floatY = Math.sin(time * particle.speed + particle.offset) * 0.3;
      const floatX = Math.cos(time * 0.5 + particle.offset) * 0.2;

      dummy.current.position.set(
        particle.x + floatX,
        particle.y + floatY,
        particle.z
      );
      dummy.current.rotation.set(
        time * 0.1 + i * 0.1,
        time * 0.2 + i * 0.1,
        0
      );
      dummy.current.scale.set(0.1, 0.1, 0.1);
      dummy.current.updateMatrix();

      particlesRef.current.setMatrixAt(i, dummy.current.matrix);
    }

    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <octahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial
        color={colors.accent}
        transparent
        opacity={0.3}
        roughness={0.5}
        metalness={0.5}
      />
    </instancedMesh>
  );
}

export default function InteractiveScene() {
  const stats = useTerminalStats();

  return (
    <>
      {/* Vintage yellow/cream background from theme */}
      <color attach="background" args={[colors.background]} />

      {/* Background floating particles */}
      <BackgroundParticles />

      {/* Lighting - room effect with multiple light sources */}
      <ambientLight intensity={0.6} />

      {/* Main directional light from top */}
      <directionalLight
        position={[0, 15, 5]}
        intensity={0.8}
      />

      {/* Fill light from left */}
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#E8E4D9" />

      {/* Accent light from front-right */}
      <pointLight position={[8, 3, 8]} intensity={0.3} color={colors.accent} />

      {/* Rim light from behind for depth */}
      <spotLight
        position={[0, 10, -15]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        color="#FFFFFF"
      />

      {/* Soft hemisphere light for ambient fill */}
      <hemisphereLight args={['#FFFFFF', '#D4CFC5', 0.4]} />

      {/* Terminal Cube - displays blog stats */}
      <TerminalCube stats={stats} />

      {/* Camera controls for user interaction */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={false}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}
