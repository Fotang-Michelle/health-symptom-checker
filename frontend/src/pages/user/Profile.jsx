import { useState } from 'react'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name:       user?.name  || '',
    email:      user?.email || '',
    phone:      '',
    location:   '',
    dob:        '',
    bloodType:  '',
    allergies:  '',
    conditions: '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = form.name
    ? form.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
    : 'U'

  return (
    <>
      <div className="db-page-head">
        <h1 className="db-page-title"
          style={{ display:'flex', alignItems:'center', gap:10 }}>
          <User size={22} color="var(--blue)" /> My Profile
        </h1>
        <p className="db-page-sub">
          Manage your personal information and health details.
        </p>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'280px 1fr',
        gap:24, alignItems:'start'
      }}>
        <div className="db-card">
          <div className="db-card-body"
            style={{ textAlign:'center', padding:'32px 20px' }}>
            <div style={{
              width:80, height:80, borderRadius:20,
              background:'linear-gradient(135deg,var(--blue),var(--purple))',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontSize:28, fontWeight:800,
              margin:'0 auto 14px', fontFamily:'var(--font-d)'
            }}>{initials}</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>
              {form.name || 'Your Name'}
            </div>
            <div style={{ fontSize:13, color:'var(--text3)', marginBottom:16 }}>
              {form.email}
            </div>
            <span className="badge badge-blue">Regular User</span>

            <div style={{ marginTop:20, display:'flex',
              flexDirection:'column', gap:10, textAlign:'left' }}>
              {[
                { icon:Mail,   label: form.email    || 'No email' },
                { icon:Phone,  label: form.phone    || 'No phone' },
                { icon:MapPin, label: form.location || 'No location' },
              ].map(({ icon:Icon, label }) => (
                <div key={label} style={{ display:'flex', alignItems:'center',
                  gap:8, fontSize:13, color:'var(--text2)' }}>
                  <Icon size={14} color="var(--text3)" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-head">
            <span className="db-card-title">Personal Information</span>
          </div>
          <div className="db-card-body">
            {saved && (
              <div style={{
                padding:'10px 14px', marginBottom:16,
                background:'var(--green-light)',
                border:'1px solid #86efac',
                borderRadius:'var(--r-sm)',
                fontSize:13, color:'var(--green)', fontWeight:500
              }}>
                ✓ Profile saved successfully
              </div>
            )}
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+237 xxx xxx xxx" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="City, Country" />
                </div>
              </div>

              <div style={{ marginTop:8, paddingTop:16,
                borderTop:'1px solid var(--border)', marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700,
                  fontFamily:'var(--font-d)', marginBottom:14 }}>
                  Medical Information
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Blood Type</label>
                    <select className="form-input" value={form.bloodType}
                      onChange={e => set('bloodType', e.target.value)}>
                      <option value="">Select blood type</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input className="form-input" type="date" value={form.dob}
                      onChange={e => set('dob', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Known Allergies</label>
                  <input className="form-input" value={form.allergies}
                    onChange={e => set('allergies', e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts (comma separated)" />
                </div>
                <div className="form-group">
                  <label className="form-label">Existing Conditions</label>
                  <input className="form-input" value={form.conditions}
                    onChange={e => set('conditions', e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes (comma separated)" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                <Save size={15} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}