'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPicture } from '@/lib/supabase/mutations'
import { uploadImage } from '@/lib/supabase/storage'
import Image from 'next/image'

export default function NewPicture() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [dateTaken, setDateTaken] = useState('')
  const [order, setOrder] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setUploading(true)
    setError('')

    if (!file) {
      setError('Please select an image to upload')
      setUploading(false)
      return
    }

    // Upload image to Supabase Storage
    const { url, error: uploadError } = await uploadImage(file)

    if (uploadError || !url) {
      setError('Error uploading image: ' + (uploadError?.message || 'Unknown error'))
      setUploading(false)
      return
    }

    // Create picture record
    const { data, error } = await createPicture({
      url,
      caption: caption || null,
      location: location || null,
      date_taken: dateTaken || null,
      order_column: order ? parseInt(order) : null,
    })

    if (error) {
      setError('Error creating picture: ' + error.message)
      setUploading(false)
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

  const fileInputStyle: React.CSSProperties = {
    width: '100%',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
  }

  const previewContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
    backgroundColor: '#1A1D21',
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'clamp(12px, 2vh, 16px)',
    overflow: 'hidden',
    position: 'relative',
  }

  const previewPlaceholderStyle: React.CSSProperties = {
    color: '#666666',
    textAlign: 'center',
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
      <h1 style={headingStyle}>Upload Picture</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <form style={formStyle} onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={fileInputStyle}
            required
          />
          <div style={previewContainerStyle}>
            {preview ? (
              <Image src={preview} alt="Preview" fill style={{ objectFit: 'contain' }} sizes="(max-width: 600px) 100vw" />
            ) : (
              <div style={previewPlaceholderStyle}>
                Image preview will appear here
              </div>
            )}
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
            placeholder="Optional: number for ordering"
          />
        </div>

        <div>
          <button
            type="submit"
            style={buttonStyle}
            disabled={uploading}
            onMouseEnter={(e) => {
              if (!uploading) e.currentTarget.style.backgroundColor = '#CC4420'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E5532C'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Picture'}
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
