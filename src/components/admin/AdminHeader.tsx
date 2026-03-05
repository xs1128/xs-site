'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function AdminHeader({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#2A2F35',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: 'clamp(12px, 2vh, 20px)',
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'clamp(8px, 1vh, 16px)',
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  }

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'clamp(12px, 2vw, 24px)',
    flexWrap: 'wrap',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 16px)',
    fontWeight: 500,
    color: '#CCCCCC',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  }

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Blog CMS</h1>
        <nav style={navStyle}>
          <Link href="/admin" style={linkStyle}>Dashboard</Link>
          <Link href="/admin/posts" style={linkStyle}>Posts</Link>
          <Link href="/admin/series" style={linkStyle}>Series</Link>
          <Link href="/admin/pictures" style={linkStyle}>Pictures</Link>
          <Link href="/admin/avatar" style={linkStyle}>Avatar</Link>
          <Link href="/admin/hero" style={linkStyle}>Hero</Link>
          <a href="/" style={linkStyle}>View Site →</a>
        </nav>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(12px, 2vw, 20px)',
        }}>
          <span style={{
            fontFamily: "'Hubot Sans', sans-serif",
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            color: '#CCCCCC',
          }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              fontFamily: "'Hubot Sans', sans-serif",
              fontSize: 'clamp(12px, 1.5vw, 14px)',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: '#E5532C',
              border: 'none',
              borderRadius: '4px',
              padding: 'clamp(6px, 1vh, 10px) clamp(12px, 1.5vw, 20px)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#CC4420'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E5532C'
            }}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}
