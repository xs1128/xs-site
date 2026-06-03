'use client'

import { useState, useRef } from 'react'
import type { Heading, Post, SeriesDetail } from '@/types/post'
import BlogPageHeader from '@/components/blog/BlogPageHeader'
import PostHeader from '@/components/blog/PostHeader'
import PostHero from '@/components/blog/PostHero'
import PostContent from '@/components/blog/PostContent'
import TableOfContents from '@/components/blog/TableOfContents'
import TagList from '@/components/blog/TagList'
import OtherPosts from '@/components/blog/OtherPosts'
import SeriesBanner from '@/components/blog/SeriesBanner'
import PostNavigation from '@/components/blog/PostNavigation'
import FullScreenNav from '@/components/ui/FullScreenNav'
import { SkeletonHero, SkeletonText } from '@/components/skeleton'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { useScrollProgress, useFooterVisibility } from '@/hooks/useScrollDetection'
import { spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'

interface PostDetailClientProps {
  post: Post
  seriesData: SeriesDetail[]
  headings: Heading[]
  relatedPosts: Post[]
}

export default function PostDetailClient({
  post,
  seriesData,
  headings,
  relatedPosts,
}: PostDetailClientProps) {
  // Check if we're in a loading state (empty post object)
  const isLoading = !post || !post.id
  const [prevNext, setPrevNext] = useState<{
    prev: { title: string; slug: string } | null
    next: { title: string; slug: string } | null
  }>({ prev: null, next: null })

  const [isNavOpen, setIsNavOpen] = useState(false)
  const scrollProgress = useScrollProgress()
  const isMobile = useIsMobile()
  const footerVisible = useFooterVisibility()
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.darkBackground,
    overflowX: 'auto',
    width: '100%',
    position: 'relative',
  }

  const contentContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: isMobile ? '0' : spacing.md,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing.lg,
    flex: 1,
    position: 'relative',
    width: '100%',
    overflowX: 'hidden',
  }

  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '0%' : '18%',
    flexShrink: 0,
    display: 'block',
    opacity: isMobile ? 0 : 1,
    transition: 'opacity 0.3s ease',
  }

  const contentStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: '100%',
    width: '100%',
  }

  const mainContentStyle: React.CSSProperties = {
    padding: spacing.lg,
  }

  return (
    <>
      <div style={pageContainerStyle}>
        {/* Reading Progress Bar - Fixed at bottom of screen, sticks at content bottom when footer visible */}
        <div style={{
          position: footerVisible ? 'absolute' : 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(229, 83, 44, 0.2)',
          zIndex: 101,
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${scrollProgress}%`,
            backgroundColor: '#E5532C',
            transition: TRANSITIONS.slower('width'),
            boxShadow: '0 0 10px rgba(229, 83, 44, 0.5)',
          }} />
        </div>
        {/* Full-width Header */}
        <BlogPageHeader onMenuClick={() => setIsNavOpen(true)} />

      {/* Content Container */}
      <div style={contentContainerStyle}>
        {/* Left Sidebar */}
        <aside style={sidebarStyle}>
          <TableOfContents headings={headings} />
          <OtherPosts posts={relatedPosts} loading={isLoading} />
        </aside>

        {/* Main Content */}
        <main style={contentStyle}>
          <div style={mainContentStyle}>
            <PostHeader post={post} series={seriesData} loading={isLoading} />

            {isLoading ? (
              <SkeletonHero />
            ) : post.featured_image ? (
              <PostHero imageUrl={post.featured_image} alt={post.title} />
            ) : null}

            {seriesData && seriesData.length > 0 && (
              <SeriesBanner
                series={seriesData[0]}
                currentPostSlug={post.slug}
              />
            )}

            {post.content && <PostContent content={post.content} headings={headings} />}

            <div style={{
              width: '100%',
              height: '1px',
              backgroundColor: colors.border,
              margin: `${spacing.lg} 0`,
            }} />

            <TagList tags={post.tags || []} loading={isLoading} />

            <PostNavigation
              prevPost={prevNext.prev}
              nextPost={prevNext.next}
              seriesTitle={seriesData?.[0]?.title}
            />
          </div>
        </main>
      </div>

      {/* Full-Screen Navigation */}
      <FullScreenNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />
    </div>
    </>
  )
}
