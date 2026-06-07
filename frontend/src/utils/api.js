import axios from 'axios'

const API = axios.create({
  baseURL:import.meta.env.VITE_API_URL || '/api'
})

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)

// Tasks
export const getTasks = (params) => API.get('/tasks', { params })
export const createTask = (data) => API.post('/tasks', data)
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data)
export const toggleTask = (id) => API.patch(`/tasks/${id}/toggle`)
export const deleteTask = (id) => API.delete(`/tasks/${id}`)
