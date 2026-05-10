import { useNavigate } from 'react-router-dom'
import { Activity, RotateCcw } from 'lucide-react'
import SymptomForm from '../../components/SymptomForm/SymptomForm'
import ResultCard  from '../../components/ResultCard/ResultCard'
import { useSymptoms } from '../../hooks/useSymptoms'

export default function CheckSymptoms() {
  const navigate = useNavigate()
  const { checkSymptoms, loading, error, result, reset } = useSymptoms()

  if (result) {
    return (
      <>
        <div className="db-page-head" style={{
          display:'flex', alignItems:'center',
          justifyContent:'space-between', flexWrap:'wrap', gap:12
        }}>
          <div>
            <h1 className="db-page-title">Analysis Results</h1>
            <p className="db-page-sub">
              Here's what our ML model found based on your symptoms.
            </p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-outline" onClick={reset}>
              <RotateCcw size={14} /> New Check
            </button>
            <button className="btn btn-primary"
              onClick={() => navigate('/dashboard/history')}>
              View History
            </button>
          </div>
        </div>
        <ResultCard result={result} />
      </>
    )
  }

  return (
    <>
      <div className="db-page-head">
        <h1 className="db-page-title"
          style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Activity size={22} color="var(--blue)" /> Check Symptoms
        </h1>
        <p className="db-page-sub">
          Select all symptoms you are currently experiencing for an AI-powered analysis.
        </p>
      </div>

      <div className="db-card">
        <div className="db-card-body">
          {error && (
            <div style={{
              padding:'12px 16px', marginBottom:16,
              background:'var(--red-light)',
              border:'1px solid #fca5a5',
              borderRadius:'var(--r-sm)',
              fontSize:14, color:'var(--red)',
              display:'flex', alignItems:'center', gap:8
            }}>
              ⚠ {error}
            </div>
          )}
          <SymptomForm onSubmit={checkSymptoms} loading={loading} />
        </div>
      </div>
    </>
  )
}