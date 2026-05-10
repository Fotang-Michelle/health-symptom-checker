import { AlertCircle, X, RefreshCw } from 'lucide-react'

export default function ErrorMessage({ message, onDismiss, onRetry }) {
  if (!message) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 16px',
      background: 'var(--red-light)', border: '1px solid #fca5a5',
      borderRadius: 'var(--r-sm, 9px)', marginBottom: 16
    }}>
      <AlertCircle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ flex: 1, fontSize: 14, color: 'var(--red)', lineHeight: 1.5 }}>
        {message}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--red)', padding: 2
            }}
            title="Retry"
          >
            <RefreshCw size={14} />
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--red)', padding: 2
            }}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}