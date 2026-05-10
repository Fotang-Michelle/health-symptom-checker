import { useState, useEffect } from 'react'
import { fetchDashboardStats, fetchChartData } from '../api/user'

export function useDashboard() {
  const [stats,   setStats]   = useState(null)
  const [chart,   setChart]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, chartData] = await Promise.all([
          fetchDashboardStats(),
          fetchChartData()
        ])
        setStats(statsData)
        setChart(chartData)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { stats, chart, loading, error }
}