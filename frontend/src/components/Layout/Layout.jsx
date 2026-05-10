import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Layout.module.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>SymptomCheck</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Check
          </NavLink>
          <NavLink to="/history" className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            History
          </NavLink>
        </nav>
        <div className={styles.user}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}