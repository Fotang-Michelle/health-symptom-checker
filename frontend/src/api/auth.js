import axios from './axiosInstance'

export async function loginUser(email, password) {
  const res = await axios.post('/auth/login', { email, password })
  return res.data
}

export async function registerUser(email, password, name) {
  const res = await axios.post('/auth/register', { email, password, name })
  return res.data
}