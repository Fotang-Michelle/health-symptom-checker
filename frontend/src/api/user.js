import axios from './axiosInstance'

export async function fetchDashboardStats() {
  const res = await axios.get('/user/dashboard-stats')
  return res.data
}

export async function fetchUserHistory() {
  const res = await axios.get('/user/history')
  return res.data
}

export async function fetchRecommendations() {
  const res = await axios.get('/user/recommendations')
  return res.data
}

export async function updateProfile(data) {
  const res = await axios.put('/user/profile', data)
  return res.data
}

export async function fetchChartData() {
  const res = await axios.get('/user/chart-data')
  return res.data
}