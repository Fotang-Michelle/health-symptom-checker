import { useNavigate } from 'react-router-dom'
import SymptomForm from '../components/SymptomForm/SymptomForm'
import { useSymptoms } from '../hooks/useSymptoms'
import styles from './Pages.module.css'

export default function Home() {
  const navigate = useNavigate()
  const { checkSymptoms, loading, error } = useSymptoms()

  const handleSubmit = async (symptoms) => {
    const result = await checkSymptoms(symptoms)
    if (result) navigate('/results', { state: { result } })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>How are you feeling?</h1>
        <p className={styles.pageSubtitle}>Select all symptoms you are currently experiencing</p>
      </div>
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠</span> {error}
        </div>
      )}
      <SymptomForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}