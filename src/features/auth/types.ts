import { z } from "zod"

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[0-9]/, "One number")
    .regex(/[A-Z]/, "One uppercase character")
    .regex(/[a-z]/, "One lowercase character"),
})

export type RegisterValues = z.infer<typeof registerSchema>

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  token: string
}
