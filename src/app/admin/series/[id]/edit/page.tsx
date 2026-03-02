'use client'

import { useEffect, useState, FormEvent, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSeriesById, updateSeries, deleteSeries } from '@/lib/supabase/mutations'

export default function EditSeries({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const seriesId = parseInt(id)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadSeries() {
      // Validate ID before database call
      if (isNaN(seriesId)) {
        console.error('Invalid series ID:', id, 'Parsed as:', seriesId)
        setNotFound(true)
        setLoading(false)
        return
      }

      console.log('Fetching series with ID:', seriesId)
      const { data, error } = await getSeriesById(seriesId)

      if (error) {
        console.error('Error fetching series:', error)
        setError('Error loading series: ' + error.message)
        setNotFound(true)
        setLoading(false)
        return
      }

      if (!data) {
        console.error('No data returned for series ID:', seriesId)
        setNotFound(true)
        setLoading(false)
        return
      }

      console.log('Series loaded successfully:', data)
      setTitle(data.title || '')
      setSlug(data.slug || '')
      setDescription(data.description || '')
      setLoading(false)
    }

    loadSeries()
  }, [seriesId])

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
    setSaving(true)
    setError('')

    if (!title || !slug) {
      setError('Title and slug are required')
      setSaving(false)
      return
    }

    const { data, error } = await updateSeries(seriesId, {
      title,
      slug,
      description: description || null,
    })

    if (error) {
      setError('Error updating series: ' + error.message)
      setSaving(false)
    } else {
      router.push('/admin/series')
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this series?')) {
      return
    }

    setDeleting(true)
    const { error } = await deleteSeries(seriesId)
    setDeleting(false)

    if (error) {
      setError('Error deleting series: ' + error.message)
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
    marginRight: 'clamp(8px, 1.5vh, 12px)',
  }

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #CCCCCC',
    color: '#CCCCCC',
  }

  const deleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#FF6B6B',
    border: 'none',
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

  if (loading) {
    return <div style={{ color: '#999999' }}>Loading...</div>
  }

  if (notFound) {
    return (
      <div>
        <h1 style={headingStyle}>Series Not Found</h1>
        <p style={{ color: '#999999', marginBottom: 'clamp(16px, 3vh, 24px)' }}>
          The requested series could not be found.
        </p>
        <Link href="/admin/series" style={linkStyle}>
          Back to Series
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 style={headingStyle}>Edit Series</h1>

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
            disabled={saving}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = '#CC4420'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E5532C'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={deleteButtonStyle}
            onMouseEnter={(e) => {
              if (!deleting) e.currentTarget.style.backgroundColor = '#FF8787'
            }}
            onMouseLeave={(e) => {
              if (!deleting) e.currentTarget.style.backgroundColor = '#FF6B6B'
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
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
