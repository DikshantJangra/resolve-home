import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, ENDPOINTS } from "@resolve/api"
import { useEffect as useReactEffect } from 'react'
import { toast } from 'sonner'

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

export function useUpdateBioAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { bio?: string; homeAddress?: { street?: string; city?: string; state?: string; country?: string; postalCode?: string } | null }) => {
      const response = await apiClient.put(ENDPOINTS.USER.BIO_ADDRESS, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
    }
  })
}


// --- Bookings ---

export function useUserBookings(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKINGS.BASE)
      return response.data.data?.bookings || response.data.data || []
    },
    enabled: (typeof window !== 'undefined' && !!localStorage.getItem('auth_token')) && (options.enabled !== false)
  })
}

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ['booking-detail', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKINGS.BY_ID(id))
      const data = response.data.data || response.data
      return data?.booking || data
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
      const response = await apiClient.post(ENDPOINTS.ENGINEER.COMPLETE_PROFILE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
    }
  })
}

export function useResendGuarantorVerification() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(ENDPOINTS.GUARANTOR.RESEND)
      return response.data
    }
  })
}

export function useUpdateGuarantor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { guarantorName?: string; guarantorEmail: string; guarantorPhone?: string; relationship?: string; placeOfWork?: string }) => {
      const response = await apiClient.put(ENDPOINTS.GUARANTOR.UPDATE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
    }
  })
}

// --- Engineer Bookings ---

export function useEngineerLocationTracker(enabled = false) {
  useReactEffect(() => {
    if (!enabled) return
    if (!navigator.geolocation) return

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            await apiClient.put(ENDPOINTS.ENGINEER.LOCATION, {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            })
            toast.info('📍 Location updated')
          } catch { }
        },
        () => { }
      )
    }

    sendLocation()
    const interval = setInterval(sendLocation, 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [enabled])
}

export function useEngineerDashboard(enabled = false) {
  return useQuery({
    queryKey: ['engineer-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ENGINEER.DASHBOARD)
      return response.data.data ?? null
    },
    enabled: enabled && typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useEngineerBookings(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['engineer-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ENGINEER.BOOKINGS)
      return response.data.data?.bookings || []
    },
    enabled: (typeof window !== 'undefined' && !!localStorage.getItem('auth_token')) && (options.enabled !== false)
  })
}

export function useEngineerMyBookings(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['engineer-my-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ENGINEER.MY_BOOKINGS)
      return response.data.data?.bookings || []
    },
    enabled: (typeof window !== 'undefined' && !!localStorage.getItem('auth_token')) && (options.enabled !== false)
  })
}

export function useEngineerBookingDetail(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['engineer-booking-detail', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ENGINEER.BOOKING_BY_ID(id))
      return response.data.data
    },
    enabled: !!id && (typeof window !== 'undefined' && !!localStorage.getItem('auth_token')) && (options.enabled !== false)
  })
}

export function useAcceptJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.put(ENDPOINTS.BOOKINGS.ACCEPT(bookingId))
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
      const response = await apiClient.put(ENDPOINTS.BOOKINGS.REJECT(bookingId))
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
      const response = await apiClient.put(ENDPOINTS.ENGINEER.BOOKING_BY_ID(bookingId) + '/complete')
      return response.data
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['engineer-booking-detail', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['engineer-bookings'] })
    }
  })
}

// --- Wallet ---

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.BALANCE)
      return response.data.data as { balance: number; currency: string }
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

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
      // paginated response: data is the array directly
      return response.data.data || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useInitializeDeposit() {
  return useMutation({
    mutationFn: async ({ amount, callbackURL }: { amount: number, callbackURL?: string }) => {
      const response = await apiClient.post(ENDPOINTS.WALLET.DEPOSIT_INITIALIZE, { amount, callbackURL })
      return response.data.data
    }
  })
}

export function useVerifyDeposit(reference: string) {
  return useQuery({
    queryKey: ['verify-deposit', reference],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.DEPOSIT_VERIFY(reference))
      return response.data.data
    },
    enabled: !!reference
  })
}

export function useBankAccount() {
  return useQuery({
    queryKey: ['wallet-bank-account'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.BANK_ACCOUNT)
      const d = response.data.data
      // Handle { bankDetails: null }, { bankAccount: {...} }, or direct object
      const result = d?.bankAccount || d?.bankDetails || (d && !d.bankAccount && !d.bankDetails ? d : null)
      return result && Object.keys(result).length > 0 ? result : null
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useNigerianBanks() {
  return useQuery({
    queryKey: ['nigerian-banks'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.BANKS)
      return response.data.data?.banks || []
    }
  })
}

export function useAddBankAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { bankName: string, accountNumber: string, accountName: string, bankCode: string }) => {
      const response = await apiClient.post(ENDPOINTS.WALLET.BANK_ACCOUNT, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-bank-account'] })
    }
  })
}

export function useDeleteBankAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(ENDPOINTS.WALLET.BANK_ACCOUNT)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-bank-account'] })
    }
  })
}

// Aliases for backward compatibility
export const useBanks = useBankAccount
export const useAddBank = useAddBankAccount
export const useDeleteBank = useDeleteBankAccount

export function useWithdraw() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { amount: number }) => {
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
      const response = await apiClient.put(ENDPOINTS.QUOTATIONS.APPROVE(quotationId))
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
      const response = await apiClient.put(ENDPOINTS.QUOTATIONS.REJECT(quotationId), { reason })
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
      const data = response.data.data || response.data
      // Backend returns customerMessages + engineerMessages separately — merge and sort
      const customer = data?.customerMessages || []
      const engineer = data?.engineerMessages || []
      const all = [...customer, ...engineer].sort(
        (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      return all.length > 0 ? all : (data?.messages || [])
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

// --- Notifications ---

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.BASE, {
        params: unreadOnly ? { unreadOnly: true } : undefined,
      })
      return response.data.data || []
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put(ENDPOINTS.NOTIFICATIONS.READ(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.put(ENDPOINTS.NOTIFICATIONS.READ_ALL)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.SETTINGS)
      return response.data.data?.settings ?? null
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      bookingUpdates?: boolean
      messagesFromProfessionals?: boolean
      pushNotifications?: boolean
      smsAlerts?: boolean
      weeklyEmailDigest?: boolean
      promotionsAndOffers?: boolean
    }) => {
      const response = await apiClient.put(ENDPOINTS.NOTIFICATIONS.SETTINGS, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] })
    },
  })
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const isImage = file.type.startsWith('image/')
      const isDoc = file.type.includes('pdf') || file.type.includes('word')
      const uploadType = isImage ? 'image' : isDoc ? 'document' : 'any'

      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post(
        `${ENDPOINTS.UPLOAD.BASE}?type=${uploadType}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000, // 2 min timeout for large files
        }
      )
      return response.data.data?.file?.url || response.data.data?.url
    },
  })
}

// --- Admin Categories ---

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string, description?: string }) => {
      const response = await apiClient.post(ENDPOINTS.ADMIN_CATEGORIES.BASE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(ENDPOINTS.ADMIN_CATEGORIES.BY_ID(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
// --- Subscriptions ---

export function useMySubscription() {
  return useQuery({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.MY)
        return response.data.data?.subscription ?? null
      } catch (error) {
        return null
      }
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useSubscribe() {
  return useMutation({
    mutationFn: async ({ planId, callbackURL }: { planId: 'basic' | 'standard' | 'premium', callbackURL?: string }) => {
      const response = await apiClient.post(ENDPOINTS.SUBSCRIPTIONS.SUBSCRIBE, { planId, callbackURL })
      return response.data.data
    }
  })
}

export function useVerifySubscription(reference: string) {
  return useQuery({
    queryKey: ['verify-subscription', reference],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.VERIFY(reference))
      return response.data
    },
    enabled: !!reference
  })
}

export function useSubscriptionHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['subscription-history', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.HISTORY, {
        params: { page, limit }
      })
      return response.data.data || response.data
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.put(ENDPOINTS.SUBSCRIPTIONS.CANCEL)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    }
  })
}

export function useChangePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (planId: 'basic' | 'standard' | 'premium') => {
      const response = await apiClient.put(ENDPOINTS.SUBSCRIPTIONS.CHANGE_PLAN, { planId })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    }
  })
}

export function useToggleAutoRenew() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (autoRenew: boolean) => {
      const response = await apiClient.put(ENDPOINTS.SUBSCRIPTIONS.AUTO_RENEW, { autoRenew })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    }
  })
}

export function useAdminSubscriptions(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin-subscriptions', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.ADMIN, {
        params: { page, limit }
      })
      return response.data.data || response.data
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token')
  })
}
