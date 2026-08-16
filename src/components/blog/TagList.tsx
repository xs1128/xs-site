'use client';

import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { colors } from '@/styles/blog/colors';
import { SkeletonList } from '@/components/blog/skeleton';

interface TagListProps {
  tags: string[];
  loading?: boolean;
}

export default function TagList({ tags, loading = false }: TagListProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
    marginTop: spacing.lg,
  };

  if (loading) {
    return <SkeletonList variant="tag" items={4} />;
  }

  if (!tags || tags.length === 0) return null;

  const tagStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.xs,
    fontWeight: 500,
    color: colors.accent,
    backgroundColor: `${colors.accent}15`,
    padding: '6px 12px',
    borderRadius: '20px',
    border: `1px solid ${colors.accent}40`,
  };

  return (
    <div style={containerStyle}>
      {tags.map((tag) => (
        <span key={tag} style={tagStyle}>
          #{tag}
        </span>
      ))}
    </div>
  );
}
