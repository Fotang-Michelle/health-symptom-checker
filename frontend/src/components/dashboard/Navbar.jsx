import { useState } from 'react'
import { Search, Bell, Sun, Moon, Menu, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onToggleSidebar, darkMode, onToggleDark }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [drop, setDrop] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase()

  return (
    <header className="db-navbar">
      <button className="db-hamburger" onClick={onToggleSidebar}>
        <Menu size={19} />
      </button>

      <div className="db-search-wrap">
        <Search size={14} color="var(--text3)" />
        <input placeholder="Search symptoms, conditions..." />
      </div>

      <div className="db-nav-actions">
        <button className="db-icon-btn" onClick={onToggleDark}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="db-icon-btn">
          <Bell size={16} />
          <span className="db-notif-dot" />
        </button>

        <div
          className="db-nav-user"
          onClick={() => setDrop(v => !v)}
          style={{ position: 'relative' }}
        >
          <div className="db-nav-avatar">{initials}</div>
          <span className="db-nav-uname"
            style={{ maxWidth:100, overflow:'hidden',
              textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user?.name || user?.email || 'User'}
          </span>
          <ChevronDown size={13} color="var(--text3)" />

          {drop && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position:'absolute', top:'110%', right:0, minWidth:170,
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'var(--r-sm)', boxShadow:'var(--shadow-lg)',
                padding:6, zIndex:100
              }}
            >
              <div style={{ padding:'8px 12px', fontSize:12,
                color:'var(--text3)', borderBottom:'1px solid var(--border)',
                marginBottom:4 }}>
                {user?.email}
              </div>
              {[
                { label:'Profile',  path:'/dashboard/profile' },
                { label:'Settings', path:'/dashboard/settings' },
              ].map(item => (
                <div key={item.path}
                  onClick={() => { navigate(item.path); setDrop(false) }}
                  style={{ padding:'8px 12px', fontSize:13,
                    color:'var(--text2)', borderRadius:6, cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {item.label}
                </div>
              ))}
              <div style={{ borderTop:'1px solid var(--border)',
                marginTop:4, paddingTop:4 }}>
                <div
                  onClick={() => { logout(); navigate('/login') }}
                  style={{ padding:'8px 12px', fontSize:13,
                    color:'var(--red)', borderRadius:6, cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--red-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
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