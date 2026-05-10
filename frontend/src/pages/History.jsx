import HistoryList from '../components/HistoryList/HistoryList'
import { useHistory } from '../hooks/useHistory'
import styles from './Pages.module.css'

export default function History() {
  const { history, loading, error } = useHistory()

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Past checks</h1>
        <p className={styles.pageSubtitle}>Your symptom history</p>
      </div>
      {loading && (
        <div className={styles.loadingState}>
          <span className={styles.loadingDot} /> Loading history...
        </div>
      )}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠</span> {error}
        </div>
      )}
      {!loading && <HistoryList history={history} />}
    </div>
  )
}