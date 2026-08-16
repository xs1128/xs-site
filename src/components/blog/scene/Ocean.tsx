"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MeshPhongMaterial, Vector2 } from "three";
import { createWaterNormal } from "./createWaterNormal";

const WAVE_GLSL = /* glsl */ `
uniform float uTime;

vec3 gerstner(vec2 p, out vec3 n) {
  vec3 offset = vec3(0.0);
  vec2 slope = vec2(0.0);
  float curl = 0.0;
  float ph, c, s;

  ph = 0.169816 * dot(vec2(0.98586, 0.16760), p) + uTime * 1.290697;
  c = cos(ph); s = sin(ph);
  offset.xy += 0.384400 * vec2(0.98586, 0.16760) * c;
  offset.z += 0.62 * s;
  slope += vec2(0.98586, 0.16760) * 0.105286 * c;
  curl += 0.065277 * s;

  ph = 0.273182 * dot(vec2(-0.419058, 0.907959), p) + uTime * 1.637045;
  c = cos(ph); s = sin(ph);
  offset.xy += 0.163200 * vec2(-0.419058, 0.907959) * c;
  offset.z += 0.34 * s;
  slope += vec2(-0.419058, 0.907959) * 0.092882 * c;
  curl += 0.044583 * s;

  ph = 0.448799 * dot(vec2(0.628337, -0.777940), p) + uTime * 2.098266;
  c = cos(ph); s = sin(ph);
  offset.xy += 0.057800 * vec2(0.628337, -0.777940) * c;
  offset.z += 0.17 * s;
  slope += vec2(0.628337, -0.777940) * 0.076296 * c;
  curl += 0.025941 * s;

  ph = 0.739198 * dot(vec2(-0.927740, -0.373232), p) + uTime * 2.692867;
  c = cos(ph); s = sin(ph);
  offset.xy += 0.017600 * vec2(-0.927740, -0.373232) * c;
  offset.z += 0.08 * s;
  slope += vec2(-0.927740, -0.373232) * 0.059136 * c;
  curl += 0.013010 * s;

  n = normalize(vec3(-slope.x, -slope.y, 1.0 - curl));
  return offset;
}
`;

interface OceanProps {
  daylight: number;
  isMobile?: boolean;
}

export default function Ocean({ daylight, isMobile = false }: OceanProps) {
  const timeUniform = useRef({ value: 0 });
  const scroll = useRef({ x: 0, y: 0 });

  const normalMap = useMemo(() => {
    const texture = createWaterNormal(isMobile ? 128 : 256);
    texture.repeat.set(18, 18);
    return texture;
  }, [isMobile]);

  const material = useMemo(() => {
    const mat = new MeshPhongMaterial({
      shininess: 55,
      normalMap,
      normalScale: new Vector2(0.7, 0.7),
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = timeUniform.current;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\n${WAVE_GLSL}`)
        .replace(
          "#include <beginnormal_vertex>",
          "vec3 waveNormal;\nvec3 waveOffset = gerstner(position.xy, waveNormal);\nvec3 objectNormal = waveNormal;"
        )
        .replace("#include <begin_vertex>", "vec3 transformed = position + waveOffset;");
    };

    return mat;
  }, [normalMap]);

  useEffect(() => {
    return () => {
      material.dispose();
      normalMap.dispose();
    };
  }, [material, normalMap]);

  useEffect(() => {
    material.color.set("#27435F").lerp(new Color("#67B3CE"), daylight);
    material.specular.set("#4A5A6E").lerp(new Color("#D8E8F4"), 0.3 + daylight * 0.7);
  }, [material, daylight]);

  useFrame((state, delta) => {
    timeUniform.current.value = state.clock.getElapsedTime();
    scroll.current.x += delta * 0.005;
    scroll.current.y += delta * 0.0035;
    normalMap.offset.set(scroll.current.x, scroll.current.y);
  });

  const segments = isMobile ? 72 : 128;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]} material={material}>
      <planeGeometry args={[420, 420, segments, segments]} />
    </mesh>
  );
}
