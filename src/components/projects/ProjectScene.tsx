'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './projects.module.css';

const partMotion: Record<string, [number, number]> = {
  lid: [-230, -4],
  power: [-145, 3],
  internals: [-60, -2],
  cooling: [15, 2],
  chassis: [45, 1.5],
};

export interface ProjectSceneProps {
  labelledBy: string;
  header: ReactNode;
  artwork: ReactNode;
  caption?: ReactNode;
  kind?: 'intro' | 'apps' | 'access';
}

export function ProjectScene({
  labelledBy,
  header,
  artwork,
  caption,
  kind = 'intro',
}: ProjectSceneProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Let the browser drive scroll timelines without duplicate layout reads
    // and style writes on every frame. Keep this fallback for older browsers.
    if (window.CSS?.supports('animation-timeline', 'view()')) return;

    const scene = sceneRef.current;
    const panel = panelRef.current;
    const image = artworkRef.current;
    if (!scene || !panel || !image) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const parts = image.querySelectorAll<SVGElement>('[data-part]');
    const resetParts = () =>
      parts.forEach((part) => {
        part.style.transform = '';
      });
    let frame: number | null = null;

    const update = () => {
      frame = null;
      if (preference.matches) {
        image.style.transform = '';
        resetParts();
        return;
      }

      const sticky = getComputedStyle(panel).position === 'sticky';
      const travel = sticky
        ? Math.max(1, scene.offsetHeight - panel.offsetHeight)
        : Math.max(innerHeight, image.offsetHeight);
      const top = (sticky ? scene : image).getBoundingClientRect().top;
      const progress = Math.min(
        1,
        Math.max(0, ((sticky ? 0 : innerHeight) - top) / travel),
      );

      // Move from the whole scene to a close-up of the Mac mini.
      // Transform updates avoid React renders.
      const zoom = kind === 'intro' ? 1.4 : 0.25;
      const tilt = kind === 'intro' ? -9 : kind === 'apps' ? -3 : 0;
      const x = kind === 'intro' ? -80 : kind === 'apps' ? -50 : -20;
      const y = kind === 'intro' ? -32 : kind === 'apps' ? -18 : -12;
      const scale = kind === 'access' ? 0.2 : zoom;
      image.style.transform = sticky
        ? `translate(${x * progress}px, ${y * progress}px) scale(${1 + scale * progress}) rotate(${tilt * progress}deg)`
        : '';
      const open = Math.max(
        0,
        Math.min(1, (progress - 0.05) / 0.35, (0.95 - progress) / 0.3),
      );
      const eased = open * open * (3 - 2 * open);
      parts.forEach((part) => {
        const motion = partMotion[part.dataset.part ?? ''];
        if (motion)
          part.style.transform = `rotate(${motion[1] * eased}deg) translateY(${motion[0] * eased}px)`;
      });
    };

    const schedule = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
    };
  }, [kind]);

  return (
    <section
      ref={sceneRef}
      className={styles.scene}
      data-kind={kind}
      aria-labelledby={labelledBy}
    >
      <div
        ref={panelRef}
        className={kind === 'intro' ? styles.panel : styles.storyPanel}
      >
        {header}
        <figure className={styles.frame}>
          <div ref={artworkRef} className={styles.artwork}>
            {artwork}
          </div>
          {caption}
        </figure>
      </div>
    </section>
  );
}
