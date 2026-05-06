import { useQuery, useMutation } from "@tanstack/react-query"
import apiClient from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"

// --- Categories ---

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.CATEGORIES.LIST)
      return response.data.data
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
      return response.data.data
    }
  })
}

// --- User Profile ---

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.USER.PROFILE)
      return response.data.data
    },
    // Only fetch if token exists
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

// --- Bookings ---

export function useUserBookings() {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKINGS.BASE)
      return response.data.data
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
      return response.data.data
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.CHATS.MESSAGES(chatId))
      return response.data.data
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
      return response.data.data
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
