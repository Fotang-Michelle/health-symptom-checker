import { useState } from 'react'
import { FileText, Download, Filter } from 'lucide-react'

const ALL_LOGS = [
  { id:1,  time:'2026-05-08 12:34:01', level:'INFO',    service:'Flask',    user:'alice@example.com',  msg:'POST /api/symptoms 200 OK',             duration:'142ms' },
  { id:2,  time:'2026-05-08 12:33:58', level:'INFO',    service:'ML',       user:'alice@example.com',  msg:'Prediction: Influenza confidence 0.87',  duration:'98ms'  },
  { id:3,  time:'2026-05-08 12:33:45', level:'WARNING', service:'Flask',    user:'system',             msg:'Rate limit approaching for IP',          duration:'—'     },
  { id:4,  time:'2026-05-08 12:33:12', level:'INFO',    service:'Firebase', user:'bob@example.com',    msg:'User document written',                  duration:'45ms'  },
  { id:5,  time:'2026-05-08 12:32:55', level:'ERROR',   service:'ML',       user:'system',             msg:'Unknown symptom skipped: feeling weird', duration:'—'     },
  { id:6,  time:'2026-05-08 12:32:40', level:'INFO',    service:'Flask',    user:'david@example.com',  msg:'GET /api/user/history 200 OK',           duration:'38ms'  },
  { id:7,  time:'2026-05-08 12:31:22', level:'INFO',    service:'Auth',     user:'emma@example.com',   msg:'User login successful',                  duration:'22ms'  },
  { id:8,  time:'2026-05-08 12:30:11', level:'WARNING', service:'ML',       user:'system',             msg:'Model confidence below threshold: 0.51', duration:'—'     },
  { id:9,  time:'2026-05-08 12:29:05', level:'INFO',    service:'Flask',    user:'carol@example.com',  msg:'POST /api/auth/register 201 Created',    duration:'67ms'  },
  { id:10, time:'2026-05-08 12:28:44', level:'ERROR',   service:'Firebase', user:'system',             msg:'Connection timeout — retrying',          duration:'—'     },
]

const LOG_COLOR  = { INFO:'badge-blue', WARNING:'badge-amber', ERROR:'badge-red' }
const SERV_COLOR = { Flask:'badge-blue', ML:'badge-purple', Firebase:'badge-green', Auth:'badge-amber' }

export default function Logs() {
  const [level,   setLevel]   = useState('all')
  const [service, setService] = useState('all')

  const filtered = ALL_LOGS.filter(l => {
    const matchLevel   = level   === 'all' || l.level   === level
    const matchService = service === 'all' || l.service === service
    return matchLevel && matchService
  })

  return (
    <>
      <div className="db-page-head" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={22} color="var(--blue)" /> System Logs
          </h1>
          <p className="db-page-sub">Full audit trail of all system events.</p>
        </div>
        <button className="btn btn-outline"><Download size={14} /> Export Logs</button>
      </div>

      <div className="db-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label:'Total Logs',  value: ALL_LOGS.length,                              color:'var(--blue)'   },
          { label:'Errors',      value: ALL_LOGS.filter(l=>l.level==='ERROR').length,  color:'var(--red)'    },
          { label:'Warnings',    value: ALL_LOGS.filter(l=>l.level==='WARNING').length,color:'var(--amber)'  },
          { label:'Info',        value: ALL_LOGS.filter(l=>l.level==='INFO').length,   color:'var(--green)'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="db-stat">
            <div className="db-stat-val" style={{ color }}>{value}</div>
            <div className="db-stat-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="db-card">
        <div className="db-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="db-card-title">Log Entries ({filtered.length})</span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="form-input" style={{ width: 'auto', padding: '7px 12px' }}>
              <option value="all">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
            </select>
            <select value={service} onChange={e => setService(e.target.value)}
              className="form-input" style={{ width: 'auto', padding: '7px 12px' }}>
              <option value="all">All Services</option>
              <option value="Flask">Flask</option>
              <option value="ML">ML</option>
              <option value="Firebase">Firebase</option>
              <option value="Auth">Auth</option>
            </select>
          </div>
        </div>
        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Level</th>
                <th>Service</th>
                <th>User</th>
                <th>Message</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'nowrap' }}>{log.time}</td>
                  <td><span className={`badge ${LOG_COLOR[log.level]}`} style={{ fontSize: 10 }}>{log.level}</span></td>
                  <td><span className={`badge ${SERV_COLOR[log.service] || 'badge-blue'}`} style={{ fontSize: 10 }}>{log.service}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{log.user}</td>
                  <td style={{ fontSize: 13, maxWidth: 300 }}>{log.msg}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}