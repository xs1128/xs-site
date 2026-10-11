'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function ProjectScroll() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scroll: Lenis | undefined;

    const configure = () => {
      scroll?.destroy();
      scroll = undefined;
      if (preference.matches) return;

      scroll = new Lenis({
        autoRaf: true,
        lerp: 0.16,
        smoothWheel: true,
        syncTouch: false,
        overscroll: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
    };

    configure();
    preference.addEventListener('change', configure);
    return () => {
      preference.removeEventListener('change', configure);
      scroll?.destroy();
    };
  }, []);

  return null;
}
