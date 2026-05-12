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
      
      // The backend developer specified to only send the token for /api/auth/ endpoints
      const isAuthPath = config.url?.startsWith('/api/auth/')
      
      if (token && isAuthPath) {
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
    
    if (error.response?.status === 401) {
      // Silently ignore — callers handle empty/unauthenticated state
    } else if (error.response?.status !== undefined) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
