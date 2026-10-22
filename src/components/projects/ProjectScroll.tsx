'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function ProjectScroll() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scroll: Lenis | undefined;

    const syncScrollLock = () => {
      if (document.body.style.overflow === 'hidden') {
        scroll?.stop();
      } else {
        scroll?.start();
      }
    };

    const configure = () => {
      scroll?.destroy();
      scroll = undefined;
      if (preference.matches) return;

      scroll = new Lenis({
        autoRaf: true,
        autoResize: false,
        lerp: 0.16,
        smoothWheel: true,
        syncTouch: false,
        overscroll: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
      syncScrollLock();
    };

    const resize = () => scroll?.resize();
    const sizeObserver = new ResizeObserver(resize);
    const main = document.querySelector('main');
    if (main) sizeObserver.observe(main);
    window.addEventListener('resize', resize);
    const lockObserver = new MutationObserver(syncScrollLock);
    lockObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });
    configure();
    preference.addEventListener('change', configure);
    return () => {
      preference.removeEventListener('change', configure);
      window.removeEventListener('resize', resize);
      sizeObserver.disconnect();
      lockObserver.disconnect();
      scroll?.destroy();
    };
  }, []);

  return null;
}
