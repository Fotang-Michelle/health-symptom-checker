import { BarChart2 } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'

const MONTHLY = [
  { month:'Jan', users:12, predictions:42, accuracy:88 },
  { month:'Feb', users:19, predictions:38, accuracy:91 },
  { month:'Mar', users:28, predictions:65, accuracy:93 },
  { month:'Apr', users:22, predictions:59, accuracy:90 },
  { month:'May', users:35, predictions:87, accuracy:94 },
  { month:'Jun', users:41, predictions:74, accuracy:95 },
]

const DISEASE_TREND = [
  { month:'Jan', Influenza:8,  Malaria:5,  'COVID-19':4 },
  { month:'Feb', Influenza:7,  Malaria:6,  'COVID-19':3 },
  { month:'Mar', Influenza:12, Malaria:9,  'COVID-19':7 },
  { month:'Apr', Influenza:10, Malaria:8,  'COVID-19':5 },
  { month:'May', Influenza:15, Malaria:12, 'COVID-19':8 },
  { month:'Jun', Influenza:11, Malaria:10, 'COVID-19':6 },
]

export default function Analytics() {
  return (
    <>
      <div className="db-page-head">
        <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={22} color="var(--blue)" /> Analytics
        </h1>
        <p className="db-page-sub">Detailed insights into system usage and health trends.</p>
      </div>

      <div className="db-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label:'Avg Daily Users',       value:'8.3',   color:'var(--blue)'   },
          { label:'Avg Daily Predictions', value:'61.6',  color:'var(--purple)' },
          { label:'Peak Accuracy',         value:'95.0%', color:'var(--green)'  },
          { label:'Growth Rate',           value:'+18%',  color:'var(--amber)'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="db-stat">
            <div className="db-stat-val" style={{ color }}>{value}</div>
            <div className="db-stat-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="db-row cols-2">
        <div className="db-card">
          <div className="db-card-head">
            <span className="db-card-title">User Growth vs Predictions</span>
          </div>
          <div className="db-card-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MONTHLY} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
                <Legend formatter={v => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>} />
                <Bar dataKey="users"       fill="var(--blue)"   radius={[4,4,0,0]} name="New Users" />
                <Bar dataKey="predictions" fill="var(--purple)" radius={[4,4,0,0]} name="Predictions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-head">
            <span className="db-card-title">Model Accuracy Trend</span>
          </div>
          <div className="db-card-body">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--green)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
                <Area type="monotone" dataKey="accuracy" stroke="var(--green)" strokeWidth={2} fill="url(#accGrad)" name="Accuracy %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <span className="db-card-title">Top Disease Trends</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Monthly breakdown</span>
        </div>
        <div className="db-card-body">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={DISEASE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
              <Legend formatter={v => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>} />
              <Line type="monotone" dataKey="Influenza" stroke="var(--blue)"   strokeWidth={2} dot={{ r:4 }} />
              <Line type="monotone" dataKey="Malaria"   stroke="var(--red)"    strokeWidth={2} dot={{ r:4 }} />
              <Line type="monotone" dataKey="COVID-19"  stroke="var(--purple)" strokeWidth={2} dot={{ r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}