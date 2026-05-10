import { ClipboardList, Calendar, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHistory } from '../../hooks/useHistory'

const SEV_COLOR = { low:'badge-green', medium:'badge-amber', high:'badge-red' }

export default function HistoryPage() {
  const { history, loading, error } = useHistory()
  const navigate = useNavigate()

  return (
    <>
      <div className="db-page-head" style={{
        display:'flex', alignItems:'center',
        justifyContent:'space-between', flexWrap:'wrap', gap:12
      }}>
        <div>
          <h1 className="db-page-title"
            style={{ display:'flex', alignItems:'center', gap:10 }}>
            <ClipboardList size={22} color="var(--blue)" /> Symptom History
          </h1>
          <p className="db-page-sub">All your past symptom checks in one place.</p>
        </div>
        <button className="btn btn-primary"
          onClick={() => navigate('/dashboard/symptoms')}>
          <Activity size={15} /> New Check
        </button>
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <span className="db-card-title">All Checks ({history.length})</span>
        </div>

        {loading ? (
          <div style={{ padding:24, display:'flex', flexDirection:'column', gap:12 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height:56 }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ padding:24, color:'var(--red)', fontSize:14 }}>
            Failed to load history.
          </div>
        ) : history.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column',
            alignItems:'center', padding:'60px 20px',
            gap:12, color:'var(--text3)', textAlign:'center' }}>
            <ClipboardList size={36} style={{ opacity:.3 }} />
            <p style={{ fontSize:15, fontWeight:600 }}>No checks yet</p>
            <p style={{ fontSize:13, color:'var(--text2)' }}>
              Start by checking your symptoms.
            </p>
            <button className="btn btn-primary btn-sm"
              onClick={() => navigate('/dashboard/symptoms')}>
              Check Now
            </button>
          </div>
        ) : (
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symptoms</th>
                  <th>Top Prediction</th>
                  <th>Confidence</th>
                  <th>Severity</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => {
                  const top = item.predictions?.[0]
                  const sev = top?.severity || 'low'
                  return (
                    <tr key={item.id || i}>
                      <td style={{ whiteSpace:'nowrap' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <Calendar size={13} color="var(--text3)" />
                          <span style={{ fontWeight:500, color:'var(--text)' }}>
                            {new Date(item.created_at).toLocaleDateString('en-GB',
                              { day:'numeric', month:'short', year:'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:4,
                          flexWrap:'wrap', maxWidth:200 }}>
                          {(item.symptoms || []).slice(0,3).map(s => (
                            <span key={s} className="badge badge-blue"
                              style={{ fontSize:10 }}>{s}</span>
                          ))}
                          {item.symptoms?.length > 3 && (
                            <span style={{ fontSize:11, color:'var(--text3)' }}>
                              +{item.symptoms.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontWeight:600, color:'var(--text)' }}>
                        {item.top_prediction || '—'}
                      </td>
                      <td>
                        {top ? (
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ flex:1, height:6,
                              background:'var(--border)',
                              borderRadius:3, maxWidth:80 }}>
                              <div style={{
                                height:'100%', borderRadius:3,
                                width:`${Math.round(top.confidence * 100)}%`,
                                background:'var(--blue)'
                              }} />
                            </div>
                            <span style={{ fontSize:12, fontWeight:600 }}>
                              {Math.round(top.confidence * 100)}%
                            </span>
                          </div>
                        ) : '—'}
                      </td>
                      <td>
                        <span className={`badge ${SEV_COLOR[sev]}`}>{sev}</span>
                      </td>
                      <td style={{ maxWidth:220, fontSize:12,
                        color:'var(--text2)', lineHeight:1.4 }}>
                        {top?.recommendation?.slice(0,80)}
                        {top?.recommendation?.length > 80 ? '...' : ''}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}