'use client';

import { useRef, useState } from 'react';
import { works, type Work } from '@/lib/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProjectCover } from './ProjectCover';
import { WorkDetails } from './WorkDetails';

export function WorkGallery() {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<Work | null>(null);
  const [animated, setAnimated] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const change = (
    next: string | null,
    animate: boolean,
    restoreFocus = false,
  ) => {
    const moving = animate && !reducedMotion;
    setAnimated(moving);
    setActive(next);
    if (next) setSelected(works.find((work) => work.slug === next) ?? null);
    else if (!moving) setSelected(null);
    if (restoreFocus) {
      const trigger = galleryRef.current?.querySelector<HTMLButtonElement>(
        `#work-${active}`,
      );
      trigger?.focus({ preventScroll: true });
      trigger?.scrollIntoView({
        behavior: moving ? 'smooth' : 'instant',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  };
  const close = (animate: boolean) => change(null, animate, true);

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
        className="projects-details-reveal"
        data-open={active !== null}
        data-animated={animated}
        inert={active === null}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === 'grid-template-rows' &&
            active === null
          )
            setSelected(null);
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
