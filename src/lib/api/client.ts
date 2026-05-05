import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

// Base URL is the bare origin — all ENDPOINTS already include the /api prefix.
// Dev: http://localhost:3000  |  Prod: https://resolvhome.onrender.com
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In a real app, you might get the token from a cookie or localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor (Global Error Handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Backend returns { success: false, error: string } — see docs/API.md
    const data = error.response?.data as { error?: string; message?: string } | undefined
    const message = data?.error || data?.message || error.message || 'An unexpected error occurred'
    
    // Normalize error display
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.')
      // Optional: Redirect to login or clear token
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
