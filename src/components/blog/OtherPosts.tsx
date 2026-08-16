'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { Post } from '@/types/post';
import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { colors } from '@/styles/blog/colors';
import { TRANSITIONS, TIMING } from '@/styles/blog/animations';
import { SkeletonList } from '@/components/blog/skeleton';

interface OtherPostsProps {
  posts: Post[];
  loading?: boolean;
}

// Resting title color on the dark page bg; hover swaps to accent.
const TITLE_REST = '#C7CBD1';
const META_COLOR = '#7E848C';
// Per-item accent bar, dim at rest; brightens to accent on hover/focus so the
// bar lights up AND slides with the item (mirrors the TOC interaction).
const BAR_REST = 'rgba(229, 83, 44, 0.35)';

// Dependency-free, null-guarded short date. post.date is published_at||created_at
// upstream and its format can vary, so we hard-guard against Invalid Date.
function formatShortDate(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

function PostItem({ post }: { post: Post }) {
  // State-driven like the TOC: hover/focus drives the slide + bar brighten,
  // pressed drives the brief "clicky" compression on pointer/key press.
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  // The bar lives on this translating element, so it slides with the text.
  // Pressed nudges a touch further (6px) for snappy press feedback.
  const slide = pressed
    ? 'translateX(6px)'
    : active
      ? 'translateX(4px)'
      : 'translateX(0)';
  const barColor = active ? colors.accent : BAR_REST;

  const linkStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    paddingLeft: spacing.sm,
    borderLeft: `2px solid ${barColor}`,
    transform: slide,
    transition: `transform ${TIMING.fast} ${TIMING.smooth}, border-color ${TIMING.slower} ${TIMING.smooth}`,
    cursor: 'pointer',
  };

  const titleStyle: React.CSSProperties = {
    minWidth: 0,
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    lineHeight: 1.5,
    color: active ? colors.accent : TITLE_REST,
    transition: `color ${TIMING.slower} ${TIMING.smooth}`,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  };

  const metaStyle: React.CSSProperties = {
    fontFamily: FONTS.mono,
    fontSize: clamp.xs,
    color: META_COLOR,
    marginTop: spacing.xs,
    letterSpacing: '0.02em',
  };

  const d = post.date ? formatShortDate(post.date) : null;
  const rt =
    typeof post.read_time === 'number' && post.read_time > 0
      ? `${post.read_time} min`
      : null;
  const metaParts = [d, rt].filter((part): part is string => part !== null);

  return (
    <li style={{ border: 'none', background: 'none', padding: 0 }}>
      <Link
        href={`/blog/posts/${post.slug}`}
        title={post.title}
        style={linkStyle}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => {
          setActive(false);
          setPressed(false);
        }}
        onFocus={() => setActive(true)}
        onBlur={() => {
          setActive(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setPressed(true);
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setPressed(false);
        }}
      >
        <span style={titleStyle}>{post.title}</span>
        {metaParts.length > 0 && (
          <span style={metaStyle}>{metaParts.join(' · ')}</span>
        )}
      </Link>
    </li>
  );
}

export default function OtherPosts({
  posts,
  loading = false,
}: OtherPostsProps) {
  const [expanded, setExpanded] = useState(false);

  const containerStyle: React.CSSProperties = {
    marginTop: spacing.lg,
    // Match TOC's containerStyle left inset so the "RELATED READS" eyebrow (and
    // the per-item accent bars beneath it) share the same left edge as the TOC
    // "CONTENTS" heading + its items in the sticky sidebar.
    paddingLeft: spacing.lg,
  };

  // Mono accent eyebrow, a recommendation signal. Kept as a real <h3> for the
  // heading outline. (The old heading used colors.text, invisible on the dark bg.)
  const headingStyle: React.CSSProperties = {
    fontFamily: FONTS.mono,
    fontSize: clamp.xs,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: spacing.sm,
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h3 style={headingStyle}>Related Reads</h3>
        <SkeletonList variant="post" items={3} />
      </div>
    );
  }

  if (!posts || posts.length === 0) return null;

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  };

  const toggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4em',
    marginTop: spacing.sm,
    padding: 0,
    background: 'none',
    border: 'none',
    fontFamily: FONTS.mono,
    fontSize: clamp.xs,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: META_COLOR,
    cursor: 'pointer',
    transition: TRANSITIONS.fast('color'),
  };

  const chevronStyle: React.CSSProperties = {
    display: 'inline-flex',
    fontSize: '1.2em',
    transition: TRANSITIONS.fast('transform'),
    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  // Always show the first; collapse the rest behind the toggle.
  const visiblePosts = expanded ? posts : posts.slice(0, 1);
  const hiddenCount = posts.length - 1;
  const showToggle = posts.length > 1;

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>Related Reads</h3>
      <ul id="related-reads-list" style={listStyle}>
        {visiblePosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </ul>
      {showToggle && (
        <button
          type="button"
          style={toggleStyle}
          aria-expanded={expanded}
          aria-controls="related-reads-list"
          onClick={() => setExpanded((prev) => !prev)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = META_COLOR;
          }}
        >
          {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          <span aria-hidden style={chevronStyle}>
            <ChevronDown size="1em" strokeWidth={2.5} />
          </span>
        </button>
      )}
    </div>
  );
}
