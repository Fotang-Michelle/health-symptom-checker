import { useLocation, useNavigate } from 'react-router-dom'
import ResultCard from '../components/ResultCard/ResultCard'
import styles from './Pages.module.css'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.result) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <p>No results to display.</p>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← Start a new check
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Your results</h1>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← New check
        </button>
      </div>
      <ResultCard result={state.result} />
    </div>
  )
}