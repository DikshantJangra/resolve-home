import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

// Base URL is the bare origin — all ENDPOINTS already include the /api prefix.
// Dev: http://localhost:3000  |  Prod: https://resolvhome.onrender.com
const isBrowser = typeof window !== 'undefined'

const apiBaseUrl = isBrowser ? '' : (process.env.NEXT_PUBLIC_API_URL || 'https://resolvhome.onrender.com')
if (!apiBaseUrl && !isBrowser) {
  console.warn('NEXT_PUBLIC_API_URL is not defined on the server.')
}

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    // Sanitize token
    if (token === 'undefined' || token === 'null') {
      token = null
    }

    // Don't add token to auth endpoints to avoid issues with stale tokens
    const isAuthRoute = config.url?.includes('/api/auth/') || config.url?.includes('/api/signup-with-role')
    const isGetSession = config.url?.includes('/api/auth/get-session')
    
    if (token && config.headers && (!isAuthRoute || isGetSession)) {
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
      toast.error(message || 'You do not have permission to perform this action.')
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
