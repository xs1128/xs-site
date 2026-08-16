'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/blog/supabase/client'
import type { Heading, Post, PostLink, SeriesDetail } from '@/types/post'
import BlogPageHeader from '@/components/blog/BlogPageHeader'
import ReadingProgressBar from '@/components/blog/ReadingProgressBar'
import Breadcrumbs, { type Crumb } from '@/components/blog/Breadcrumbs'
import PostHeader from '@/components/blog/PostHeader'
import PostHero from '@/components/blog/PostHero'
import PostContent from '@/components/blog/PostContent'
import TableOfContents from '@/components/blog/TableOfContents'
import TagList from '@/components/blog/TagList'
import OtherPosts from '@/components/blog/OtherPosts'
import PostNavigation from '@/components/blog/PostNavigation'
import FullScreenNav from '@/components/blog/ui/FullScreenNav'
import { SkeletonHero } from '@/components/blog/skeleton'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { useScrollProgress, useFooterVisibility } from '@/hooks/useScrollDetection'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { spacing } from '@/styles/blog/typography'
import { colors } from '@/styles/blog/colors'

interface PostDetailClientProps {
  post: Post
  seriesData: SeriesDetail[]
  headings: Heading[]
  relatedPosts: Post[]
  prevPost?: PostLink | null
  nextPost?: PostLink | null
}

export default function PostDetailClient({
  post,
  seriesData,
  headings,
  relatedPosts,
  prevPost = null,
  nextPost = null,
}: PostDetailClientProps) {
  // Check if we're in a loading state (empty post object)
  const isLoading = !post || !post.id

  const [isNavOpen, setIsNavOpen] = useState(false)
  const articleRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const footerVisible = useFooterVisibility()

  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (isLoading || !post?.slug) return

    const key = `post-view:${post.slug}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    createClient()
      .rpc('increment_post_view', { p_slug: post.slug })
      .then(() => {})
  }, [isLoading, post?.slug])

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
    maxWidth: '1400px',
    margin: '0 auto',
    flex: 1,
    position: 'relative',
    width: '100%',
    // Intentionally no overflowX: keep the window as the single scroll root so
    // position: sticky on the sidebar works. The main column uses minWidth: 0
    // so wide children stay contained instead of forcing horizontal scroll.
  }

  const contentStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: '100%',
    width: '100%',
    // Allow this flex item to shrink below its content width so wide code
    // blocks/tables scroll internally instead of widening the page.
    minWidth: 0,
  }

  // Series level lets readers jump to sibling posts; omitted for standalone posts.
  const parentSeries = seriesData?.[0]
  const breadcrumbs: Crumb[] = [
    { label: 'All Posts', href: '/?expanded=true' },
    ...(parentSeries
      ? [{ label: parentSeries.title, href: `/series/${parentSeries.slug}` }]
      : []),
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
      <div className="post-layout" style={contentContainerStyle}>
        {/* CSS hides this under 768px; unmounting also drops the TOC's
            scroll listener on mobile. */}
        {!isMobile && (
          <aside className="post-sidebar">
            <TableOfContents headings={headings} loading={isLoading} />
            <OtherPosts posts={relatedPosts} loading={isLoading} />
          </aside>
        )}

        {/* Main Content */}
        <main style={contentStyle}>
          <div className="post-main">
            {!isLoading && <Breadcrumbs items={breadcrumbs} />}

            <PostHeader post={post} loading={isLoading} />

            {isLoading ? (
              <SkeletonHero />
            ) : post.featured_image ? (
              <PostHero imageUrl={post.featured_image} alt={post.title} />
            ) : null}

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
              prevPost={prevPost}
              nextPost={nextPost}
              seriesTitle={parentSeries?.title}
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
