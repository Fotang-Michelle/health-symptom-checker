import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request automatically
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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

// Handle responses and errors globally
instance.interceptors.response.use(
  response => {
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

    if (import.meta.env.DEV) {
      console.error(`[API] Error ${status}:`, message)
    }

    // Auto logout on 401
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