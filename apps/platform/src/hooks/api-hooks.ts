import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"

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

export function useReviewBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, rating, comment }: { bookingId: string, rating: number, comment: string }) => {
      const response = await apiClient.post(ENDPOINTS.BOOKINGS.REVIEW(bookingId), {
        rating,
        comment
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking-detail', variables.bookingId] })
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] })
    }
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.put(ENDPOINTS.BOOKINGS.CANCEL(bookingId))
      return response.data
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['booking-detail', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] })
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
    mutationFn: async ({ bookingId, engineerId, paymentReference }: { bookingId: string, engineerId: string, paymentReference?: string }) => {
      const response = await apiClient.put(ENDPOINTS.BOOKINGS.SELECT_ENGINEER(bookingId), {
        engineerId,
        paymentReference
      })
      return response.data
    }
  })
}

export function useUpdateEngineerProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(ENDPOINTS.ENGINEER_BOOKINGS.BASE.replace('/bookings', '/profile'), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
    }
  })
}

// --- Engineer Bookings ---

export function useEngineerBookings() {
  return useQuery({
    queryKey: ['engineer-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ENGINEER_BOOKINGS.BASE)
      return response.data.data?.bookings || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useEngineerBookingDetail(id: string) {
  return useQuery({
    queryKey: ['engineer-booking-detail', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ENGINEER_BOOKINGS.BY_ID(id))
      return response.data.data
    },
    enabled: !!id && typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useAcceptJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.put(ENDPOINTS.ENGINEER_BOOKINGS.ACCEPT(bookingId))
      return response.data
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['engineer-booking-detail', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['engineer-bookings'] })
    }
  })
}

export function useRejectJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.put(ENDPOINTS.ENGINEER_BOOKINGS.REJECT(bookingId))
      return response.data
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['engineer-booking-detail', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['engineer-bookings'] })
    }
  })
}

export function useCompleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookingId: string) => {
      // Assuming a PUT /api/engineer/bookings/{id}/complete endpoint exists
      const response = await apiClient.put(ENDPOINTS.ENGINEER_BOOKINGS.BY_ID(bookingId) + '/complete')
      return response.data
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['engineer-booking-detail', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['engineer-bookings'] })
    }
  })
}

// --- Wallet ---

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.BASE)
      return response.data.data?.wallet ?? null
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useWalletStatistics() {
  return useQuery({
    queryKey: ['wallet-statistics'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.STATISTICS)
      return response.data.data?.statistics ?? null
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.TRANSACTIONS)
      return response.data.data?.transactions || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useInitializeDeposit() {
  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiClient.post(ENDPOINTS.WALLET.DEPOSIT_INITIALIZE, { amount })
      return response.data.data
    }
  })
}

export function useBanks() {
  return useQuery({
    queryKey: ['wallet-banks'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.BANKS.LIST)
      return response.data.data?.banks || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useAddBank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { bankName: string, accountNumber: string, accountName: string }) => {
      const response = await apiClient.post(ENDPOINTS.WALLET.BANKS.BASE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-banks'] })
    }
  })
}

export function useDeleteBank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(ENDPOINTS.WALLET.BANKS.DELETE(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-banks'] })
    }
  })
}

export function useWithdraw() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { amount: number, bankId: string }) => {
      const response = await apiClient.post(ENDPOINTS.WALLET.WITHDRAW, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
    }
  })
}

// --- Quotations ---

export function useBookingQuotation(bookingId: string) {
  return useQuery({
    queryKey: ['quotation', bookingId],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.QUOTATIONS.BY_BOOKING(bookingId))
      return response.data.data?.quotation ?? null
    },
    enabled: !!bookingId && typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useApproveQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (quotationId: string) => {
      const response = await apiClient.post(ENDPOINTS.QUOTATIONS.APPROVE(quotationId))
      return response.data
    },
    onSuccess: (_, quotationId) => {
      queryClient.invalidateQueries({ queryKey: ['quotation'] })
      queryClient.invalidateQueries({ queryKey: ['booking-detail'] })
    }
  })
}

export function useRejectQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ quotationId, reason }: { quotationId: string, reason: string }) => {
      const response = await apiClient.post(ENDPOINTS.QUOTATIONS.REJECT(quotationId), { reason })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation'] })
      queryClient.invalidateQueries({ queryKey: ['booking-detail'] })
    }
  })
}

export function useCreateQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(ENDPOINTS.QUOTATIONS.BASE, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotation', variables.bookingId] })
      // Also trigger a message or update the chat implicitly handled by backend
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

// --- Complaints ---

export function useComplaints() {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.COMPLAINTS.BASE)
      return response.data.data?.complaints || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useComplaintDetail(id: string) {
  return useQuery({
    queryKey: ['complaint-detail', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.COMPLAINTS.BY_ID(id))
      return response.data.data
    },
    enabled: !!id && typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useCreateComplaint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { bookingId?: string, title: string, description: string, category?: string }) => {
      const response = await apiClient.post(ENDPOINTS.COMPLAINTS.BASE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
    }
  })
}
