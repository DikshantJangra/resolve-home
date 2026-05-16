import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Priority = 'Emergency' | 'Standard' | null

interface BookingLocation {
  country?: string
  countryCode?: string
  state: string
  city: string
  streetAddress: string
  landmark: string
  latitude?: number
  longitude?: number
}

export interface BookingDraft {
  id: string
  savedAt: string
  currentStep: number
  priority: Priority
  serviceType: string
  issueDetails: string
  photos: string[]
  location: BookingLocation | null
  categoryId: string | null
  serviceId: string | null
  scheduledDate: string | null
  scheduledTime: string | null
}

interface BookingState {
  currentStep: number
  priority: Priority
  serviceType: string
  issueDetails: string
  photos: string[]
  location: BookingLocation | null
  categoryId: string | null
  serviceId: string | null
  scheduledDate: string | null
  scheduledTime: string | null
  selectedEngineerId: string | null
  availableEngineers: any[]
  bookingId: string | null
  isOpen: boolean
  drafts: BookingDraft[]

  // Actions
  setIsOpen: (isOpen: boolean) => void
  setStep: (step: number) => void
  setPriority: (priority: Priority) => void
  setServiceType: (type: string) => void
  setCategoryId: (id: string | null) => void
  setServiceId: (id: string | null) => void
  setIssueDetails: (details: string) => void
  setPhotos: (photos: string[]) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  setLocation: (location: BookingLocation | null) => void
  setScheduledDate: (date: string | null) => void
  setScheduledTime: (time: string | null) => void
  setSelectedEngineerId: (id: string | null) => void
  setAvailableEngineers: (engineers: any[]) => void
  setBookingId: (id: string | null) => void
  saveDraft: () => void
  resumeDraft: (draft: BookingDraft) => void
  deleteDraft: (id: string) => void
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      priority: null,
      serviceType: 'Electrician',
      issueDetails: '',
      photos: [],
      location: null,
      categoryId: null,
      serviceId: null,
      scheduledDate: null,
      scheduledTime: null,
      selectedEngineerId: null,
      availableEngineers: [],
      bookingId: null,
      isOpen: false,
      drafts: [],

      setIsOpen: (isOpen) => set({ isOpen }),
      setStep: (step) => set({ currentStep: step }),
      setPriority: (priority) => set({ priority }),
      setServiceType: (serviceType) => set({ serviceType }),
      setCategoryId: (categoryId) => set({ categoryId }),
      setServiceId: (serviceId) => set({ serviceId }),
      setIssueDetails: (issueDetails) => set({ issueDetails }),
      setPhotos: (photos) => set({ photos }),
      addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
      removePhoto: (index) => set((state) => ({
        photos: state.photos.filter((_, i) => i !== index)
      })),
      setLocation: (location) => set({ location }),
      setScheduledDate: (scheduledDate) => set({ scheduledDate }),
      setScheduledTime: (scheduledTime) => set({ scheduledTime }),
      setSelectedEngineerId: (selectedEngineerId) => set({ selectedEngineerId }),
      setAvailableEngineers: (availableEngineers) => set({ availableEngineers }),
      setBookingId: (bookingId) => set({ bookingId }),

      saveDraft: () => {
        const s = get()
        // Only save if user has made meaningful progress (past step 1)
        if (s.currentStep <= 1 && !s.priority && !s.serviceId) return
        const draft: BookingDraft = {
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          currentStep: s.currentStep,
          priority: s.priority,
          serviceType: s.serviceType,
          issueDetails: s.issueDetails,
          photos: s.photos,
          location: s.location,
          categoryId: s.categoryId,
          serviceId: s.serviceId,
          scheduledDate: s.scheduledDate,
          scheduledTime: s.scheduledTime,
        }
        // Keep max 5 drafts, newest first
        set((state) => ({ drafts: [draft, ...state.drafts].slice(0, 5) }))
      },

      resumeDraft: (draft: BookingDraft) => {
        set({
          currentStep: draft.currentStep,
          priority: draft.priority,
          serviceType: draft.serviceType,
          issueDetails: draft.issueDetails,
          photos: draft.photos,
          location: draft.location,
          categoryId: draft.categoryId,
          serviceId: draft.serviceId,
          scheduledDate: draft.scheduledDate,
          scheduledTime: draft.scheduledTime,
          selectedEngineerId: null,
          availableEngineers: [],
          bookingId: null,
          isOpen: true,
        })
      },

      deleteDraft: (id: string) => {
        set((state) => ({ drafts: state.drafts.filter((d) => d.id !== id) }))
      },

      resetBooking: () =>
        set({
          currentStep: 1,
          priority: null,
          issueDetails: '',
          photos: [],
          location: null,
          categoryId: null,
          serviceId: null,
          scheduledDate: null,
          scheduledTime: null,
          selectedEngineerId: null,
          availableEngineers: [],
          bookingId: null,
          isOpen: false,
        }),
    }),
    {
      name: 'booking-storage',
    }
  )
)

