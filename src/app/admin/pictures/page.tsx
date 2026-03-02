'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPictures, deletePicture } from '@/lib/supabase/mutations'
import Image from 'next/image'

export default function PicturesList() {
  const [pictures, setPictures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPictures() {
      const { data, error } = await getAllPictures()
      if (data) {
        setPictures(data)
      }
      setLoading(false)
    }

    loadPictures()
  }, [])

  async function handleDelete(id: number, caption: string) {
    const title = caption || 'this picture'
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    const { error } = await deletePicture(id)
    if (error) {
      alert('Error deleting picture: ' + error.message)
    } else {
      setPictures(pictures.filter(p => p.id !== id))
    }
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 'clamp(16px, 3vh, 24px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'clamp(12px, 2vh, 16px)',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 500,
    color: '#E5532C',
    textDecoration: 'none',
    border: '1px solid #E5532C',
    borderRadius: '4px',
    padding: 'clamp(8px, 1.5vh, 12px) clamp(16px, 2.5vw, 24px)',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 'clamp(16px, 3vh, 24px)',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#2A2F35',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, borderColor 0.2s ease',
  }

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '200px',
    backgroundColor: '#1A1D21',
  }

  const infoStyle: React.CSSProperties = {
    padding: 'clamp(12px, 2vh, 16px)',
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 'clamp(4px, 0.8vh, 8px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  const metaStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(10px, 1.4vw, 12px)',
    fontWeight: 400,
    color: '#999999',
    marginBottom: 'clamp(4px, 0.8vh, 8px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'clamp(8px, 1.5vh, 12px)',
    marginTop: 'clamp(8px, 1.5vh, 12px)',
  }

  const actionLinkStyle: React.CSSProperties = {
    color: '#E5532C',
    textDecoration: 'none',
    fontSize: 'clamp(11px, 1.6vw, 13px)',
    transition: 'color 0.2s ease',
  }

  const deleteLinkStyle: React.CSSProperties = {
    ...actionLinkStyle,
    color: '#FF6B6B',
  }

  if (loading) {
    return <div style={{ color: '#999999' }}>Loading pictures...</div>
  }

  return (
    <div>
      <h1 style={headingStyle}>
        Pictures
        <Link
          href="/admin/pictures/new"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E5532C'
            e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#E5532C'
          }}
        >
          + Upload Picture
        </Link>
      </h1>

      {pictures.length === 0 ? (
        <div style={{ color: '#999999', padding: 'clamp(24px, 4vh, 32px)', textAlign: 'center' }}>
          No pictures yet. <Link href="/admin/pictures/new" style={actionLinkStyle}>Upload your first picture</Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {pictures.map((picture: any) => (
            <div key={picture.id} style={cardStyle}>
              <div style={imageContainerStyle}>
                <Image
                  src={picture.url}
                  alt={picture.caption || 'Picture'}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 250px) 100vw"
                />
              </div>
              <div style={infoStyle}>
                {picture.caption && <div style={titleStyle}>{picture.caption}</div>}
                {picture.location && (
                  <div style={metaStyle}>
                    📍 {picture.location}
                    {picture.date_taken && ` • ${new Date(picture.date_taken).toLocaleDateString()}`}
                  </div>
                )}
                <div style={actionsStyle}>
                  <Link
                    href={`/admin/pictures/${picture.id}/edit`}
                    style={actionLinkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5532C'}
                  >
                    Edit
                  </Link>
                  <a
                    href="#"
                    style={deleteLinkStyle}
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(picture.id, picture.caption)
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF8787'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#FF6B6B'}
                  >
                    Delete
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
