import { useState, useEffect } from 'react'
import { Users as UsersIcon, Search, UserPlus, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { fetchAdminUsers, deleteUser } from '../../api/admin'
import axios from '../../api/axiosInstance'

export default function Users() {
  const [users,   setUsers]   = useState([])
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await fetchAdminUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  const handleMakeAdmin = async (userId) => {
    setActionLoading(userId + '_admin')
    try {
      await axios.post(`/admin/users/${userId}/make-admin`)
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: 'admin' } : u
      ))
    } catch (e) {
      alert('Failed to promote user.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemoveAdmin = async (userId) => {
    setActionLoading(userId + '_remove')
    try {
      await axios.post(`/admin/users/${userId}/remove-admin`)
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: 'user' } : u
      ))
    } catch (e) {
      alert('Failed to demote user.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setActionLoading(userId + '_delete')
    try {
      await deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (e) {
      alert('Failed to delete user.')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.role === filter
    return matchSearch && matchFilter
  })

  return (
    <>
      <div className="db-page-head" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UsersIcon size={22} color="var(--blue)" /> User Management
          </h1>
          <p className="db-page-sub">Manage all registered users and their roles.</p>
        </div>
        <button className="btn btn-outline" onClick={loadUsers}>
          Refresh
        </button>
      </div>

      <div className="db-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Users', value: users.length,                              color: 'var(--blue)'   },
          { label: 'Admins',      value: users.filter(u=>u.role==='admin').length,   color: 'var(--red)'    },
          { label: 'Regular',     value: users.filter(u=>u.role==='user').length,    color: 'var(--green)'  },
          { label: 'Total Checks',value: users.reduce((a,u)=>a+(u.total_checks||0),0), color: 'var(--purple)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="db-stat">
            <div className="db-stat-val" style={{ color }}>{value}</div>
            <div className="db-stat-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="db-card">
        <div className="db-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="db-card-title">All Users ({filtered.length})</span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div className="db-search-wrap" style={{ maxWidth: 240 }}>
              <Search size={14} color="var(--text3)" />
              <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="form-input" style={{ width: 'auto', padding: '7px 12px' }}>
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>Loading users...</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--red)' }}>{error}</div>
        ) : (
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date Joined</th>
                  <th>Checks</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9,
                          background: user.role === 'admin'
                            ? 'linear-gradient(135deg,#dc2626,#7c3aed)'
                            : 'linear-gradient(135deg,var(--blue),var(--purple))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0
                        }}>
                          {user.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{user.name}</div>
                          {user.role === 'admin' && (
                            <div style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700 }}>ADMIN</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{user.email}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                      {user.joined ? new Date(user.joined).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      }) : '—'}
                    </td>
                    <td><span className="badge badge-purple">{user.total_checks || 0}</span></td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {user.role !== 'admin' ? (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleMakeAdmin(user.id)}
                            disabled={actionLoading === user.id + '_admin'}
                            title="Make Admin"
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <ShieldCheck size={13} color="var(--green)" />
                            {actionLoading === user.id + '_admin' ? '...' : 'Make Admin'}
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleRemoveAdmin(user.id)}
                            disabled={actionLoading === user.id + '_remove'}
                            title="Remove Admin"
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <ShieldOff size={13} color="var(--amber)" />
                            {actionLoading === user.id + '_remove' ? '...' : 'Remove Admin'}
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading === user.id + '_delete'}
                          title="Delete User"
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Trash2 size={13} />
                          {actionLoading === user.id + '_delete' ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}