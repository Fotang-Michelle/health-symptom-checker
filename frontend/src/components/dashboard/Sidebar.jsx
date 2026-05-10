import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Activity, ClipboardList,
  Lightbulb, User, Settings, LogOut, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_MAIN = [
  { to: '/dashboard',                 icon: LayoutDashboard, label: 'Dashboard',       end: true },
  { to: '/dashboard/symptoms',        icon: Activity,        label: 'Check Symptoms' },
  { to: '/dashboard/history',         icon: ClipboardList,   label: 'History' },
  { to: '/dashboard/recommendations', icon: Lightbulb,       label: 'Recommendations' },
]
const NAV_ACCOUNT = [
  { to: '/dashboard/profile',  icon: User,     label: 'Profile' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      <div className={`db-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`db-sidebar ${open ? 'open' : ''}`}>

        <div className="db-sidebar-logo">
          <div className="db-logo-mark">SC</div>
          <span className="db-logo-name">Symptom<span>Check</span></span>
          <button
            onClick={onClose}
            style={{ marginLeft:'auto', background:'none', border:'none',
              cursor:'pointer', color:'var(--text3)', display:'flex', padding:4 }}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="db-nav">
          <div className="db-nav-group">
            <p className="db-nav-label">Main Menu</p>
            {NAV_MAIN.map(({ to, icon: Icon, label, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `db-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="db-nav-icon" size={17} />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="db-nav-group">
            <p className="db-nav-label">Account</p>
            {NAV_ACCOUNT.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `db-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="db-nav-icon" size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-sidebar-user" onClick={handleLogout}>
            <div className="db-sidebar-avatar">{initials}</div>
            <div>
              <div className="db-sidebar-uname">{user?.name || 'User'}</div>
              <div className="db-sidebar-urole">
                <LogOut size={10} /> Sign out
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}