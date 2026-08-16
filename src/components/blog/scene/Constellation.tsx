"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Object3D,
  ShaderMaterial,
  Vector3,
} from "three";

const STARS: Record<string, [number, number]> = {
  alnasl: [0.97, -0.21],
  kausMedia: [0.48, -0.12],
  kausAustralis: [0.38, -0.79],
  kausBorealis: [0.26, 0.53],
  phi: [-0.31, 0.3],
  nunki: [-0.62, 0.4],
  tau: [-0.99, 0.2],
  ascella: [-0.86, -0.13],
};

const SIZES: Record<keyof typeof STARS, number> = {
  kausAustralis: 4.6,
  nunki: 4.2,
  ascella: 3.6,
  kausMedia: 3.5,
  kausBorealis: 3.4,
  alnasl: 3.2,
  phi: 3.0,
  tau: 3.0,
};

const EDGES: [keyof typeof STARS, keyof typeof STARS][] = [
  ["alnasl", "kausMedia"],
  ["alnasl", "kausAustralis"],
  ["kausMedia", "kausAustralis"],
  ["kausAustralis", "ascella"],
  ["ascella", "phi"],
  ["phi", "kausMedia"],
  ["kausMedia", "kausBorealis"],
  ["kausBorealis", "nunki"],
  ["nunki", "tau"],
  ["tau", "ascella"],
];

const SPREAD = 100;
const HOVER_PAD = 18;
const LABEL = "xs is a Sagittarius";
const CYCLE = 26;
const DRAW_TIME = 7;
const HOLD_TIME = 11;

const LINE_VERTEX = /* glsl */ `
attribute float aDist;
varying float vDist;
void main() {
  vDist = aDist;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const LINE_FRAGMENT = /* glsl */ `
uniform float uProgress;
uniform float uOpacity;
varying float vDist;
void main() {
  float reveal = 1.0 - smoothstep(uProgress - 0.05, uProgress, vDist);
  gl_FragColor = vec4(0.62, 0.78, 1.0, reveal * uOpacity * 0.85);
}
`;

const POINT_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uScale;
attribute float aSize;
attribute float aOrder;
varying float vGlow;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vGlow = 0.7 + 0.3 * sin(uTime * 1.4 + aOrder * 5.0);
  gl_PointSize = aSize * uScale * vGlow / -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const POINT_FRAGMENT = /* glsl */ `
uniform float uOpacity;
varying float vGlow;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.02, d) * vGlow * uOpacity;
  gl_FragColor = vec4(0.85, 0.92, 1.0, alpha);
}
`;

const LINE_DATA = (() => {
  const verts: number[] = [];
  const starts: number[] = [];
  const lengths: number[] = [];
  let walked = 0;

  for (const [from, to] of EDGES) {
    const a = STARS[from];
    const b = STARS[to];
    verts.push(a[0] * SPREAD, a[1] * SPREAD, 0, b[0] * SPREAD, b[1] * SPREAD, 0);
    starts.push(walked);
    lengths.push(Math.hypot(b[0] - a[0], b[1] - a[1]));
    walked += lengths[lengths.length - 1];
  }

  const dists: number[] = [];
  for (let i = 0; i < starts.length; i++) {
    dists.push(starts[i] / walked, (starts[i] + lengths[i]) / walked);
  }

  return { verts, dists };
})();

const HOVER_AREA = (() => {
  const points = Object.values(STARS);
  const xs = points.map(([x]) => x * SPREAD);
  const ys = points.map(([, y]) => y * SPREAD);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    center: [(minX + maxX) / 2, (minY + maxY) / 2, 0] as [number, number, number],
    size: [maxX - minX + HOVER_PAD * 2, maxY - minY + HOVER_PAD * 2] as [number, number],
  };
})();

type LineUniforms = Record<"uProgress" | "uOpacity", { value: number }>;
type PointUniforms = Record<"uTime" | "uScale" | "uOpacity", { value: number }>;

interface ConstellationProps {
  position: Vector3;
  opacity?: number;
  occluders?: RefObject<Object3D | null>[];
}

export default function Constellation({
  position,
  opacity = 1,
  occluders,
}: ConstellationProps) {
  const dpr = useThree((state) => state.viewport.dpr);
  const lineMaterial = useRef<ShaderMaterial>(null);
  const pointMaterial = useRef<ShaderMaterial>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { lineGeometry, pointGeometry } = useMemo(() => {
    const { verts, dists } = LINE_DATA;

    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute("position", new Float32BufferAttribute(verts, 3));
    lineGeo.setAttribute("aDist", new Float32BufferAttribute(dists, 1));

    const names = Object.keys(STARS);
    const points: number[] = [];
    const sizes: number[] = [];
    const orders: number[] = [];

    names.forEach((name, index) => {
      const [x, y] = STARS[name];
      points.push(x * SPREAD, y * SPREAD, 0);
      sizes.push(SIZES[name]);
      orders.push(index / names.length);
    });

    const pointGeo = new BufferGeometry();
    pointGeo.setAttribute("position", new Float32BufferAttribute(points, 3));
    pointGeo.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
    pointGeo.setAttribute("aOrder", new Float32BufferAttribute(orders, 1));

    return { lineGeometry: lineGeo, pointGeometry: pointGeo };
  }, []);

  const lineUniforms = useMemo(
    () => ({ uProgress: { value: 0 }, uOpacity: { value: 1 } }),
    []
  );
  const pointUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScale: { value: 1400 }, uOpacity: { value: 1 } }),
    []
  );

  useEffect(() => {
    return () => {
      lineGeometry.dispose();
      pointGeometry.dispose();
    };
  }, [lineGeometry, pointGeometry]);

  useEffect(() => {
    if (!isHovered) return;
    document.body.style.cursor = "help";
    return () => {
      document.body.style.cursor = "";
    };
  }, [isHovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const phase = time % CYCLE;

    let visible: number;
    if (phase < DRAW_TIME) visible = phase / DRAW_TIME;
    else if (phase < DRAW_TIME + HOLD_TIME) visible = 1;
    else visible = 1 - (phase - DRAW_TIME - HOLD_TIME) / (CYCLE - DRAW_TIME - HOLD_TIME);

    const fade = phase < DRAW_TIME + HOLD_TIME ? 1 : visible;

    const line = lineMaterial.current;
    if (line) {
      const u = line.uniforms as LineUniforms;
      u.uProgress.value = phase < DRAW_TIME ? visible : 1;
      u.uOpacity.value = fade * opacity;
    }

    const point = pointMaterial.current;
    if (point) {
      const u = point.uniforms as PointUniforms;
      u.uTime.value = time;
      u.uOpacity.value = fade * opacity;
    }

    if (isHovered && fade * opacity < 0.3) setIsHovered(false);
  });

  return (
    <group position={position} rotation={[0, 0, -0.1]}>
      <lineSegments geometry={lineGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={lineMaterial}
          uniforms={lineUniforms}
          vertexShader={LINE_VERTEX}
          fragmentShader={LINE_FRAGMENT}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
      <points geometry={pointGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={pointMaterial}
          uniforms={pointUniforms}
          uniforms-uScale-value={1400 * dpr}
          vertexShader={POINT_VERTEX}
          fragmentShader={POINT_FRAGMENT}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
      <mesh
        position={HOVER_AREA.center}
        onPointerOver={(event) => {
          if (event.intersections[0]?.object !== event.object) return;
          event.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
      >
        <planeGeometry args={HOVER_AREA.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {isHovered && (
        <Html
          position={HOVER_AREA.center}
          center
          zIndexRange={[4, 0]}
          occlude={occluders as RefObject<Object3D>[] | undefined}
          style={{ pointerEvents: "none" }}
        >
          <div className="blog-tooltip" data-ready="true" style={{ position: "static" }}>
            {LABEL}
          </div>
        </Html>
      )}
    </group>
  );
}
