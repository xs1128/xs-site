'use client'

import { useState, useEffect } from 'react'
import { uploadImage } from '@/lib/supabase/storage'
import { getHeroImageUrl, updateHeroImageUrl } from '@/lib/supabase/settings'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSettings() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [currentHeroUrl, setCurrentHeroUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Load current hero image
  useEffect(() => {
    async function loadHeroImage() {
      const url = await getHeroImageUrl()
      setCurrentHeroUrl(url)
      setLoading(false)
    }
    loadHeroImage()
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setSuccessMessage('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)
    setError('')
    setSuccessMessage('')

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

    // Update hero image URL in site_settings
    const { error: updateError } = await updateHeroImageUrl(url)

    if (updateError) {
      setError('Error updating hero image: ' + updateError.message)
      setUploading(false)
    } else {
      setCurrentHeroUrl(url)
      setPreview('')
      setFile(null)
      setSuccessMessage('Hero image updated successfully!')
      setUploading(false)
      setTimeout(() => setSuccessMessage(''), 3000)
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

  const sectionStyle: React.CSSProperties = {
    marginBottom: 'clamp(32px, 5vh, 48px)',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(16px, 2vw, 20px)',
    fontWeight: 600,
    color: '#CCCCCC',
    marginBottom: 'clamp(12px, 2vh, 16px)',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 600,
    color: '#CCCCCC',
    display: 'block',
    marginBottom: 'clamp(6px, 1vh, 8px)',
  }

  const previewContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
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

  const currentImageStyle: React.CSSProperties = {
    ...previewContainerStyle,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '300px',
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

  const linkStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #CCCCCC',
    color: '#CCCCCC',
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

  const successStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#51CF66',
    marginBottom: 'clamp(12px, 2vh, 16px)',
    padding: 'clamp(8px, 1.5vh, 12px)',
    backgroundColor: 'rgba(81, 207, 102, 0.1)',
    borderRadius: '4px',
  }

  if (loading) {
    return <div style={{ color: '#999999' }}>Loading hero settings...</div>
  }

  return (
    <div>
      <h1 style={headingStyle}>Hero Image Settings</h1>

      {error && <div style={errorStyle}>{error}</div>}
      {successMessage && <div style={successStyle}>{successMessage}</div>}

      <form style={formStyle} onSubmit={handleSubmit}>
        {/* Current Hero Image Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Current Hero Image</h2>
          <div style={currentImageStyle}>
            <Image
              src={currentHeroUrl}
              alt="Current hero image"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 800px) 100vw"
            />
          </div>
        </div>

        {/* Upload New Image Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Upload New Hero Image</h2>

          <div style={{ marginBottom: 'clamp(16px, 3vh, 24px)' }}>
            <label style={labelStyle}>Select Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: '100%', fontSize: 'clamp(12px, 1.8vw, 14px)' }}
              required
            />
            <div style={previewContainerStyle}>
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 800px) 100vw"
                />
              ) : (
                <div style={{ color: '#666666', textAlign: 'center' }}>
                  Image preview will appear here
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              style={buttonStyle}
              disabled={uploading || !file}
              onMouseEnter={(e) => {
                if (!uploading && file) e.currentTarget.style.backgroundColor = '#CC4420'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E5532C'
              }}
            >
              {uploading ? 'Uploading...' : 'Update Hero Image'}
            </button>
            <Link
              href="/admin"
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
              Back to Dashboard
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
