import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'

export default function DashboardLayout() {
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
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="db-main" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <Navbar
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