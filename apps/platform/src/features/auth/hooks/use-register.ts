import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"
import { RegisterValues } from "../types"
import { useRegisterStore } from "@/store/use-register-store"

export function useRegister() {
  const router = useRouter()

  const { role } = useRegisterStore()

  return useMutation({
    mutationFn: async (data: RegisterValues) => {
      const { role: storeRole } = useRegisterStore.getState()
      
      // Map store roles to backend-expected role identifiers
      const backendRole = storeRole === 'pro' ? 'worker' : 'user'
      
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        role: backendRole
      })

      return response.data
    },
    onSuccess: (response) => {
      // The backend returns { success: true, message: string } for signup
      // Sign up might not return a token directly if email verification is required
      // If it does return a token, we save it.
      const token = response?.data?.token || response?.token

      if (token) {
        const { role: storeRole } = useRegisterStore.getState()
        const backendRole = storeRole === 'pro' ? 'worker' : 'user'
        
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_role', backendRole)
        
        // Set cookies for proxy
        import('js-cookie').then((Cookies) => {
          Cookies.default.set('auth_token', token, { expires: 7, path: '/' })
          Cookies.default.set('user_role', backendRole, { expires: 7, path: '/' })
        })
      }

      toast.success(response.message || "Welcome to Resolve Home! Please verify your email.")
      router.push("/login")
    },
    onError: (error: any) => {
      // Error handling is already integrated in the apiClient interceptor via Sonner toasts
      // but we can add specific logic here if needed.
    },
  })
}
