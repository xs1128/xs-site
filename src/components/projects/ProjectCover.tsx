'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, Plus } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Work } from '@/lib/projects';

export interface ProjectCoverProps {
  project: Work;
  open: boolean;
  onToggle: (animate: boolean) => void;
}

export function ProjectCover({ project, open, onToggle }: ProjectCoverProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const card = ref.current;
    const surface = card?.parentElement;
    if (!card || !surface || reducedMotion) return;
    const hover = matchMedia('(hover: hover) and (pointer: fine)');
    let bounds: DOMRect | null = null;
    let frame: number | null = null;
    let previous = 0;
    const position = [0, 0];
    const velocity = [0, 0];
    const target = [0, 0];

    const tick = (time: number) => {
      frame = null;
      const dt = Math.min((time - previous) / 1000 || 1 / 60, 1 / 30);
      previous = time;
      let moving = false;
      for (let axis = 0; axis < 2; axis++) {
        velocity[axis] +=
          ((target[axis] - position[axis]) * 240 - velocity[axis] * 26) * dt;
        position[axis] += velocity[axis] * dt;
        moving ||=
          Math.abs(target[axis] - position[axis]) > 0.01 ||
          Math.abs(velocity[axis]) > 0.02;
      }
      card.style.transform = `perspective(1000px) rotateX(${position[0]}deg) rotateY(${position[1]}deg)`;
      if (moving) frame = requestAnimationFrame(tick);
      else if (!bounds) card.style.transform = '';
    };
    const move = (event: PointerEvent) => {
      if (!hover.matches || event.pointerType === 'touch') return;
      bounds ??= surface.getBoundingClientRect();
      target[0] = Math.max(
        -1.5,
        Math.min(1.5, (0.5 - (event.clientY - bounds.top) / bounds.height) * 3),
      );
      target[1] = Math.max(
        -2,
        Math.min(2, ((event.clientX - bounds.left) / bounds.width - 0.5) * 4),
      );
      if (frame === null) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const leave = () => {
      if (!bounds) return;
      bounds = null;
      target.fill(0);
      if (frame === null) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const reset = () => {
      if (!bounds && frame === null) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = bounds = null;
      position.fill(0);
      velocity.fill(0);
      target.fill(0);
      card.style.transform = '';
    };
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', leave);
    surface.addEventListener('pointercancel', reset);
    window.addEventListener('pointerdown', reset);
    window.addEventListener('scroll', reset, true);
    window.addEventListener('resize', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('keydown', reset);
    document.addEventListener('visibilitychange', reset);
    hover.addEventListener('change', reset);
    return () => {
      reset();
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', leave);
      surface.removeEventListener('pointercancel', reset);
      window.removeEventListener('pointerdown', reset);
      window.removeEventListener('scroll', reset, true);
      window.removeEventListener('resize', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('keydown', reset);
      document.removeEventListener('visibilitychange', reset);
      hover.removeEventListener('change', reset);
    };
  }, [reducedMotion]);

  return (
    <h3 className="projects-cover__heading">
      <button
        ref={ref}
        id={`work-${project.slug}`}
        type="button"
        className="projects-cover__link"
        aria-label={`Explore ${project.title}`}
        aria-describedby={`focus-${project.slug}`}
        aria-expanded={open}
        aria-controls={open ? `details-${project.slug}` : undefined}
        onClick={(event) => onToggle(event.detail > 0)}
      >
        <span
          className="projects-cover__visual"
          data-work={project.slug}
          data-loaded={loaded}
        >
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(max-width: 640px) 85vw, 40vw"
            className="projects-cover__image"
            onLoad={() => setLoaded(true)}
          />
        </span>
        <span id={`focus-${project.slug}`} className="projects-cover__topline">
          {project.category}
        </span>
        <span className="projects-cover__copy">
          <span className="projects-cover__title">
            {project.title}
            <span>.</span>
          </span>
          <span className="projects-cover__hint" aria-hidden="true">
            Details
            <ArrowDown size={16} strokeWidth={2} />
          </span>
          <span className="projects-cover__open" aria-hidden="true">
            <Plus size={24} strokeWidth={1.5} />
          </span>
        </span>
      </button>
    </h3>
  );
}
