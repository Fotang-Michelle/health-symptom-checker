import styles from './ResultCard.module.css'

const SEVERITY_CONFIG = {
  low:    { label: 'Low concern',  color: '#3fb950', bg: 'rgba(63,185,80,0.1)'  },
  medium: { label: 'Moderate',     color: '#d29922', bg: 'rgba(210,153,34,0.1)' },
  high:   { label: 'High concern', color: '#f85149', bg: 'rgba(248,81,73,0.1)'  },
}

export default function ResultCard({ result }) {
  const { predictions = [], symptoms_analyzed = [], session_id } = result

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Analysis complete</h2>
          <p className={styles.subtitle}>
            Based on {symptoms_analyzed.length} symptom{symptoms_analyzed.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span className={styles.sessionId}>#{session_id?.slice(-6)}</span>
      </div>

      <div className={styles.symptomsRow}>
        {symptoms_analyzed.map(s => (
          <span key={s} className={styles.symptomTag}>{s}</span>
        ))}
      </div>

      <div className={styles.disclaimer}>
        <span className={styles.disclaimerIcon}>⚠</span>
        This is for informational purposes only. Always consult a qualified medical professional.
      </div>

      <div className={styles.predictions}>
        <h3 className={styles.sectionTitle}>Possible conditions</h3>
        {predictions.length === 0 ? (
          <p className={styles.empty}>No predictions available.</p>
        ) : (
          predictions.map((pred, i) => {
            const severity = pred.severity || 'low'
            const config = SEVERITY_CONFIG[severity]
            const pct = Math.round((pred.confidence || 0) * 100)
            return (
              <div key={i} className={styles.predItem}>
                <div className={styles.predHeader}>
                  <span className={styles.predName}>{pred.condition}</span>
                  <div className={styles.predMeta}>
                    <span className={styles.predPct}>{pct}%</span>
                    <span className={styles.severityBadge}
                      style={{ color: config.color, background: config.bg }}>
                      {config.label}
                    </span>
                  </div>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill}
                    style={{ width: `${pct}%`, background: config.color }} />
                </div>
                {pred.description && (
                  <p className={styles.predDesc}>{pred.description}</p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}