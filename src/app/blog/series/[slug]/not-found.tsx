'use client'

import Link from 'next/link'
import { FONTS, clamp, spacing } from '@/styles/blog/typography'
import { colors } from '@/styles/blog/colors'
import { TRANSITIONS } from '@/styles/blog/animations'

export default function NotFound() {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp['3xl'],
    fontWeight: 700,
    color: colors.text,
    marginBottom: spacing.md,
  }

  const messageStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    color: '#666666',
    marginBottom: spacing.lg,
    maxWidth: '500px',
  }

  const buttonStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: colors.accent,
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    transition: TRANSITIONS.fast('background-color'),
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Series Not Found</h1>
      <p style={messageStyle}>
        The series you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#CC4420'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.accent
        }}
      >
        Go Home
      </Link>
    </div>
  )
}
