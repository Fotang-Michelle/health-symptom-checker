import { useState } from 'react'
import { Monitor, Server, Activity, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

const SERVICES = [
  { name:'Flask API',    port:'5000', url:'http://localhost:5000', status:'online',  latency:'24ms',  uptime:'99.9%', requests:1847, icon:Server,       color:'var(--blue)',   bg:'var(--blue-light)'   },
  { name:'ML Service',   port:'5001', url:'http://localhost:5001', status:'online',  latency:'142ms', uptime:'99.7%', requests:1847, icon:Activity,     color:'var(--purple)', bg:'var(--purple-light)' },
  { name:'Firebase',     port:'Cloud',url:'cloud',                 status:'online',  latency:'89ms',  uptime:'99.9%', requests:3200, icon:CheckCircle,  color:'var(--green)',  bg:'var(--green-light)'  },
  { name:'Avg Response', port:'All',  url:null,                    status:'warning', latency:'258ms', uptime:'99.8%', requests:6894, icon:Clock,        color:'var(--amber)',  bg:'var(--amber-light)'  },
]

const LOGS = [
  { time:'12:34:01', level:'INFO',    service:'Flask',   msg:'POST /api/symptoms 200 OK — 142ms'    },
  { time:'12:33:58', level:'INFO',    service:'ML',      msg:'Prediction: Influenza — confidence 0.87' },
  { time:'12:33:45', level:'WARNING', service:'Flask',   msg:'Rate limit approaching for IP 192.168.1.5' },
  { time:'12:33:12', level:'INFO',    service:'Firebase',msg:'User document written — uid: abc123'  },
  { time:'12:32:55', level:'ERROR',   service:'ML',      msg:'Unknown symptom skipped: feeling weird' },
  { time:'12:32:40', level:'INFO',    service:'Flask',   msg:'GET /api/user/history 200 OK — 38ms'  },
]

const LOG_COLOR = { INFO:'badge-blue', WARNING:'badge-amber', ERROR:'badge-red' }

export default function Monitoring() {
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
          <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Monitor size={22} color="var(--blue)" /> System Monitoring
          </h1>
          <p className="db-page-sub">Real-time status of all services.</p>
        </div>
        <button className="btn btn-outline" onClick={handleRefresh}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
        gap: 16, marginBottom: 24
      }}>
        {SERVICES.map(({ name, port, status, latency, uptime, requests, icon: Icon, color, bg }) => (
          <div key={name} className="db-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>Port: {port}</div>
              </div>
              <span className={`badge ${status === 'online' ? 'badge-green' : 'badge-amber'}`}
                style={{ marginLeft: 'auto' }}>
                {status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Latency', value: latency },
                { label: 'Uptime',  value: uptime },
                { label: 'Requests',value: requests },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'center', padding: '8px', background: 'var(--bg3)', borderRadius: 'var(--r-sm)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <span className="db-card-title">Live Logs</span>
          <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
            Live
          </span>
        </div>
        <div style={{ padding: '4px 0' }}>
          {LOGS.map((log, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 20px', borderBottom: '1px solid var(--border)',
              fontFamily: 'monospace', fontSize: 13
            }}>
              <span style={{ color: 'var(--text3)', whiteSpace: 'nowrap' }}>{log.time}</span>
              <span className={`badge ${LOG_COLOR[log.level]}`} style={{ flexShrink: 0, fontSize: 10 }}>
                {log.level}
              </span>
              <span className="badge badge-purple" style={{ flexShrink: 0, fontSize: 10 }}>{log.service}</span>
              <span style={{ color: 'var(--text2)', flex: 1 }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}