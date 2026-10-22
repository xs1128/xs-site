'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { works, type Work } from '@/lib/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProjectCover } from './ProjectCover';
import { WorkDetails } from './WorkDetails';

export function WorkGallery() {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<Work | null>(null);
  const [animated, setAnimated] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Holds the reveal's bottom edge still while it collapses, then scrolls back
  // to the gallery. ResizeObserver fires before paint: no one-frame lag.
  const returning = useRef<{
    observer: ResizeObserver;
    timeout: number;
  } | null>(null);

  const stopReturn = () => {
    if (returning.current) {
      returning.current.observer.disconnect();
      clearTimeout(returning.current.timeout);
    }
    returning.current = null;
    if (revealRef.current) delete revealRef.current.dataset.returning;
  };

  const finishReturn = () => {
    if (returning.current === null) return;
    stopReturn();
    setSelected(null);
    // Only ever scroll up: below the heading, the gallery is already in view.
    const section = galleryRef.current?.closest('section');
    if (section && section.getBoundingClientRect().top < 0)
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const change = (
    next: string | null,
    animate: boolean,
    restoreFocus = false,
  ) => {
    const moving = animate && !reducedMotion;
    stopReturn();
    setAnimated(moving);
    setActive(next);
    if (next) setSelected(works.find((work) => work.slug === next) ?? null);
    else if (!moving) setSelected(null);
    if (!restoreFocus) return;
    const trigger = galleryRef.current?.querySelector<HTMLButtonElement>(
      `#work-${active}`,
    );
    trigger?.focus({ preventScroll: true });
    const reveal = revealRef.current;
    if (!moving || !reveal) {
      trigger?.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'nearest',
      });
      return;
    }
    // Pin no lower than the viewport, and never above the gallery: from the
    // top Close button a far-off bottom edge would drag the page to the hero.
    const pin = Math.min(reveal.getBoundingClientRect().bottom, innerHeight);
    const section = galleryRef.current?.closest('section');
    const floor = section
      ? section.getBoundingClientRect().top +
        scrollY -
        parseFloat(getComputedStyle(section).scrollMarginTop)
      : 0;
    reveal.dataset.returning = 'true';
    const observer = new ResizeObserver(() => {
      const lift = reveal.getBoundingClientRect().bottom - pin;
      if (lift < 0)
        scrollTo({
          top: Math.max(Math.min(floor, scrollY), scrollY + lift),
          behavior: 'instant',
        });
    });
    observer.observe(reveal);
    // Fallback for a transitionend that never arrives.
    returning.current = {
      observer,
      timeout: window.setTimeout(finishReturn, 600),
    };
  };
  const close = (animate: boolean) => change(null, animate, true);

  useEffect(() => stopReturn, []);

  // Points the reveal's notch at the open cover, which moves when the phone
  // carousel scrolls sideways.
  useLayoutEffect(() => {
    const reveal = revealRef.current;
    const gallery = galleryRef.current;
    const cover = active && gallery?.querySelector(`#work-${active}`);
    if (!reveal || !gallery || !cover) return;
    const place = () => {
      const box = reveal.getBoundingClientRect();
      const target = cover.getBoundingClientRect();
      const x = target.left + target.width / 2 - box.left;
      reveal.style.setProperty('--notch-x', `${x}px`);
      reveal.dataset.notch = String(x > 24 && x < box.width - 24);
    };
    place();
    const panels = gallery.firstElementChild;
    // Slide a half-hidden cover fully into the phone carousel.
    if (panels) {
      const view = panels.getBoundingClientRect();
      const target = cover.getBoundingClientRect();
      const shift =
        Math.max(0, target.right - view.right) ||
        Math.min(0, target.left - view.left);
      if (shift)
        panels.scrollBy({
          left: shift,
          behavior: reducedMotion ? 'instant' : 'smooth',
        });
    }
    panels?.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      panels?.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  }, [active, reducedMotion]);

  return (
    <div
      ref={galleryRef}
      className="projects-collection__list"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && active) {
          event.preventDefault();
          close(false);
        }
      }}
    >
      <div className="projects-collection__panels">
        {works.map((work) => (
          <article
            key={work.slug}
            className="projects-cover"
            data-open={active === work.slug}
          >
            <ProjectCover
              project={work}
              open={active === work.slug}
              onToggle={(animate) =>
                change(active === work.slug ? null : work.slug, animate)
              }
            />
          </article>
        ))}
      </div>
      <div
        ref={revealRef}
        className="projects-details-reveal"
        data-open={active !== null}
        data-animated={animated}
        inert={active === null}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === 'grid-template-rows' &&
            active === null
          ) {
            setSelected(null);
            finishReturn();
          }
        }}
      >
        <div className="projects-details-reveal__content">
          {selected && (
            <WorkDetails key={selected.slug} work={selected} onClose={close} />
          )}
        </div>
      </div>
    </div>
  );
}
