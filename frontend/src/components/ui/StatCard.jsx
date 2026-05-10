import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
  icon: Icon, iconBg, iconColor,
  label, value, trend, trendUp, sub
}) {
  return (
    <div className="db-stat">
      <div className="db-stat-top">
        <div className="db-stat-icon" style={{ background: iconBg }}>
          <Icon size={20} color={iconColor} />
        </div>
        {trend && (
          <span
            className="db-stat-pill"
            style={{
              color: trendUp ? 'var(--green)' : 'var(--red)',
              background: trendUp ? 'var(--green-light)' : 'var(--red-light)'
            }}
          >
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="db-stat-val">{value}</div>
        <div className="db-stat-lbl">{label}</div>
        {sub && (
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}