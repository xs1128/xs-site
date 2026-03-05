'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { getAvatarUrl } from '@/lib/supabase/settings'

interface SocialLink {
  name: string
  url: string
  icon: React.ReactNode
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/xs1128',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/xinsheng-ooi-6738083b4',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/ooi.xinsheng/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/xs_ooi1128',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
      </svg>
    )
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [isWrapped, setIsWrapped] = useState(false)
  const [isVerticalStack, setIsVerticalStack] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const authorSectionRef = useRef<HTMLDivElement>(null)
  const linksSectionRef = useRef<HTMLDivElement>(null)

  // Load avatar URL
  useEffect(() => {
    async function loadAvatar() {
      const url = await getAvatarUrl()
      // Use fallback image if no avatar is set
      setAvatarUrl(url || 'https://fopmnlxsudpgsdpaqrzd.supabase.co/storage/v1/object/public/blog-images/default-avatar.jpeg')
    }
    loadAvatar()
  }, [])

  // Ensure avatarUrl is never empty
  const displayAvatarUrl = avatarUrl || 'https://fopmnlxsudpgsdpaqrzd.supabase.co/storage/v1/object/public/blog-images/default-avatar.jpeg'

  // Detect when profile section squeezes the quick link section down
  useEffect(() => {
    const checkWrap = () => {
      if (!authorSectionRef.current || !linksSectionRef.current) return

      const authorRect = authorSectionRef.current.getBoundingClientRect()
      const linksRect = linksSectionRef.current.getBoundingClientRect()

      // If links section is below author section (top position is different), it's wrapped
      setIsWrapped(linksRect.top > authorRect.top + 10)
    }

    checkWrap()
    window.addEventListener('resize', checkWrap)
    return () => window.removeEventListener('resize', checkWrap)
  }, [])

  // Detect when to switch to vertical stacking at 550px
  useEffect(() => {
    const checkVerticalStack = () => {
      setIsVerticalStack(window.innerWidth < 550)
    }

    checkVerticalStack()
    window.addEventListener('resize', checkVerticalStack)
    return () => window.removeEventListener('resize', checkVerticalStack)
  }, [])

  const footerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#F2E9D8',
    padding: '24px 0 16px 0',
    marginTop: 'auto',
    position: 'relative' as const,
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.lg,
  }

  const topSectionStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: isVerticalStack ? 'center' as const : 'flex-start' as const,
    alignItems: isVerticalStack ? 'center' as const : 'flex-start' as const,
    flexDirection: isVerticalStack ? ('column' as const) : ('row' as const),
    flexWrap: isVerticalStack ? 'nowrap' as const : 'wrap' as const,
    gap: isVerticalStack ? spacing.lg : spacing.lg,
    paddingLeft: isVerticalStack ? '0' : '7%',
    paddingRight: '0',
  }

  const authorSectionStyle: React.CSSProperties = {
    flex: '0 0 auto',
    width: isVerticalStack ? 'auto' : '27%',
    minWidth: '200px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: spacing.sm,
    alignItems: 'flex-start' as const,
  }

  const linksSectionStyle: React.CSSProperties = {
    flex: '0 0 auto',
    width: isVerticalStack ? 'auto' : '23%',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.sm,
    alignItems: 'flex-start' as const,
  }

  const socialSectionStyle: React.CSSProperties = {
    flex: '0 0 auto',
    width: isVerticalStack ? 'auto' : '27%',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.sm,
    alignItems: 'flex-start' as const,
  }

  const socialButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'clamp(40px, 5vw, 48px)',
    height: 'clamp(40px, 5vw, 48px)',
    minWidth: '40px',
    minHeight: '40px',
    maxWidth: '48px',
    maxHeight: '48px',
    borderRadius: '50%',
    backgroundColor: '#E4D9C2',
    color: '#2A2F35',
    textDecoration: 'none',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    flexShrink: 0,
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.lg,
    fontWeight: 700,
    color: colors.text,
    marginBottom: '4px',
    textAlign: 'left' as const,
  }

  const socialLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    flexWrap: 'nowrap' as const,
  }

  const socialIconStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    color: colors.text,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
    display: 'inline-block',
    padding: '4px 8px',
    position: 'relative' as const,
  }

  const quickLinkWrapperStyle: React.CSSProperties = {
    display: 'inline-block',
  }

  const quickLinkInnerStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    color: colors.text,
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'color 0.3s ease, transform 0.3s ease',
    position: 'relative' as const,
    textAlign: 'left' as const,
  }

  const copyrightStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    color: '#666666',
    textAlign: 'center' as const,
    paddingTop: spacing.xs,
    borderTop: `1px solid ${colors.border}`,
  }

  const verticalDividerStyle: React.CSSProperties = {
    width: '1px',
    backgroundColor: colors.border,
    margin: '0 20px',
    alignSelf: 'stretch' as const,
  }

  return (
    <footer style={footerStyle}>
      {/* Full width horizontal divider at top edge */}
      <div style={{
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '1px',
        backgroundColor: colors.border,
      }}></div>
      <div style={containerStyle}>
        {/* Top Section */}
        <div style={topSectionStyle}>
          {/* Author Info */}
          <div style={authorSectionStyle} ref={authorSectionRef}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: spacing.xs, paddingLeft: isVerticalStack ? '0' : '20px' }}>
              {/* Avatar and Name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                {/* Profile picture */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  overflow: 'hidden',
                  position: 'relative' as const,
                }}>
                  <Image
                    src={displayAvatarUrl}
                    alt="Profile avatar"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="60px"
                  />
                </div>
                <div style={{
                  fontFamily: FONTS.primary,
                  fontSize: clamp.base,
                  fontWeight: 600,
                  color: colors.text,
                }}>
                  xs
                </div>
              </div>
              {/* Bio/Tagline */}
              <div style={{
                fontFamily: FONTS.primary,
                fontSize: clamp.sm,
                color: '#555555',
              }}>
                Building things for the web
              </div>
            </div>
          </div>

          {!isWrapped && !isVerticalStack && <div style={verticalDividerStyle}></div>}

          {/* Site Links */}
          <div style={linksSectionStyle} ref={linksSectionRef}>
            <div style={headingStyle}>Links</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
              <a
                href="https://me.xsooi.com"
                target="_blank"
                rel="noopener noreferrer"
                style={quickLinkInnerStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Main Site
                  <svg width="0.7em" height="0.7em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="7,17 15,9" />
                    <polyline points="17,17 17,7 7,7" />
                  </svg>
                </span>
              </a>
              <a
                href="https://projects.xsooi.com"
                target="_blank"
                rel="noopener noreferrer"
                style={quickLinkInnerStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Projects
                  <svg width="0.7em" height="0.7em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="7,17 15,9" />
                    <polyline points="17,17 17,7 7,7" />
                  </svg>
                </span>
              </a>
              <a
                href="https://me.xsooi.com#contact"
                target="_blank"
                rel="noopener noreferrer"
                style={quickLinkInnerStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Contact me
                  <svg width="0.7em" height="0.7em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="7,17 15,9" />
                    <polyline points="17,17 17,7 7,7" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div style={socialSectionStyle}>
            <div style={{
              fontFamily: 'Roboto Mono, monospace',
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: colors.text,
              marginBottom: spacing.md,
            }}>
              email: hi@xsooi.com
            </div>
            <div style={socialLinksStyle}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  style={socialButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.backgroundColor = '#2A2F35'
                    e.currentTarget.style.color = '#E4D9C2'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.backgroundColor = '#E4D9C2'
                    e.currentTarget.style.color = '#2A2F35'
                  }}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={copyrightStyle}>
          <div style={{ marginBottom: '4px' }}>
            This website is built with Next.js, React, Supabase and Vercel.
          </div>
          <div>
            © {currentYear} Xinsheng Ooi.
          </div>
        </div>
      </div>
    </footer>
  )
}
