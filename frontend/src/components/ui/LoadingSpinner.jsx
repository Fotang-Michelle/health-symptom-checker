export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const dim = size === 'sm' ? 20 : size === 'lg' ? 48 : 32

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: size === 'lg' ? '60px 20px' : '20px',
      gap: 12
    }}>
      <div style={{
        width: dim, height: dim, borderRadius: '50%',
        border: `3px solid var(--border)`,
        borderTopColor: 'var(--blue)',
        animation: 'spin 0.7s linear infinite'
      }} />
      {message && (
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>
          {message}
        </span>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}