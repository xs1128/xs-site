'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Mesh,
  InstancedMesh,
  Object3D,
  BackSide,
  AdditiveBlending,
  Color,
  Vector3,
} from 'three';
import { OrbitControls, Sky } from '@react-three/drei';
import { colors } from '@/styles/blog/colors';
import TerminalCube from './TerminalCube';
import Ocean from './Ocean';
import StarField from './StarField';
import Constellation from './Constellation';
import { useTerminalStats } from './useTerminalStats';
import { useSunPosition } from './useSunPosition';

type Particle = {
  x: number;
  y: number;
  z: number;
  speed: number;
  offset: number;
};

const PARTICLE_COUNT = 50;
const CELESTIAL_DISTANCE = 600;
const SAGITTARIUS_AT = new Vector3(-376, 274, -651);

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
  const tick = useRef(0);

  useFrame((state) => {
    if (!particlesRef.current || !dummy.current) return;
    if (tick.current++ % 2) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = PARTICLES[i];

      // Floating animation
      const floatY = Math.sin(time * particle.speed + particle.offset) * 0.3;
      const floatX = Math.cos(time * 0.5 + particle.offset) * 0.2;

      dummy.current.position.set(
        particle.x + floatX,
        particle.y + floatY,
        particle.z,
      );
      dummy.current.rotation.set(time * 0.1 + i * 0.1, time * 0.2 + i * 0.1, 0);
      dummy.current.scale.set(0.1, 0.1, 0.1);
      dummy.current.updateMatrix();

      particlesRef.current.setMatrixAt(i, dummy.current.matrix);
    }

    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={particlesRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <octahedronGeometry args={[0.1, 0]} />
      <meshLambertMaterial color={colors.accent} transparent opacity={0.3} />
    </instancedMesh>
  );
}

function Halo({
  radius,
  color,
  opacity,
}: {
  radius: number;
  color: string | Color;
  opacity: number;
}) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 16, 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={BackSide}
        blending={AdditiveBlending}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function PlainEnvironment() {
  return (
    <>
      <color attach="background" args={[colors.background]} />

      {/* Lighting - room effect with multiple light sources */}
      <ambientLight intensity={0.6} />

      {/* Main directional light from top */}
      <directionalLight position={[0, 15, 5]} intensity={0.8} />

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
    </>
  );
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  const fired = useRef(false);

  useFrame(() => {
    if (fired.current) return;
    frames.current += 1;
    if (frames.current < 2) return;
    fired.current = true;
    onReady?.();
  });

  return null;
}

interface InteractiveSceneProps {
  isMobile?: boolean;
  rich?: boolean;
  onReady?: () => void;
}

export default function InteractiveScene({
  isMobile = false,
  rich = true,
  onReady,
}: InteractiveSceneProps) {
  const stats = useTerminalStats();
  const cubeRef = useRef<Mesh>(null);
  const sun = useSunPosition();
  const isNight = sun.isNight;
  const fogColor = isNight ? '#0A1428' : '#7FA6CC';

  const climb = Math.min(1, sun.daylight * 1.7);
  const sunCore = useMemo(
    () => new Color('#FF7A1E').lerp(new Color('#FFFBEA'), climb),
    [climb],
  );
  const sunGlow = useMemo(
    () => new Color('#FF4E12').lerp(new Color('#FFDC94'), climb),
    [climb],
  );

  return (
    <>
      {!rich && <PlainEnvironment />}

      {rich && (
        <>
          <color attach="background" args={[colors.background]} />
          <fog attach="fog" args={[fogColor, 25, 190]} />

          <Sky
            sunPosition={sun.sunPosition}
            turbidity={isNight ? 6 : 1.6 + climb * 1.2}
            rayleigh={isNight ? 0.4 : 2.8 + climb * 1.1}
            mieCoefficient={0.0025}
            mieDirectionalG={0.94}
          />
          {sun.daylight < 0.25 && (
            <>
              <StarField opacity={1 - sun.daylight / 0.25} />
              <Constellation
                position={SAGITTARIUS_AT}
                opacity={1 - sun.daylight / 0.25}
                occluders={[cubeRef]}
              />
            </>
          )}
          {isNight ? (
            <group
              position={sun.moonPosition
                .clone()
                .multiplyScalar(CELESTIAL_DISTANCE)}
            >
              <mesh>
                <sphereGeometry args={[9, 24, 16]} />
                <meshBasicMaterial
                  color="#FBFCFF"
                  fog={false}
                  toneMapped={false}
                />
              </mesh>
              <Halo radius={13} color="#AFC4EC" opacity={0.22} />
            </group>
          ) : (
            <group
              position={sun.sunPosition
                .clone()
                .multiplyScalar(CELESTIAL_DISTANCE)}
            >
              <mesh>
                <sphereGeometry args={[9, 24, 16]} />
                <meshBasicMaterial
                  color={sunCore}
                  fog={false}
                  toneMapped={false}
                />
              </mesh>
              <Halo radius={13} color={sunGlow} opacity={0.22} />
            </group>
          )}

          <Ocean daylight={sun.daylight} isMobile={isMobile} />

          <ambientLight
            intensity={isNight ? 0.32 : 0.25 + sun.daylight * 0.45}
            color={isNight ? '#8FA8D8' : '#FFFFFF'}
          />
          <hemisphereLight
            args={[
              isNight ? '#4C6294' : '#BBDCF2',
              isNight ? '#101B2E' : '#4E7E96',
              isNight ? 0.7 : 0.5 + sun.daylight * 0.6,
            ]}
          />
          <directionalLight
            position={isNight ? sun.moonPosition : sun.sunPosition}
            intensity={isNight ? 0.95 : 0.3 + sun.daylight * 0.9}
            color={isNight ? '#CBD8F5' : '#FFF6E0'}
          />
        </>
      )}

      {/* Background floating particles */}
      <BackgroundParticles />

      <ReadySignal onReady={onReady} />

      {/* Terminal Cube - displays blog stats */}
      <TerminalCube stats={stats} meshRef={cubeRef} />

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
