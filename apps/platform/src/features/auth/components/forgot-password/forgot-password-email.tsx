"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { useForgotPasswordStore } from "@/store/use-forgot-password-store"
import { toast } from "sonner"
import { cn } from "@resolve/ui"
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type EmailValues = z.infer<typeof emailSchema>

export function ForgotPasswordEmail() {
  const { setEmail, nextStep } = useForgotPasswordStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
  })

  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit = async (data: EmailValues) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.FORGET_PASSWORD, {
        email: data.email,
        redirectTo: window.location.origin + "/reset-password",
      })

      if (response.data.success === false) {
        toast.error(response.data.error || "Failed to send reset email")
      } else {
        setEmail(data.email)
        toast.success("Reset email sent! Please check your inbox.")
        nextStep()
      }
    } catch (err: any) {
      console.error("Forgot password error:", err)
      toast.error(err.response?.data?.error || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-tight text-neutral-700">
          Reset your password
        </h1>
        <p className="text-base font-normal font-inter leading-6 text-zinc-600">
          Enter your email below and we'll send you an OTP, ensure that you entered the correct email address.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-600 text-sm font-medium font-inter leading-5">
            Email address <span className="text-red-600">*</span>
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="opeyemi@gmail.com"
            className="h-12 border-stone-300 focus-visible:ring-blue-600"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white hover:bg-blue-800",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? "Sending..." : "Verify & continue"}
        </Button>
      </form>

      <p className="text-center text-xs font-normal font-inter leading-4 text-zinc-600 mt-auto">
        By continuing you agree to our <span className="underline cursor-pointer">Terms & Privacy Policy</span>.
      </p>
    </div>
  )
}
