import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

const apiBaseUrl = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'https://resolve.onrender.com')

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor — cookies are sent automatically via proxy (same-origin in browser)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      
      // Attach token to all /api/ requests if it exists
      const isApiPath = config.url?.startsWith('/api/')
      
      if (token && isApiPath) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor (Global Error Handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Backend returns { success: false, error: string } — see docs/API.md
    const data = error.response?.data as { error?: string; message?: string } | undefined
    const message = data?.error || data?.message || error.message || 'An unexpected error occurred'
    
    // Attach the friendly message to the error object so components can use it
    error.message = message
    
    if (error.response?.status === 401) {
      // Silently ignore — callers handle empty/unauthenticated state
    } else if (error.response?.status !== undefined) {
      // Show global toast for all other API errors
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
