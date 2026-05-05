import { create } from 'zustand'

export type RegisterRole = 'client' | 'pro' | null

interface RegisterState {
  step: number
  role: RegisterRole
  setStep: (step: number) => void
  setRole: (role: RegisterRole) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

export const useRegisterStore = create<RegisterState>((set) => ({
  step: 1,
  role: null,
  setStep: (step) => set({ step }),
  setRole: (role) => set({ role }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  reset: () => set({ step: 1, role: null }),
}))
