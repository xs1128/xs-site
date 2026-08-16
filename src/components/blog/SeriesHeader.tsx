import type { SeriesDetail } from '@/types/post';
import { FONTS, clamp, spacing } from '@/styles/blog/typography';
import { colors } from '@/styles/blog/colors';
import Breadcrumbs, { type Crumb } from '@/components/blog/Breadcrumbs';
import { SkeletonText } from '@/components/blog/skeleton';

interface SeriesHeaderProps {
  series: SeriesDetail;
  loading?: boolean;
}

export default function SeriesHeader({
  series,
  loading = false,
}: SeriesHeaderProps) {
  const headerStyle: React.CSSProperties = {
    padding: 'clamp(40px, 6vh, 80px) clamp(20px, 3vh, 40px)',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  };

  const breadcrumbs: Crumb[] = [
    { label: 'All Posts', href: '/blog?expanded=true' },
    { label: series.title },
  ];

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp['2xl'],
    fontWeight: 700,
    color: colors.darkText,
    marginBottom: spacing.md,
    lineHeight: 1.2,
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    color: '#CCCCCC',
    lineHeight: 1.6,
    maxWidth: '800px',
  };

  return (
    <header style={headerStyle}>
      <Breadcrumbs items={breadcrumbs} />
      {loading ? (
        <>
          <SkeletonText lines={2} width={['70%', '50%']} height="2em" />
          <SkeletonText lines={3} width="100%" height="1.2em" />
        </>
      ) : (
        <>
          <h1 style={titleStyle}>{series.title}</h1>
          {series.description && (
            <p style={descriptionStyle}>{series.description}</p>
          )}
        </>
      )}
    </header>
  );
}
