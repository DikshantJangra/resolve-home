import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Priority = 'Emergency' | 'Standard' | null

interface BookingLocation {
  state: string
  city: string
  streetAddress: string
  landmark: string
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
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      priority: null,
      serviceType: 'Electrician', // Default or from previous flow
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

