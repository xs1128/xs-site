'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSeries } from '@/lib/supabase/mutations'

export default function NewSeries() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Improved slug generation with validation
  function generateSlug(title: string): string {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (!slug) {
      throw new Error('Please enter a valid title with at least one letter')
    }

    return slug
  }

  // Auto-generate slug from title
  function handleTitleChange(value: string) {
    setTitle(value)
    try {
      const generatedSlug = generateSlug(value)
      setSlug(generatedSlug)
      setError('') // Clear any previous error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid title')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title || !slug) {
      setError('Title and slug are required')
      setLoading(false)
      return
    }

    const { data, error } = await createSeries({
      title,
      slug,
      description: description || null,
    })

    if (error) {
      setError('Error creating series: ' + error.message)
      setLoading(false)
    } else {
      router.push('/admin/series')
    }
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 'clamp(16px, 3vh, 24px)',
  }

  const formStyle: React.CSSProperties = {
    maxWidth: '600px',
  }

  const formGroupStyle: React.CSSProperties = {
    marginBottom: 'clamp(16px, 3vh, 24px)',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 600,
    color: '#CCCCCC',
    display: 'block',
    marginBottom: 'clamp(6px, 1vh, 8px)',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#FFFFFF',
    backgroundColor: '#2A2F35',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    padding: 'clamp(8px, 1.5vh, 12px)',
    boxSizing: 'border-box' as const,
  }

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
  }

  const buttonStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: '#E5532C',
    border: 'none',
    borderRadius: '4px',
    padding: 'clamp(10px, 1.5vh, 14px) clamp(20px, 3vw, 28px)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginRight: 'clamp(8px, 1.5vh, 12px)',
  }

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #CCCCCC',
    color: '#CCCCCC',
  }

  const linkStyle: React.CSSProperties = {
    ...secondaryButtonStyle,
    textDecoration: 'none',
    display: 'inline-block',
  }

  const errorStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#FF6B6B',
    marginBottom: 'clamp(12px, 2vh, 16px)',
    padding: 'clamp(8px, 1.5vh, 12px)',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '4px',
  }

  return (
    <div>
      <h1 style={headingStyle}>New Series</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <form style={formStyle} onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            style={inputStyle}
            placeholder="Series title"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={inputStyle}
            placeholder="url-friendly-slug"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={textareaStyle}
            placeholder="Series description..."
            rows={4}
          />
        </div>

        <div>
          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#CC4420'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E5532C'
            }}
          >
            {loading ? 'Saving...' : 'Create Series'}
          </button>
          <Link
            href="/admin/series"
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = '#FFFFFF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#CCCCCC'
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
