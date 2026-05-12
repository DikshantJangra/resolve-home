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
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => null,
    enabled: false,
  })
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => null,
    enabled: false,
  })
}

export function useAdminEngineerStats() {
  return useQuery({
    queryKey: ['admin-engineer-stats'],
    queryFn: async () => null,
    enabled: false,
  })
}

export function useAdminBookingStats() {
  return useQuery({
    queryKey: ['admin-booking-stats'],
    queryFn: async () => ({} as any),
    enabled: false,
  })
}

export function useAdminComplaintStats() {
  return useQuery({
    queryKey: ['admin-complaint-stats'],
    queryFn: async () => ({} as any),
    enabled: false,
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

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_USERS.BY_ID(id))
      return response.data.data?.user || response.data.data
    },
    enabled: !!id
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

export function useAdminEngineer(id: string) {
  return useQuery({
    queryKey: ['admin-engineer', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_ENGINEERS.BY_ID(id))
      return response.data.data?.engineer || response.data.data
    },
    enabled: !!id
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

export function useAdminBooking(id: string) {
  return useQuery({
    queryKey: ['admin-booking', id],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_BOOKINGS.BY_ID(id))
      return response.data.data?.booking || response.data.data
    },
    enabled: !!id
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
      return response.data.data?.complaints || []
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

export function useAdminVerificationRequests() {
  return useQuery({
    queryKey: ['admin-verification-requests'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_ENGINEER_VERIFICATIONS.PENDING)
      return response.data.data?.verifications || []
    }
  })
}

export function useAdminVerifyEngineer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string, status: 'approved' | 'rejected', notes?: string }) => {
      const response = await apiClient.post(ENDPOINTS.ADMIN_ENGINEER_VERIFICATIONS.VERIFY(id), {
        status,
        notes
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin-engineers'] })
    }
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
