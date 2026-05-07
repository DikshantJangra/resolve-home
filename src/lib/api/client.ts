import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

// Base URL is the bare origin — all ENDPOINTS already include the /api prefix.
// Dev: http://localhost:3000  |  Prod: https://resolvhome.onrender.com
const isBrowser = typeof window !== 'undefined'

const apiBaseUrl = isBrowser ? '' : process.env.NEXT_PUBLIC_API_URL
if (!apiBaseUrl && !isBrowser) {
  console.warn('NEXT_PUBLIC_API_URL is not defined on the server.')
}

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
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
      const hasToken = !!error.config?.headers?.Authorization;
      if (hasToken) {
        toast.error('Session expired. Please log in again.')
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        import('js-cookie').then((Cookies) => {
          Cookies.default.remove('auth_token')
        })
      }
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
