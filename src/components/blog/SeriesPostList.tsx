'use client';

import { useState, useEffect } from 'react';
import type { SeriesPost } from '@/types/post';
import SeriesPostCard from './SeriesPostCard';
import SeriesPostCardSkeleton from './SeriesPostCardSkeleton';
import { spacing } from '@/styles/blog/typography';

interface SeriesPostListProps {
  posts: SeriesPost[];
}

export default function SeriesPostList({ posts }: SeriesPostListProps) {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [postsWithImages, setPostsWithImages] = useState<Set<string>>(
    new Set(),
  );

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 clamp(32px, 5vh, 60px) clamp(40px, 6vh, 80px)`,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(24px, 4vh, 40px)',
  };

  const emptyStateStyle: React.CSSProperties = {
    fontFamily: 'var(--font-primary)',
    fontSize: 'clamp(14px, 2vw, 18px)',
    color: '#CCCCCC',
    textAlign: 'center',
    padding: 'clamp(40px, 6vh, 80px)',
  };

  useEffect(() => {
    // Track image loading
    const postsWithFeatureImages = posts.filter((post) => post.featured_image);

    if (postsWithFeatureImages.length === 0) {
      setAllImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalToLoad = postsWithFeatureImages.length;

    postsWithFeatureImages.forEach((post) => {
      const img = new Image();
      img.src = post.featured_image!;

      img.onload = () => {
        setPostsWithImages((prev) => new Set(prev).add(post.slug));
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setAllImagesLoaded(true);
        }
      };

      img.onerror = () => {
        // Count as loaded even on error so we don't wait forever
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setAllImagesLoaded(true);
        }
      };
    });

    // If all images are already cached, they might load instantly
    // Set a minimum loading time of 500ms for better UX
    const minLoadingTime = setTimeout(() => {
      setAllImagesLoaded(true);
    }, 500);

    return () => clearTimeout(minLoadingTime);
  }, [posts]);

  if (!posts || posts.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={emptyStateStyle}>This series has no posts yet.</p>
      </div>
    );
  }

  // Show skeletons while images are loading
  if (!allImagesLoaded) {
    return (
      <div style={containerStyle}>
        {posts.map((post) => (
          <SeriesPostCardSkeleton key={post.slug} />
        ))}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {posts.map((post) => (
        <SeriesPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
