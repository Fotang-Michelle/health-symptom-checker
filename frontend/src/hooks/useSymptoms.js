import { useState } from 'react'
import { submitSymptoms } from '../api/symptoms'
import { analytics, logEvent } from '../firebase'

export function useSymptoms() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [result,  setResult]  = useState(null)

  const checkSymptoms = async (selectedSymptoms) => {
    if (!selectedSymptoms.length) {
      setError('Please select at least one symptom.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    const startTime = Date.now()

    try {
      const data = await submitSymptoms(selectedSymptoms)
      setResult(data)

      // Log symptom check to Firebase Analytics
      try {
        logEvent(analytics, 'symptom_check', {
          symptom_count:    selectedSymptoms.length,
          top_prediction:   data.predictions?.[0]?.condition || 'none',
          confidence:       data.predictions?.[0]?.confidence || 0,
          duration_ms:      Date.now() - startTime,
          source:           data.source || 'ml'
        })
      } catch {
        /* ignore analytics logging errors */
      }

      return data
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')

      // Log error to Firebase Analytics
      try {
        logEvent(analytics, 'symptom_check_error', {
          error:    err.message,
          symptoms: selectedSymptoms.length
        })
      } catch {
        /* ignore analytics logging errors */
      }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { checkSymptoms, loading, error, result, reset }
}