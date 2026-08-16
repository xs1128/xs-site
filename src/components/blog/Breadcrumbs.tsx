'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { TRANSITIONS } from '@/styles/blog/animations';

export interface Crumb {
  /** Visible label. */
  label: string;
  /** Link target. Omit for the current (last) crumb. */
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

/**
 * Breadcrumb trail for post/series pages. Matches the dark page theme:
 * muted links, accent current item, chevron separators.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items.length) return null;

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: spacing.md,
    fontFamily: FONTS.body,
    fontSize: clamp.sm,
  };

  const linkStyle: React.CSSProperties = {
    color: '#999999',
    textDecoration: 'none',
    fontWeight: 500,
    transition: TRANSITIONS.fast('color'),
    whiteSpace: 'nowrap',
  };

  const currentStyle: React.CSSProperties = {
    color: 'var(--color-accent)',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '60vw',
  };

  const separatorStyle: React.CSSProperties = {
    color: 'var(--color-muted)',
    display: 'inline-flex',
    userSelect: 'none',
  };

  return (
    <nav aria-label="Breadcrumb" style={navStyle}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-dark-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#999999';
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={currentStyle}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span style={separatorStyle} aria-hidden="true">
                <ChevronRight size="1em" strokeWidth={2.5} />
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
