'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPosts, getAllSeries, getAllPictures } from '@/lib/supabase/mutations'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, series: 0, pictures: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const [postsData, seriesData, picturesData] = await Promise.all([
        getAllPosts(),
        getAllSeries(),
        getAllPictures(),
      ])

      setStats({
        posts: postsData.data?.length || 0,
        series: seriesData.data?.length || 0,
        pictures: picturesData.data?.length || 0,
      })
      setLoading(false)
    }

    loadStats()
  }, [])

  const headingStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 'clamp(16px, 3vh, 32px)',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'clamp(16px, 3vh, 24px)',
    marginBottom: 'clamp(32px, 5vh, 48px)',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#2A2F35',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: 'clamp(16px, 3vh, 24px)',
    textDecoration: 'none',
    transition: 'transform 0.2s ease, borderColor 0.2s ease',
    display: 'block',
  }

  const cardTitleStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(14px, 2vw, 16px)',
    fontWeight: 500,
    color: '#CCCCCC',
    marginBottom: 'clamp(8px, 1.5vh, 12px)',
  }

  const cardNumberStyle: React.CSSProperties = {
    fontFamily: 'Hubot Sans, sans-serif',
    fontSize: 'clamp(36px, 5vw, 48px)',
    fontWeight: 700,
    color: '#E5532C',
  }

  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
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

  if (loading) {
    return <div style={{ color: '#999999' }}>Loading...</div>
  }

  return (
    <div>
      <h1 style={headingStyle}>Dashboard</h1>

      <div style={gridStyle}>
        <Link
          href="/admin/posts"
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = '#E5532C'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={cardTitleStyle}>Total Posts</div>
          <div style={cardNumberStyle}>{stats.posts}</div>
        </Link>

        <Link
          href="/admin/series"
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = '#E5532C'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={cardTitleStyle}>Series</div>
          <div style={cardNumberStyle}>{stats.series}</div>
        </Link>

        <Link
          href="/admin/pictures"
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = '#E5532C'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={cardTitleStyle}>Pictures</div>
          <div style={cardNumberStyle}>{stats.pictures}</div>
        </Link>
      </div>

      <div>
        <h2 style={{ ...headingStyle, fontSize: 'clamp(18px, 2.5vw, 24px)' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 'clamp(12px, 2vw, 16px)', flexWrap: 'wrap' }}>
          <Link
            href="/admin/posts/new"
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
            New Post
          </Link>
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
            New Series
          </Link>
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
            Upload Picture
          </Link>
          <Link
            href="/admin/hero"
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
            Update Hero
          </Link>
          <Link
            href="/admin/avatar"
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
            Update Avatar
          </Link>
        </div>
      </div>
    </div>
  )
}
