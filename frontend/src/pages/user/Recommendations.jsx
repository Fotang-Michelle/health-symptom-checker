import { Lightbulb, Droplets, Apple, Dumbbell, Moon, Brain, Shield } from 'lucide-react'

const RECS = [
  {
    category:'Hydration', icon:Droplets, color:'var(--blue)', bg:'var(--blue-light)',
    title:'Drink More Water',
    desc:'Aim for 8–10 glasses of water per day. Proper hydration supports kidney function, skin health, and energy levels.',
    tips:['Start your day with a glass of water','Carry a reusable water bottle','Drink a glass before each meal'],
  },
  {
    category:'Nutrition', icon:Apple, color:'var(--green)', bg:'var(--green-light)',
    title:'Balanced Nutrition',
    desc:'A diverse diet rich in fruits, vegetables, and whole grains provides essential vitamins and minerals.',
    tips:['Eat 5 servings of vegetables daily','Limit processed foods and sugar','Include healthy fats like avocado and nuts'],
  },
  {
    category:'Exercise', icon:Dumbbell, color:'var(--purple)', bg:'var(--purple-light)',
    title:'Stay Active',
    desc:'Regular physical activity strengthens the heart, boosts mood, and reduces the risk of chronic diseases.',
    tips:['30 minutes of walking 5x per week','Take stairs instead of lifts','Stretch for 10 minutes every morning'],
  },
  {
    category:'Sleep', icon:Moon, color:'var(--amber)', bg:'var(--amber-light)',
    title:'Quality Sleep',
    desc:'Sleep is when your body repairs itself. Poor sleep is linked to weakened immunity and higher disease risk.',
    tips:['Maintain a consistent sleep schedule','Avoid screens 1 hour before bed','Keep your bedroom cool and dark'],
  },
  {
    category:'Mental Health', icon:Brain, color:'var(--red)', bg:'var(--red-light)',
    title:'Mental Wellness',
    desc:'Mental health is just as important as physical health. Stress management reduces inflammation and boosts immunity.',
    tips:['Practice 5 minutes of deep breathing daily','Connect with friends and family','Limit news and social media consumption'],
  },
  {
    category:'Prevention', icon:Shield, color:'var(--green)', bg:'var(--green-light)',
    title:'Preventive Care',
    desc:'Regular health screenings catch problems early when they are easiest to treat.',
    tips:['Schedule annual health check-ups','Stay up to date with vaccinations','Know your family health history'],
  },
]

export default function Recommendations() {
  return (
    <>
      <div className="db-page-head">
        <h1 className="db-page-title"
          style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Lightbulb size={22} color="var(--blue)" /> Health Recommendations
        </h1>
        <p className="db-page-sub">
          Personalised health tips to help you stay well and prevent illness.
        </p>
      </div>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',
        gap:20
      }}>
        {RECS.map(({ category, icon:Icon, color, bg, title, desc, tips }) => (
          <div key={title} className="db-card"
            style={{ transition:'transform .2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className="db-card-head">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10,
                  background:bg, display:'flex', alignItems:'center',
                  justifyContent:'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontSize:11, color:'var(--text3)',
                    fontWeight:700, textTransform:'uppercase',
                    letterSpacing:.5 }}>{category}</div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{title}</div>
                </div>
              </div>
            </div>
            <div className="db-card-body">
              <p style={{ fontSize:13, color:'var(--text2)',
                lineHeight:1.6, marginBottom:14 }}>{desc}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {tips.map(tip => (
                  <div key={tip}
                    style={{ display:'flex', alignItems:'flex-start',
                      gap:8, fontSize:13 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%',
                      background:color, marginTop:6, flexShrink:0 }} />
                    <span style={{ color:'var(--text2)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}