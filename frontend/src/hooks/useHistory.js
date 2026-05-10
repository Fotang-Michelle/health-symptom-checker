import { useState, useEffect } from 'react'
import { fetchUserHistory } from '../api/user'

export function useHistory() {
  const [history, setHistory]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUserHistory()
        setHistory(data)
      } catch (err) {
        setError(err.message || 'Failed to load history.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { history, loading, error }
}