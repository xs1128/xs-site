'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllSeries, deleteSeries } from '@/lib/supabase/mutations'

export default function SeriesList() {
  const [series, setSeries] = useState<Array<{
    id: number
    slug: string
    title: string
    description: string | null
    created_at: string
    updated_at: string
    posts?: any[]
  }>>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSeries() {
      const { data, error } = await getAllSeries()
      if (error) {
        setError('Failed to load series: ' + error.message)
      } else if (data) {
        setSeries(data)
      }
      setLoading(false)
    }

    loadSeries()
  }, [])

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    setDeletingId(id)
    const { error } = await deleteSeries(id)
    setDeletingId(null)

    if (error) {
      alert('Error deleting series: ' + error.message)
    } else {
      setSeries(prevSeries => prevSeries?.filter(s => s.id !== id) || [])
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 'clamp(16px, 3vh, 24px)',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#2A2F35',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: 'clamp(16px, 3vh, 24px)',
    textDecoration: 'none',
    transition: 'transform 0.2s ease, borderColor 0.2s ease',
  }

  const cardTitleStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(16px, 2.2vw, 20px)',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 'clamp(8px, 1.5vh, 12px)',
  }

  const cardDescStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#CCCCCC',
    marginBottom: 'clamp(12px, 2vh, 16px)',
    lineHeight: 1.4,
  }

  const cardMetaStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(11px, 1.6vw, 13px)',
    fontWeight: 500,
    color: '#999999',
    marginBottom: 'clamp(12px, 2vh, 16px)',
  }

  const actionLinkStyle: React.CSSProperties = {
    color: '#E5532C',
    textDecoration: 'none',
    fontSize: 'clamp(11px, 1.6vw, 13px)',
    marginRight: 'clamp(12px, 2vh, 16px)',
    transition: 'color 0.2s ease',
  }

  const deleteLinkStyle: React.CSSProperties = {
    ...actionLinkStyle,
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

  if (loading) {
    return <div style={{ color: '#999999' }}>Loading series...</div>
  }

  return (
    <div>
      <h1 style={headingStyle}>
        Series
        <Link
          href="/admin/series/new"
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
          + New Series
        </Link>
      </h1>

      {error && <div style={errorStyle}>{error}</div>}

      {!series || series.length === 0 ? (
        <div style={{ color: '#999999', padding: 'clamp(24px, 4vh, 32px)', textAlign: 'center' }}>
          No series yet. <Link href="/admin/series/new" style={actionLinkStyle}>Create your first series</Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {series.map((s: any) => (
            <div key={s.id} style={cardStyle}>
              <h3 style={cardTitleStyle}>{s.title}</h3>
              {s.description && <p style={cardDescStyle}>{s.description}</p>}
              <div>
                <Link
                  href={`/admin/series/${s.id}/edit`}
                  style={actionLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#E5532C'}
                >
                  Edit
                </Link>
                <a
                  href="#"
                  style={{ ...deleteLinkStyle, opacity: deletingId === s.id ? 0.5 : 1, pointerEvents: deletingId === s.id ? 'none' : 'auto' }}
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete(s.id, s.title)
                  }}
                  onMouseEnter={(e) => {
                    if (deletingId !== s.id) e.currentTarget.style.color = '#FF8787'
                  }}
                  onMouseLeave={(e) => {
                    if (deletingId !== s.id) e.currentTarget.style.color = '#FF6B6B'
                  }}
                >
                  {deletingId === s.id ? 'Deleting...' : 'Delete'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
