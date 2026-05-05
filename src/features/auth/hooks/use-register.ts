import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import apiClient from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import { RegisterValues } from "../types"
import { signUp } from "@/lib/auth-client"
import { useRegisterStore } from "@/store/use-register-store"

export function useRegister() {
  const router = useRouter()

  const { role } = useRegisterStore()

  return useMutation({
    mutationFn: async (data: RegisterValues) => {
      const { role } = useRegisterStore.getState()
      
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        role: (role || 'user').toLowerCase() // Backend expects lowercase (user, worker, admin)
      })

      return response.data
    },
    onSuccess: (response) => {
      // Save token if returned
      const authData = response as any
      const token = authData?.token || authData?.data?.token

      if (token) {
        localStorage.setItem('auth_token', token)
        // Set cookie for middleware to read
        import('js-cookie').then((Cookies) => {
          Cookies.default.set('auth_token', token, { expires: 7, path: '/' })
        })
      }

      toast.success("Welcome to Resolve Home!")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      // Error handling is already integrated in the apiClient interceptor via Sonner toasts
      // but we can add specific logic here if needed.
    },
  })
}
