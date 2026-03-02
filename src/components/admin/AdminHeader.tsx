import Link from 'next/link'

export default function AdminHeader() {
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

  const activeLinkStyle: React.CSSProperties = {
    ...linkStyle,
    color: '#E5532C',
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
          <a href="/" style={linkStyle}>View Site →</a>
        </nav>
      </div>
    </header>
  )
}
