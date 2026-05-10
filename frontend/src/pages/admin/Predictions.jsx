import { Activity } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const TREND = [
  { month:'Jan', predictions:42, accurate:40 },
  { month:'Feb', predictions:38, accurate:36 },
  { month:'Mar', predictions:65, accurate:61 },
  { month:'Apr', predictions:59, accurate:55 },
  { month:'May', predictions:87, accurate:83 },
  { month:'Jun', predictions:74, accurate:70 },
]

const RECENT = [
  { id:'#P001', user:'Alice Mbeki',  symptoms:'Fever, Cough, Fatigue',         result:'Influenza',  confidence:'87%', severity:'medium', time:'2 mins ago'  },
  { id:'#P002', user:'Bob Nguyen',   symptoms:'Headache, Nausea, Dizziness',   result:'Migraine',   confidence:'91%', severity:'medium', time:'14 mins ago' },
  { id:'#P003', user:'David Okafor', symptoms:'Fever, Chills, Muscle aches',   result:'Malaria',    confidence:'94%', severity:'high',   time:'1 hr ago'    },
  { id:'#P004', user:'Emma Johnson', symptoms:'Rash, Itching, Congestion',     result:'Allergic Reaction', confidence:'88%', severity:'low', time:'2 hrs ago' },
  { id:'#P005', user:'Irene Diallo', symptoms:'Cough, Shortness of breath',    result:'Pneumonia',  confidence:'92%', severity:'high',   time:'3 hrs ago'   },
]

const SEV = { low:'badge-green', medium:'badge-amber', high:'badge-red' }

export default function Predictions() {
  return (
    <>
      <div className="db-page-head">
        <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color="var(--blue)" /> Predictions
        </h1>
        <p className="db-page-sub">Monitor all ML predictions made across the system.</p>
      </div>

      <div className="db-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label:'Total Predictions', value:'1,847', color:'var(--blue)'   },
          { label:'Today',             value:'89',    color:'var(--purple)' },
          { label:'Avg Confidence',    value:'91.2%', color:'var(--green)'  },
          { label:'High Severity',     value:'234',   color:'var(--red)'    },
        ].map(({ label, value, color }) => (
          <div key={label} className="db-stat">
            <div className="db-stat-val" style={{ color }}>{value}</div>
            <div className="db-stat-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="db-card" style={{ marginBottom: 24 }}>
        <div className="db-card-head">
          <span className="db-card-title">Prediction Trends</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Last 6 months</span>
        </div>
        <div className="db-card-body">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
              <Legend formatter={v => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>} />
              <Line type="monotone" dataKey="predictions" stroke="var(--blue)"   strokeWidth={2} dot={{ r:4 }} name="Total" />
              <Line type="monotone" dataKey="accurate"    stroke="var(--green)"  strokeWidth={2} dot={{ r:4 }} name="Accurate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <span className="db-card-title">Recent Predictions</span>
        </div>
        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Symptoms</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>Severity</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.id}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text)' }}>{p.user}</td>
                  <td style={{ fontSize: 12, maxWidth: 200 }}>{p.symptoms}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{p.result}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 5, background: 'var(--border)', borderRadius: 3 }}>
                        <div style={{ height: '100%', borderRadius: 3, width: p.confidence, background: 'var(--blue)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{p.confidence}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${SEV[p.severity]}`}>{p.severity}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text3)' }}>{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}