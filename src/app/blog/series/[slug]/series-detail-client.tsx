'use client';

import { useState } from 'react';
import type { SeriesDetail } from '@/types/post';
import BlogPageHeader from '@/components/blog/BlogPageHeader';
import SeriesHeader from '@/components/blog/SeriesHeader';
import SeriesPostList from '@/components/blog/SeriesPostList';
import FullScreenNav from '@/components/blog/ui/FullScreenNav';
import { useIsMobile } from '@/hooks/useBreakpoint';
import { spacing } from '@/styles/blog/typography';
import { colors } from '@/styles/blog/colors';

interface SeriesDetailClientProps {
  series: SeriesDetail;
}

export default function SeriesDetailClient({
  series,
}: SeriesDetailClientProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useIsMobile();

  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.darkBackground,
    width: '100%',
    position: 'relative',
  };

  const contentContainerStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <>
      <div style={pageContainerStyle}>
        {/* Full-width Header */}
        <BlogPageHeader onMenuClick={() => setIsNavOpen(true)} />

        {/* Content Container */}
        <div style={contentContainerStyle}>
          <SeriesHeader series={series} />
          <SeriesPostList posts={series.posts} />
        </div>
      </div>

      {/* Full-Screen Navigation */}
      <FullScreenNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
}
