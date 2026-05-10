import { useState } from 'react'
import { Stethoscope, Plus, Search } from 'lucide-react'

const DISEASES = [
  { id:1,  name:'Influenza',       category:'Viral',     severity:'medium', cases:45, accuracy:'94%' },
  { id:2,  name:'Common Cold',     category:'Viral',     severity:'low',    cases:38, accuracy:'97%' },
  { id:3,  name:'COVID-19',        category:'Viral',     severity:'high',   cases:32, accuracy:'91%' },
  { id:4,  name:'Malaria',         category:'Parasitic', severity:'high',   cases:28, accuracy:'95%' },
  { id:5,  name:'Typhoid Fever',   category:'Bacterial', severity:'high',   cases:20, accuracy:'93%' },
  { id:6,  name:'Gastroenteritis', category:'Viral',     severity:'medium', cases:17, accuracy:'89%' },
  { id:7,  name:'Pneumonia',       category:'Bacterial', severity:'high',   cases:14, accuracy:'92%' },
  { id:8,  name:'Anaemia',         category:'Blood',     severity:'medium', cases:11, accuracy:'88%' },
  { id:9,  name:'Allergic Reaction',category:'Immune',   severity:'low',    cases:9,  accuracy:'90%' },
  { id:10, name:'Migraine',        category:'Neurological',severity:'medium',cases:8, accuracy:'86%' },
  { id:11, name:'Appendicitis',    category:'Surgical',  severity:'high',   cases:5,  accuracy:'94%' },
]

const SEV = { low:'badge-green', medium:'badge-amber', high:'badge-red' }

export default function Diseases() {
  const [search, setSearch] = useState('')

  const filtered = DISEASES.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="db-page-head" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stethoscope size={22} color="var(--blue)" /> Disease Management
          </h1>
          <p className="db-page-sub">Manage diseases and prediction rules in the ML model.</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> Add Disease</button>
      </div>

      <div className="db-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label:'Total Diseases', value: DISEASES.length,                                    color:'var(--blue)'   },
          { label:'High Severity',  value: DISEASES.filter(d=>d.severity==='high').length,     color:'var(--red)'    },
          { label:'Avg Accuracy',   value: '91.7%',                                             color:'var(--green)'  },
          { label:'Total Cases',    value: DISEASES.reduce((a,d)=>a+d.cases,0),                color:'var(--purple)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="db-stat">
            <div className="db-stat-val" style={{ color }}>{value}</div>
            <div className="db-stat-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="db-card">
        <div className="db-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="db-card-title">All Diseases ({filtered.length})</span>
          <div className="db-search-wrap" style={{ maxWidth: 260 }}>
            <Search size={14} color="var(--text3)" />
            <input placeholder="Search diseases..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Disease Name</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Total Cases</th>
                <th>Model Accuracy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id}>
                  <td style={{ color: 'var(--text3)', fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{d.name}</td>
                  <td><span className="badge badge-blue">{d.category}</span></td>
                  <td><span className={`badge ${SEV[d.severity]}`}>{d.severity}</span></td>
                  <td style={{ fontWeight: 600 }}>{d.cases}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, maxWidth: 80 }}>
                        <div style={{ height: '100%', borderRadius: 3, width: d.accuracy, background: 'var(--green)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{d.accuracy}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}