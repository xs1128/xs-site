import { useState, useEffect, useRef, type RefObject } from 'react'

// Easing factor for the reading-progress lerp. Each frame the displayed value
// moves this fraction of the remaining distance to the target:
//   displayed += (target - displayed) * SMOOTHING
// 0.15 was chosen empirically: low enough to absorb the per-frame jitter of raw
// scroll deltas (so the bar doesn't feel jumpy), but high enough that it visibly
// converges within a few frames (~no perceptible lag). Higher values feel snappy
// but jittery; lower values feel smooth but laggy.
const PROGRESS_SMOOTHING = 0.15

// Stop the easing loop once we're within this many percent of the target, so we
// don't burn frames asymptotically chasing a value that's visually settled.
const PROGRESS_EPSILON = 0.1

// Fraction of the viewport height by which we shift the progress START anchor
// UP, so the bar begins filling *before* the article top reaches the viewport
// top. With 0.5 the bar starts moving once the article top is within half a
// viewport of the top, i.e. roughly when the article first scrolls into the
// lower half of the screen, while the header/hero is still partly visible.
// This avoids the "bar sits at 0% through the whole header" feel the old
// articleTop-only anchor produced. Expressed as a fraction (not a fixed px
// value) so it scales with screen size; tune between ~0.4 (later) and ~0.8
// (earlier). The END anchor (article fully read) is left untouched, so the bar
// still reaches exactly 100% at the end of the article content.
const PROGRESS_START_OFFSET_VH = 0.5

/**
 * Hook for tracking reading progress through a target element.
 *
 * Measures how far the viewport has scrolled through [articleTop -
 * PROGRESS_START_OFFSET_VH * viewportHeight, articleBottom - viewportHeight] for
 * the passed element, instead of the whole document. This keeps the bar anchored
 * to the actual post body (excludes header, TOC, tags, post-nav, related posts
 * and footer), while letting it begin filling slightly before the article top
 * reaches the viewport top so it doesn't sit at 0% through the whole header. The
 * end anchor is unchanged, so it still reaches 100% at the end of the article.
 *
 * Smoothing: the scroll/resize handler (rAF-throttled) only updates a TARGET ref
 * from the raw measurement. A separate continuous rAF easing loop lerps a
 * DISPLAYED value toward that target and is the only thing that updates React
 * state. The loop self-stops when settled (|target - displayed| < epsilon) and
 * is restarted whenever a new target arrives. This decouples responsiveness from
 * smoothness: the bar eases instead of snapping (no jitter) without the lag a CSS
 * transition would add.
 *
 * When `reducedMotion` is true, interpolation is skipped entirely, so the displayed
 * value snaps to the target with no easing loop.
 *
 * Recomputes on scroll, resize, and element reflow (late-loading images/fonts)
 * via a ResizeObserver. All measurement paths share one rAF throttle.
 */
export function useScrollProgress(
  targetRef: RefObject<HTMLElement | null>,
  reducedMotion = false
) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const tickingRef = useRef(false)
  // Latest measured target (0..100). Written by the scroll handler, read by the
  // easing loop. A ref so updates don't trigger renders; only the loop does.
  const targetProgressRef = useRef(0)
  // Current displayed value, mirrored in a ref so the easing loop can read it
  // without depending on the state value (avoids stale closures / restarts).
  const displayedRef = useRef(0)
  // Active easing-loop rAF id, or null when no loop is running.
  const easeRafRef = useRef<number | null>(null)
  // Pending throttle-rAF id scheduled by onScroll, or null when none is pending.
  const throttleRafRef = useRef<number | null>(null)

  useEffect(() => {
    function setDisplayed(value: number) {
      displayedRef.current = value
      setScrollProgress(value)
    }

    function ease() {
      const target = targetProgressRef.current
      const displayed = displayedRef.current
      const next = displayed + (target - displayed) * PROGRESS_SMOOTHING

      // Intentionally tests `next` (not `displayed`) so the final written value
      // snaps cleanly to target. Keep this when refactoring or convergence breaks.
      if (Math.abs(target - next) <= PROGRESS_EPSILON) {
        // Close enough: snap to target and stop the loop to save frames.
        setDisplayed(target)
        easeRafRef.current = null
        return
      }

      setDisplayed(next)
      easeRafRef.current = requestAnimationFrame(ease)
    }

    function startEasing() {
      if (reducedMotion) {
        // No animation: snap straight to the latest target.
        if (easeRafRef.current !== null) {
          cancelAnimationFrame(easeRafRef.current)
          easeRafRef.current = null
        }
        setDisplayed(targetProgressRef.current)
        return
      }
      // One loop at a time; if already running it will pick up the new target.
      if (easeRafRef.current === null) {
        easeRafRef.current = requestAnimationFrame(ease)
      }
    }

    function updateProgress() {
      tickingRef.current = false

      const el = targetRef.current
      if (!el) {
        targetProgressRef.current = 0
        startEasing()
        return
      }

      const viewportHeight = window.innerHeight
      const rect = el.getBoundingClientRect()
      // Article top/bottom in document coordinates.
      const articleTop = rect.top + window.scrollY
      const articleBottom = articleTop + rect.height

      // Shift the START anchor up by a fraction of the viewport so progress
      // begins accruing before the article top reaches the viewport top. Clamp
      // at 0 so we never anchor above the document start.
      const startOffset = viewportHeight * PROGRESS_START_OFFSET_VH
      const effectiveStart = Math.max(0, articleTop - startOffset)

      // The scrollable span over which we read the article: from the (earlier)
      // effective start until the article bottom reaches the viewport bottom.
      // Adding the offset to the old span keeps this strictly positive whenever
      // the old span was non-negative, so there's no new zero-divide path.
      const trackable = articleBottom - viewportHeight - effectiveStart
      if (trackable <= 0) {
        // Article fits within (or is shorter than) the viewport: nothing to
        // track. Treat as fully read once we're at/past its top.
        targetProgressRef.current = window.scrollY >= articleTop ? 100 : 0
        startEasing()
        return
      }

      const scrolledIntoArticle = window.scrollY - effectiveStart
      const progress = (scrolledIntoArticle / trackable) * 100
      const clamped = Math.min(100, Math.max(0, progress))
      // NaN guard: ignore bogus measurements rather than poisoning the lerp.
      if (Number.isNaN(clamped)) return
      targetProgressRef.current = clamped
      startEasing()
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true
        throttleRafRef.current = requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Recompute when the article element reflows (late images/fonts).
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onScroll)
      if (targetRef.current) observer.observe(targetRef.current)
      observer.observe(document.body)
    }

    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (observer) observer.disconnect()
      if (easeRafRef.current !== null) {
        cancelAnimationFrame(easeRafRef.current)
        easeRafRef.current = null
      }
      if (throttleRafRef.current !== null) {
        cancelAnimationFrame(throttleRafRef.current)
        throttleRafRef.current = null
      }
    }
  }, [targetRef, reducedMotion])

  return scrollProgress
}

/**
 * Hook for detecting when footer is visible (throttled)
 * Extracted from post-detail-client.tsx
 */
export function useFooterVisibility() {
  const [footerVisible, setFooterVisible] = useState(false)
  const tickingRef = useRef(false)

  useEffect(() => {
    // Cache the footer node once instead of querying it every frame.
    const footer = document.querySelector('footer')

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(() => {
          tickingRef.current = false
          if (!footer) return

          const footerRect = footer.getBoundingClientRect()
          setFooterVisible(footerRect.top < window.innerHeight)
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return footerVisible
}
