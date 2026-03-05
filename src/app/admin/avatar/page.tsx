'use client'

import { useState, useEffect } from 'react'
import { uploadImage } from '@/lib/supabase/storage'
import { getAvatarUrl, updateAvatarUrl } from '@/lib/supabase/settings'
import Image from 'next/image'
import Link from 'next/link'

export default function AvatarSettings() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Load current avatar
  useEffect(() => {
    async function loadAvatar() {
      const url = await getAvatarUrl()
      setCurrentAvatarUrl(url || '')
      setLoading(false)
    }
    loadAvatar()
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

    // Update avatar URL in site_settings
    const { error: updateError } = await updateAvatarUrl(url)

    if (updateError) {
      setError('Error updating avatar: ' + updateError.message)
      setUploading(false)
    } else {
      setCurrentAvatarUrl(url)
      setPreview('')
      setFile(null)
      setSuccessMessage('Avatar updated successfully!')
      setUploading(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  async function handleRemoveAvatar() {
    if (!confirm('Are you sure you want to remove your avatar? The default fallback image will be used instead.')) {
      return
    }

    setUploading(true)
    setError('')
    setSuccessMessage('')

    // Set avatar URL to null to use fallback
    const { error: updateError } = await updateAvatarUrl('')

    if (updateError) {
      setError('Error removing avatar: ' + updateError.message)
      setUploading(false)
    } else {
      setCurrentAvatarUrl('')
      setSuccessMessage('Avatar removed. Using fallback image.')
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
    width: '200px',
    height: '200px',
    backgroundColor: '#1A1D21',
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
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

  const removeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #FF6B6B',
    color: '#FF6B6B',
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
    return <div style={{ color: '#999999' }}>Loading avatar settings...</div>
  }

  return (
    <div>
      <h1 style={headingStyle}>Avatar Settings</h1>

      {error && <div style={errorStyle}>{error}</div>}
      {successMessage && <div style={successStyle}>{successMessage}</div>}

      <form style={formStyle} onSubmit={handleSubmit}>
        {/* Current Avatar Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Current Avatar</h2>
          <div style={currentImageStyle}>
            {currentAvatarUrl ? (
              <Image
                src={currentAvatarUrl}
                alt="Current avatar"
                fill
                style={{ objectFit: 'cover' }}
                sizes="200px"
              />
            ) : (
              <div style={{ color: '#666666', textAlign: 'center', padding: '20px' }}>
                No avatar set
              </div>
            )}
          </div>
        </div>

        {/* Upload New Avatar Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Upload New Avatar</h2>

          <div style={{ marginBottom: 'clamp(16px, 3vh, 24px)' }}>
            <label style={labelStyle}>Select Image (Recommended: Square image, 200x200px or larger) *</label>
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
                  style={{ objectFit: 'cover' }}
                  sizes="200px"
                />
              ) : (
                <div style={{ color: '#666666', textAlign: 'center', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
                  Preview
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
              {uploading ? 'Uploading...' : 'Update Avatar'}
            </button>
            {currentAvatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                style={removeButtonStyle}
                disabled={uploading}
                onMouseEnter={(e) => {
                  if (!uploading) e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Remove Avatar
              </button>
            )}
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
