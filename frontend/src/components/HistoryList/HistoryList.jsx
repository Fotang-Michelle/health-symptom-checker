import styles from './HistoryList.module.css'

export default function HistoryList({ history }) {
  if (!history.length) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>◎</span>
        <p>No checks yet. Start by analyzing your symptoms.</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {history.map((item, i) => (
        <div key={item.id || i} className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.date}>
              {new Date(item.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
            <span className={styles.count}>{item.symptoms?.length || 0} symptoms</span>
          </div>
          <div className={styles.symptoms}>
            {(item.symptoms || []).slice(0, 5).map(s => (
              <span key={s} className={styles.tag}>{s}</span>
            ))}
            {item.symptoms?.length > 5 && (
              <span className={styles.more}>+{item.symptoms.length - 5} more</span>
            )}
          </div>
          {item.top_prediction && (
            <div className={styles.topResult}>
              Top result: <strong>{item.top_prediction}</strong>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}