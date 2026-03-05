'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'
import type { Heading } from '@/types/post'

interface PostContentProps {
  content: string
  headings: Heading[]
}

export default function PostContent({ content, headings }: PostContentProps) {
  // Create a map of heading text to generated IDs from server
  const headingIdMap = new Map<string, string>()
  const headingCount: Record<string, number> = {}

  // First pass: build the map using the same logic as extractHeadings
  for (const heading of headings) {
    const key = `${heading.level}-${heading.text}`

    // Generate base ID
    const baseId = heading.text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    if (!headingCount[baseId]) {
      headingCount[baseId] = 0
    }

    const count = headingCount[baseId]
    headingCount[baseId]++

    const generatedId = count === 0 ? baseId : `${baseId}-${count}`
    headingIdMap.set(key, generatedId)
  }

  const getHeadingId = (level: number, text: string): string => {
    const key = `${level}-${text}`
    return headingIdMap.get(key) || text.toLowerCase().replace(/\s+/g, '-')
  }

  const containerStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    fontWeight: 400,
    color: '#F5F5F5',
    lineHeight: 1.8,
    textAlign: 'justify',
  }

  const headingStyles = {
    h1: {
      fontFamily: FONTS.primary,
      fontSize: clamp['3xl'],
      fontWeight: 700,
      color: '#F5F5F5',
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      textAlign: 'left' as const,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: FONTS.primary,
      fontSize: clamp['2xl'],
      fontWeight: 700,
      color: '#F5F5F5',
      marginTop: spacing.md,
      marginBottom: spacing.md,
      textAlign: 'left' as const,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: FONTS.primary,
      fontSize: clamp.xl,
      fontWeight: 600,
      color: '#F5F5F5',
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
      textAlign: 'left' as const,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: FONTS.primary,
      fontSize: clamp.lg,
      fontWeight: 600,
      color: '#F5F5F5',
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
      textAlign: 'left' as const,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: FONTS.primary,
      fontSize: clamp.base,
      fontWeight: 600,
      color: '#F5F5F5',
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
    },
    h6: {
      fontFamily: FONTS.primary,
      fontSize: clamp.sm,
      fontWeight: 600,
      color: '#F5F5F5',
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
    },
  }

  const paragraphStyle: React.CSSProperties = {
    marginBottom: spacing.md,
  }

  const linkStyle: React.CSSProperties = {
    color: colors.accent,
    textDecoration: 'none',
    transition: TRANSITIONS.fast('color'),
    cursor: 'pointer',
  }

  const blockquoteStyle: React.CSSProperties = {
    borderLeft: `4px solid ${colors.accent}`,
    paddingLeft: spacing.md,
    marginLeft: 0,
    marginRight: 0,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: spacing.md,
  }

  const listStyle: React.CSSProperties = {
    marginBottom: spacing.md,
    paddingLeft: spacing.md,
  }

  const listItemStyle: React.CSSProperties = {
    marginBottom: '4px',
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: spacing.md,
    textAlign: 'left' as const,
  }

  const tableCellStyle: React.CSSProperties = {
    border: `1px solid ${colors.border}`,
    padding: '8px 12px',
  }

  const imageStyle: React.CSSProperties = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    margin: `${spacing.md} auto`,
  }

  return (
    <div style={containerStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => {
            const text = children?.toString() || ''
            const id = getHeadingId(1, text)
            return (
              <h1 id={id} style={headingStyles.h1} {...props}>
                {children}
              </h1>
            )
          },
          h2: ({ children, ...props }) => {
            const text = children?.toString() || ''
            const id = getHeadingId(2, text)
            return (
              <h2 id={id} style={headingStyles.h2} {...props}>
                {children}
              </h2>
            )
          },
          h3: ({ children, ...props }) => {
            const text = children?.toString() || ''
            const id = getHeadingId(3, text)
            return (
              <h3 id={id} style={headingStyles.h3} {...props}>
                {children}
              </h3>
            )
          },
          h4: ({ children, ...props }) => {
            const text = children?.toString() || ''
            const id = getHeadingId(4, text)
            return (
              <h4 id={id} style={headingStyles.h4} {...props}>
                {children}
              </h4>
            )
          },
          h5: ({ children, ...props }) => {
            const text = children?.toString() || ''
            const id = getHeadingId(5, text)
            return (
              <h5 id={id} style={headingStyles.h5} {...props}>
                {children}
              </h5>
            )
          },
          h6: ({ children, ...props }) => {
            const text = children?.toString() || ''
            const id = getHeadingId(6, text)
            return (
              <h6 id={id} style={headingStyles.h6} {...props}>
                {children}
              </h6>
            )
          },
          p: ({ children }) => <p style={paragraphStyle}>{children}</p>,
          a: ({ children, href }) => (
            <a
              href={href}
              style={linkStyle}
              className="markdown-link"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote style={blockquoteStyle}>{children}</blockquote>
          ),
          ul: ({ children }) => <ul style={listStyle}>{children}</ul>,
          ol: ({ children }) => <ol style={listStyle}>{children}</ol>,
          li: ({ children }) => <li style={listItemStyle}>{children}</li>,
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <CodeBlock language={match[1]} code={String(children).trim()} />
            ) : (
              <code
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: clamp.sm,
                  backgroundColor: '#F5F5F5',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: colors.accent,
                }}
              >
                {children}
              </code>
            )
          },
          img: ({ src, alt }) => (
            <img src={src || ''} alt={alt || ''} style={imageStyle} />
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: `${spacing.md} 0` }}>
              <table style={tableStyle}>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th style={{ ...tableCellStyle, backgroundColor: colors.card }}>
              {children}
            </th>
          ),
          td: ({ children }) => <td style={tableCellStyle}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
