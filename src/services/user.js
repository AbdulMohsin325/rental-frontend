
import axios from 'axios'
import { logoutUser } from './auth'

const API_BASE_URL = import.meta.env.VITE_BACKEND_SERVICE

const normalizeUser = (rawUser = {}) => {
  return {
    fullName: rawUser.fullName || rawUser.name || '',
    email: rawUser.email || '',
    phone: rawUser.phone || rawUser.mobile || '',
    role: rawUser.role || 'user',
    ...rawUser,
  }
}

export const updateMe = async (doc) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/update-details`, doc)
    const { data, message } = response.data
    return { status: true, data: normalizeUser(data), message }
  } catch (error) {
    if (error?.response?.status === 401) {
      logoutUser()
    }
    throw new Error(error?.message || 'Failed to update profile.')
  }
}

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users`)
    const payload = response?.data || {}
    if (payload?.status !== 1 && payload?.status !== true) {
      throw new Error(payload?.message || payload?.error || 'Failed to load users.')
    }
    const data = payload?.data ?? payload
    return { status: true, data: Array.isArray(data) ? data.map(normalizeUser) : [], message: payload?.message || 'Success' }
  } catch (error) {
    if (error?.response?.status === 401) {
      logoutUser()
    }
    throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to load users.')
  }
}

export const fetchAdminUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, { params: { role: 'admin' } })
    const payload = response?.data || {}
    if (payload?.status !== 1 && payload?.status !== true) {
      throw new Error(payload?.message || payload?.error || 'Failed to load admin users.')
    }
    const data = payload?.data ?? payload
    return { status: true, data: Array.isArray(data) ? data.map(normalizeUser) : [], message: payload?.message || 'Success' }
  } catch (error) {
    if (error?.response?.status === 401) {
      logoutUser()
    }
    throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to load admin users.')
  }
}

export const createAdminUser = async (doc) => {
  try {
    const payloadToSend = { ...doc, role: 'admin' }
    const response = await axios.post(`${API_BASE_URL}/admin/users`, payloadToSend)
    const payload = response?.data || {}
    if (payload?.status !== 1 && payload?.status !== true) {
      throw new Error(payload?.message || payload?.error || 'Failed to create admin user.')
    }
    const data = payload?.data ?? payload
    return { status: true, data: normalizeUser(data), message: payload?.message || 'Success' }
  } catch (error) {
    if (error?.response?.status === 401) {
      logoutUser()
    }
    throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to create admin user.')
  }
}

export const updateUserById = async (id, doc) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/users/${id}`, doc)
    const payload = response?.data || {}
    if (payload?.status !== 1 && payload?.status !== true) {
      throw new Error(payload?.message || payload?.error || 'Failed to update user.')
    }
    const data = payload?.data ?? payload
    return { status: true, data: normalizeUser(data), message: payload?.message || 'Success' }
  } catch (error) {
    if (error?.response?.status === 401) {
      logoutUser()
    }
    throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to update user.')
  }
}