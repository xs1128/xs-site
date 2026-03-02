'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPictureById, updatePicture, deletePicture } from '@/lib/supabase/mutations'
import Image from 'next/image'

export default function EditPicture({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const pictureId = parseInt(id)
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [dateTaken, setDateTaken] = useState('')
  const [order, setOrder] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadPicture() {
      const { data, error } = await getPictureById(pictureId)

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setUrl(data.url || '')
      setCaption(data.caption || '')
      setLocation(data.location || '')
      setDateTaken(data.date_taken || '')
      setOrder(data.order_column?.toString() || '')
      setLoading(false)
    }

    loadPicture()
  }, [pictureId])

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this picture?')) {
      return
    }

    const { error } = await deletePicture(pictureId)
    if (error) {
      setError('Error deleting picture: ' + error.message)
    } else {
      router.push('/admin/pictures')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { data, error } = await updatePicture(pictureId, {
      url,
      caption: caption || null,
      location: location || null,
      date_taken: dateTaken || null,
      order_column: order ? parseInt(order) : null,
    })

    if (error) {
      setError('Error updating picture: ' + error.message)
      setSaving(false)
    } else {
      router.push('/admin/pictures')
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

  const previewContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
    backgroundColor: '#1A1D21',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    marginBottom: 'clamp(12px, 2vh, 16px)',
    overflow: 'hidden',
    position: 'relative',
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
        <h1 style={headingStyle}>Picture Not Found</h1>
        <p style={{ color: '#999999', marginBottom: 'clamp(16px, 3vh, 24px)' }}>
          The requested picture could not be found.
        </p>
        <Link href="/admin/pictures" style={linkStyle}>
          Back to Pictures
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 style={headingStyle}>Edit Picture</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <form style={formStyle} onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Image URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
            readOnly
          />
          <div style={previewContainerStyle}>
            <Image src={url} alt="Preview" fill style={{ objectFit: 'contain' }} sizes="(max-width: 600px) 100vw" />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={inputStyle}
            placeholder="Image caption or title"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="Where was this taken?"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Date Taken</label>
          <input
            type="date"
            value={dateTaken}
            onChange={(e) => setDateTaken(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Display Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            style={inputStyle}
            placeholder="Number for ordering"
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
            style={deleteButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF8787'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B6B'
            }}
          >
            Delete
          </button>
          <Link
            href="/admin/pictures"
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
