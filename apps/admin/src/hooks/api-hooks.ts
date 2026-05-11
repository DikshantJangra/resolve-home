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
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_STATS.BASE)
      return response.data.data as {
        totalRevenue?: number;
        totalHomeowners?: number;
        totalEngineers?: number;
        completedJobs?: number;
        averageRating?: number;
        trends?: Record<string, string>;
        revenueDistribution?: Array<{
          label: string;
          value: string | number;
          percent: string;
          color: string;
        }>;
      }
    }
  })
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_USERS.STATS)
      return response.data.data as { 
        totalHomeowners?: number; 
        membershipPro?: string; 
        activeMembers?: string; 
        inactiveMembers?: string; 
        trends?: Record<string, string>;
      }
    }
  })
}

export function useAdminEngineerStats() {
  return useQuery({
    queryKey: ['admin-engineer-stats'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_ENGINEERS.STATS)
      return response.data.data as { 
        totalEngineers?: number; 
        activeProfessionals?: number; 
        inactiveProfessionals?: number; 
        jobsDone?: number;
        verifiedEngineers?: string;
        activeEngineers?: string;
        inactiveEngineers?: string;
        trends?: Record<string, string>;
      }
    }
  })
}

export function useAdminBookingStats() {
  return useQuery({
    queryKey: ['admin-booking-stats'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_BOOKINGS.STATS)
      return response.data.data as { 
        totalBookings?: number; 
        completedBookings?: string; 
        activeBookings?: string; 
        pendingBookings?: string;
        inProgress?: number;
        emergency?: number;
        avgResponse?: string;
        trends?: Record<string, string>;
      }
    }
  })
}

export function useAdminComplaintStats() {
  return useQuery({
    queryKey: ['admin-complaint-stats'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN_COMPLAINTS.STATS)
      return response.data.data as { 
        totalComplaints?: number; 
        resolvedCases?: string; 
        pendingDisputes?: string; 
        trends?: Record<string, string>;
      }
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
