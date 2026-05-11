import { create } from 'zustand'

interface ForgotPasswordState {
  step: number
  email: string
  token: string
  setStep: (step: number) => void
  setEmail: (email: string) => void
  setToken: (token: string) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  step: 1,
  email: '',
  token: '',
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  setToken: (token) => set({ token }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  reset: () => set({ step: 1, email: '', token: '' }),
}))
