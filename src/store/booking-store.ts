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
  
  // Actions
  setStep: (step: number) => void
  setPriority: (priority: Priority) => void
  setServiceType: (type: string) => void
  setIssueDetails: (details: string) => void
  setPhotos: (photos: string[]) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  setLocation: (location: BookingLocation | null) => void
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

      setStep: (step) => set({ currentStep: step }),
      setPriority: (priority) => set({ priority }),
      setServiceType: (serviceType) => set({ serviceType }),
      setIssueDetails: (issueDetails) => set({ issueDetails }),
      setPhotos: (photos) => set({ photos }),
      addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
      removePhoto: (index) => set((state) => ({ 
        photos: state.photos.filter((_, i) => i !== index) 
      })),
      setLocation: (location) => set({ location }),
      resetBooking: () =>
        set({
          currentStep: 1,
          priority: null,
          issueDetails: '',
          photos: [],
          location: null,
        }),
    }),
    {
      name: 'booking-storage',
    }
  )
)

