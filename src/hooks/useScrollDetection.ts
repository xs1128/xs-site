import { useState, useEffect } from 'react'

/**
 * Hook for tracking scroll progress
 * Extracted from post-detail-client.tsx
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

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

  return scrollProgress
}

/**
 * Hook for detecting when footer is visible
 * Extracted from post-detail-client.tsx
 */
export function useFooterVisibility() {
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      if (!footer) return

      const footerRect = footer.getBoundingClientRect()

      if (footerRect.top < window.innerHeight) {
        setFooterVisible(true)
      } else {
        setFooterVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return footerVisible
}
