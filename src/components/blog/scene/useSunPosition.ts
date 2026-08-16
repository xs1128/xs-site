'use client';

import { useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'three';

const MAX_ELEVATION = (19 * Math.PI) / 180;
const AZIMUTH_HALF = (34 * Math.PI) / 180;
const UPDATE_MS = 60_000;

export interface SunState {
  sunPosition: Vector3;
  moonPosition: Vector3;
  daylight: number;
  isNight: boolean;
}

function arcVector(t: number, maxElevation: number): Vector3 {
  const elevation = Math.sin(t * Math.PI) * maxElevation;
  const theta = Math.PI + (t - 0.5) * 2 * AZIMUTH_HALF;
  return new Vector3().setFromSphericalCoords(
    1,
    Math.PI / 2 - elevation,
    theta,
  );
}

function computeSun(date: Date): SunState {
  const hours = date.getHours() + date.getMinutes() / 60;
  const isNight = hours < 6 || hours >= 18;

  if (isNight) {
    const t = ((((hours - 18) % 24) + 24) % 24) / 12;
    return {
      sunPosition: arcVector(t, -MAX_ELEVATION),
      moonPosition: arcVector(t, MAX_ELEVATION),
      daylight: 0,
      isNight: true,
    };
  }

  const t = (hours - 6) / 12;
  return {
    sunPosition: arcVector(t, MAX_ELEVATION),
    moonPosition: arcVector(t, -MAX_ELEVATION),
    daylight: Math.sin(t * Math.PI),
    isNight: false,
  };
}

export function useSunPosition(): SunState {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), UPDATE_MS);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => computeSun(now), [now]);
}
