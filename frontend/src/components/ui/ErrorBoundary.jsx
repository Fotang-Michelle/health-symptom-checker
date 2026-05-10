import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', info.componentStack)
    this.setState({ info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh',
          padding: '40px 20px', textAlign: 'center',
          fontFamily: 'var(--font, sans-serif)'
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'var(--red-light, #fef2f2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, marginBottom: 20
          }}>
            ⚠
          </div>
          <h2 style={{
            fontSize: 20, fontWeight: 700, marginBottom: 8,
            color: 'var(--text, #0d1226)'
          }}>
            Something went wrong
          </h2>
          <p style={{
            fontSize: 14, color: 'var(--text2, #5a6385)',
            maxWidth: 400, marginBottom: 24, lineHeight: 1.6
          }}>
            An unexpected error occurred in this section.
            The rest of the app is still working.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <details style={{
              maxWidth: 600, width: '100%', textAlign: 'left',
              background: 'var(--bg3, #f7f9ff)',
              border: '1px solid var(--border, #e2e8f8)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20
            }}>
              <summary style={{
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                color: 'var(--red, #dc2626)'
              }}>
                Error details (dev only)
              </summary>
              <pre style={{
                fontSize: 12, marginTop: 10, overflow: 'auto',
                color: 'var(--text2, #5a6385)', lineHeight: 1.5
              }}>
                {this.state.error.toString()}
                {this.state.info?.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null, info: null })}
            style={{
              padding: '10px 24px', background: 'var(--blue, #2563eb)',
              color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}