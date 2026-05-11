import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfessionalSetupState {
  currentStep: number
  
  // Step 1: Work Profile
  specialty: string
  categoryId: string
  experience: string
  idType: string
  idNumber: string
  idPhoto: string | null
  
  // Step 2: Location
  state: string
  city: string
  address: string
  landmark: string
  
  // Step 3: Guarantor & Bank
  guarantorName: string
  guarantorEmail: string
  accountName: string
  bankName: string
  accountNumber: string
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  
  updateField: (field: string, value: any) => void
  reset: () => void
}

export const useProfessionalSetupStore = create<ProfessionalSetupState>()(
  persist(
    (set) => ({
      currentStep: 1,
      
      specialty: '',
      categoryId: '',
      experience: '',
      idType: '',
      idNumber: '',
      idPhoto: null,
      
      state: '',
      city: '',
      address: '',
      landmark: '',
      
      guarantorName: '',
      guarantorEmail: '',
      accountName: '',
      bankName: '',
      accountNumber: '',
      
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      
      updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
      reset: () => set({
        currentStep: 1,
        specialty: '',
        categoryId: '',
        experience: '',
        idType: '',
        idNumber: '',
        idPhoto: null,
        state: '',
        city: '',
        address: '',
        landmark: '',
        guarantorName: '',
        guarantorEmail: '',
        accountName: '',
        bankName: '',
        accountNumber: '',
      }),
    }),
    {
      name: 'professional-setup-storage',
    }
  )
)
