import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login    from './pages/Login'
import Register from './pages/Register'

import DashboardLayout from './components/dashboard/DashboardLayout'
import UserDashboard   from './pages/user/UserDashboard'
import CheckSymptoms   from './pages/user/CheckSymptoms'
import HistoryPage     from './pages/user/HistoryPage'
import Recommendations from './pages/user/Recommendations'
import Profile         from './pages/user/Profile'
import SettingsPage    from './pages/user/SettingsPage'

import AdminLayout    from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Users          from './pages/admin/Users'
import Diseases       from './pages/admin/Diseases'
import Predictions    from './pages/admin/Predictions'
import Analytics      from './pages/admin/Analytics'
import Monitoring     from './pages/admin/Monitoring'
import Logs           from './pages/admin/Logs'
import AdminSettings  from './pages/admin/AdminSettings'

import './dashboard.css'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User dashboard */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index                  element={<UserDashboard />} />
        <Route path="symptoms"        element={<CheckSymptoms />} />
        <Route path="history"         element={<HistoryPage />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="profile"         element={<Profile />} />
        <Route path="settings"        element={<SettingsPage />} />
      </Route>

      {/* Admin dashboard */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index               element={<AdminDashboard />} />
        <Route path="users"        element={<Users />} />
        <Route path="diseases"     element={<Diseases />} />
        <Route path="predictions"  element={<Predictions />} />
        <Route path="analytics"    element={<Analytics />} />
        <Route path="monitoring"   element={<Monitoring />} />
        <Route path="logs"         element={<Logs />} />
        <Route path="settings"     element={<AdminSettings />} />
      </Route>

      <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}