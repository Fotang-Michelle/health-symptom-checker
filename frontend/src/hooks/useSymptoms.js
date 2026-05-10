import { useState } from 'react'
import { submitSymptoms } from '../api/symptoms'
import { useAuth } from '../context/AuthContext'

export function useSymptoms() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const checkSymptoms = async (selectedSymptoms) => {
    if (!selectedSymptoms.length) {
      setError('Please select at least one symptom.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await submitSymptoms(selectedSymptoms, token)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
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