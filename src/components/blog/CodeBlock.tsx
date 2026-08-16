'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FONTS, clamp, spacing } from '@/styles/blog/typography';

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const,
    margin: `${spacing.sm} 0`,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#252526',
    borderBottom: '1px solid #3E3E42',
  };

  const languageStyle: React.CSSProperties = {
    fontFamily: FONTS.body,
    fontSize: clamp.xs,
    color: '#CCCCCC',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    letterSpacing: '0.05em',
  };

  const copyButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: FONTS.body,
    fontSize: clamp.xs,
    color: copied ? '#4EC9B0' : '#CCCCCC',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  };

  const copyIconStyle: React.CSSProperties = {
    width: '14px',
    height: '14px',
  };

  return (
    <div style={containerStyle}>
      {/* Header Bar */}
      <div style={headerStyle}>
        <span style={languageStyle}>{language}</span>
        <button
          style={copyButtonStyle}
          onClick={handleCopy}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.backgroundColor = '#3E3E42';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {copied ? (
            <>
              <svg
                style={copyIconStyle}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                style={copyIconStyle}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighter */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          fontFamily: FONTS.code,
          fontSize: clamp.sm,
          lineHeight: 1.6,
          backgroundColor: '#1E1E1E',
          padding: '16px',
          margin: '0',
          borderRadius: '0 0 8px 8px',
          maxWidth: '100%',
          overflow: 'auto',
        }}
        showLineNumbers
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
