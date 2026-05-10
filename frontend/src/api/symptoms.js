import axios from './axiosInstance'

export async function submitSymptoms(symptoms, token) {
  const res = await axios.post(
    '/symptoms',
    { symptoms },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}