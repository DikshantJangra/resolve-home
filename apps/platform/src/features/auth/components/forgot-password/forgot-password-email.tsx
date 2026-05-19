"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { toast } from "sonner"
import { cn } from "@resolve/ui"
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"
import Link from "next/link"
import { IoArrowBack } from "react-icons/io5"
import { HiOutlineMail } from "react-icons/hi"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type EmailValues = z.infer<typeof emailSchema>

export function ForgotPasswordEmail() {
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
  })

  const onSubmit = async (data: EmailValues) => {
    setIsLoading(true)
    try {
      await apiClient.post(ENDPOINTS.AUTH.FORGET_PASSWORD, {
        email: data.email,
        redirectTo: window.location.origin + "/reset-password",
      })
      setEmail(data.email)
      setSent(true)
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex w-full flex-col items-center gap-10 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <HiOutlineMail className="h-10 w-10 text-blue-700" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold font-heading text-neutral-700">Check your email</h2>
          <p className="text-base font-normal font-inter text-zinc-600 max-w-[320px]">
            We sent a password reset link to <span className="font-bold">{email}</span>. Click the link in the email to set a new password.
          </p>
        </div>
        <p className="text-sm text-zinc-500">
          Didn't receive it?{" "}
          <button
            onClick={() => setSent(false)}
            className="text-blue-700 font-semibold hover:underline"
          >
            Try again
          </button>
        </p>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <IoArrowBack className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-tight text-neutral-700">
          Reset your password
        </h1>
        <p className="text-base font-normal font-inter leading-6 text-zinc-600">
          Enter your email and we'll send you a link to reset your password.
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
            placeholder="you@example.com"
            className="h-12 border-stone-300 focus-visible:ring-blue-600"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white hover:bg-blue-800",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors py-2"
          >
            <IoArrowBack className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </form>
    </div>
  )
}
