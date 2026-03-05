'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [prevNext, setPrevNext] = useState<{
    prev: { title: string; slug: string } | null
    next: { title: string; slug: string } | null
  }>({ prev: null, next: null })

  const [seriesWithPosts, setSeriesWithPosts] = useState<SeriesDetail[]>([])
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const contentContainerRef = useRef<HTMLDivElement>(null)

  // Detect small screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Calculate reading progress
  useEffect(() => {
    function updateProgress() {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = (scrolled / documentHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  // Detect when footer is visible to adjust progress bar positioning
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      if (!footer) return

      const footerRect = footer.getBoundingClientRect()

      // Check if footer has entered the viewport
      if (footerRect.top < window.innerHeight) {
        setFooterVisible(true)
      } else {
        setFooterVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // For now, we'll just set prev/next to null since we need to fetch
    // the full series data with posts to calculate this
    // This could be enhanced with a separate query
    if (seriesData && seriesData.length > 0) {
      setSeriesWithPosts(seriesData)
    }
  }, [seriesData])

  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: colors.darkBackground,
    overflowX: 'auto',
    width: '100%',
    position: 'relative' as const,
  }

  const contentContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.lg,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing.lg,
    flex: 1,
    position: 'relative',
    minWidth: '300px',
  }

  const sidebarStyle: React.CSSProperties = {
    width: isSmallScreen ? '0%' : '18%',
    flexShrink: 0,
    display: 'block',
    opacity: isSmallScreen ? 0 : 1,
    transition: 'opacity 0.3s ease',
  }

  const contentStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: isSmallScreen ? '100%' : '78%',
  }

  const mainContentStyle: React.CSSProperties = {
    padding: spacing.lg,
  }

  return (
    <>
      <div style={pageContainerStyle}>
        {/* Reading Progress Bar - Fixed at bottom of screen, sticks at content bottom when footer visible */}
        <div style={{
          position: footerVisible ? ('absolute' as const) : ('fixed' as const),
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
          <OtherPosts posts={relatedPosts} />
        </aside>

        {/* Main Content */}
        <main style={contentStyle}>
          <div style={mainContentStyle}>
            <PostHeader post={post} series={seriesWithPosts} />

            {post.featured_image && (
              <PostHero imageUrl={post.featured_image} alt={post.title} />
            )}

            {seriesWithPosts && seriesWithPosts.length > 0 && (
              <SeriesBanner
                series={seriesWithPosts[0]}
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

            <TagList tags={post.tags || []} />

            <PostNavigation
              prevPost={prevNext.prev}
              nextPost={prevNext.next}
              seriesTitle={seriesWithPosts?.[0]?.title}
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
