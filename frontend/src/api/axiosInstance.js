import axios from 'axios'
import { perf, trace, analytics, logEvent } from '../firebase'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Start Firebase Performance trace
    try {
      const t = trace(perf, `api_${config.method}_${config.url?.replace(/\//g, '_')}`)
      t.start()
      config._perfTrace = t
    } catch (e) {
      // Performance monitoring not available
    }

    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  error => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    // Stop performance trace on success
    try {
      if (response.config._perfTrace) {
        response.config._perfTrace.putAttribute('status', 'success')
        response.config._perfTrace.putMetric('status_code', response.status)
        response.config._perfTrace.stop()
      }
    } catch (e) {}

    // Log to Firebase Analytics
    try {
      logEvent(analytics, 'api_success', {
        endpoint: response.config.url,
        method:   response.config.method,
        status:   response.status
      })
    } catch (e) {}

    if (import.meta.env.DEV) {
      console.log(`[API] ${response.status} ${response.config.url}`)
    }
    return response
  },
  error => {
    const status  = error.response?.status
    const message = error.response?.data?.message ||
                    error.response?.data?.error   ||
                    error.message                 ||
                    'Request failed'

    // Stop performance trace on error
    try {
      if (error.config?._perfTrace) {
        error.config._perfTrace.putAttribute('status', 'error')
        error.config._perfTrace.putMetric('status_code', status || 0)
        error.config._perfTrace.stop()
      }
    } catch (e) {}

    // Log error to Firebase Analytics
    try {
      logEvent(analytics, 'api_error', {
        endpoint: error.config?.url,
        status:   status,
        message:  message
      })
    } catch (e) {}

    if (import.meta.env.DEV) {
      console.error(`[API] Error ${status}:`, message)
    }

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(new Error(message))
  }
)

export default instance