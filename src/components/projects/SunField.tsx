'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const [CX, CY] = [600, 300];
const YELLOW = '#f3cf6b';
const CHARCOAL = '#24272a';
const PAPER = '#f2e9d8';
const REACH = 1500;
// Starts on a note so first-time visitors see what the beam does.
const REST = -90;

const wedge = (half: number) => {
  const rad = (half * Math.PI) / 180;
  const y = (REACH * Math.sin(rad)).toFixed(1);
  const x = (REACH * Math.cos(rad)).toFixed(1);
  return `M0 0L${x} -${y}L${x} ${y}Z`;
};
const rays = Array.from({ length: 20 }, (_, i) => i * 18);

// Phones crop the sides, so `narrow` spots stay within x 320 to 880.
const notes: {
  text: string;
  wide: [number, number];
  narrow: [number, number];
  tilt: number;
  size: number;
}[] = [
  {
    text: 'Based in Hsinchu, Taiwan',
    wide: [450, 120],
    narrow: [540, 60],
    tilt: -4,
    size: 22,
  },
  {
    text: 'Japanese: passed N5, now on N4',
    wide: [925, 125],
    narrow: [690, 150],
    tilt: 3,
    size: 19,
  },
  {
    text: 'My Mac mini never sleeps',
    wide: [1020, 385],
    narrow: [700, 430],
    tilt: -2,
    size: 21,
  },
  {
    text: 'You found the sun. ☀️',
    wide: [735, 505],
    narrow: [565, 560],
    tilt: 2,
    size: 18,
  },
  {
    text: 'I wish to sleep 9 hours/day',
    wide: [215, 430],
    narrow: [470, 500],
    tilt: 5,
    size: 20,
  },
  {
    text: 'Say hi: hi@xsooi.com',
    wide: [190, 215],
    narrow: [440, 205],
    tilt: -3,
    size: 19,
  },
];

// A fixed sun whose beam follows the pointer and lights hidden notes.
export function SunField() {
  const svg = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();
  // Read live, so flipping the preference never restarts a sweep midway.
  const still = useRef(reducedMotion);
  useEffect(() => {
    still.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const drawing = svg.current;
    if (!drawing) return;
    const beams = drawing.querySelectorAll<SVGElement>('[data-beam]');
    let angle = REST;
    let target = REST;
    let frame: number | null = null;

    const step = () => {
      frame = null;
      // Turn the short way round.
      const gap = ((((target - angle) % 360) + 540) % 360) - 180;
      angle = still.current ? target : angle + gap * 0.12;
      beams.forEach((beam) =>
        beam.setAttribute(
          'transform',
          `translate(${CX} ${CY}) rotate(${angle})`,
        ),
      );
      if (Math.abs(gap) > 0.1 && !still.current)
        frame = requestAnimationFrame(step);
    };

    const aim = (event: PointerEvent) => {
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        drawing.getScreenCTM()!.inverse(),
      );
      target = (Math.atan2(point.y - CY, point.x - CX) * 180) / Math.PI;
      if (frame === null) frame = requestAnimationFrame(step);
    };

    drawing.addEventListener('pointermove', aim);
    drawing.addEventListener('pointerdown', aim);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      drawing.removeEventListener('pointermove', aim);
      drawing.removeEventListener('pointerdown', aim);
    };
  }, []);

  const rest = `translate(${CX} ${CY}) rotate(${REST})`;
  return (
    <section
      id="made-to-play"
      className="projects-sun"
      aria-labelledby="sun-title"
    >
      <h2 id="sun-title">Made to play.</h2>
      <div className="projects-sun__frame">
        <svg
          ref={svg}
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient
              id="sun-light"
              gradientUnits="userSpaceOnUse"
              cx={CX}
              cy={CY}
              r="620"
            >
              <stop offset="0" stopColor={YELLOW} stopOpacity=".5" />
              <stop offset="1" stopColor={YELLOW} stopOpacity=".06" />
            </radialGradient>
            <filter id="sun-soft">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <mask id="sun-beam" maskUnits="userSpaceOnUse">
              <path
                data-beam=""
                d={wedge(30)}
                fill="#fff"
                filter="url(#sun-soft)"
                transform={rest}
              />
            </mask>
          </defs>
          <g fill={YELLOW} opacity=".05" transform={`translate(${CX} ${CY})`}>
            {rays.map((turn) => (
              <path key={turn} d={wedge(4.5)} transform={`rotate(${turn})`} />
            ))}
          </g>
          <path
            data-beam=""
            d={wedge(30)}
            fill="url(#sun-light)"
            filter="url(#sun-soft)"
            transform={rest}
          />
          <g
            mask="url(#sun-beam)"
            fill={PAPER}
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-hubot-sans), sans-serif' }}
          >
            {(['wide', 'narrow'] as const).map((layout) => (
              <g key={layout} className={`projects-sun__${layout}`}>
                {notes.map((note) => {
                  const [x, y] = note[layout];
                  return (
                    <text
                      key={note.text}
                      x={x}
                      y={y}
                      fontSize={note.size}
                      transform={`rotate(${note.tilt} ${x} ${y})`}
                    >
                      {note.text}
                    </text>
                  );
                })}
              </g>
            ))}
          </g>
          <circle cx={CX} cy={CY} r="96" fill={YELLOW} />
          <circle
            cx={CX}
            cy={CY}
            r="82"
            fill="none"
            stroke={CHARCOAL}
            strokeWidth="1.6"
            opacity=".5"
          />
        </svg>
      </div>
    </section>
  );
}
