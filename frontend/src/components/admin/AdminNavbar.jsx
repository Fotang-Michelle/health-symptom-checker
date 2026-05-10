import { useState } from 'react'
import { Search, Bell, Sun, Moon, Menu, ChevronDown, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminNavbar({ onToggleSidebar, darkMode, onToggleDark }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [drop, setDrop] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <header className="db-navbar">
      <button className="db-hamburger" onClick={onToggleSidebar}>
        <Menu size={19} />
      </button>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 10px', background: 'var(--red-light)',
        border: '1px solid #fca5a5', borderRadius: 'var(--r-sm)'
      }}>
        <Shield size={13} color="var(--red)" />
        <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 700 }}>
          Admin Mode
        </span>
      </div>

      <div className="db-search-wrap">
        <Search size={14} color="var(--text3)" />
        <input placeholder="Search users, diseases, logs..." />
      </div>

      <div className="db-nav-actions">
        <button className="db-icon-btn" onClick={onToggleDark}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="db-icon-btn">
          <Bell size={16} />
          <span className="db-notif-dot" />
        </button>
        <div className="db-nav-user"
          onClick={() => setDrop(v => !v)}
          style={{ position: 'relative' }}>
          <div className="db-nav-avatar"
            style={{ background: 'linear-gradient(135deg,#dc2626,#7c3aed)' }}>
            {initials}
          </div>
          <span className="db-nav-uname"
            style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Admin'}
          </span>
          <ChevronDown size={13} color="var(--text3)" />

          {drop && (
            <div onClick={e => e.stopPropagation()} style={{
              position: 'absolute', top: '110%', right: 0, minWidth: 170,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', boxShadow: 'var(--shadow-lg)',
              padding: 6, zIndex: 100
            }}>
              <div style={{
                padding: '8px 12px', fontSize: 12, color: 'var(--text3)',
                borderBottom: '1px solid var(--border)', marginBottom: 4
              }}>
                {user?.email}
              </div>
              <div onClick={() => { navigate('/dashboard'); setDrop(false) }}
                style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text2)', borderRadius: 6, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                User Dashboard
              </div>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                <div onClick={() => { logout(); navigate('/login') }}
                  style={{ padding: '8px 12px', fontSize: 13, color: 'var(--red)', borderRadius: 6, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--red-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Sign out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}