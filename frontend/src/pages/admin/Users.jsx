import { useState } from 'react'
import { Users as UsersIcon, Search, UserPlus } from 'lucide-react'

const ALL_USERS = [
  { id:1,  name:'Alice Mbeki',     email:'alice@example.com',    joined:'2026-01-15', status:'active',   role:'user',  checks:12 },
  { id:2,  name:'Bob Nguyen',      email:'bob@example.com',      joined:'2026-02-03', status:'active',   role:'user',  checks:7  },
  { id:3,  name:'Carol Smith',     email:'carol@example.com',    joined:'2026-02-18', status:'inactive', role:'user',  checks:2  },
  { id:4,  name:'David Okafor',    email:'david@example.com',    joined:'2026-03-01', status:'active',   role:'user',  checks:19 },
  { id:5,  name:'Emma Johnson',    email:'emma@example.com',     joined:'2026-03-14', status:'active',   role:'user',  checks:5  },
  { id:6,  name:'Frank Ateafack',  email:'frank@example.com',    joined:'2026-03-20', status:'active',   role:'admin', checks:34 },
  { id:7,  name:'Grace Mensah',    email:'grace@example.com',    joined:'2026-04-02', status:'inactive', role:'user',  checks:1  },
  { id:8,  name:'Henry Balogun',   email:'henry@example.com',    joined:'2026-04-10', status:'active',   role:'user',  checks:8  },
  { id:9,  name:'Irene Diallo',    email:'irene@example.com',    joined:'2026-04-22', status:'active',   role:'user',  checks:15 },
  { id:10, name:'James Fofana',    email:'james@example.com',    joined:'2026-05-01', status:'active',   role:'user',  checks:3  },
]

export default function Users() {
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [users,  setUsers]      = useState(ALL_USERS)

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter
    return matchSearch && matchFilter
  })

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ))
  }

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
          <p className="db-page-sub">Manage all registered users.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <div className="db-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Users',    value: users.length,                             color: 'var(--blue)'   },
          { label: 'Active',         value: users.filter(u => u.status==='active').length,   color: 'var(--green)'  },
          { label: 'Inactive',       value: users.filter(u => u.status==='inactive').length, color: 'var(--amber)'  },
          { label: 'Admins',         value: users.filter(u => u.role==='admin').length,       color: 'var(--purple)' },
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
              <input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '7px 12px' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Date Joined</th>
                <th>Role</th>
                <th>Checks</th>
                <th>Status</th>
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
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{user.name}</div>
                        {user.role === 'admin' && (
                          <div style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700 }}>ADMIN</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(user.joined).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td><span className="badge badge-purple">{user.checks}</span></td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm">View</button>
                      <button
                        className={`btn btn-sm ${user.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}