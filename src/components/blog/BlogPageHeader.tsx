'use client'

import { useState, useEffect } from 'react'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import AnimatedButton from '@/components/ui/AnimatedButton'

interface BlogPageHeaderProps {
  onMenuClick: () => void
}

export default function BlogPageHeader({ onMenuClick }: BlogPageHeaderProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  const headerStyle: React.CSSProperties = {
    position: 'sticky' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.md} ${spacing.lg}`,
    backgroundColor: colors.darkText,
  }

  const logoStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.xl,
    fontWeight: 700,
    color: colors.darkBackground,
    textDecoration: 'none',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    paddingBottom: '4px',
  }

  const menuButtonStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.xl,
    fontWeight: 700,
    color: colors.darkBackground,
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  }

  return (
    <header style={headerStyle}>
      <AnimatedButton variant="underline" href="/" style={logoStyle}>
        BLOG
      </AnimatedButton>
      <AnimatedButton
        variant="underline"
        reverse
        onClick={onMenuClick}
        style={menuButtonStyle}
      >
        <span style={{ fontSize: "clamp(20px, 3vw, 28px)", transform: "translateY(-4px)", display: "inline-block" }}>☰</span>
        {!isSmallScreen && <span>MENU</span>}
      </AnimatedButton>
    </header>
  )
}
