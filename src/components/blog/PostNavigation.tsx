'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PostLink } from '@/types/post';
import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { TRANSITIONS } from '@/styles/blog/animations';

interface PostNavigationProps {
  prevPost: PostLink | null;
  nextPost: PostLink | null;
  seriesTitle?: string;
}

export default function PostNavigation({
  prevPost,
  nextPost,
  seriesTitle,
}: PostNavigationProps) {
  if (!prevPost && !nextPost) return null;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTop: `1px solid var(--color-border)`,
  };

  const navItemStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.xs,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.xs,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    fontWeight: 600,
    color: 'var(--color-accent)',
    textDecoration: 'none',
    transition: TRANSITIONS.fast('color'),
  };

  const leftStyle: React.CSSProperties = {
    ...navItemStyle,
    alignItems: 'flex-start',
  };

  const rightStyle: React.CSSProperties = {
    ...navItemStyle,
    alignItems: 'flex-end',
    textAlign: 'right' as const,
  };

  return (
    <div style={containerStyle}>
      {prevPost && (
        <div style={leftStyle}>
          <span style={labelStyle}>
            {seriesTitle ? 'Previous in Series' : 'Previous Post'}
          </span>
          <Link
            href={`/blog/posts/${prevPost.slug}`}
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#CC4420';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
          >
            <ArrowLeft
              size="1em"
              strokeWidth={2.5}
              style={{ verticalAlign: '-0.15em' }}
            />{' '}
            {prevPost.title}
          </Link>
        </div>
      )}

      {nextPost && (
        <div style={rightStyle}>
          <span style={labelStyle}>
            {seriesTitle ? 'Next in Series' : 'Next Post'}
          </span>
          <Link
            href={`/blog/posts/${nextPost.slug}`}
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#CC4420';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
          >
            {nextPost.title}{' '}
            <ArrowRight
              size="1em"
              strokeWidth={2.5}
              style={{ verticalAlign: '-0.15em' }}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
