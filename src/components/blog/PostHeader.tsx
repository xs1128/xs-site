import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { colors } from '@/styles/blog/colors';
import type { Post } from '@/types/post';
import { formatDate, formatReadTime } from '@/lib/blog/utils/post';
import { SkeletonText } from '@/components/blog/skeleton';

interface PostHeaderProps {
  post: Post;
  loading?: boolean;
}

export default function PostHeader({ post, loading = false }: PostHeaderProps) {
  const containerStyle: React.CSSProperties = {
    marginBottom: spacing.lg,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    // Intentionally diverges from the clamp['3xl'] token: keeps the mobile min (2rem)
    // but caps desktop smaller (2.75rem vs 3.5rem) for the post title only.
    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    fontWeight: 700,
    color: '#F5F5F5',
    marginBottom: spacing.lg,
    lineHeight: 1.2,
    textAlign: 'left' as const,
  };

  const metaContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottom: `1px solid ${colors.border}`,
  };

  const metaLeftStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  };

  const metaRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  const metaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#999999',
  };

  const authorStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#999999',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <SkeletonText lines={3} width={['80%', '60%', '40%']} height="1.5em" />
      ) : (
        <>
          <h1 style={titleStyle}>{post.title}</h1>

          <div style={metaContainerStyle}>
            <div style={metaLeftStyle}>
              {post.date && (
                <div style={metaItemStyle}>
                  <span>{formatDate(post.date)}</span>
                </div>
              )}

              {post.read_time && (
                <div style={metaItemStyle}>
                  <span>·</span>
                  <span>{formatReadTime(post.read_time)}</span>
                </div>
              )}
            </div>

            <div style={metaRightStyle}>
              <span style={authorStyle}>{post.author_name || 'Author'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
