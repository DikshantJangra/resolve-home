import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"

export function useAuthSession() {
  return useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.AUTH.GET_SESSION)
        const data = response.data.data
        return data ?? null
      } catch (error) {
        return null
      }
    },
    retry: false
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(ENDPOINTS.AUTH.SIGN_OUT, {}, {
        headers: { 'Content-Type': 'application/json' }
      })
      return response.data
    },
    onSuccess: () => {
      localStorage.removeItem('auth_token')
      import('js-cookie').then((Cookies) => {
        Cookies.default.remove('auth_token')
      })
      queryClient.setQueryData(['auth-session'], null)
      window.location.href = '/login'
    }
  })
}
export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.USER.PROFILE)
      return response.data.data
    }
  })
}

// --- Admin Stats ---

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/stats')
      return response.data.data
    }
  })
}

// --- Admin Users ---

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_USERS.BASE)
      return response.data.data?.users || []
    }
  })
}

export function useBanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.post(ENDPOINTS.ADMIN_USERS.BAN(userId))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    }
  })
}

// --- Admin Engineers ---

export function useAdminEngineers() {
  return useQuery({
    queryKey: ['admin-engineers'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_ENGINEERS.BASE)
      return response.data.data?.engineers || []
    }
  })
}

export function useApproveEngineer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ engineerId, data }: { engineerId: string, data: any }) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_ENGINEERS.BY_ID(engineerId), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-engineers'] })
    }
  })
}

// --- Admin Bookings ---

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_BOOKINGS.BASE)
      return response.data.data?.bookings || []
    }
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: string }) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_BOOKINGS.STATUS(bookingId), { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    }
  })
}

export function useAssignEngineer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, engineerId }: { bookingId: string, engineerId: string }) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_BOOKINGS.ENGINEERS(bookingId), {
        engineerId
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    }
  })
}
