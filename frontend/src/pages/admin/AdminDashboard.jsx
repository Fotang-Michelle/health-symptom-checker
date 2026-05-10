import { useState } from 'react'
import {
  Users, Activity, TrendingUp, Server,
  UserPlus, Download, FileText, RefreshCw,
  CheckCircle, Clock
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts'
import StatCard from '../../components/ui/StatCard'

const DISEASE_DATA = [
  { name: 'Influenza',        count: 45 },
  { name: 'Common Cold',      count: 38 },
  { name: 'COVID-19',         count: 32 },
  { name: 'Malaria',          count: 28 },
  { name: 'Typhoid',          count: 20 },
  { name: 'Gastroenteritis',  count: 17 },
  { name: 'Pneumonia',        count: 14 },
  { name: 'Migraine',         count: 12 },
]

const ACTIVITY_DATA = [
  { name: 'Active Users',    value: 65, color: '#2563eb' },
  { name: 'Inactive Users',  value: 25, color: '#e2e8f8' },
  { name: 'New This Month',  value: 10, color: '#059669' },
]

const MOCK_USERS = [
  { id: 1, name: 'Alice Mbeki',    email: 'alice@example.com',  joined: '2026-01-15', status: 'active',   checks: 12 },
  { id: 2, name: 'Bob Nguyen',     email: 'bob@example.com',    joined: '2026-02-03', status: 'active',   checks: 7  },
  { id: 3, name: 'Carol Smith',    email: 'carol@example.com',  joined: '2026-02-18', status: 'inactive', checks: 2  },
  { id: 4, name: 'David Okafor',   email: 'david@example.com',  joined: '2026-03-01', status: 'active',   checks: 19 },
  { id: 5, name: 'Emma Johnson',   email: 'emma@example.com',   joined: '2026-03-14', status: 'active',   checks: 5  },
]

const SERVICES = [
  { name: 'Flask API',     port: '5000', status: 'online',  latency: '24ms',  icon: Server,       color: 'var(--blue)',   bg: 'var(--blue-light)'   },
  { name: 'ML Service',    port: '5001', status: 'online',  latency: '142ms', icon: Activity,     color: 'var(--purple)', bg: 'var(--purple-light)' },
  { name: 'Firebase',      port: 'Cloud',status: 'online',  latency: '89ms',  icon: CheckCircle,  color: 'var(--green)',  bg: 'var(--green-light)'  },
  { name: 'Response Time', port: 'Avg',  status: 'warning', latency: '258ms', icon: Clock,        color: 'var(--amber)',  bg: 'var(--amber-light)'  },
]

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <>
      <div className="db-page-head" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h1 className="db-page-title">Admin Dashboard</h1>
          <p className="db-page-sub">System overview and management controls.</p>
        </div>
        <button className="btn btn-outline" onClick={handleRefresh}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="db-stats">
        <StatCard
          icon={Users} iconBg="var(--blue-light)" iconColor="var(--blue)"
          label="Total Users" value="248"
          trend="+12 this week" trendUp
        />
        <StatCard
          icon={Activity} iconBg="var(--purple-light)" iconColor="var(--purple)"
          label="Total Predictions" value="1,847"
          trend="+89 today" trendUp
        />
        <StatCard
          icon={TrendingUp} iconBg="var(--green-light)" iconColor="var(--green)"
          label="Active Users" value="163"
          trend="+5.2%" trendUp
        />
        <StatCard
          icon={Server} iconBg="var(--green-light)" iconColor="var(--green)"
          label="Server Status" value="Online"
          trend="99.9% uptime" trendUp
        />
      </div>

      {/* Charts row */}
      <div className="db-row cols-2">
        <div className="db-card">
          <div className="db-card-head">
            <span className="db-card-title">Most Common Diseases</span>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>All time</span>
          </div>
          <div className="db-card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DISEASE_DATA} layout="vertical" barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
                <Bar dataKey="count" fill="var(--blue)" radius={[0, 6, 6, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-head">
            <span className="db-card-title">User Activity</span>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>This month</span>
          </div>
          <div className="db-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ACTIVITY_DATA}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3} dataKey="value"
                >
                  {ACTIVITY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
                <Legend iconType="circle" iconSize={10}
                  formatter={v => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
              {ACTIVITY_DATA.map(item => (
                <div key={item.name} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-d)', color: item.color }}>
                    {item.value}%
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="db-card" style={{ marginBottom: 24 }}>
        <div className="db-card-head">
          <span className="db-card-title">Recent Users</span>
          <button className="btn btn-outline btn-sm"
            onClick={() => window.location.href = '/admin/users'}>
            View all
          </button>
        </div>
        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date Joined</th>
                <th>Checks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: 'linear-gradient(135deg,var(--blue),var(--purple))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0
                      }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(user.joined).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <span className="badge badge-blue">{user.checks}</span>
                  </td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm">View</button>
                      <button className="btn btn-danger btn-sm">Block</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitoring */}
      <div className="db-card" style={{ marginBottom: 24 }}>
        <div className="db-card-head">
          <span className="db-card-title">System Monitoring</span>
          <span className="badge badge-green">All Systems Operational</span>
        </div>
        <div className="db-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
            {SERVICES.map(({ name, port, status, latency, icon: Icon, color, bg }) => (
              <div key={name} style={{
                padding: '16px', borderRadius: 'var(--r-sm)',
                border: '1px solid var(--border)', background: 'var(--bg3)',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'transform .2s'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Port: {port}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <span className={`badge ${status === 'online' ? 'badge-green' : 'badge-amber'}`}>
                      {status}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>{latency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="db-card">
        <div className="db-card-head">
          <span className="db-card-title">Quick Actions</span>
        </div>
        <div className="db-card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: UserPlus,  label: 'Add User',       color: 'var(--blue)',   bg: 'var(--blue-light)'   },
              { icon: Download,  label: 'Export Reports',  color: 'var(--green)',  bg: 'var(--green-light)'  },
              { icon: FileText,  label: 'View Logs',       color: 'var(--purple)', bg: 'var(--purple-light)' },
              { icon: RefreshCw, label: 'Restart Services',color: 'var(--amber)',  bg: 'var(--amber-light)'  },
            ].map(({ icon: Icon, label, color, bg }) => (
              <button key={label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 18px', borderRadius: 'var(--r-sm)',
                border: '1px solid var(--border)', background: 'var(--bg2)',
                cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--font)',
                fontSize: 14, fontWeight: 500, color: 'var(--text2)'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}