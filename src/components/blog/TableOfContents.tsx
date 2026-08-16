'use client';

import { useState, useEffect } from 'react';
import type { Heading } from '@/types/post';
import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { TIMING } from '@/styles/blog/animations';
import { SkeletonList } from '@/components/blog/skeleton';

interface TableOfContentsProps {
  headings: Heading[];
  loading?: boolean;
}

// Pixels from the viewport top at which a heading is considered "current".
// Must be >= the click scroll offset so a clicked heading registers as active.
const ACTIVE_OFFSET = 100;

export default function TableOfContents({
  headings,
  loading = false,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Active-section tracking: the current section is the last heading scrolled
  // past. Clamps to the first heading (before any are passed) and the last
  // heading (at page bottom) so the highlight never goes over the top or bottom.
  useEffect(() => {
    if (headings.length === 0) return;

    let raf = 0;

    const computeActive = () => {
      raf = 0;
      const els = headings
        .map((h) => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);
      if (els.length === 0) return;

      // Bottom guard: short final sections may never reach ACTIVE_OFFSET, so
      // force the last heading active once the page is scrolled to the bottom.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(els[els.length - 1].id);
        return;
      }

      // Top clamp: default to the first heading until one is actually passed.
      let currentId = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET <= 0) {
          currentId = el.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [headings]);

  function scrollToHeading(headingId: string) {
    const element = document.getElementById(headingId);
    if (element) {
      const top =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        ACTIVE_OFFSET +
        20;
      window.scrollTo({ top, behavior: 'smooth' });
      // Reflect the click immediately; the scroll listener keeps it in sync.
      setActiveId(headingId);
    }
  }

  const getIndentPadding = (level: number): string => {
    const baseIndent = 12; // Base indentation unit in pixels
    switch (level) {
      case 1:
        return '0';
      case 2:
        return `${baseIndent}px`;
      case 3:
        return `${baseIndent * 2}px`;
      case 4:
        return `${baseIndent * 3}px`;
      case 5:
        return `${baseIndent * 4}px`;
      case 6:
        return `${baseIndent * 5}px`;
      default:
        return '0';
    }
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: spacing.md,
    paddingLeft: spacing.lg,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.body,
    fontSize: clamp.base,
    fontWeight: 700,
    color: 'var(--color-dark-text)',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const getHeadingStyle = (
    level: number,
    isActive: boolean,
    isHovered: boolean,
  ): React.CSSProperties => ({
    fontFamily: FONTS.body,
    fontSize: clamp.sm,
    fontWeight: isActive ? 600 : 400,
    color: isActive
      ? 'var(--color-accent)'
      : isHovered
        ? 'var(--color-dark-text)'
        : '#999999',
    cursor: 'pointer',
    padding: `${spacing.xs} 0`,
    paddingLeft: getIndentPadding(level),
    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
    transition: `color ${TIMING.slower} ${TIMING.smooth}, transform ${TIMING.fast} ${TIMING.smooth}`,
    borderLeft: level > 1 ? `1px solid var(--color-border)` : 'none',
  });

  // Loading sentinel (empty post during Suspense) shows skeletons.
  if (loading) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Contents</h3>
        <SkeletonList variant="heading" items={5} />
      </div>
    );
  }

  // A fully-loaded post with no headings has no TOC to show.
  if (headings.length === 0) return null;

  return (
    <nav style={containerStyle} aria-label="Table of contents">
      <h3 style={titleStyle}>Contents</h3>

      <ul style={listStyle}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={getHeadingStyle(
              heading.level,
              activeId === heading.id,
              hoveredId === heading.id,
            )}
            onClick={() => scrollToHeading(heading.id)}
            onMouseEnter={() => setHoveredId(heading.id)}
            onMouseLeave={() => setHoveredId(null)}
            aria-current={activeId === heading.id ? 'location' : undefined}
          >
            {heading.text}
          </li>
        ))}
      </ul>
    </nav>
  );
}
