import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminNavbar  from './AdminNavbar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="db-shell">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="db-main" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(v => !v)}
        />
        <main className="db-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}