import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"

export function useAuthSession() {
  return useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.AUTH.GET_SESSION)
      // Handle both { data: { user, session } } and { user, session }
      const data = response.data.data || response.data

      // If the response is success: true, data: ...
      if (data && typeof data === 'object' && 'user' in data) {
        return data
      }

      // If we only have the inner data
      if (response.data && typeof response.data === 'object' && 'user' in response.data) {
        return response.data
      }

      return null
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
      const data = response.data.data || response.data
      return data?.user || data
    }
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
    mutationFn: async (data: any) => {
      const response = await apiClient.put(ENDPOINTS.GUARANTOR.UPDATE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    }
  })
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post(ENDPOINTS.UPLOAD.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const data = response.data.data
      return typeof data === 'object' ? data.url || data.path || data : data
    }
  })
}

// --- Admin Stats ---

export function useAdminStats() {
  const { data: users } = useAdminUsers()
  const { data: engineers } = useAdminEngineers()
  const { data: bookings } = useAdminBookings()

  return useQuery({
    queryKey: ['admin-stats', users?.length, engineers?.length, bookings?.length],
    queryFn: async () => {
      if (!users || !engineers || !bookings) return null

      const totalHomeowners = users.filter((u: any) => u.role === 'user').length
      const totalEngineers = engineers.length
      const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.price || b.totalAmount || 0), 0)
      const completedJobs = bookings.filter((b: any) => b.status === 'completed').length

      return {
        totalRevenue,
        totalHomeowners,
        totalEngineers,
        completedJobs,
      }
    },
    enabled: !!users && !!engineers && !!bookings,
  })
}

export function useAdminBookingStats() {
  const { data: bookings } = useAdminBookings()

  return useQuery({
    queryKey: ['admin-booking-stats', bookings?.length],
    queryFn: async () => {
      if (!bookings) return {}

      const totalBookings = bookings.length
      const inProgress = bookings.filter((b: any) => b.status === 'in-progress').length
      const emergency = bookings.filter((b: any) => b.isEmergency || b.serviceCategory?.toLowerCase() === 'emergency').length

      return {
        totalBookings,
        inProgress,
        emergency,
      }
    },
    enabled: !!bookings,
  })
}

export function useAdminComplaintStats() {
  const { data: complaints } = useAdminComplaints()

  return useQuery({
    queryKey: ['admin-complaint-stats', complaints?.length],
    queryFn: async () => {
      if (!complaints) return {}

      const totalComplaints = complaints.length
      const resolvedCases = complaints.filter((c: any) => c.status === 'resolved' || c.status === 'closed').length
      const pendingDisputes = complaints.filter((c: any) => c.status === 'open' || c.status === 'pending').length

      return {
        totalComplaints,
        resolvedCases,
        pendingDisputes,
      }
    },
    enabled: !!complaints,
  })
}

// --- Admin Users ---

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_USERS.BASE)
      const data = response.data.data || response.data

      if (Array.isArray(data)) return data
      if (data && typeof data === 'object') {
        return data.users || data.items || data.data || []
      }
      return []
    }
  })
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_USERS.BY_ID(id))
      const data = response.data.data || response.data
      const user = data?.user || data?.item || data?.data || data
      const engineerProfile = data?.engineerProfile || null
      // Merge engineerProfile into the user object for easy access
      return engineerProfile ? { ...user, engineerProfile } : user
    },
    enabled: !!id
  })
}

export function useCreateProfessional() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; phone?: string }) => {
      const response = await apiClient.post(ENDPOINTS.ADMIN_USERS.BASE, {
        ...data,
        role: 'worker',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-engineers'] })
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
  // No GET /api/admin/engineers endpoint exists — use users list and filter by role
  return useQuery({
    queryKey: ['admin-engineers'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_USERS.BASE)
      const data = response.data.data || response.data

      const all = Array.isArray(data) ? data : (data?.users || data?.items || data?.data || [])
      return all.filter((u: any) =>
        u.role?.toLowerCase() === 'engineer' ||
        u.role?.toLowerCase() === 'worker' ||
        u.engineerProfile != null
      )
    }
  })
}

export function useAdminEngineer(id: string) {
  // No GET /api/admin/engineers/{id} endpoint — fall back to users endpoint
  return useQuery({
    queryKey: ['admin-engineer', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_USERS.BY_ID(id))
      const data = response.data.data || response.data
      return data?.user || data?.item || data?.data || data
    },
    enabled: !!id
  })
}

export function useAdminPendingEngineerById(id: string) {
  return useQuery({
    queryKey: ['admin-pending-engineer', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_ENGINEERS.BY_ID(id))
      const data = response.data.data || response.data
      return data?.engineer || data
    },
    enabled: !!id
  })
}

// --- Admin Bookings ---

function normalizeBooking(b: any) {
  return {
    ...b,
    serviceName: b.serviceName || b.service?.name || b.service?.title || '',
    serviceCategory: b.serviceCategory || b.service?.category || b.service?.name || '',
    isEmergency: b.isEmergency ?? b.priority?.toLowerCase() === 'emergency',
    customerName: b.customerName || b.customerDetails?.name || b.customerDetails?.fullName || 'Customer',
    customerAvatar: b.customerAvatar || b.customerDetails?.avatar || b.customerDetails?.image || b.customerDetails?.profileImage || '',
  }
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_BOOKINGS.BASE)
      const raw = response.data.data || response.data
      const list = Array.isArray(raw) ? raw : (raw?.bookings || raw?.items || raw?.data || [])
      return list.map(normalizeBooking)
    }
  })
}

export function useAdminBooking(id: string) {
  return useQuery({
    queryKey: ['admin-booking', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_BOOKINGS.BY_ID(id))
      const data = response.data.data || response.data
      return normalizeBooking(data?.booking || data)
    },
    enabled: !!id,
    retry: false,
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

// --- Admin Complaints ---

export function useAdminComplaints() {
  return useQuery({
    queryKey: ['admin-complaints'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_COMPLAINTS.BASE)
      const data = response.data.data || response.data

      if (Array.isArray(data)) return data
      if (data && typeof data === 'object') {
        return data.complaints || data.items || data.data || []
      }
      return []
    }
  })
}

export function useRespondToComplaint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ complaintId, response }: { complaintId: string, response: string }) => {
      const apiResponse = await apiClient.put(ENDPOINTS.ADMIN_COMPLAINTS.RESPOND(complaintId), {
        response
      })
      return apiResponse.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] })
    }
  })
}
// --- Admin Wallet ---
export function useAdminWalletStats() {
  return useQuery({
    queryKey: ['admin-wallet-stats'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.STATISTICS)
      return response.data.data?.statistics || null
    }
  })
}

export function useAdminWalletTransactions() {
  return useQuery({
    queryKey: ['admin-wallet-transactions'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.WALLET.TRANSACTIONS)
      return response.data.data || []
    }
  })
}
// --- Admin Engineer Verifications ---

export function useAdminVerificationRequests(_page = 1, _limit = 10) {
  return useQuery({
    queryKey: ['admin-verification-requests'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_ENGINEERS.PENDING)
      const data = response.data.data || response.data
      const verifications: any[] = Array.isArray(data) ? data : (data?.engineers || data?.items || [])
      return { verifications, pagination: data?.pagination || null }
    }
  })
}

export function useAdminApproveEngineer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, note }: { id: string, note?: string }) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_ENGINEER_VERIFICATIONS.APPROVE(id), { note })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin-engineers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-engineer'] })
      queryClient.invalidateQueries({ queryKey: ['admin-pending-engineer'] })
    }
  })
}

export function useAdminRejectEngineer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, note }: { id: string, note?: string }) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_ENGINEER_VERIFICATIONS.REJECT(id), { note })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin-engineers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-engineer'] })
      queryClient.invalidateQueries({ queryKey: ['admin-pending-engineer'] })
    }
  })
}

export function useAdminVerifyGuarantor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_ENGINEERS.VERIFY_GUARANTOR(id))
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin-engineer', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-pending-engineer', id] })
    }
  })
}

export function useDeleteEngineer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(ENDPOINTS.ADMIN_ENGINEERS.DELETE(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-engineers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    }
  })
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: async () => {
      const response = await apiClient.get('/')
      return response.data
    },
    refetchInterval: 30000 // Check every 30 seconds
  })
}

// --- Notifications ---
export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.SETTINGS)
      return response.data.data || null
    }
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put(ENDPOINTS.NOTIFICATIONS.SETTINGS, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] })
    }
  })
}

// --- Categories ---

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.CATEGORIES.LIST)
      const data = response.data.data || response.data
      if (Array.isArray(data)) return data
      if (data && typeof data === 'object') {
        return data.categories || data.items || []
      }
      return []
    }
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string, description?: string }) => {
      const response = await apiClient.post(ENDPOINTS.ADMIN_CATEGORIES.BASE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await apiClient.put(ENDPOINTS.ADMIN_CATEGORIES.BY_ID(id), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
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
    }
  })
}

// --- Sub-services (Specific Services) ---

export function useServices(categoryId?: string) {
  return useQuery({
    queryKey: ['services', categoryId],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.SERVICES.BASE, {
        params: { categoryId }
      })
      const data = response.data.data || response.data
      return data.services || (Array.isArray(data) ? data : [])
    },
    enabled: !!categoryId
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string, categoryId: string, description?: string, price?: number }) => {
      const response = await apiClient.post(ENDPOINTS.ADMIN_SERVICES.BASE, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', variables.categoryId] })
    }
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, categoryId }: { id: string, categoryId: string }) => {
      const response = await apiClient.delete(ENDPOINTS.ADMIN_SERVICES.BY_ID(id))
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', variables.categoryId] })
    }
  })
}

// --- Admin Subscriptions ---

export function useAdminSubscriptions(page = 1, limit = 20, status?: string) {
  return useQuery({
    queryKey: ['admin-subscriptions', page, limit, status],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.ADMIN, {
        params: { page, limit, status }
      })
      return response.data.data || response.data
    }
  })
}

// --- User Subscriptions ---

export function useMySubscription() {
  return useQuery({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.MY)
      const data = response.data.data || response.data
      return data?.subscription || data || null
    }
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
    }
  })
}

export function useSubscribe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { plan: string;[key: string]: any }) => {
      const response = await apiClient.post(ENDPOINTS.SUBSCRIPTIONS.SUBSCRIBE, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    }
  })
}

export function useVerifySubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (reference: string) => {
      const response = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.VERIFY(reference))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
      queryClient.invalidateQueries({ queryKey: ['subscription-history'] })
    }
  })
}

export function useChangePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { plan: string;[key: string]: any }) => {
      const response = await apiClient.put(ENDPOINTS.SUBSCRIPTIONS.CHANGE_PLAN, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    }
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

export function useToggleAutoRenew() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await apiClient.put(ENDPOINTS.SUBSCRIPTIONS.AUTO_RENEW, { enabled })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    }
  })
}

// --- Quotations ---

export function useBookingQuotations(bookingId: string) {
  return useQuery({
    queryKey: ['quotations', bookingId],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.QUOTATIONS.BY_BOOKING(bookingId))
      const data = response.data.data || response.data
      return Array.isArray(data) ? data : (data?.quotations || [])
    },
    enabled: !!bookingId
  })
}

export function useApproveQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put(ENDPOINTS.QUOTATIONS.APPROVE(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
    }
  })
}

export function useRejectQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason?: string }) => {
      const response = await apiClient.put(ENDPOINTS.QUOTATIONS.REJECT(id), { reason })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
    }
  })
}
