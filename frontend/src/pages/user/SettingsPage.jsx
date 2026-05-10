import { useState } from 'react'
import { Settings, Bell, Shield, Palette, Trash2, Save } from 'lucide-react'

const SECTIONS = [
  {
    icon:Bell, label:'Notifications', color:'var(--blue)', bg:'var(--blue-light)',
    settings:[
      { key:'emailAlerts',  title:'Email Alerts',         desc:'Receive symptom check summaries by email' },
      { key:'pushNotifs',   title:'Push Notifications',   desc:'Get reminders to check your health regularly' },
      { key:'weeklyReport', title:'Weekly Health Report',  desc:'Receive a weekly summary of your health activity' },
    ]
  },
  {
    icon:Palette, label:'Appearance', color:'var(--purple)', bg:'var(--purple-light)',
    settings:[
      { key:'darkMode',    title:'Dark Mode',    desc:'Switch to dark theme for reduced eye strain' },
      { key:'compactView', title:'Compact View', desc:'Display more information with less spacing' },
    ]
  },
  {
    icon:Shield, label:'Privacy & Security', color:'var(--green)', bg:'var(--green-light)',
    settings:[
      { key:'saveHistory', title:'Save Check History',   desc:'Store your symptom checks for future reference' },
      { key:'shareAnon',   title:'Anonymous Analytics',  desc:'Help improve the model with anonymised data' },
      { key:'twoFactor',   title:'Two-Factor Auth',      desc:'Add an extra layer of security to your account' },
    ]
  },
]

export default function SettingsPage() {
  const [toggles, setToggles] = useState({
    emailAlerts:true, pushNotifs:false, weeklyReport:true,
    darkMode:false, compactView:false,
    saveHistory:true, shareAnon:false, twoFactor:false
  })
  const [saved, setSaved] = useState(false)

  const toggle = key => setToggles(t => ({ ...t, [key]: !t[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <div className="db-page-head" style={{
        display:'flex', alignItems:'center',
        justifyContent:'space-between', flexWrap:'wrap', gap:12
      }}>
        <div>
          <h1 className="db-page-title"
            style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Settings size={22} color="var(--blue)" /> Settings
          </h1>
          <p className="db-page-sub">
            Manage your account preferences and privacy settings.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={15} /> Save Changes
        </button>
      </div>

      {saved && (
        <div style={{
          padding:'12px 16px', marginBottom:20,
          background:'var(--green-light)', border:'1px solid #86efac',
          borderRadius:'var(--r-sm)', fontSize:13,
          color:'var(--green)', fontWeight:500
        }}>
          ✓ Settings saved successfully
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        {SECTIONS.map(({ icon:Icon, label, color, bg, settings }) => (
          <div key={label} className="db-card">
            <div className="db-card-head">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:8,
                  background:bg, display:'flex', alignItems:'center',
                  justifyContent:'center' }}>
                  <Icon size={16} color={color} />
                </div>
                <span className="db-card-title">{label}</span>
              </div>
            </div>
            <div className="db-card-body">
              {settings.map(({ key, title, desc }) => (
                <div key={key} className="setting-row">
                  <div className="setting-info">
                    <div className="setting-title">{title}</div>
                    <div className="setting-desc">{desc}</div>
                  </div>
                  <button
                    type="button"
                    className={`toggle ${toggles[key] ? 'on' : ''}`}
                    onClick={() => toggle(key)}
                    aria-label={title}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="db-card" style={{ borderColor:'#fca5a5' }}>
          <div className="db-card-head" style={{ borderColor:'#fca5a5' }}>
            <span className="db-card-title" style={{ color:'var(--red)' }}>
              ⚠ Danger Zone
            </span>
          </div>
          <div className="db-card-body">
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-title">Delete Account</div>
                <div className="setting-desc">
                  Permanently delete your account and all associated data.
                  This cannot be undone.
                </div>
              </div>
              <button className="btn btn-danger btn-sm">
                <Trash2 size={13} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}