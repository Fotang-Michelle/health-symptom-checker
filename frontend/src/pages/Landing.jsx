import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Heart, Shield, Brain, Activity, Users, Zap, ArrowRight, Menu, X,
  Droplets, Apple, Moon, Dumbbell, Wind, Sun
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const TIPS = [
  { icon: Droplets, title: 'Hydrate Daily',       text: 'Drink 8 glasses of water daily to support kidney function, digestion, and energy levels.',          color: '#0ea5e9', bg: '#f0f9ff' },
  { icon: Apple,    title: 'Eat the Rainbow',      text: 'Fill half your plate with colorful fruits and vegetables to get a wide range of essential nutrients.',color: '#22c55e', bg: '#f0fdf4' },
  { icon: Dumbbell, title: 'Move Every Day',       text: '30 minutes of moderate exercise daily reduces risk of heart disease, diabetes, and depression.',     color: '#f59e0b', bg: '#fffbeb' },
  { icon: Moon,     title: 'Prioritise Sleep',     text: '7 to 9 hours of quality sleep repairs cells, consolidates memory, and balances hormones.',           color: '#8b5cf6', bg: '#faf5ff' },
  { icon: Wind,     title: 'Breathe Deeply',       text: 'Deep breathing activates the parasympathetic nervous system, reducing stress and lowering blood pressure.', color: '#06b6d4', bg: '#ecfeff' },
  { icon: Sun,      title: 'Get Sunlight',         text: 'Daily sunlight exposure boosts vitamin D production, improves mood, and regulates your sleep cycle.', color: '#f97316', bg: '#fff7ed' },
]

const STATS = [
  { value: '11',    label: 'Diseases Detected',  icon: Brain    },
  { value: '93.9%', label: 'ML Accuracy',         icon: Zap      },
  { value: '25+',   label: 'Symptoms Analyzed',   icon: Activity },
  { value: '100%',  label: 'Private & Secure',    icon: Shield   },
]

const HOW = [
  { step: '01', title: 'Select Symptoms',    text: 'Choose from 25+ symptoms you are currently experiencing using our intuitive symptom picker.'  },
  { step: '02', title: 'AI Analysis',        text: 'Our Random Forest ML model analyzes your symptoms with 93.9% accuracy in under a second.'      },
  { step: '03', title: 'Get Predictions',    text: 'Receive top 3 possible conditions with confidence scores and severity levels.'                  },
  { step: '04', title: 'Follow Up',          text: 'Read tailored health recommendations and consult a qualified healthcare professional.'           },
]

export default function Landing() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
  if (user) {
    navigate('/dashboard', { replace: true })
  }
}, [user, navigate])

if (user) return null

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #e2e8f0' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 5%'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Symptom<span style={{ color: '#2563eb' }}>Check</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
            {[
              { label: 'Features',   href: '#features'  },
              { label: 'How it works', href: '#how'     },
              { label: 'Health Tips', href: '#tips'     },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: '#475569', textDecoration: 'none', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#2563eb'}
                onMouseLeave={e => e.target.style.color = '#475569'}
              >
                {label}
              </a>
            ))}

            <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 8px' }} />

            <button onClick={() => navigate('/login')} style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: 'none', border: '1.5px solid #e2e8f0', color: '#0f172a',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.borderColor = '#2563eb'; e.target.style.color = '#2563eb' }}
              onMouseLeave={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.color = '#0f172a' }}
            >
              Sign in
            </button>

            <button onClick={() => navigate('/register')} style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              border: 'none', color: '#fff', cursor: 'pointer',
              transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
            }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Get started free
            </button>

            <button onClick={() => navigate('/login')} style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #dc2626, #7c3aed)',
              border: 'none', color: '#fff', cursor: 'pointer',
              transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(220,38,38,0.3)'
            }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Admin login
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(v => !v)} style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: 4
          }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: '#fff', borderTop: '1px solid #e2e8f0',
            padding: '16px 5%', display: 'flex', flexDirection: 'column', gap: 8
          }}>
            {['Features', 'How it works', 'Health Tips'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(' ', '')}`}
                style={{ padding: '10px 0', fontSize: 15, color: '#475569', textDecoration: 'none', fontWeight: 500 }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/login')} style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                background: 'none', border: '1.5px solid #e2e8f0', color: '#0f172a', cursor: 'pointer'
              }}>
                Sign in
              </button>
              <button onClick={() => navigate('/register')} style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                border: 'none', color: '#fff', cursor: 'pointer'
              }}>
                Register
              </button>
              <button onClick={() => navigate('/login')} style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                background: 'linear-gradient(135deg, #dc2626, #7c3aed)',
                border: 'none', color: '#fff', cursor: 'pointer'
              }}>
                Admin
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 50%, #f0fdf4 100%)',
        padding: '100px 5% 60px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '10%', right: '5%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 100, padding: '6px 14px', marginBottom: 28,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>AI-Powered Health Analysis</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900,
              color: '#0f172a', lineHeight: 1.1, marginBottom: 24,
              letterSpacing: '-2px'
            }}>
              Check your symptoms,<br />
              <span style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                understand your health.
              </span>
            </h1>

            <p style={{
              fontSize: 18, color: '#64748b', lineHeight: 1.7,
              marginBottom: 36, maxWidth: 520
            }}>
              Our machine learning model analyzes your symptoms with 93.9% accuracy
              and provides instant health insights — helping you make informed decisions
              before seeing a doctor.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <button onClick={() => navigate('/register')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                border: 'none', color: '#fff', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37,99,235,0.35)', transition: 'transform 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Start for free <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/login')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                background: '#fff', border: '1.5px solid #e2e8f0', color: '#0f172a',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}
              >
                Sign in
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'rgba(37,99,235,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={16} color="#2563eb" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: '#2563eb',
              letterSpacing: '0.1em', textTransform: 'uppercase'
            }}>
              Features
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: '#0f172a', marginTop: 8, letterSpacing: '-1px' }}>
              Everything you need to stay healthy
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: Brain,    color: '#2563eb', bg: '#eff6ff', title: 'AI Symptom Analysis',    text: 'Random Forest model trained on 164 patient records across 11 diseases with 93.9% accuracy.'           },
              { icon: Shield,   color: '#7c3aed', bg: '#faf5ff', title: 'Secure & Private',        text: 'Your health data is encrypted and stored securely in Firebase Firestore. Never shared with third parties.' },
              { icon: Zap,      color: '#f59e0b', bg: '#fffbeb', title: 'Instant Results',         text: 'Get your top 3 possible conditions with confidence scores and severity levels in under 2 seconds.'         },
              { icon: Activity, color: '#22c55e', bg: '#f0fdf4', title: 'Track Your History',      text: 'Keep a complete log of all your symptom checks and monitor your health trends over time.'                  },
              { icon: Users,    color: '#06b6d4', bg: '#ecfeff', title: 'Admin Dashboard',         text: 'Full admin panel to manage users, diseases, predictions, analytics and system monitoring.'                  },
              { icon: Heart,    color: '#ef4444', bg: '#fef2f2', title: 'Health Recommendations',  text: 'Personalised health tips and recommendations based on your symptom history and predictions.'                },
            ].map(({ icon: Icon, color, bg, title, text }) => (
              <div key={title} style={{
                padding: 28, borderRadius: 16, border: '1px solid #f1f5f9',
                background: '#fafafa', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '100px 5%', background: 'linear-gradient(135deg, #eff6ff, #faf5ff)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              How it works
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: '#0f172a', marginTop: 8, letterSpacing: '-1px' }}>
              Four simple steps to better health
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {HOW.map(({ step, title, text }) => (
              <div key={step} style={{ padding: 28, borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0', position: 'relative' }}>
                <div style={{
                  fontSize: 48, fontWeight: 900, color: '#e2e8f0',
                  lineHeight: 1, marginBottom: 16, letterSpacing: '-2px'
                }}>
                  {step}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tips */}
      <section id="tips" style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Health Tips
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: '#0f172a', marginTop: 8, letterSpacing: '-1px' }}>
              Simple habits, big results
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
              Science-backed daily habits that make a measurable difference to your health.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {TIPS.map(({ icon: Icon, title, text, color, bg }) => (
              <div key={title} style={{
                padding: 24, borderRadius: 14, border: '1px solid #f1f5f9',
                display: 'flex', gap: 16, transition: 'all 0.2s', background: '#fafafa'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = color + '40' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f1f5f9' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 5%',
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-1px' }}>
            Take control of your health today
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>
            Join thousands of users who trust SymptomCheck for fast, accurate health insights.
            It is free, private, and takes less than 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{
              padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: '#fff', border: 'none', color: '#2563eb', cursor: 'pointer',
              transition: 'transform 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Create free account
            </button>
            <button onClick={() => navigate('/login')} style={{
              padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 5%', background: '#0f172a', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={13} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>
            Symptom<span style={{ color: '#60a5fa' }}>Check</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
          Built for academic purposes. Always consult a qualified healthcare professional.
        </p>
        <p style={{ fontSize: 12, color: '#475569' }}>
          © 2026 SymptomCheck · Health Symptom Checker System
        </p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}