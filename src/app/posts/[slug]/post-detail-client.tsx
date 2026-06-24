'use client'

import { useState, useRef } from 'react'
import type { Heading, Post, SeriesDetail } from '@/types/post'
import BlogPageHeader from '@/components/blog/BlogPageHeader'
import ReadingProgressBar from '@/components/blog/ReadingProgressBar'
import Breadcrumbs, { type Crumb } from '@/components/blog/Breadcrumbs'
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
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'

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
  const articleRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const footerVisible = useFooterVisibility()

  const reducedMotion = useReducedMotion()

  // Already-smoothed via frame-based lerp inside the hook (skips easing when
  // reduced motion is preferred), so the bar reads this value directly.
  const scrollProgress = useScrollProgress(articleRef, reducedMotion)

  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.darkBackground,
    // No overflow here: any non-visible overflow makes this a scroll container,
    // which caps window scroll and breaks the sticky TOC + scroll tracking.
    // Horizontal overflow is contained by children (code blocks, tables, wrap).
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
    // Intentionally no overflowX: keep the window as the single scroll root so
    // position: sticky on the sidebar works. The main column uses minWidth: 0
    // so wide children stay contained instead of forcing horizontal scroll.
  }

  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '0%' : '18%',
    flexShrink: 0,
    display: 'block',
    opacity: isMobile ? 0 : 1,
    transition: 'opacity 0.3s ease',
    // Sticky so the TOC follows the page; align-self keeps the flex item from
    // stretching to row height (which would defeat sticky). Caps at viewport
    // height and stops at the content container's bottom — never over header
    // or footer.
    ...(isMobile
      ? {}
      : {
          position: 'sticky' as const,
          top: '88px',
          alignSelf: 'flex-start' as const,
          maxHeight: 'calc(100vh - 104px)',
          overflowY: 'auto' as const,
        }),
  }

  const contentStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: '100%',
    width: '100%',
    // Allow this flex item to shrink below its content width so wide code
    // blocks/tables scroll internally instead of widening the page.
    minWidth: 0,
  }

  const mainContentStyle: React.CSSProperties = {
    padding: spacing.lg,
  }

  // Trail: Home › {parent series | Blog} › {post}. Series parent lets readers
  // jump to sibling posts; falls back to the expanded blog listing.
  const parentSeries = seriesData?.[0]
  const breadcrumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    parentSeries
      ? { label: parentSeries.title, href: `/series/${parentSeries.slug}` }
      : { label: 'Blog', href: '/?expanded=true' },
    { label: post.title },
  ]

  return (
    <>
      <div style={pageContainerStyle}>
        {/* Reading Progress Bar - Fixed at bottom of screen, sticks at content bottom when footer visible */}
        <ReadingProgressBar
          progress={scrollProgress}
          footerVisible={footerVisible}
        />
        {/* Full-width Header */}
        <BlogPageHeader onMenuClick={() => setIsNavOpen(true)} />

      {/* Content Container */}
      <div style={contentContainerStyle}>
        {/* Left Sidebar */}
        <aside style={sidebarStyle}>
          <TableOfContents headings={headings} loading={isLoading} />
          <OtherPosts posts={relatedPosts} loading={isLoading} />
        </aside>

        {/* Main Content */}
        <main style={contentStyle}>
          <div style={mainContentStyle}>
            {!isLoading && <Breadcrumbs items={breadcrumbs} />}

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

            {post.content && (
              <div ref={articleRef}>
                <PostContent content={post.content} headings={headings} />
              </div>
            )}

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
