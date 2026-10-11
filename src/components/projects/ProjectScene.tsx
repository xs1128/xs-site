'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './projects.module.css';

interface ProjectSceneProps {
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

      const travel = Math.max(1, scene.offsetHeight - panel.offsetHeight);
      if (getComputedStyle(panel).position !== 'sticky') {
        image.style.transform = '';
        resetParts();
        return;
      }
      const progress = Math.min(
        1,
        Math.max(0, -scene.getBoundingClientRect().top / travel),
      );

      // Move from the whole scene to a close-up of the Mac mini.
      // Transform updates avoid React renders.
      const zoom = kind === 'intro' ? 1.4 : 0.25;
      const tilt = kind === 'intro' ? -9 : kind === 'apps' ? -3 : 0;
      const x = kind === 'intro' ? -80 : kind === 'apps' ? -50 : -20;
      const y = kind === 'intro' ? -32 : kind === 'apps' ? -18 : -12;
      const scale = kind === 'access' ? 0.2 : zoom;
      image.style.transform = `translate(${x * progress}px, ${y * progress}px) scale(${1 + scale * progress}) rotate(${tilt * progress}deg)`;
      const open = Math.max(
        0,
        Math.min(1, (progress - 0.05) / 0.35, (0.95 - progress) / 0.3),
      );
      parts.forEach((part) => {
        const name = part.dataset.part;
        const distance =
          name === 'lid'
            ? -230
            : name === 'chassis'
              ? 45
              : name === 'cooling'
                ? 15
                : name === 'power'
                  ? -145
                  : -60;
        part.style.transform = `translateY(${distance * open}px)`;
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
