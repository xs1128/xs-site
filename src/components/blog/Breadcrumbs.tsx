'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'

export interface Crumb {
  /** Visible label. */
  label: string
  /** Link target. Omit for the current (last) crumb. */
  href?: string
}

interface BreadcrumbsProps {
  items: Crumb[]
}

/**
 * Breadcrumb trail for post/series pages. Matches the dark page theme:
 * accent links, muted current item, chevron separators.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items.length) return null

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: spacing.md,
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
  }

  const linkStyle: React.CSSProperties = {
    color: colors.accent,
    textDecoration: 'none',
    fontWeight: 600,
    transition: TRANSITIONS.fast('color'),
    whiteSpace: 'nowrap',
  }

  const currentStyle: React.CSSProperties = {
    color: '#999999',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '60vw',
  }

  const separatorStyle: React.CSSProperties = {
    color: colors.navText,
    fontWeight: 400,
    userSelect: 'none',
  }

  return (
    <nav aria-label="Breadcrumb" style={navStyle}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#CC4420'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.accent
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={currentStyle} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span style={separatorStyle} aria-hidden="true">
                ›
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
