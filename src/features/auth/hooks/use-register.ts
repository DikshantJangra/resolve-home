import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import apiClient from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import { RegisterValues, AuthResponse } from "../types"

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterValues) => {
      const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success("Welcome to Resolve Home!")
      if (data.token) {
        localStorage.setItem("auth_token", data.token)
      }
      // Redirect to the dashboard or home
      router.push("/dashboard")
    },
    onError: (error: any) => {
      // Error handling is already integrated in the apiClient interceptor via Sonner toasts
      // but we can add specific logic here if needed.
    },
  })
}
