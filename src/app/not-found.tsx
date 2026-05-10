import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
        Page not found
      </p>
      <Link
        href="/"
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          background: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
