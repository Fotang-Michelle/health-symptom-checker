import axios from './axiosInstance'

export async function fetchHistory(token) {
  const res = await axios.get('/history', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}