'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Error logging in: ' + error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#1A1D21',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(16px, 3vh, 32px)',
  }

  const formStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#2A2F35',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: 'clamp(32px, 5vh, 48px)',
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 'clamp(24px, 4vh, 32px)',
    textAlign: 'center',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 600,
    color: '#CCCCCC',
    display: 'block',
    marginBottom: 'clamp(6px, 1vh, 8px)',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#FFFFFF',
    backgroundColor: '#363D44',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    padding: 'clamp(10px, 1.5vh, 14px)',
    marginBottom: 'clamp(16px, 3vh, 24px)',
    boxSizing: 'border-box' as const,
  }

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(14px, 2vw, 16px)',
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: '#E5532C',
    border: 'none',
    borderRadius: '4px',
    padding: 'clamp(12px, 2vh, 16px)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  }

  const errorStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    fontWeight: 400,
    color: '#FF6B6B',
    marginBottom: 'clamp(16px, 3vh, 24px)',
    padding: 'clamp(8px, 1.5vh, 12px)',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '4px',
    textAlign: 'center',
  }

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1 style={headingStyle}>Admin Login</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="admin@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="Your password"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#CC4420'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E5532C'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
