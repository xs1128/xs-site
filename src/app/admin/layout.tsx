import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      <AdminHeader />
      <main style={mainStyle}>{children}</main>
    </div>
  )
}
