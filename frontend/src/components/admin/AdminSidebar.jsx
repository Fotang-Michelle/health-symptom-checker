import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Stethoscope, Activity,
  BarChart2, Monitor, FileText, Settings, LogOut,
  Shield, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_MAIN = [
  { to: '/admin',             icon: LayoutDashboard, label: 'Dashboard',   end: true },
  { to: '/admin/users',       icon: Users,           label: 'Users' },
  { to: '/admin/diseases',    icon: Stethoscope,     label: 'Diseases' },
  { to: '/admin/predictions', icon: Activity,        label: 'Predictions' },
  { to: '/admin/analytics',   icon: BarChart2,       label: 'Analytics' },
]
const NAV_SYSTEM = [
  { to: '/admin/monitoring', icon: Monitor,   label: 'Monitoring' },
  { to: '/admin/logs',       icon: FileText,  label: 'Logs' },
  { to: '/admin/settings',   icon: Settings,  label: 'Settings' },
]

export default function AdminSidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      <div className={`db-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`db-sidebar ${open ? 'open' : ''}`}
        style={{ borderRight: '1px solid var(--border)' }}>

        <div className="db-sidebar-logo">
          <div className="db-logo-mark"
            style={{ background: 'linear-gradient(135deg,#dc2626,#7c3aed)' }}>
            <Shield size={16} color="#fff" />
          </div>
          <span className="db-logo-name">Admin<span> Panel</span></span>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: 4
          }}>
            <X size={16} />
          </button>
        </div>

        <nav className="db-nav">
          <div className="db-nav-group">
            <p className="db-nav-label">Main Menu</p>
            {NAV_MAIN.map(({ to, icon: Icon, label, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `db-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}>
                <Icon className="db-nav-icon" size={17} />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="db-nav-group">
            <p className="db-nav-label">System</p>
            {NAV_SYSTEM.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `db-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}>
                <Icon className="db-nav-icon" size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="db-sidebar-footer">
          <div style={{
            padding: '6px 12px', marginBottom: 6,
            background: 'var(--red-light)', borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Shield size={12} color="var(--red)" />
            <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 700 }}>
              ADMIN ACCESS
            </span>
          </div>
          <div className="db-sidebar-user" onClick={handleLogout}>
            <div className="db-sidebar-avatar"
              style={{ background: 'linear-gradient(135deg,#dc2626,#7c3aed)' }}>
              {initials}
            </div>
            <div>
              <div className="db-sidebar-uname">{user?.name || 'Admin'}</div>
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