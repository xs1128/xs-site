'use client'

import { useEffect, useState, FormEvent, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPostById, updatePost, deletePost, getAllSeries, savePostSeries, getSeriesForPost } from '@/lib/supabase/mutations'
import SeriesMultiSelect from '@/components/admin/SeriesMultiSelect'

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const postId = parseInt(id)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  const [availableSeries, setAvailableSeries] = useState<Array<{
    id: number
    title: string
    slug: string
  }>>([])
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<number[]>([])

  useEffect(() => {
    async function loadData() {
      // Validate ID
      if (isNaN(postId)) {
        console.error('Invalid post ID:', id, 'Parsed as:', postId)
        setNotFound(true)
        setLoading(false)
        return
      }

      console.log('Fetching post with ID:', postId)
      const { data, error } = await getPostById(postId)

      if (error) {
        console.error('Error fetching post:', error)
        setError('Error loading post: ' + error.message)
        setNotFound(true)
        setLoading(false)
        return
      }

      if (!data) {
        console.error('No data returned for post ID:', postId)
        setNotFound(true)
        setLoading(false)
        return
      }

      console.log('Post loaded successfully:', data)
      setTitle(data.title || '')
      setSlug(data.slug || '')
      setExcerpt(data.excerpt || '')
      setContent(data.content || '')
      setPublish(!!data.published_at)

      // Load all available series
      const { data: allSeries } = await getAllSeries()
      if (allSeries) setAvailableSeries(allSeries)

      // Load post's existing series relationships
      const { data: postSeries } = await getSeriesForPost(postId)
      if (postSeries) {
        const seriesIds = postSeries.map(s => s.series_id)
        setSelectedSeriesIds(seriesIds)
      }

      setLoading(false)
    }

    loadData()
  }, [postId])

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

    // Update post
    const { error: postError } = await updatePost(postId, {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      published_at: publish ? new Date().toISOString() : null,
    })

    if (postError) {
      setError('Error updating post: ' + postError.message)
      setSaving(false)
      return
    }

    // Update series relationships
    const { error: seriesError } = await savePostSeries(
      postId,
      selectedSeriesIds
    )

    if (seriesError) {
      setError('Post updated but failed to update series: ' + seriesError.message)
      setSaving(false)
      return
    }

    router.push('/admin/posts')
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    setDeleting(true)
    const { error } = await deletePost(postId)
    setDeleting(false)

    if (error) {
      setError('Error deleting post: ' + error.message)
    } else {
      router.push('/admin/posts')
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
    maxWidth: '800px',
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
    minHeight: '150px',
    resize: 'vertical',
    fontFamily: 'monospace',
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
        <h1 style={headingStyle}>Post Not Found</h1>
        <p style={{ color: '#999999', marginBottom: 'clamp(16px, 3vh, 24px)' }}>
          The requested post could not be found.
        </p>
        <Link href="/admin/posts" style={linkStyle}>
          Back to Posts
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 style={headingStyle}>Edit Post</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <form style={formStyle} onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            style={inputStyle}
            placeholder="Post title"
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
          <label style={labelStyle}>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            style={inputStyle}
            placeholder="Short summary..."
            rows={3}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={textareaStyle}
            placeholder="Write your post content in Markdown..."
          />
        </div>

        <div style={formGroupStyle}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              style={{ width: 'auto', margin: 0 }}
            />
            Published (uncheck to make draft)
          </label>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Series</label>
          <SeriesMultiSelect
            availableSeries={availableSeries}
            selectedSeriesIds={selectedSeriesIds}
            onChange={setSelectedSeriesIds}
            disabled={saving}
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
            href="/admin/posts"
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
