'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Don't check auth on login page
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        setLoading(false)
      } else {
        // Not authenticated, redirect to login
        router.push('/admin/login')
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setLoading(false)
      } else {
        setUser(null)
        if (!isLoginPage) {
          router.push('/admin/login')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, isLoginPage])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1A1D21',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: "'Hubot Sans', sans-serif"
      }}>
        Loading...
      </div>
    )
  }

  // On login page, just render children without admin layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!user) {
    return null // Will redirect to login
  }

  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#1A1D21',
  }

  const mainStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(16px, 3vh, 32px)',
  }

  return (
    <div style={layoutStyle}>
      <AdminHeader user={user} />
      <main style={mainStyle}>{children}</main>
    </div>
  )
}
