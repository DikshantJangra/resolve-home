import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Cookies from "js-cookie"

import { apiClient, ENDPOINTS } from "@resolve/api"
import { RegisterValues } from "../types"
import { useRegisterStore } from "@/store/use-register-store"

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterValues & { role: string }) => {
      console.log("[useRegister] auth_token in localStorage before request:", localStorage.getItem("auth_token"))
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        role: data.role,
      })

      return response.data
    },
    onSuccess: (response: any) => {
      console.log("[useRegister] Success response:", response)
      // Save token if provided to allow immediate verification
      const token = response?.data?.token
      if (token) {
        console.log("[useRegister] Saving auth_token to localStorage")
        localStorage.setItem("auth_token", token)
        Cookies.set('auth_token', token, { expires: 7, path: '/' })
      }
      toast.success(response.message || "Welcome to ResolvHome! Please verify your email.")
    },
    onError: () => {},
  })
}
