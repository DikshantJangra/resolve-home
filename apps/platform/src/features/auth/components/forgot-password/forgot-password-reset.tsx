"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2"
import { useForgotPasswordStore } from "@/store/use-forgot-password-store"
import { cn } from "@resolve/ui"
import { toast } from "sonner"
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"

const resetSchema = z.object({
  password: z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[A-Z]/, "Must include an uppercase character")
    .regex(/[a-z]/, "Must include a lowercase character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetValues = z.infer<typeof resetSchema>

interface ForgotPasswordResetProps {
  externalToken?: string
  onSuccess?: () => void
}

export function ForgotPasswordReset({ externalToken, onSuccess }: ForgotPasswordResetProps) {
  const { nextStep, token: storeToken } = useForgotPasswordStore()
  const token = externalToken || storeToken
  const [showPass, setShowPass] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
  })

  const password = watch("password", "")

  const onSubmit = async (data: ResetValues) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        newPassword: data.password,
        token: token || "", // Token from store (or OTP)
      })

      if (response.data.success === false) {
        toast.error(response.data.error || "Failed to reset password")
      } else {
        toast.success("Password reset successfully!")
        if (onSuccess) {
          onSuccess()
        } else {
          nextStep()
        }
      }
    } catch (err: any) {
      console.error("Reset password error:", err)
      toast.error(err.response?.data?.error || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const requirements = [
    { label: "minimum 8 characters", met: password.length >= 8 },
    { label: "one number", met: /[0-9]/.test(password) },
    { label: "one uppercase character", met: /[A-Z]/.test(password) },
    { label: "one lowercase character", met: /[a-z]/.test(password) },
  ]

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-tight text-neutral-700">
          Set a new password
        </h1>
        <p className="text-base font-normal font-inter leading-6 text-zinc-600">
          Enter a password secure and easily to remember
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 text-sm font-medium font-inter leading-5">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPass ? "text" : "password"}
                placeholder="Enter desired password"
                className="h-12 border-stone-300 pr-10 focus-visible:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPass ? <HiOutlineEyeSlash size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
            {/* Requirements Grid */}
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              {requirements.map((req) => (
                <div key={req.label} className="flex items-center gap-1.5">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    req.met ? "bg-emerald-500" : "bg-zinc-300"
                  )} />
                  <span className={cn(
                    "text-[11px] font-normal font-inter",
                    req.met ? "text-emerald-600" : "text-zinc-500"
                  )}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 text-sm font-medium font-inter leading-5">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Enter password again"
                className="h-12 border-stone-300 pr-10 focus-visible:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showConfirm ? <HiOutlineEyeSlash size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white hover:bg-blue-800",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? "Saving..." : "Save & continue"}
        </Button>
      </form>

      <p className="text-center text-xs font-normal font-inter leading-4 text-zinc-600 mt-auto">
        By continuing you agree to our <span className="underline cursor-pointer">Terms & Privacy Policy</span>.
      </p>
    </div>
  )
}
