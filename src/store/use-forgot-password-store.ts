import { create } from 'zustand'

interface ForgotPasswordState {
  step: number
  email: string
  setStep: (step: number) => void
  setEmail: (email: string) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  step: 1,
  email: '',
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  reset: () => set({ step: 1, email: '' }),
}))
