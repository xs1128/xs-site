'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { markdownSanitizeSchema } from '@/lib/markdown/sanitizeSchema'
import CodeBlock from './CodeBlock'
import { FONTS, clamp, spacing } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { TRANSITIONS } from '@/styles/animations'
import { slugifyHeading } from '@/lib/utils/post'
import type { Heading } from '@/types/post'

// Recursively flatten a rendered heading's children into plain text, so an
// <h2>Why <code>yt-dlp</code>?</h2> yields "Why yt-dlp?" (not "[object Object]").
// This must match the plain text extractHeadings derives from the markdown.
function getNodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if (React.isValidElement(node)) {
    return getNodeText((node.props as { children?: React.ReactNode }).children)
  }
  return ''
}

interface PostContentProps {
  content: string
  headings: Heading[]
}

// Memoize image component to prevent re-renders
const MemoizedImage = React.memo(({ src, alt, style }: { src: string | Blob | undefined; alt: string | undefined; style: React.CSSProperties }) => (
  <img
    src={typeof src === 'string' ? src : ''}
    alt={alt || ''}
    loading="eager"
    fetchPriority="high"
    style={style}
  />
))
MemoizedImage.displayName = 'MemoizedImage'

// Move all styles outside component to prevent recreation on every render
const containerStyle: React.CSSProperties = {
  fontFamily: FONTS.primary,
  fontSize: clamp.base,
  fontWeight: 400,
  color: '#F5F5F5',
  lineHeight: 1.8,
  textAlign: 'justify',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
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
  overflowWrap: 'break-word',
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

const codeStyle: React.CSSProperties = {
  fontFamily: FONTS.mono,
  fontSize: clamp.sm,
  backgroundColor: '#F5F5F5',
  padding: '2px 6px',
  borderRadius: '4px',
  color: colors.accent,
  wordBreak: 'break-all',
  overflowWrap: 'break-word',
}

const imageStyle: React.CSSProperties = {
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: '70%',
  height: 'auto',
  borderRadius: '8px',
  margin: `${spacing.md} auto`,
}

const PostContentComponent = ({ content, headings }: PostContentProps) => {
  // Build a map from each heading (level + plain text) to its DOM id, using the
  // exact same slug + dedup scheme as extractHeadings. heading.text is already
  // plain (markdown stripped), so renderer ids and TOC ids stay in lockstep.
  const headingIdMap = React.useMemo(() => {
    const map = new Map<string, string>()
    const headingCount: Record<string, number> = {}

    for (const heading of headings) {
      const key = `${heading.level}-${heading.text}`
      const baseId = slugifyHeading(heading.text)

      if (!headingCount[baseId]) {
        headingCount[baseId] = 0
      }

      const count = headingCount[baseId]
      headingCount[baseId]++

      map.set(key, count === 0 ? baseId : `${baseId}-${count}`)
    }

    return map
  }, [headings])

  const getHeadingId = React.useCallback((level: number, text: string): string => {
    const key = `${level}-${text}`
    return headingIdMap.get(key) || slugifyHeading(text)
  }, [headingIdMap])

  // Memoize the markdown components to prevent recreation
  const components = React.useMemo(() => ({
    h1: ({ children, ...props }: any) => {
      const text = getNodeText(children)
      const id = getHeadingId(1, text)
      return (
        <h1 id={id} style={headingStyles.h1} {...props}>
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }: any) => {
      const text = getNodeText(children)
      const id = getHeadingId(2, text)
      return (
        <h2 id={id} style={headingStyles.h2} {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }: any) => {
      const text = getNodeText(children)
      const id = getHeadingId(3, text)
      return (
        <h3 id={id} style={headingStyles.h3} {...props}>
          {children}
        </h3>
      )
    },
    h4: ({ children, ...props }: any) => {
      const text = getNodeText(children)
      const id = getHeadingId(4, text)
      return (
        <h4 id={id} style={headingStyles.h4} {...props}>
          {children}
        </h4>
      )
    },
    h5: ({ children, ...props }: any) => {
      const text = getNodeText(children)
      const id = getHeadingId(5, text)
      return (
        <h5 id={id} style={headingStyles.h5} {...props}>
          {children}
        </h5>
      )
    },
    h6: ({ children, ...props }: any) => {
      const text = getNodeText(children)
      const id = getHeadingId(6, text)
      return (
        <h6 id={id} style={headingStyles.h6} {...props}>
          {children}
        </h6>
      )
    },
    p: ({ children, node }: any) => {
      // Check if paragraph only contains an image
      const childArray = React.Children.toArray(children)
      const firstChild = childArray[0] as React.ReactElement
      const hasOnlyImage =
        childArray.length === 1 &&
        React.isValidElement(firstChild) &&
        (firstChild.type === 'img' || firstChild.type === MemoizedImage)

      // Add min-height for image paragraphs to prevent layout shift
      const style = hasOnlyImage
        ? {
            ...paragraphStyle,
            minHeight: '400px',
            backgroundColor: '#2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        : paragraphStyle

      return <p style={style}>{children}</p>
    },
    a: ({ children, href }: any) => (
      <a
        href={href}
        style={linkStyle}
        className="markdown-link"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={blockquoteStyle}>{children}</blockquote>
    ),
    ul: ({ children }: any) => <ul style={listStyle}>{children}</ul>,
    ol: ({ children }: any) => <ol style={listStyle}>{children}</ol>,
    li: ({ children }: any) => <li style={listItemStyle}>{children}</li>,
    code: ({ className, children }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      return match ? (
        <CodeBlock language={match[1]} code={String(children).trim()} />
      ) : (
        <code style={codeStyle}>
          {children}
        </code>
      )
    },
    img: ({ src, alt }: any) => (
      <MemoizedImage
        key={typeof src === 'string' ? src : 'image'}
        src={src}
        alt={alt}
        style={imageStyle}
      />
    ),
    table: ({ children }: any) => (
      <div style={{ overflowX: 'auto', margin: `${spacing.md} 0` }}>
        <table style={tableStyle}>{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead>{children}</thead>,
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => <tr>{children}</tr>,
    th: ({ children }: any) => (
      <th style={{ ...tableCellStyle, backgroundColor: colors.card }}>
        {children}
      </th>
    ),
    td: ({ children }: any) => <td style={tableCellStyle}>{children}</td>,
  }), [getHeadingId])

  return (
    <div style={containerStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // rehypeRaw parses embedded raw HTML into the tree; rehypeSanitize MUST
        // run immediately after it to strip <script>/<iframe>/on*=... before the
        // tree is rendered. Heading ids the TOC relies on are assigned by the
        // custom h1-h6 components below (post-sanitize), so the schema's
        // user-content- id clobbering does not affect TOC anchors.
        rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Memoize the entire component to prevent re-renders when parent updates
export default React.memo(PostContentComponent, (prevProps, nextProps) => {
  // Compare content directly
  if (prevProps.content !== nextProps.content) {
    return false
  }

  // Deep compare headings array since it might be a new reference with same content
  const prevHeadings = prevProps.headings
  const nextHeadings = nextProps.headings

  if (prevHeadings.length !== nextHeadings.length) {
    return false
  }

  for (let i = 0; i < prevHeadings.length; i++) {
    const prev = prevHeadings[i]
    const next = nextHeadings[i]

    if (prev.level !== next.level ||
        prev.text !== next.text ||
        prev.id !== next.id) {
      return false
    }
  }

  return true
})
