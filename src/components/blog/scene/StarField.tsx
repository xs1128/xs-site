'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  Spherical,
  Vector3,
} from 'three';

const COUNT = 900;
const RADIUS = 760;
const DEPTH = 170;
const BASE_SCALE = 1400;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uScale;
attribute float aSize;
attribute float aPhase;
attribute float aSpeed;
attribute vec3 aColor;
varying float vTwinkle;
varying vec3 vColor;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float pulse = 0.55 + 0.45 * sin(uTime * aSpeed + aPhase);
  vTwinkle = pulse;
  vColor = aColor;
  gl_PointSize = aSize * uScale * (0.75 + 0.25 * pulse) / -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform float uOpacity;
varying float vTwinkle;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.04, d) * vTwinkle * uOpacity;
  gl_FragColor = vec4(vColor, alpha);
}
`;

const TINTS = [
  [1.0, 0.98, 0.94],
  [0.82, 0.88, 1.0],
  [1.0, 0.9, 0.78],
  [0.92, 0.95, 1.0],
];

const STAR_DATA = (() => {
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  const speeds = new Float32Array(COUNT);

  const spherical = new Spherical();
  const vector = new Vector3();

  for (let i = 0; i < COUNT; i++) {
    spherical.set(
      RADIUS + Math.random() * DEPTH,
      Math.acos(1 - Math.random() * 2),
      Math.random() * 2 * Math.PI,
    );
    vector.setFromSpherical(spherical);
    positions.set([vector.x, vector.y, vector.z], i * 3);
    colors.set(TINTS[(Math.random() * TINTS.length) | 0], i * 3);
    sizes[i] = 0.9 + Math.random() * 1.9;
    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.35 + Math.random() * 1.15;
  }

  return { positions, colors, sizes, phases, speeds };
})();

type StarUniforms = Record<'uTime' | 'uScale' | 'uOpacity', { value: number }>;

export default function StarField({ opacity = 1 }: { opacity?: number }) {
  const dpr = useThree((state) => state.viewport.dpr);
  const material = useRef<ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      'position',
      new Float32BufferAttribute(STAR_DATA.positions, 3),
    );
    geo.setAttribute('aColor', new Float32BufferAttribute(STAR_DATA.colors, 3));
    geo.setAttribute('aSize', new Float32BufferAttribute(STAR_DATA.sizes, 1));
    geo.setAttribute('aPhase', new Float32BufferAttribute(STAR_DATA.phases, 1));
    geo.setAttribute('aSpeed', new Float32BufferAttribute(STAR_DATA.speeds, 1));
    return geo;
  }, []);

  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScale: { value: BASE_SCALE },
      uOpacity: { value: 1 },
    }),
    [],
  );

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state) => {
    const mat = material.current;
    if (mat)
      (mat.uniforms as StarUniforms).uTime.value = state.clock.getElapsedTime();
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={initialUniforms}
        uniforms-uScale-value={BASE_SCALE * dpr}
        uniforms-uOpacity-value={opacity}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
