import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookingState {
  currentStep: number
  serviceType: string | null
  appointmentDate: string | null
  address: {
    line1: string
    city: string
    postcode: string
  } | null
  contactDetails: {
    email: string
    phone: string
  } | null
  setStep: (step: number) => void
  setServiceType: (type: string) => void
  setAppointmentDate: (date: string) => void
  setAddress: (address: BookingState['address']) => void
  setContactDetails: (details: BookingState['contactDetails']) => void
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      serviceType: null,
      appointmentDate: null,
      address: null,
      contactDetails: null,
      setStep: (step) => set({ currentStep: step }),
      setServiceType: (type) => set({ serviceType: type }),
      setAppointmentDate: (date) => set({ appointmentDate: date }),
      setAddress: (address) => set({ address }),
      setContactDetails: (contactDetails) => set({ contactDetails }),
      resetBooking: () =>
        set({
          currentStep: 1,
          serviceType: null,
          appointmentDate: null,
          address: null,
          contactDetails: null,
        }),
    }),
    {
      name: 'booking-storage',
    }
  )
)
