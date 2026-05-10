import { useState } from 'react'
import { Settings, Save, Shield, Bell, Database, Cpu } from 'lucide-react'

const SECTIONS = [
  {
    icon: Shield, label: 'Security', color: 'var(--red)', bg: 'var(--red-light)',
    settings: [
      { key:'requireTwoFactor', title:'Require 2FA for Admins', desc:'Force all admin accounts to use two-factor authentication' },
      { key:'sessionTimeout',   title:'Auto Session Timeout',   desc:'Automatically log out inactive users after 30 minutes' },
      { key:'ipWhitelist',      title:'IP Whitelist',           desc:'Restrict admin panel access to whitelisted IP addresses' },
    ]
  },
  {
    icon: Bell, label: 'Notifications', color: 'var(--blue)', bg: 'var(--blue-light)',
    settings: [
      { key:'errorAlerts',    title:'Error Alerts',         desc:'Send email alerts when system errors occur' },
      { key:'dailyReport',    title:'Daily Report',         desc:'Receive a daily summary of system activity' },
      { key:'newUserAlert',   title:'New User Alerts',      desc:'Get notified when new users register' },
    ]
  },
  {
    icon: Database, label: 'Data Management', color: 'var(--purple)', bg: 'var(--purple-light)',
    settings: [
      { key:'autoBackup',     title:'Auto Backup',          desc:'Automatically backup Firestore data daily' },
      { key:'retainLogs',     title:'Retain Logs 90 Days',  desc:'Keep system logs for 90 days before deletion' },
      { key:'anonymizeData',  title:'Anonymize Analytics',  desc:'Strip personal identifiers from analytics data' },
    ]
  },
  {
    icon: Cpu, label: 'ML Model', color: 'var(--green)', bg: 'var(--green-light)',
    settings: [
      { key:'autoRetrain',    title:'Auto Retrain Model',   desc:'Automatically retrain the ML model weekly' },
      { key:'logPredictions', title:'Log All Predictions',  desc:'Store all prediction results in the database' },
      { key:'fallbackRules',  title:'Rule-Based Fallback',  desc:'Use rule-based predictions when ML service is down' },
    ]
  },
]

export default function AdminSettings() {
  const [toggles, setToggles] = useState({
    requireTwoFactor:true,  sessionTimeout:true,   ipWhitelist:false,
    errorAlerts:true,       dailyReport:true,       newUserAlert:false,
    autoBackup:true,        retainLogs:true,        anonymizeData:true,
    autoRetrain:false,      logPredictions:true,    fallbackRules:true,
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
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Settings size={22} color="var(--blue)" /> Admin Settings
          </h1>
          <p className="db-page-sub">Configure system behaviour, security, and data management.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={15} /> Save Changes
        </button>
      </div>

      {saved && (
        <div style={{
          padding: '12px 16px', marginBottom: 20,
          background: 'var(--green-light)', border: '1px solid #86efac',
          borderRadius: 'var(--r-sm)', fontSize: 13,
          color: 'var(--green)', fontWeight: 500
        }}>
          ✓ Settings saved successfully
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SECTIONS.map(({ icon: Icon, label, color, bg, settings }) => (
          <div key={label} className="db-card">
            <div className="db-card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      </div>
    </>
  )
}