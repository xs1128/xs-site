export default function LeftSidebar() {
  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 20px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(14px, 2vw, 18px)',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 20px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const linkContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    fontWeight: 400,
    color: '#CCCCCC',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  };

  const categories = [
    { name: 'Technology', count: 12 },
    { name: 'Travel', count: 8 },
    { name: 'Photography', count: 5 },
    { name: 'Coding', count: 15 },
  ];

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Categories</h2>
      <div style={linkContainerStyle}>
        {categories.map((category) => (
          <span
            key={category.name}
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#E5532C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#CCCCCC';
            }}
          >
            {category.name}{' '}
            <span style={{ color: '#666666' }}>({category.count})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
