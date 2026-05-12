import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { apiClient, ENDPOINTS } from "@resolve/api"
import { RegisterValues } from "../types"
import { useRegisterStore } from "@/store/use-register-store"

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterValues & { role: string }) => {
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        role: data.role,
      })

      return response.data
    },
    onSuccess: (response) => {
      toast.success(response.message || "Welcome to Resolve Home! Please verify your email.")
      router.push("/login")
    },
    onError: () => {},
  })
}
