'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPosts, deletePost } from '@/lib/supabase/mutations'

export default function PostsList() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPosts() {
      const { data, error } = await getAllPosts()
      if (error) {
        setError('Failed to load posts: ' + error.message)
      } else if (data) {
        setPosts(data)
      }
      setLoading(false)
    }

    loadPosts()
  }, [])

  // Safe date formatter that won't crash on invalid dates
  function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    setDeletingId(id)
    const { error } = await deletePost(id)
    setDeletingId(null)

    if (error) {
      alert('Error deleting post: ' + error.message)
    } else {
      setPosts(prevPosts => prevPosts?.filter(p => p.id !== id) || [])
    }
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
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
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 500,
    color: '#E5532C',
    textDecoration: 'none',
    border: '1px solid #E5532C',
    borderRadius: '4px',
    padding: 'clamp(8px, 1.5vh, 12px) clamp(16px, 2.5vw, 24px)',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#2A2F35',
    borderRadius: '8px',
    overflow: 'hidden',
  }

  const thStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 600,
    color: '#CCCCCC',
    textAlign: 'left',
    padding: 'clamp(12px, 2vh, 16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  }

  const tdStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#FFFFFF',
    padding: 'clamp(12px, 2vh, 16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  }

  const actionLinkStyle: React.CSSProperties = {
    color: '#E5532C',
    textDecoration: 'none',
    marginRight: 'clamp(8px, 1.5vh, 12px)',
    fontSize: 'clamp(11px, 1.6vw, 13px)',
    transition: 'color 0.2s ease',
  }

  const deleteLinkStyle: React.CSSProperties = {
    ...actionLinkStyle,
    color: '#FF6B6B',
  }

  const errorStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#FF6B6B',
    marginBottom: 'clamp(12px, 2vh, 16px)',
    padding: 'clamp(8px, 1.5vh, 12px)',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '4px',
  }

  if (loading) {
    return <div style={{ color: '#999999' }}>Loading posts...</div>
  }

  return (
    <div>
      <h1 style={headingStyle}>
        Posts
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
          + New Post
        </Link>
      </h1>

      {error && <div style={errorStyle}>{error}</div>}

      {!posts || posts.length === 0 ? (
        <div style={{ color: '#999999', padding: 'clamp(24px, 4vh, 32px)', textAlign: 'center' }}>
          No posts yet. <Link href="/admin/posts/new" style={actionLinkStyle}>Create your first post</Link>
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map(post => (
              <tr key={post.id}>
                <td style={tdStyle}>{post.title}</td>
                <td style={tdStyle}>
                  {post.published_at ? (
                    <span style={{ color: '#4ADE80' }}>Published</span>
                  ) : (
                    <span style={{ color: '#999999' }}>Draft</span>
                  )}
                </td>
                <td style={tdStyle}>
                  {formatDate(post.created_at)}
                </td>
                <td style={tdStyle}>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    style={actionLinkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5532C'}
                  >
                    Edit
                  </Link>
                  <a
                    href="#"
                    style={{ ...deleteLinkStyle, opacity: deletingId === post.id ? 0.5 : 1, pointerEvents: deletingId === post.id ? 'none' : 'auto' }}
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(post.id, post.title)
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== post.id) e.currentTarget.style.color = '#FF8787'
                    }}
                    onMouseLeave={(e) => {
                      if (deletingId !== post.id) e.currentTarget.style.color = '#FF6B6B'
                    }}
                  >
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
