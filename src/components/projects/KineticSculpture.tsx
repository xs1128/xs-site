'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { createParticleRenderer } from './ParticleRenderer';

const shapes = ['Trefoil', 'Mobius', 'Spiral'] as const;
type Shape = (typeof shapes)[number];
function geometry(shape: Shape, columns: number, rows: number) {
  return new Float32Array(
    Array.from({ length: columns * rows }, (_, index) => {
      const u = ((index % columns) / columns) * Math.PI * 2;
      const row = Math.floor(index / columns);
      const v = row / (rows - 1);
      if (shape === 'Mobius') {
        const s = (v - 0.5) * 1.3;
        const radius = 1.25 + s * Math.cos(u / 2);
        return [
          radius * Math.cos(u),
          radius * Math.sin(u),
          s * Math.sin(u / 2),
        ];
      }
      if (shape === 'Spiral') {
        const turn = u * 2;
        const arc = 0.35 + v * 1.65;
        return [
          1.4 * Math.cos(turn) * Math.sin(arc),
          1.4 * Math.sin(turn) * Math.sin(arc),
          1.4 * (Math.cos(arc) + Math.log(Math.tan(arc / 2))) +
            0.17 * turn -
            0.5,
        ];
      }
      const tube = v * Math.PI * 2;
      const radius = 1.05 + 0.4 * Math.cos(u * 3) + 0.22 * Math.cos(tube);
      return [
        radius * Math.cos(u * 2),
        radius * Math.sin(u * 2),
        0.6 * Math.sin(u * 3) + 0.22 * Math.sin(tube),
      ];
    }).flat(),
  );
}

// Loading skeleton: the trefoil's first frame as dots, projected with the
// shader's maths (rotation, tilt, perspective) so the WebGL hand-off lines up.
// The viewBox is 1 / 0.225 by 1 / 0.3 units, matching the renderer's
// min(width * 0.225, height * 0.3) scale under `meet`.
const FALLBACK_DOTS = (() => {
  const points = geometry('Trefoil', 90, 5);
  const [cx, sx] = [Math.cos(-0.38), Math.sin(-0.38)];
  const [cy, sy] = [Math.cos(-0.45), Math.sin(-0.45)];
  const [ct, st] = [Math.cos(-0.28), Math.sin(-0.28)];
  let path = '';
  for (let index = 0; index < points.length; index += 3) {
    let [x, y, z] = [points[index], points[index + 1], points[index + 2]];
    [x, z] = [cy * x + sy * z, -sy * x + cy * z];
    [y, z] = [cx * y - sx * z, sx * y + cx * z];
    [x, y] = [ct * x - st * y, st * x + ct * y];
    const perspective = 5 / (5 + z);
    path += `M${(x * perspective + 0.09).toFixed(3)} ${(y * perspective).toFixed(3)}h0`;
  }
  return path;
})();

export function KineticSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef({
    paused: false,
    restart: () => {},
    redraw: () => {},
  });
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const small = window.matchMedia('(max-width: 640px)').matches;
    const geometries = shapes.map((option) =>
      geometry(option, small ? 96 : 144, 12),
    );
    let renderer = createParticleRenderer(canvas, geometries);
    let contextAvailable = Boolean(renderer);
    // No WebGL: the skeleton becomes the permanent fallback, so stop its pulse.
    if (!renderer) canvas.dataset.unavailable = 'true';
    const weights = new Float32Array([1, 0, 0]);
    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let previousTime = 0;
    let clock = 0;
    let shape = 0;
    let nextMorph = 9;
    let visible = true;
    let dragging = false;
    let pointerId: number | null = null;
    let lastX = 0;
    let pressX = 0;
    let pressY = 0;
    let dragged = false;
    let dragRotation = 0;
    let pointerX = 0;
    let pointerY = 0;
    let easedX = 0;
    let easedY = 0;

    const draw = (time: number) => {
      frame = null;
      if (!visible || !contextAvailable || document.hidden || !width || !height)
        return;
      const delta = previousTime ? (time - previousTime) / 1000 : 1 / 60;
      previousTime = time;
      const moving = !controls.current.paused && !reducedMotion;
      if (moving && !dragging) {
        clock += Math.min(delta, 0.05);
        if (clock >= nextMorph) {
          shape = (shape + 1) % shapes.length;
          nextMorph = clock + 9;
        }
      }

      const follow = reducedMotion ? 1 : 1 - Math.exp(-delta * 6);
      easedX += (pointerX - easedX) * follow;
      easedY += (pointerY - easedY) * follow;

      let morphing = false;
      const morphFollow = reducedMotion ? 1 : 1 - Math.exp(-delta * 16);
      for (let index = 0; index < weights.length; index++) {
        const target = Number(index === shape);
        weights[index] += (target - weights[index]) * morphFollow;
        if (Math.abs(target - weights[index]) < 0.001) weights[index] = target;
        else morphing = true;
      }

      const angleX = -0.38 + easedY * 0.3;
      const angleY = -0.45 + clock * 0.16 + dragRotation + easedX * 0.4;
      if (!renderer?.draw(angleX, angleY, weights)) return;
      if (canvas.dataset.ready !== 'true') canvas.dataset.ready = 'true';

      const settling =
        Math.abs(pointerX - easedX) + Math.abs(pointerY - easedY) > 0.001;
      if (moving || morphing || settling) frame = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (frame === null && visible && contextAvailable && !document.hidden) {
        previousTime = 0;
        frame = requestAnimationFrame(draw);
      }
    };
    const shuffle = (animate = true) => {
      shape =
        (shape + 1 + Math.floor(Math.random() * (shapes.length - 1))) %
        shapes.length;
      nextMorph = clock + 9;
      if (reducedMotion || !animate) {
        weights.fill(0);
        weights[shape] = 1;
      }
      wake();
    };
    const keydown = (event: KeyboardEvent) => {
      if (!['Enter', ' '].includes(event.key) || event.repeat) return;
      event.preventDefault();
      shuffle(false);
    };
    const click = (event: MouseEvent) => {
      if (event.detail === 0) shuffle(false);
    };
    const api = controls.current;
    api.redraw = wake;
    api.restart = () => {
      clock = 0;
      shape = 0;
      nextMorph = 9;
      dragRotation = 0;
      pointerX = easedX = 0;
      pointerY = easedY = 0;
      weights.set([1, 0, 0]);
      wake();
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (width && height) renderer?.resize(width, height);
      wake();
    };
    const move = (event: PointerEvent) => {
      if (dragging && event.pointerId === pointerId) {
        if (Math.hypot(event.clientX - pressX, event.clientY - pressY) > 8)
          dragged = true;
        if (!reducedMotion) dragRotation += (event.clientX - lastX) * 0.008;
        lastX = event.clientX;
      }
      if (reducedMotion) return;
      if (event.pointerType !== 'touch') {
        const bounds = canvas.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / width - 0.5) * 2;
        pointerY = ((event.clientY - bounds.top) / height - 0.5) * 2;
      }
      wake();
    };
    const startDrag = (event: PointerEvent) => {
      if (dragging || event.button !== 0) return;
      dragging = true;
      dragged = false;
      pointerId = event.pointerId;
      pressX = lastX = event.clientX;
      pressY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.dataset.dragging = 'true';
    };
    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      dragged ||=
        event.type !== 'pointerup' ||
        Math.hypot(event.clientX - pressX, event.clientY - pressY) > 8;
      const captured = pointerId;
      dragging = false;
      pointerId = null;
      if (captured !== null && canvas.hasPointerCapture(captured))
        canvas.releasePointerCapture(captured);
      delete canvas.dataset.dragging;
      if (!dragged) shuffle();
      wake();
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
      wake();
    };
    const visibility = () => {
      if (document.hidden && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      } else wake();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      contextAvailable = false;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      delete canvas.dataset.ready;
    };
    const contextRestored = () => {
      renderer?.dispose();
      renderer = createParticleRenderer(canvas, geometries);
      contextAvailable = Boolean(renderer);
      resize();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      } else wake();
    });
    const sizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    sizeObserver.observe(canvas);
    const events = new AbortController();
    const options = { signal: events.signal };
    canvas.addEventListener('pointermove', move, options);
    canvas.addEventListener('pointerdown', startDrag, options);
    canvas.addEventListener('pointerup', endDrag, options);
    canvas.addEventListener('pointercancel', endDrag, options);
    canvas.addEventListener('lostpointercapture', endDrag, options);
    canvas.addEventListener('pointerleave', leave, options);
    canvas.addEventListener('click', click, options);
    canvas.addEventListener('keydown', keydown, options);
    canvas.addEventListener('webglcontextlost', contextLost, options);
    canvas.addEventListener('webglcontextrestored', contextRestored, options);
    document.addEventListener('visibilitychange', visibility, options);
    resize();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      api.redraw = () => {};
      api.restart = () => {};
      renderer?.dispose();
      observer.disconnect();
      sizeObserver.disconnect();
      events.abort();
    };
  }, [reducedMotion]);

  return (
    <figure
      className="projects-sculpture"
      aria-label="Interactive particle sculpture"
    >
      <div className="projects-sculpture__stage">
        <svg
          className="projects-sculpture__fallback"
          viewBox="-2.222 -1.667 4.444 3.333"
          aria-hidden="true"
        >
          <path d={FALLBACK_DOTS} />
        </svg>
        <canvas
          ref={canvasRef}
          className="projects-sculpture__canvas"
          role="button"
          tabIndex={0}
          aria-label="Change sculpture shape"
        />
      </div>
      <figcaption className="projects-sculpture__caption">
        <div
          className="projects-sculpture__controls"
          role="group"
          aria-label="Sculpture controls"
        >
          <button
            type="button"
            aria-label="Restart sculpture animation"
            onClick={() => {
              setPaused(false);
              controls.current.paused = false;
              controls.current.restart();
            }}
          >
            <RotateCcw size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="projects-sculpture__playback"
            aria-label={
              paused
                ? 'Resume sculpture animation'
                : 'Pause sculpture animation'
            }
            onClick={() => {
              const next = !paused;
              setPaused(next);
              controls.current.paused = next;
              controls.current.redraw();
            }}
          >
            {paused ? (
              <Play size={20} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Pause size={20} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
