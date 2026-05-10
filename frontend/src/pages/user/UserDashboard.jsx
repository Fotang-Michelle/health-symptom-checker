import { useNavigate } from 'react-router-dom'
import {
  Activity, ClipboardCheck, Target, Heart,
  ArrowRight, Droplets, Apple, Dumbbell, Moon, Shield
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import StatCard from '../../components/ui/StatCard'
import { useHistory } from '../../hooks/useHistory'
import { useDashboard } from '../../hooks/useDashboard'
import { useAuth } from '../../context/AuthContext'

const TIPS = [
  { icon: Droplets, title: 'Stay Hydrated',   text: 'Drink at least 8 glasses of water daily to support immune function.' },
  { icon: Apple,    title: 'Balanced Diet',   text: 'Eat a variety of fruits and vegetables to get essential nutrients.' },
  { icon: Dumbbell, title: 'Exercise Daily',  text: '30 minutes of moderate activity strengthens your immune system.' },
  { icon: Moon,     title: 'Quality Sleep',   text: '7–9 hours of sleep allows your body to repair and recover.' },
  { icon: Shield,   title: 'Preventive Care', text: 'Regular check-ups catch health issues before they become serious.' },
]

const FALLBACK_TREND = [
  { month: 'Jan', checks: 0 },
  { month: 'Feb', checks: 0 },
  { month: 'Mar', checks: 0 },
  { month: 'Apr', checks: 0 },
  { month: 'May', checks: 0 },
  { month: 'Jun', checks: 0 },
]

const SEV_COLOR = { low: 'badge-green', medium: 'badge-amber', high: 'badge-red' }

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function UserDashboard() {
  const { history, loading: historyLoading } = useHistory()
  const { stats, chart, loading: statsLoading } = useDashboard()
  const { user } = useAuth()
  const navigate = useNavigate()

  const greeting    = getGreeting()
  const totalChecks = stats?.total_checks    ?? history.length
  const lastPred    = stats?.last_prediction ?? history[0]?.top_prediction ?? '—'
  const healthScore = stats?.health_score    ?? 80
  const lastDate    = stats?.last_check_date ?? history[0]?.created_at ?? ''
  const trendData   = chart?.monthly_trend   ?? FALLBACK_TREND
  const recentChecks = history.slice(0, 5)

  return (
    <>
      <div className="db-page-head">
        <h1 className="db-page-title">
          {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="db-page-sub">Here's your health overview for today.</p>
      </div>

      <div className="db-stats">
        <StatCard
          icon={ClipboardCheck}
          iconBg="var(--blue-light)" iconColor="var(--blue)"
          label="Total Checks"
          value={statsLoading ? '...' : totalChecks}
          trend="+2 this week" trendUp
        />
        <StatCard
          icon={Activity}
          iconBg="var(--purple-light)" iconColor="var(--purple)"
          label="Last Prediction"
          value={statsLoading ? '...' : lastPred}
          sub={lastDate
            ? new Date(lastDate).toLocaleDateString()
            : 'No checks yet'}
        />
        <StatCard
          icon={Target}
          iconBg="var(--green-light)" iconColor="var(--green)"
          label="Model Accuracy"
          value={statsLoading ? '...' : `${stats?.prediction_accuracy ?? 93.9}%`}
          trend="+2.1%" trendUp
        />
        <StatCard
          icon={Heart}
          iconBg="var(--red-light)" iconColor="var(--red)"
          label="Health Score"
          value={statsLoading ? '...' : `${healthScore}/100`}
          trend={healthScore >= 80 ? 'Great' : 'Monitor'}
          trendUp={healthScore >= 80}
        />
      </div>

      <div className="db-row cols-2">
        <div className="db-card">
          <div className="db-card-head">
            <span className="db-card-title">Recent Symptom Checks</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/dashboard/history')}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="db-card-body" style={{ padding: 0 }}>
            {historyLoading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: 40 }} />
                ))}
              </div>
            ) : recentChecks.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '40px 20px',
                gap: 12, color: 'var(--text3)', textAlign: 'center'
              }}>
                <Activity size={32} style={{ opacity: .3 }} />
                <p style={{ fontSize: 14 }}>No symptom checks yet.</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/dashboard/symptoms')}
                >
                  Start your first check
                </button>
              </div>
            ) : (
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Symptoms</th>
                      <th>Top Result</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentChecks.map((check, i) => {
                      const sev = check.predictions?.[0]?.severity || 'low'
                      return (
                        <tr key={check.id || i}>
                          <td style={{ whiteSpace: 'nowrap', fontWeight: 500, color: 'var(--text)' }}>
                            {new Date(check.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'short'
                            })}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {(check.symptoms || []).slice(0, 2).map(s => (
                                <span key={s} className="badge badge-blue"
                                  style={{ fontSize: 10 }}>{s}</span>
                              ))}
                              {check.symptoms?.length > 2 && (
                                <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                                  +{check.symptoms.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ fontWeight: 500, color: 'var(--text)' }}>
                            {check.top_prediction || '—'}
                          </td>
                          <td>
                            <span className={`badge ${SEV_COLOR[sev]}`}>{sev}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-head">
            <span className="db-card-title">Health Tips</span>
            <span className="badge badge-green">Daily</span>
          </div>
          <div className="db-card-body">
            {TIPS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="tip-item">
                <div className="tip-icon"><Icon size={16} /></div>
                <div>
                  <p className="tip-title">{title}</p>
                  <p className="tip-text">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="db-cta">
        <div>
          <p className="db-cta-t">How are you feeling today?</p>
          <p className="db-cta-s">
            Select your symptoms and get an instant AI-powered health analysis.
          </p>
        </div>
        <button
          className="db-cta-btn"
          onClick={() => navigate('/dashboard/symptoms')}
        >
          Check Symptoms Now →
        </button>
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <span className="db-card-title">Symptom Check Trends</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Last 12 months</span>
        </div>
        <div className="db-card-body">
          {statsLoading ? (
            <div className="skeleton" style={{ height: 220 }} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData} barCategoryGap="40%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'var(--text3)' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--text3)' }}
                  axisLine={false} tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                  cursor={{ fill: 'var(--blue-light)' }}
                />
                <Bar
                  dataKey="checks"
                  fill="var(--blue)"
                  radius={[6, 6, 0, 0]}
                  name="Checks"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  )
}