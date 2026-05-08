import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"

// --- Auth Session ---

export function useAuthSession() {
  return useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.AUTH.GET_SESSION)
        const data = response.data.data
        
        // If we got a session but don't have the token in localStorage, sync it
        // Note: The backend might not return the token in get-session, but Better Auth 
        // usually includes it in the user object or we can get it from the cookie if needed.
        // For now, let's just return the data.
        return data ?? null
      } catch (error) {
        return null
      }
    },
    // Don't disable it if token is missing, because we might have a cookie session
    retry: false
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(ENDPOINTS.AUTH.SIGN_OUT)
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

// --- Categories ---

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.CATEGORIES.LIST)
      return response.data.data?.categories || []
    }
  })
}

// --- Services ---

export function useServices(categoryId?: string) {
  return useQuery({
    queryKey: ['services', categoryId],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.SERVICES.BASE, {
        params: { categoryId }
      })
      return response.data.data?.services || []
    }
  })
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.USER.PROFILE)
        return response.data.data ?? null
      } catch (error) {
        return null
      }
    },
    // Only fetch if token exists
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put(ENDPOINTS.USER.PROFILE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
    }
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put(ENDPOINTS.USER.PASSWORD, data)
      return response.data
    }
  })
}

// --- Bookings ---

export function useUserBookings() {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKINGS.BASE)
      return response.data.data?.bookings || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ['booking-detail', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKINGS.BY_ID(id))
      return response.data.data
    },
    enabled: !!id && typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(ENDPOINTS.BOOKINGS.BASE, data)
      return response.data
    }
  })
}

export function useAvailableEngineers(bookingId: string) {
  return useQuery({
    queryKey: ['available-engineers', bookingId],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKINGS.AVAILABLE_ENGINEERS, {
        params: { bookingId }
      })
      return response.data.data
    },
    enabled: !!bookingId
  })
}

export function useSelectEngineer() {
  return useMutation({
    mutationFn: async ({ bookingId, engineerId }: { bookingId: string, engineerId: string }) => {
      const response = await apiClient.put(ENDPOINTS.BOOKINGS.SELECT_ENGINEER(bookingId), {
        engineerId
      })
      return response.data
    }
  })
}

// --- Chats ---

export function useUserChats() {
  return useQuery({
    queryKey: ['user-chats'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.CHATS.BASE)
      return response.data.data?.chats || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.CHATS.MESSAGES(chatId))
      return response.data.data?.messages || []
    },
    enabled: !!chatId
  })
}

// --- Admin ---

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Temporarily mock or remove if backend doesn't support stats yet
      return { totalBookings: 0, totalRevenue: 0, activeEngineers: 0 }
    }
  })
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_BOOKINGS.BASE)
      return response.data.data?.bookings || []
    }
  })
}

export function useAssignEngineer() {
  return useMutation({
    mutationFn: async ({ bookingId, engineerId }: { bookingId: string, engineerId: string }) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_BOOKINGS.ENGINEERS(bookingId), {
        engineerId
      })
      return response.data
    }
  })
}
