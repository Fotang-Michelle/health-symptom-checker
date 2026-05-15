import axios from './axiosInstance'

export async function fetchAdminStats() {
  const res = await axios.get('/admin/stats')
  return res.data
}

export async function fetchAdminUsers() {
  const res = await axios.get('/admin/users')
  return res.data
}

export async function deleteUser(userId) {
  const res = await axios.delete(`/admin/users/${userId}`)
  return res.data
}

export async function makeUserAdmin(userId) {
  const res = await axios.post(`/admin/users/${userId}/make-admin`)
  return res.data
}

export async function removeUserAdmin(userId) {
  const res = await axios.post(`/admin/users/${userId}/remove-admin`)
  return res.data
}

export async function fetchAdminDiseases() {
  const res = await axios.get('/admin/diseases')
  return res.data
}

export async function addDisease(data) {
  const res = await axios.post('/admin/diseases', data)
  return res.data
}

export async function updateDisease(diseaseId, data) {
  const res = await axios.put(`/admin/diseases/${diseaseId}`, data)
  return res.data
}

export async function deleteDisease(diseaseId) {
  const res = await axios.delete(`/admin/diseases/${diseaseId}`)
  return res.data
}

export async function fetchAdminAnalytics() {
  const res = await axios.get('/admin/analytics')
  return res.data
}

export async function fetchSystemStatus() {
  const res = await axios.get('/admin/system-status')
  return res.data
}

export async function fetchAdminLogs(limit = 50) {
  const res = await axios.get(`/admin/logs?limit=${limit}`)
  return res.data
}