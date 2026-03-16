import { useState, useEffect, useRef } from 'react'

/**
 * Hook for tracking scroll progress (throttled)
 * Extracted from post-detail-client.tsx
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    function updateProgress() {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = (scrolled / documentHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
      tickingRef.current = false
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(() => {
          const footer = document.querySelector('footer')
          if (!footer) {
            tickingRef.current = false
            return
          }

          const footerRect = footer.getBoundingClientRect()

          if (footerRect.top < window.innerHeight) {
            setFooterVisible(true)
          } else {
            setFooterVisible(false)
          }
          tickingRef.current = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return footerVisible
}
